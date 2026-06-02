import axios from 'axios';

// Ensure it says exactly this (NO trailing slash at the end)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const submitIdea = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, data);
    return response.data;
  } catch (error) {
    let errorMessage = "An unexpected error occurred. Please try again.";
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data.detail || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // The request was made but no response was received (e.g. server offline)
      errorMessage = "Unable to connect to the backend server. Please ensure the FastAPI server is running at http://127.0.0.1:8000.";
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
    }
    
    console.error("API Error in submitIdea:", error);
    
    // Display error directly to the UI since page components are locked
    alert(`Error: ${errorMessage}`);
    
    throw new Error(errorMessage);
  }
};
