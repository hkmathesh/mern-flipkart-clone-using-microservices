import axios from 'axios';

const PRODUCT_SERVICE_URL = import.meta.env.VITE_PRODUCT_SERVICE_URL;

const productAPI = axios.create({
  baseURL: PRODUCT_SERVICE_URL,
});

export default productAPI;
