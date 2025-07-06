const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Fetch drug names from the backend with search functionality
 * @param {string} token - JWT token for authentication
 * @param {Object} options - Search options
 * @param {string} options.search - Search term for drug name
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.size - Number of items per page (default: 10)
 * @returns {Promise<Object>} - Response with drug data
 */
export const fetchDrugs = async (token, options = {}) => {
  try {
    const { search = '', page = 1, size = 10 } = options;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (search.trim()) {
      queryParams.append('search', search.trim());
    }

    const response = await fetch(`${BASE_URL}/api/v1/drug-details?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching drugs:', error);
    throw error;
  }
};

/**
 * Fetch all drug names (for dropdown/select options)
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Array>} - Array of drug names
 */
export const fetchAllDrugNames = async (token) => {
  try {
    const response = await fetchDrugs(token, { size: 1000 }); // Get a large number to fetch all
    return response.data?.drugs || [];
  } catch (error) {
    console.error('Error fetching all drug names:', error);
    return [];
  }
}; 