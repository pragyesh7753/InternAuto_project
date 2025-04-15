import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configuration variables
INTERNSHALA_EMAIL = os.getenv('INTERNSHALA_EMAIL', 'your_default_email@example.com')
INTERNSHALA_PASSWORD = os.getenv('INTERNSHALA_PASSWORD', 'your_default_password')
