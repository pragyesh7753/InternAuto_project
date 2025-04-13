"""
API interface for Internshala Automation.
Provides endpoints to run the automation from a frontend application.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import threading
import queue
import time
from internshala_auto import InternshalaAutomation

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
CORS(app)

# Store for active automation jobs and their status
jobs = {}
status_messages = {}

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
    limit = data.get('limit', 5)  # Default to 5 applications
    
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
