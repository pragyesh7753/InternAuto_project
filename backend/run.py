"""
Main entry point for the Internshala Automation tool.
Handles command line arguments and starts the automation process.
"""

from internshala_auto import InternshalaAutomation
import logging
import argparse
from webdriver_manager.chrome import ChromeDriverManager  # Correct import

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("run.log"),
        logging.StreamHandler()
    ]
)

def prepare_environment():
    """Prepare the environment for ChromeDriver"""
    # Use the ChromeDriverManager to get Chrome version
    chrome_version = ChromeDriverManager().driver.get_browser_version_from_os()
    return {
        'chrome_version': chrome_version
    }

if __name__ == "__main__":
    # Set up argument parser
    parser = argparse.ArgumentParser(description='Run Internshala application automation')
    parser.add_argument('--email', type=str, required=True, help='Internshala login email')
    parser.add_argument('--password', type=str, required=True, help='Internshala login password')
    parser.add_argument('--headless', action='store_true', help='Run in headless mode (default: visible browser)')
    parser.add_argument('--limit', type=int, default=5, help='Maximum number of applications to submit')
    parser.add_argument('--reset', action='store_true', help='Reset ChromeDriver cache before running')
    args = parser.parse_args()
    
    logging.info(f"Starting Internshala automation. Will apply to up to {args.limit} internships.")
    
    try:
        # Prepare environment for ChromeDriver
        if args.reset:
            env_info = prepare_environment()
            logging.info(f"Chrome version detected: {env_info['chrome_version']}")
        
        # Create and run the bot with user provided credentials
        bot = InternshalaAutomation(args.email, args.password, headless=args.headless)
        bot.run(max_applications=args.limit)
        
        logging.info("Automation completed successfully")
    except Exception as e:
        logging.error(f"Automation failed with error: {str(e)}")
