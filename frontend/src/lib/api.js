import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// ── Warm-up ping — called on app load to wake Render from cold sleep ──
export const pingBackend = () => {
  fetch(`${API_BASE_URL}/health`, { method: 'GET', mode: 'cors' }).catch(() => {});
};

export const submitIdea = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, data);
    return response.data;
  } catch (error) {
    let errorMessage = "An unexpected error occurred. Please try again.";

    if (error.response) {
      errorMessage = error.response.data.detail || `Server error: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = "Unable to connect to the analysis server. Please try again in a moment.";
    } else {
      errorMessage = error.message;
    }

    console.error("API Error in submitIdea:", error);
    alert(`Error: ${errorMessage}`);
    throw new Error(errorMessage);
  }
};
