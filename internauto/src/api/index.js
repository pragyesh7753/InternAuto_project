/**
 * API client for the Internshala automation backend
 */

const API_BASE_URL = 'http://localhost:5000/api';

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
            
            return await response.json();
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
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    /**
     * Check if the API server is running
     * @returns {Promise<boolean>} True if server is running
     */
    healthCheck: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/health`, {
                method: 'GET',
            });
            
            const data = await response.json();
            return data.status === 'ok';
        } catch (error) {
            console.error('API Health Check Error:', error);
            return false;
        }
    }
};

export default InternshalaAPI;
