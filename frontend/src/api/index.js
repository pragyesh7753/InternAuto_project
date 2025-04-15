/**
 * API client for the Internshala automation backend
 */

const API_BASE_URL = 'https://internauto-project.onrender.com/api';

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
      const response = await fetch(`${API_BASE_URL}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      return handleResponse(response);
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
      const response = await fetch(`${API_BASE_URL}/status/${jobId}`, {
        method: 'GET',
      });

      return handleResponse(response);
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
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
      });

      const data = await handleResponse(response);
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
      const response = await fetch(`${API_BASE_URL}/career_suggestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      return handleResponse(response);
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
      const response = await fetch(`${API_BASE_URL}/generate_resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });

      return handleResponse(response);
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
