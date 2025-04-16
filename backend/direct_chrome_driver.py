"""
Direct Chrome driver initialization module.
Provides a fallback mechanism when undetected_chromedriver fails.
"""

import logging
import os
import platform
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

logger = logging.getLogger(__name__)

def find_chrome_executable():
    """Find the Chrome executable path"""
    import platform
    if platform.system() == "Windows":
        import winreg
        try:
            # Try to get from registry
            key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe")
            chrome_path, _ = winreg.QueryValueEx(key, None)
            return chrome_path
        except Exception:
            # Fallback to common locations
            paths = [
                os.path.join(os.environ.get('PROGRAMFILES', 'C:\\Program Files'), 'Google\\Chrome\\Application\\chrome.exe'),
                os.path.join(os.environ.get('PROGRAMFILES(X86)', 'C:\\Program Files (x86)'), 'Google\\Chrome\\Application\\chrome.exe'),
                os.path.join(os.environ.get('LOCALAPPDATA', ''), 'Google\\Chrome\\Application\\chrome.exe')
            ]
            for path in paths:
                if os.path.exists(path):
                    return path
    elif platform.system() == "Darwin":  # macOS
        paths = [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Chrome.app/Contents/MacOS/Chrome",
        ]
        for path in paths:
            if os.path.exists(path):
                return path
    elif platform.system() == "Linux":
        paths = [
            "/usr/bin/google-chrome",
            "/usr/bin/chromium",
            "/usr/bin/chromium-browser",
        ]
        for path in paths:
            if os.path.exists(path):
                return path
    
    return None

def start_chrome_session():
    """
    Initialize a standard Chrome WebDriver session as a fallback
    when undetected_chromedriver fails.
    
    Returns:
        WebDriver: Initialized Chrome WebDriver instance or None if failed
    """
    try:
        logger.info("Initializing direct Chrome WebDriver session")
        
        # Configure Chrome options
        options = webdriver.ChromeOptions()
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument("--disable-extensions")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-infobars")
        options.add_argument("--window-size=1920,1080")
        
        # Handle Chrome binary path
        chrome_binary = os.environ.get('CHROME_BINARY_PATH')
        if not chrome_binary:
            chrome_binary = find_chrome_executable()
        
        if chrome_binary and isinstance(chrome_binary, str) and os.path.exists(chrome_binary):
            logger.info(f"Setting Chrome binary path to: {chrome_binary}")
            options.binary_location = chrome_binary
        else:
            logger.info(f"No valid Chrome binary path set (value: {chrome_binary!r}) - using system default")
        
        # Create Chrome WebDriver service
        service = Service(ChromeDriverManager().install())
        
        # Create WebDriver instance without specifying binary location if not found
        driver = webdriver.Chrome(service=service, options=options)
        
        # Hide automation flags
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        logger.info("Direct Chrome WebDriver session initialized successfully")
        return driver
        
    except Exception as e:
        logger.error(f"Failed to initialize direct Chrome WebDriver: {str(e)}")
        return None
