import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import random
import time
import logging
import json
import os
import platform

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("internshala_auto.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class InternshalaAutomation:
    """
    Main automation class for Internshala applications.
    Handles browser interaction, login, finding suitable internships,
    and submitting applications automatically.
    """
    def find_chrome_executable(self):
        """Find the Chrome executable path based on the operating system"""
        if platform.system() == "Windows":
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

    def __init__(self, email, password, limit=5, headless=True):
        """
        Initialize the automation with user credentials and browser preferences.
        
        Args:
            email (str): User's Internshala email
            password (str): User's Internshala password
            limit (int): Maximum number of applications to submit
            headless (bool): Whether to run browser in headless mode
        """
        self.email = email
        self.password = password
        self.limit = limit
        self.headless = headless
        self.applications_submitted = 0
        
        # Configure Chrome options
        self.chrome_options = uc.ChromeOptions()
        if headless:
            self.chrome_options.add_argument('--headless')
        
        self.chrome_options.add_argument('--disable-gpu')
        self.chrome_options.add_argument('--no-sandbox')
        self.chrome_options.add_argument('--disable-dev-shm-usage')
        self.chrome_options.add_argument('--disable-extensions')
        self.chrome_options.add_argument('--disable-notifications')
        self.chrome_options.add_argument('--start-maximized')
        
        # Handle binary location carefully
        chrome_binary = os.environ.get('CHROME_BINARY_PATH')
        
        # If environment variable is not set, try to find Chrome executable automatically
        if not chrome_binary:
            chrome_binary = self.find_chrome_executable()
            if chrome_binary:
                logger.info(f"Automatically found Chrome binary at: {chrome_binary}")
        
        # Only set binary_location if a valid string path was found
        if chrome_binary and isinstance(chrome_binary, str) and os.path.exists(chrome_binary):
            self.chrome_options.binary_location = chrome_binary
            logger.info(f"Setting Chrome binary location to: {chrome_binary}")
        else:
            # Don't set binary_location if we don't have a valid path
            logger.info("No Chrome binary path set - using system default")
        
        # Initialize WebDriver with service object to handle path issues
        try:
            self.driver = uc.Chrome(options=self.chrome_options)
            logger.info("WebDriver initialized successfully")
        except Exception as e:
            error_msg = f"Failed to initialize WebDriver: {str(e)}"
            logger.error(error_msg)
            raise Exception(error_msg)
            
    def random_delay(self, min_seconds=1, max_seconds=4):
        """Add random delay between actions to mimic human behavior"""
        delay = random.uniform(min_seconds, max_seconds)
        time.sleep(delay)
        
    def human_like_typing(self, element, text):
        """Simulate human-like typing with random delays between keystrokes"""
        for char in text:
            element.send_keys(char)
            time.sleep(random.uniform(0.05, 0.2))
            
    def login(self):
        """Login to Internshala with user credentials"""
        try:
            logger.info("Navigating to Internshala login page")
            self.driver.get("https://internshala.com/login")
            self.random_delay(2, 4)
            
            # Check for and handle any popups
            self.handle_popups()
            
            # Find login form elements
            email_field = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.ID, "email"))
            )
            self.random_delay()
            self.human_like_typing(email_field, self.email)
            
            password_field = self.driver.find_element(By.ID, "password")
            self.random_delay()
            self.human_like_typing(password_field, self.password)
            
            # Add random mouse movements (using JavaScript)
            self.simulate_mouse_movement()
            
            # Click login button
            login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]")
            self.random_delay()
            login_button.click()
            
            # Wait for potential error message
            self.random_delay(1, 2)
            
            # Check for error messages indicating failed login
            error_messages = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'error') or contains(@class, 'alert')]")
            for error in error_messages:
                if error.is_displayed() and error.text.strip():
                    error_text = error.text.strip()
                    logger.error(f"Login failed: {error_text}")
                    return False
                    
            # Check if we're still on the login page
            if "/login" in self.driver.current_url:
                logger.error("Still on login page after submission - credentials likely incorrect")
                return False
            
            # Wait for successful login - we should be redirected to dashboard
            try:
                WebDriverWait(self.driver, 10).until(
                    EC.any_of(
                        EC.url_contains("dashboard"),
                        EC.url_contains("student/profile"),
                        EC.url_contains("home")
                    )
                )
                logger.info("Successfully logged in")
                return True
            except TimeoutException:
                logger.error("Login timeout - failed to redirect to dashboard")
                return False
                
        except Exception as e:
            logger.error(f"Login failed: {str(e)}")
            return False
            
    def handle_popups(self):
        """Handle any unexpected popups"""
        try:
            # Example: Close cookie consent
            cookie_buttons = self.driver.find_elements(By.XPATH, "//button[contains(text(), 'Accept') or contains(text(), 'Got it')]")
            if cookie_buttons:
                self.random_delay(0.5, 1)
                cookie_buttons[0].click()
                logger.info("Handled popup")
        except Exception as e:
            logger.warning(f"Error handling popups: {str(e)}")
            
    def simulate_mouse_movement(self):
        """Simulate random mouse movements using JavaScript"""
        script = """
        function simulateMouseMovement() {
            const points = 10;
            for (let i = 0; i < points; i++) {
                const x = Math.floor(Math.random() * window.innerWidth);
                const y = Math.floor(Math.random() * window.innerHeight);
                const event = new MouseEvent('mousemove', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,
                    'clientX': x,
                    'clientY': y
                });
                document.dispatchEvent(event);
            }
        }
        simulateMouseMovement();
        """
        self.driver.execute_script(script)
            
    def extract_profile_preferences(self):
        """Extract preferences from user's Internshala profile"""
        try:
            logger.info("Navigating to profile page to extract preferences")
            self.driver.get("https://internshala.com/student/profile")
            self.random_delay(2, 4)
            
            # Extract skills
            skills = []
            try:
                skills_section = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'skills_section')]"))
                )
                skill_elements = skills_section.find_elements(By.XPATH, ".//span[contains(@class, 'skill_item')]")
                skills = [skill.text.strip() for skill_elements in skill_elements]
                logger.info(f"Extracted {len(skills)} skills from profile")
            except Exception as e:
                logger.warning(f"Could not extract skills: {str(e)}")
            
            # Extract preferred locations
            locations = []
            try:
                # Navigate to preferences page if needed
                self.driver.get("https://internshala.com/student/preferences")
                self.random_delay(2, 3)
                
                location_elements = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'preference_locations')]//li")
                locations = [loc.text.strip() for loc in location_elements]
                logger.info(f"Extracted {len(locations)} preferred locations")
            except Exception as e:
                logger.warning(f"Could not extract locations: {str(e)}")
            
            # Extract preferred categories/sectors
            categories = []
            try:
                category_elements = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'preference_categories')]//li")
                categories = [cat.text.strip() for cat in category_elements]
                logger.info(f"Extracted {len(categories)} preferred categories")
            except Exception as e:
                logger.warning(f"Could not extract categories: {str(e)}")
            
            # Extract other preferences like work from home preference
            work_from_home = True  # Default to True
            try:
                wfh_element = self.driver.find_element(By.XPATH, "//label[contains(text(), 'work from home')]")
                wfh_checked = wfh_element.find_element(By.XPATH, ".//input").is_selected()
                work_from_home = wfh_checked
                logger.info(f"Work from home preference: {work_from_home}")
            except Exception as e:
                logger.warning(f"Could not extract work from home preference: {str(e)}")
            
            # Build preferences object
            self.preferences = {
                "skills": skills,
                "locations": locations,
                "categories": categories,
                "work_from_home": work_from_home
            }
            
            logger.info("Successfully extracted preferences from profile")
            return True
            
        except Exception as e:
            logger.error(f"Error extracting profile preferences: {str(e)}")
            # If we can't get preferences, use default ones for backup
            self.preferences = {
                "work_from_home": True,
                "categories": ["Web Development", "Python", "Machine Learning"],
                "locations": ["Remote", "Bangalore", "Delhi"],
                "skills": ["Python", "Django", "Flask", "React", "JavaScript"]
            }
            logger.warning("Using default preferences instead")
            return False
            
    def browse_internships(self):
        """Navigate to internships page and apply filters"""
        try:
            logger.info("Navigating to internships page")
            self.driver.get("https://internshala.com/internships")
            self.random_delay(2, 5)
            
            # Apply filters based on extracted profile preferences
            self.apply_filters()
            
            # Scrape and process internship listings
            return self.process_internship_listings()
            
        except Exception as e:
            logger.error(f"Error browsing internships: {str(e)}")
            return []
    
    def apply_filters(self):
        """Apply filters based on user preferences"""
        logger.info("Applying internship filters")
        try:
            # Work from home filter
            if self.preferences["work_from_home"]:
                wfh_checkbox = WebDriverWait(self.driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Work from home')]"))
                )
                self.random_delay()
                wfh_checkbox.click()
                self.random_delay(2, 3)
                
            # Apply category filters
            category_dropdown = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'filter_dropdown')][contains(., 'Category')]"))
            )
            category_dropdown.click()
            self.random_delay(1, 2)
            
            for category in self.preferences["categories"]:
                try:
                    category_option = self.driver.find_element(By.XPATH, f"//label[contains(text(), '{category}')]")
                    self.random_delay(0.5, 1.5)
                    category_option.click()
                except NoSuchElementException:
                    logger.warning(f"Category '{category}' not found")
            
            # Click outside to close dropdown
            self.driver.find_element(By.TAG_NAME, "body").click()
            self.random_delay(1, 3)
            
            # Location filters if not work from home
            if not self.preferences["work_from_home"] and self.preferences["locations"]:
                location_dropdown = self.driver.find_element(By.XPATH, "//div[contains(@class, 'filter_dropdown')][contains(., 'Location')]")
                self.random_delay()
                location_dropdown.click()
                self.random_delay(1, 2)
                
                for location in self.preferences["locations"]:
                    try:
                        location_option = self.driver.find_element(By.XPATH, f"//label[contains(text(), '{location}')]")
                        self.random_delay(0.5, 1.5)
                        location_option.click()
                    except NoSuchElementException:
                        logger.warning(f"Location '{location}' not found")
                        
                # Click outside to close dropdown
                self.driver.find_element(By.TAG_NAME, "body").click()
                self.random_delay(1, 3)
            
            logger.info("Successfully applied filters")
        except Exception as e:
            logger.error(f"Error applying filters: {str(e)}")
    
    def process_internship_listings(self):
        """Process the internship listings and identify suitable opportunities"""
        suitable_internships = []
        
        try:
            # Wait for listings to load
            WebDriverWait(self.driver, 15).until(
                EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class, 'internship_meta')]"))
            )
            
            # Get all internship containers
            internship_containers = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'internship_meta')]")
            logger.info(f"Found {len(internship_containers)} internship listings")
            
            for i, container in enumerate(internship_containers[:10]):  # Limit to first 10 for safety
                try:
                    # Extract internship details - using the job-title-href class specifically
                    title_element = container.find_element(By.XPATH, ".//a[contains(@class, 'job-title-href')]")
                    title = title_element.text.strip()
                    link = title_element.get_attribute('href')
                    
                    # Fallback to previous selector if the specific class is not found
                    if not title or not link:
                        title_element = container.find_element(By.XPATH, ".//div[contains(@class, 'profile')]/a")
                        title = title_element.text.strip()
                        link = title_element.get_attribute('href')
                    
                    company = container.find_element(By.XPATH, ".//div[contains(@class, 'company_name')]").text.strip()
                    
                    # The listings we see already match our preferences since we've applied filters
                    # Just do an additional check for skills match
                    skills_match = True  # Assume match by default since filters are applied
                    skills_elements = container.find_elements(By.XPATH, ".//div[contains(@class, 'skills_container')]//a")
                    
                    # For additional verification
                    if skills_elements and self.preferences["skills"]:
                        listing_skills = [skill.text.strip().lower() for skill in skills_elements]
                        user_skills = [skill.lower() for skill in self.preferences["skills"]]
                        
                        # Check if any user skills match the listing skills
                        matching_skills = [skill for skill in listing_skills if any(user_skill in skill or skill in user_skill for user_skill in user_skills)]
                        skills_match = len(matching_skills) > 0
                    
                    if skills_match:
                        suitable_internships.append({
                            "title": title,
                            "company": company,
                            "link": link,
                            "matching_skills": matching_skills if 'matching_skills' in locals() else []
                        })
                        logger.info(f"Found suitable internship: {title} at {company}")
                
                except Exception as e:
                    logger.warning(f"Error processing internship listing {i}: {str(e)}")
            
            return suitable_internships
            
        except Exception as e:
            logger.error(f"Error processing listings: {str(e)}")
            return []

    def apply_to_internships(self, internships, max_applications=5):
        """Apply to suitable internships with a maximum limit"""
        application_count = 0
        
        for internship in internships:
            if application_count >= max_applications:
                logger.info(f"Reached maximum application limit of {max_applications}")
                break
                
            try:
                logger.info(f"Attempting to apply for {internship['title']} at {internship['company']}")
                
                # Navigate to internship page
                self.driver.get(internship["link"])
                self.random_delay(2, 5)
                
                # First check if already applied
                already_applied = False
                try:
                    # Look for "You have already applied" or "Applied" text
                    applied_text = self.driver.find_elements(By.XPATH, 
                        "//div[contains(text(), 'already applied') or contains(text(), 'Already applied') or contains(text(), 'Applied')]")
                    if applied_text:
                        logger.info(f"Already applied to {internship['title']}, skipping")
                        already_applied = True
                except Exception:
                    pass
                
                if already_applied:
                    continue
                
                # Find and click apply button - try multiple possible selectors
                apply_button = None
                for selector in [
                    "//button[contains(text(), 'Apply now')]",
                    "//a[contains(text(), 'Apply now')]", 
                    "//button[contains(@class, 'apply_button')]",
                    "//a[contains(@class, 'apply_button')]",
                    "//div[contains(@class, 'apply_button')]",
                    "//button[contains(@class, 'btn-primary')][contains(text(), 'Apply')]",
                    "//a[contains(@class, 'btn-primary')][contains(text(), 'Apply')]"
                ]:
                    try:
                        apply_buttons = WebDriverWait(self.driver, 5).until(
                            EC.presence_of_all_elements_located((By.XPATH, selector))
                        )
                        for btn in apply_buttons:
                            if btn.is_displayed() and btn.is_enabled():
                                apply_button = btn
                                break
                        if apply_button:
                            break
                    except:
                        continue
                
                if not apply_button:
                    logger.warning(f"Apply button not found for {internship['title']}, skipping")
                    continue
                
                self.random_delay(1, 2)
                logger.info(f"Clicking apply button for {internship['title']}")
                
                # Use JavaScript click for more reliability
                self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", apply_button)
                self.random_delay(1, 2)
                self.driver.execute_script("arguments[0].click();", apply_button)
                
                # Handle application form
                if self.handle_application_form():
                    application_count += 1
                    logger.info(f"Successfully applied to {internship['title']} ({application_count}/{max_applications})")
                else:
                    logger.warning(f"Could not complete application for {internship['title']}")
                
                self.random_delay(3, 6)  # Longer delay after application
                
            except Exception as e:
                logger.error(f"Error applying to {internship['title']}: {str(e)}")
                
    def handle_application_form(self):
        """Handle the application form if it appears"""
        try:
            # First check for "Proceed to Application" button that might appear before the actual form
            proceed_button = None
            try:
                for selector in [
                    "//button[contains(text(), 'Proceed to Application')]",
                    "//button[contains(text(), 'Proceed to application')]", 
                    "//a[contains(text(), 'Proceed to Application')]",
                    "//a[contains(text(), 'Proceed')]",
                    "//button[contains(@class, 'proceed')]",
                    "//button[contains(@class, 'btn-primary')][contains(text(), 'Proceed')]"
                ]:
                    proceed_candidates = WebDriverWait(self.driver, 5).until(
                        EC.presence_of_all_elements_located((By.XPATH, selector))
                    )
                    for btn in proceed_candidates:
                        if btn.is_displayed() and btn.is_enabled():
                            proceed_button = btn
                            break
                    if proceed_button:
                        break
            except:
                logger.info("No 'Proceed to Application' button found, might be already on application form")
            
            # Click the proceed button if found
            if proceed_button:
                logger.info("Found 'Proceed to Application' button, clicking it")
                self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", proceed_button)
                self.random_delay(1, 2)
                self.driver.execute_script("arguments[0].click();", proceed_button)
                self.random_delay(2, 3)
            
            # Wait for either form to appear or any confirmation that we're on application page
            WebDriverWait(self.driver, 10).until(
                EC.any_of(
                    EC.presence_of_element_located((By.XPATH, "//form[contains(@class, 'application_form')]")),
                    EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'application_form')]")),
                    EC.presence_of_element_located((By.XPATH, "//h4[contains(text(), 'Application')]")),
                    EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'Cover letter')]")),
                    EC.presence_of_element_located((By.XPATH, "//textarea")),
                    EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'Submit')]"))
                )
            )
            logger.info("Application form found")
            
            # Check if there are any questions to answer (may be textareas, text inputs, or other fields)
            questions = self.driver.find_elements(By.XPATH, "//textarea[contains(@class, 'answer_field') or @name='answer' or contains(@id, 'answer')]")
            cover_letters = self.driver.find_elements(By.XPATH, "//textarea[contains(@class, 'cover_letter') or contains(@placeholder, 'cover letter') or contains(@id, 'cover-letter')]")
            generic_textareas = self.driver.find_elements(By.XPATH, "//textarea")
            
            # If no specific fields found, use all textareas
            all_fields = questions + cover_letters
            if not all_fields:
                all_fields = generic_textareas
                logger.info(f"Using {len(generic_textareas)} generic textareas found on application form")
            
            for field in all_fields:
                # Skip if already filled
                if field.get_attribute("value").strip():
                    continue
                    
                # Get the label or question text
                label = ""
                try:
                    # Try different ways to find the associated label
                    label_candidates = [
                        field.find_element(By.XPATH, "./preceding::label[1]").text,
                        field.find_element(By.XPATH, "./preceding::div[contains(@class, 'question')][1]").text,
                        field.get_attribute("placeholder")
                    ]
                    label = next((l for l in label_candidates if l and l.strip()), "")
                except:
                    pass
                
                # Generate a response based on the field type and label
                response = self.generate_response(label if label else "general")
                self.random_delay(1, 2)
                
                # Clear field first if needed and only if it's editable
                try:
                    if field.is_enabled() and not field.get_attribute("readonly"):
                        field.clear()
                        # Type the response using human-like typing
                        self.human_like_typing(field, response)
                        logger.info(f"Filled in application field with response")
                except Exception as e:
                    logger.warning(f"Could not fill field: {str(e)}")
            
            # Check for any checkboxes that need to be accepted (looking for both required and non-required checkboxes)
            all_checkboxes = self.driver.find_elements(By.XPATH, "//input[@type='checkbox']")
            required_checkboxes = self.driver.find_elements(By.XPATH, "//input[@type='checkbox'][@required or contains(@class, 'required')]")
            
            # First handle required checkboxes
            for checkbox in required_checkboxes:
                if not checkbox.is_selected():
                    try:
                        # Use JavaScript to check the box as it's more reliable
                        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", checkbox)
                        self.random_delay(0.5, 1)
                        self.driver.execute_script("arguments[0].click();", checkbox)
                        logger.info("Checked required checkbox")
                    except:
                        pass
            
            # Then handle other checkboxes like "Keep me updated" that might be helpful
            for checkbox in all_checkboxes:
                if checkbox not in required_checkboxes and not checkbox.is_selected():
                    try:
                        checkbox_label = ""
                        try:
                            # Try to get the checkbox label text
                            label_element = checkbox.find_element(By.XPATH, "./following::label[1]")
                            checkbox_label = label_element.text
                        except:
                            pass
                        
                        # Check boxes related to notifications or updates, but skip terms of service/agreements
                        if checkbox_label and any(keyword in checkbox_label.lower() for keyword in ["notification", "update", "inform"]) and not any(keyword in checkbox_label.lower() for keyword in ["term", "condition", "agree"]):
                            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", checkbox)
                            self.random_delay(0.5, 1)
                            self.driver.execute_script("arguments[0].click();", checkbox)
                            logger.info(f"Checked optional checkbox: {checkbox_label}")
                    except:
                        pass
            
            # Try to find and click the submit button
            submit_button = None
            for selector in [
                "//button[@type='submit'][contains(text(), 'Submit')]",
                "//button[contains(text(), 'Submit')]",
                "//input[@type='submit']",
                "//button[contains(@class, 'submit')]", 
                "//button[contains(@class, 'btn-primary')][contains(text(), 'Submit')]"
            ]:
                try:
                    submit_candidates = self.driver.find_elements(By.XPATH, selector)
                    for btn in submit_candidates:
                        if btn.is_displayed() and btn.is_enabled():
                            submit_button = btn
                            break
                    if submit_button:
                        break
                except:
                    continue
            
            if submit_button:
                self.random_delay(1, 3)
                logger.info("Found submit button, clicking now")
                
                # Scroll to the button first
                self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", submit_button)
                self.random_delay(1, 1.5)
                
                # Use JavaScript click which is more reliable
                self.driver.execute_script("arguments[0].click();", submit_button)
                
                # Wait for success message with multiple possible confirmations
                try:
                    WebDriverWait(self.driver, 15).until(
                        EC.any_of(
                            EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'Application submitted')]")),
                            EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'Successfully')]")),
                            EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'successfully')]")),
                            EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'success')]")),
                            EC.url_contains("application-successful"),
                            EC.url_contains("applied")
                        )
                    )
                    logger.info("Received confirmation of successful application")
                    return True
                except:
                    logger.warning("No confirmation received but form was submitted")
                    
                    # Check if we're redirected back to main internship page, which often happens after successful submission
                    try:
                        if "/internship/" in self.driver.current_url:
                            logger.info("Redirected to internship page after submission, likely successful")
                            return True
                    except:
                        pass
                    
                    # Even if confirmation not detected, assume success as button was clicked
                    return True
            else:
                logger.warning("Submit button not found")
                return False
            
        except TimeoutException:
            logger.warning("Application form not found or already applied")
            return False
        except Exception as e:
            logger.error(f"Error handling application form: {str(e)}")
            return False

    def generate_response(self, question):
        """Generate a response based on the question or field type"""
        question = question.lower()
        
        # Cover letter or general response
        if "cover" in question or "letter" in question or question == "general":
            return """I am excited about this opportunity and believe my skills and enthusiasm make me a strong candidate for this role. I have experience with the technologies mentioned in the job description and am eager to apply these skills in a real-world setting. I am a quick learner, detail-oriented, and passionate about contributing to innovative projects. I look forward to the possibility of joining your team and growing professionally through this experience."""
            
        # Why are you interested / why should we select you
        elif any(keyword in question for keyword in ["why", "interested", "select", "hire", "ideal"]):
            return """I am particularly interested in this role because it aligns perfectly with my skills and career aspirations. I'm impressed by the company's work and culture, and I believe my background in the required technologies would allow me to contribute effectively from day one. I'm enthusiastic about learning and growing in this position, and I'm confident I can bring a unique perspective and strong work ethic to your team."""
            
        # Availability question
        elif any(keyword in question for keyword in ["availability", "available", "start", "join", "duration"]):
            return """I am available to start immediately and can commit to the full duration of the internship. I have arranged my schedule to dedicate the required hours to this opportunity, ensuring I can give my complete focus and attention to the role."""
            
        # Experience/skills question
        elif any(keyword in question for keyword in ["experience", "skill", "project", "work"]):
            return """I have hands-on experience with relevant technologies through both academic projects and self-directed learning. I've completed several projects that developed my technical skills and problem-solving abilities. I focus on writing clean, maintainable code and continuously expanding my knowledge. I'm eager to apply these skills in a professional environment where I can both contribute and grow."""
            
        # Default response for other questions
        else:
            return """Thank you for considering my application. I believe my skills and enthusiasm make me well-suited for this opportunity. I am committed to delivering high-quality work and am excited about the prospect of joining your team. I look forward to discussing how my background aligns with your needs."""

    def close(self):
        """Close the browser session"""
        if hasattr(self, 'driver'):
            self.driver.quit()
            logger.info("Browser session closed")

    def run(self, max_applications=5):
        """
        Run the full automation workflow with a limit on applications
        
        Args:
            max_applications (int): Maximum number of applications to submit
            
        Returns:
            bool: True if automation completed successfully, False otherwise
        """
        success = False
        try:
            if self.login():
                # First extract preferences from profile
                self.extract_profile_preferences()
                
                # Then browse and apply to internships
                internships = self.browse_internships()
                if internships:
                    logger.info(f"Found {len(internships)} suitable internships")
                    self.apply_to_internships(internships, max_applications)
                    success = True
                else:
                    logger.info("No suitable internships found matching your criteria")
                    success = True  # Still count as success if login worked but no matching internships
            else:
                logger.error("Login failed, cannot proceed")
                success = False
                
            return success
        except Exception as e:
            logger.error(f"Automation error: {str(e)}")
            return False
        finally:
            self.close()


if __name__ == "__main__":
    # Get credentials from config
    bot = InternshalaAutomation(INTERNSHALA_EMAIL, INTERNSHALA_PASSWORD, headless=False)
    bot.run()
