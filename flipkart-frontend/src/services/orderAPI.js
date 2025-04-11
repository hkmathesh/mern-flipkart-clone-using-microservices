import axios from 'axios';

const ORDER_SERVICE_URL = import.meta.env.VITE_ORDER_SERVICE_URL;

const orderAPI = axios.create({
  baseURL: ORDER_SERVICE_URL,
});

export default orderAPI;
