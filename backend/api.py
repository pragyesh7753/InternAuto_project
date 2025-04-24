"""
API interface for Internshala Automation.
Provides endpoints to run the automation from a frontend application.
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import logging
import threading
import queue
import time
from internshala_auto import InternshalaAutomation
import os
from dotenv import load_dotenv
import io
import re

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("api.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Enable CORS for all routes to allow requests from the React frontend
# Update to explicitly allow frontend origin
CORS(app, origins=["https://internauto.pragyesh.tech", "http://localhost:5173", "http://localhost:4173"], supports_credentials=True)

# Store for active automation jobs and their status
jobs = {}
status_messages = {}

# Gemini API setup
try:
    import google.generativeai as genai
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    genai.configure(api_key=gemini_api_key)
    model = genai.GenerativeModel('gemini-2.0-flash')
    logger.info("Gemini API initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Gemini API: {e}")
    model = None

def run_automation(job_id, email, password, headless, limit):
    """Run the automation in a separate thread"""
    message_queue = queue.Queue()
    status_messages[job_id] = message_queue
    
    try:
        # Create a custom handler to capture log messages
        class QueueHandler(logging.Handler):
            def emit(self, record):
                message = self.format(record)
                message_queue.put({
                    "level": record.levelname,
                    "message": message,
                    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
                })
        
        # Add the queue handler to the logger
        queue_handler = QueueHandler()
        queue_handler.setFormatter(logging.Formatter('%(message)s'))
        logger.addHandler(queue_handler)
        
        # Update job status
        jobs[job_id] = "running"
        message_queue.put({
            "level": "INFO",
            "message": f"Starting Internshala automation with {limit} application limit",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        })
        
        # Log that we're using user-provided credentials (without logging the actual credentials)
        message_queue.put({
            "level": "INFO",
            "message": f"Using credentials provided by user: {email}",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        })
        
        # Create and run the automation bot
        bot = InternshalaAutomation(email, password, headless=headless)
        success = bot.run(max_applications=limit)
        
        # Check if login was successful
        if success:
            # Update job status upon completion
            jobs[job_id] = "completed"
            message_queue.put({
                "level": "INFO",
                "message": "Automation completed successfully",
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
            })
        else:
            # Set job status to failed if login or other critical step failed
            jobs[job_id] = "failed"
            message_queue.put({
                "level": "ERROR",
                "message": "Automation failed - login unsuccessful or could not complete tasks",
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
            })
    
    except Exception as e:
        # Update job status on error
        jobs[job_id] = "failed"
        error_message = f"Automation failed: {str(e)}"
        logger.error(error_message)
        message_queue.put({
            "level": "ERROR",
            "message": error_message,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        })
    
    finally:
        # Remove the queue handler
        for handler in logger.handlers:
            if isinstance(handler, QueueHandler):
                logger.removeHandler(handler)

@app.route('/api/run', methods=['POST'])
def start_automation():
    """API endpoint to start the automation process"""
    data = request.json
    
    # Validate required fields
    required_fields = ['email', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'success': False,
                'message': f'Missing required field: {field}'
            }), 400
    
    # Get parameters from request data
    email = data.get('email')
    password = data.get('password')
    headless = data.get('headless', True)  # Default to headless mode
    limit = data.get('limit', 15)  # Default to 5 applications
    
    # Generate a job ID
    import uuid
    job_id = str(uuid.uuid4())
    
    # Start automation in a separate thread
    threading.Thread(
        target=run_automation,
        args=(job_id, email, password, headless, limit)
    ).start()
    
    return jsonify({
        'success': True,
        'message': 'Automation started',
        'job_id': job_id
    })

@app.route('/api/status/<job_id>', methods=['GET'])
def get_job_status(job_id):
    """Get the status of a running job"""
    if job_id not in jobs:
        return jsonify({
            'success': False,
            'message': 'Job not found'
        }), 404
    
    # Get all messages from queue without removing them
    messages = []
    if job_id in status_messages:
        message_queue = status_messages[job_id]
        
        # Get all messages from queue
        while not message_queue.empty():
            try:
                messages.append(message_queue.get_nowait())
                message_queue.task_done()
            except queue.Empty:
                break
    
    return jsonify({
        'success': True,
        'status': jobs[job_id],
        'messages': messages
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Internshala API is running'
    })

@app.route('/api/career_suggestion', methods=['POST'])
def get_career_suggestion():
    """API endpoint to get career suggestion from Gemini API"""
    if not model:
        return jsonify({
            'success': False,
            'message': 'Gemini API not initialized'
        }), 500

    data = request.json
    goal = data.get('goal', '')
    education = data.get('education', '')
    technicalSkills = data.get('technicalSkills', '')
    softSkills = data.get('softSkills', '')
    project = data.get('project', '')

    prompt = f"""
    I want to achieve {goal}.
    I have completed {education}.
    My technical skills are: {technicalSkills}.
    My soft skills are: {softSkills}.
    I have worked on the following projects: {project}.

    What additional steps can I take to achieve my goal?
    Provide specific suggestions for improving my skills, gaining relevant experience, and networking.
    Provide the suggestions in a bullet point format.
    Make sure to include any relevant certifications or courses that would be beneficial.
    """

    try:
        response = model.generate_content(prompt)
        suggestion = response.text
        return jsonify({
            'success': True,
            'suggestion': suggestion
        })
    except Exception as e:
        logger.error(f"Error generating career suggestion: {e}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
