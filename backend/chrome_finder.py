"""
Chrome executable finder utility.
Provides functions to locate Chrome browser executable across different platforms.
"""

import os
import platform
import logging
import winreg

logger = logging.getLogger(__name__)

def find_chrome_executable():
    """
    Find the Chrome executable path based on the operating system.
    Works across Windows, macOS, and Linux.
    
    Returns:
        str: Path to Chrome executable if found, None otherwise
    """
    if platform.system() == "Windows":
        # Try to get from registry first
        try:
            key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe")
            chrome_path, _ = winreg.QueryValueEx(key, None)
            if os.path.exists(chrome_path):
                return chrome_path
        except Exception:
            logger.debug("Could not find Chrome in Windows registry")
        
        # Fallback to common locations
        paths = [
            os.path.join(os.environ.get('PROGRAMFILES', 'C:\\Program Files'), 'Google\\Chrome\\Application\\chrome.exe'),
            os.path.join(os.environ.get('PROGRAMFILES(X86)', 'C:\\Program Files (x86)'), 'Google\\Chrome\\Application\\chrome.exe'),
            os.path.join(os.environ.get('LOCALAPPDATA', ''), 'Google\\Chrome\\Application\\chrome.exe'),
            # Add more potential paths for Windows
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        ]
        
    elif platform.system() == "Darwin":  # macOS
        paths = [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Chrome.app/Contents/MacOS/Chrome",
            # Add more potential paths for macOS
        ]
        
    elif platform.system() == "Linux":
        paths = [
            "/usr/bin/google-chrome",
            "/usr/bin/chromium",
            "/usr/bin/chromium-browser",
            "/usr/bin/google-chrome-stable",
            "/snap/bin/chromium",
            # Add more potential paths for Linux
            "/opt/google/chrome/chrome",
            "/opt/google/chrome/google-chrome",
        ]
        
    else:
        logger.warning(f"Unsupported operating system: {platform.system()}")
        return None
    
    # Check all the potential paths
    for path in paths:
        if os.path.exists(path):
            logger.info(f"Found Chrome at: {path}")
            return path
    
    logger.warning("Could not find Chrome executable in common locations")
    return None

if __name__ == "__main__":
    # Set up logging when run directly
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    # Test the function
    chrome_path = find_chrome_executable()
    if chrome_path:
        print(f"Found Chrome at: {chrome_path}")
    else:
        print("Chrome not found!")
