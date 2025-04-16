"""
Fallback runner for Internshala Automation.
Uses a direct Selenium approach when the main automation fails.
"""

import logging
import argparse
import time
import random
from direct_chrome_driver import start_chrome_session, find_chrome_executable
from config import INTERNSHALA_EMAIL, INTERNSHALA_PASSWORD

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("fallback_run.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def random_delay(min_seconds=1, max_seconds=4):
    """Add random delay between actions to mimic human behavior"""
    delay = random.uniform(min_seconds, max_seconds)
    time.sleep(delay)

def human_like_typing(element, text):
    """Simulate human-like typing with random delays"""
    for char in text:
        element.send_keys(char)
        time.sleep(random.uniform(0.05, 0.2))

def run_internshala_automation():
    """
    Run the internshala automation using direct Selenium approach.
    This is a fallback method when the main automation fails.
    """
    driver = None
    try:
        logger.info("Starting Internshala automation with fallback driver")
        
        # Try to find Chrome binary path
        try:
            import os
            import platform
            chrome_path = find_chrome_executable()
            if chrome_path and isinstance(chrome_path, str) and os.path.exists(chrome_path):
                os.environ['CHROME_BINARY_PATH'] = chrome_path
                logger.info(f"Setting Chrome binary path for fallback: {chrome_path}")
        except Exception as e:
            logger.warning(f"Could not set Chrome binary path for fallback: {str(e)}")
        
        driver = start_chrome_session()
        
        if not driver:
            logger.error("Failed to initialize Chrome driver")
            return False
        
        # Navigate to login page
        logger.info("Navigating to Internshala login page")
        driver.get("https://internshala.com/login")
        random_delay(2, 4)
        
        # Login form
        from selenium.webdriver.common.by import By
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC
        
        # Find login form elements
        email_field = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        random_delay()
        human_like_typing(email_field, INTERNSHALA_EMAIL)
        
        password_field = driver.find_element(By.ID, "password")
        random_delay()
        human_like_typing(password_field, INTERNSHALA_PASSWORD)
        
        # Click login button
        login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]")
        random_delay()
        login_button.click()
        
        # Wait for successful login
        WebDriverWait(driver, 15).until(
            EC.url_contains("dashboard")
        )
        logger.info("Successfully logged in")
        
        # Basic internship browsing functionality
        logger.info("Navigating to internships page")
        driver.get("https://internshala.com/internships")
        random_delay(2, 5)
        
        # Wait for the user to interact or observe the page
        logger.info("Browser session active - you can now interact with it manually")
        logger.info("Press Ctrl+C in the terminal when you're done")
        
        # Keep the browser open
        while True:
            time.sleep(1)
        
    except KeyboardInterrupt:
        logger.info("Received keyboard interrupt, closing browser")
        
    except Exception as e:
        logger.error(f"Error during automation: {str(e)}")
        return False
        
    finally:
        if driver:
            logger.info("Closing browser session")
            driver.quit()
    
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run Internshala application automation with fallback driver')
    args = parser.parse_args()
    
    success = run_internshala_automation()
    if success:
        logger.info("Fallback automation completed")
    else:
        logger.error("Fallback automation failed")
