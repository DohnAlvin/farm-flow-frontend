import axios from 'axios';

// Matches your Django REST Framework router URL
const API_URL = 'https://farmflow-api-s521.onrender.com/api/tasks/';

export const farmTaskApi = {
    // GET all tasks (e.g., to populate a list or calendar)
    getAll: () => axios.get(API_URL),
    
    // GET a single task by ID
    getById: (id) => axios.get(`${API_URL}${id}/`),

    // POST a new task (e.g., "Water the north field")
    create: (taskData) => axios.post(API_URL, taskData),
    
    // PUT (Update) the entire task object
    update: (id, taskData) => axios.put(`${API_URL}${id}/`, taskData),

    // PATCH (Partial Update) - Perfect for toggling 'is_completed'
    patch: (id, partialData) => axios.patch(`${API_URL}${id}/`, partialData),
    
    // DELETE a task
    delete: (id) => axios.delete(`${API_URL}${id}/`)
};