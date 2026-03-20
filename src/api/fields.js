import axios from 'axios';

// Keeping the URL direct as requested
const API_URL = 'https://farmflow-api-s521.onrender.com/api/fields/';

export const fieldApi = {
    // GET all fields
    getAll: () => axios.get(API_URL),

    // POST a new field
    create: (data) => axios.post(API_URL, data),

    // PUT to update a specific field (Django requires the trailing slash and ID)
    update: (id, data) => axios.put(`${API_URL}${id}/`, data),

    // DELETE a specific field
    delete: (id) => axios.delete(`${API_URL}${id}/`)
};