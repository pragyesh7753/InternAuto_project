/**
 * API client for the Internshala automation backend
 */

// Use environment variable with fallback to production URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://internauto-project.onrender.com/api';

// Add a backup API URL for fallback
const BACKUP_API_URL = 'https://internauto-backup.onrender.com/api';

/**
 * Helper function to handle API responses
 * @param {Response} response - Fetch API response object
 * @returns {Promise<Object>} - Parsed JSON response or error
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }
  return response.json();
};

/**
 * Attempts to fetch data from the primary API, falls back to backup if needed
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
const fetchWithFallback = async (endpoint, options) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return await handleResponse(response);
  } catch (error) {
    console.warn(`Primary API failed: ${error.message}. Trying backup...`);
    try {
      const backupResponse = await fetch(`${BACKUP_API_URL}${endpoint}`, options);
      return await handleResponse(backupResponse);
    } catch (backupError) {
      console.error('Backup API also failed:', backupError);
      throw new Error(`API unavailable: ${error.message}`);
    }
  }
};

export const InternshalaAPI = {
  /**
   * Start an automation job
   * @param {Object} params - Automation parameters
   * @param {string} params.email - Internshala email
   * @param {string} params.password - Internshala password 
   * @param {boolean} params.headless - Run in headless mode
   * @param {number} params.limit - Max number of applications
   * @returns {Promise<Object>} Response with job_id
   */
  startAutomation: async (params) => {
    try {
      return await fetchWithFallback('/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  /**
   * Check automation job status
   * @param {string} jobId - The job ID to check
   * @returns {Promise<Object>} Response with status and messages
   */
  checkStatus: async (jobId) => {
    try {
      return await fetchWithFallback(`/status/${jobId}`, {
        method: 'GET',
      });
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  /**
   * Health check for API server
   * @returns {Promise<boolean>} True if server is running
   */
  healthCheck: async () => {
    try {
      const data = await fetchWithFallback('/health', {
        method: 'GET',
      });
      return data.status === 'ok';
    } catch (error) {
      console.error('API Health Check Error:', error);
      return false;
    }
  },

  /**
   * Get career suggestion from Gemini API
   * @param {Object} params - User's career info
   * @param {string} params.goal
   * @param {string} params.education
   * @param {string} params.technicalSkills
   * @param {string} params.softSkills
   * @param {string} params.project
   * @returns {Promise<Object>} Response with suggestion
   */
  getCareerSuggestion: async (params) => {
    try {
      return await fetchWithFallback('/career_suggestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  /**
   * Generate a resume based on user input
   * @param {Object} resumeData - User's resume information
   * @returns {Promise<Object>} Response with generated resume
   */
  generateResume: async (resumeData) => {
    try {
      return await fetchWithFallback('/generate_resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });
    } catch (error) {
      console.error('Resume Generation Error:', error);
      throw error;
    }
  },

  /**
   * Download resume as DOCX (now handled client-side)
   * @deprecated Use client-side document generation instead
   */
  downloadResumeDocx: async () => {
    console.warn('This method is deprecated, DOCX generation now happens on frontend');
    return new Blob([''], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  }
};

export default InternshalaAPI;
