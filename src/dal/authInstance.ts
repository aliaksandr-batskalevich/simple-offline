import axios from 'axios';

// SERVER IP
const baseURL = process.env.REACT_APP_SERVER_ENDPOINT || 'http://185.250.46.14/api/simple-offline/';

const axiosOptions = {
    baseURL,
};

export const authInstance = axios.create(axiosOptions);