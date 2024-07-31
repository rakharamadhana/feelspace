import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

console.log('API_URL ', process.env.REACT_APP_API_URL);

export default api;
