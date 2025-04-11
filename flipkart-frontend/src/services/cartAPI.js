import axios from 'axios';

const CART_SERVICE_URL = import.meta.env.VITE_CART_SERVICE_URL;

const cartAPI = axios.create({
  baseURL: CART_SERVICE_URL,
});

export default cartAPI;
