"""
Run the API server for Internshala Automation.
This provides the interface for frontend applications to control the automation.
"""

from api import app
import argparse
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("api_server.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    # Set up argument parser
    parser = argparse.ArgumentParser(description='Run Internshala API server')
    parser.add_argument('--host', type=str, default='0.0.0.0', help='Host address to bind the server')
    parser.add_argument('--port', type=int, default=5000, help='Port to bind the server')
    parser.add_argument('--debug', action='store_true', help='Run server in debug mode')
    args = parser.parse_args()
    
    logger.info(f"Starting Internshala API server on {args.host}:{args.port}")
    logger.info("API now uses credentials provided by users via the frontend form")
    
    try:
        app.run(host=args.host, port=args.port, debug=args.debug)
    except Exception as e:
        logger.error(f"API server failed with error: {str(e)}")
