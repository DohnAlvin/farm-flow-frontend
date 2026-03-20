import axios from 'axios';

const apiClient = axios.create({
    // Use an environment variable for the URL, or default to local Django
    baseURL: process.env.REACT_APP_API_URL || 'https://farmflow-api-s521.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;