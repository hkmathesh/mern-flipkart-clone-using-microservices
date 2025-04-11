import axios from 'axios';

const ADDRESS_SERVICE_URL = import.meta.env.VITE_ADDRESS_SERVICE_URL;

const addressAPI = axios.create({
  baseURL: ADDRESS_SERVICE_URL,
});

export default addressAPI;
