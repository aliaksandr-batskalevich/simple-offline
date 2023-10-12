import axios from 'axios';


// SERVER IP
const baseURL = 'http://185.250.46.14/api/simple-offline/';

const axiosOptions = {
    baseURL,
};

export const instance = axios.create(axiosOptions);