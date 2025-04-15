import os
import sys
import logging
import subprocess
import shutil
import platform
import requests
from pathlib import Path

logger = logging.getLogger(__name__)

def get_chrome_version():
    """Get the installed Chrome browser version."""
    system = platform.system()
    try:
        if system == "Windows":
            import winreg
            key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Google\Chrome\BLBeacon")
            version, _ = winreg.QueryValueEx(key, "version")
            return version
        elif system == "Darwin":  # macOS
            process = subprocess.Popen(
                ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "--version"],
                stdout=subprocess.PIPE
            )
        else:  # Linux
            process = subprocess.Popen(
                ["google-chrome", "--version"],
                stdout=subprocess.PIPE
            )
        
        output = process.communicate()[0].decode('utf-8')
        version = output.split()[-1] if output else "Unknown"
        return version
    except Exception as e:
        logger.error(f"Failed to get Chrome version: {e}")
        return "Unknown"

def clear_chromedriver_cache():
    """Clear the cached ChromeDriver files."""
    try:
        # Path to undetected_chromedriver cache
        home_dir = Path.home()
        
        # Windows path
        if platform.system() == "Windows":
            cache_dir = home_dir / "appdata" / "roaming" / "undetected_chromedriver"
        # macOS path
        elif platform.system() == "Darwin":
            cache_dir = home_dir / "Library" / "Application Support" / "undetected_chromedriver"
        # Linux path
        else:
            cache_dir = home_dir / ".config" / "undetected_chromedriver"
        
        if cache_dir.exists():
            logger.info(f"Removing ChromeDriver cache at {cache_dir}")
            shutil.rmtree(cache_dir, ignore_errors=True)
            return True
        else:
            logger.info(f"No ChromeDriver cache found at {cache_dir}")
            return False
    except Exception as e:
        logger.error(f"Failed to clear ChromeDriver cache: {e}")
        return False

def prepare_environment():
    """Prepare environment for ChromeDriver."""
    chrome_version = get_chrome_version()
    logger.info(f"Detected Chrome version: {chrome_version}")
    
    # Clear existing cache to force a fresh driver download
    if clear_chromedriver_cache():
        logger.info("ChromeDriver cache cleared successfully")
    
    return {
        "chrome_version": chrome_version
    }

if __name__ == "__main__":
    # Setup basic logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    
    # Print environment info when run directly
    info = prepare_environment()
    print(f"Chrome Version: {info['chrome_version']}")
    print("Environment prepared for ChromeDriver")
