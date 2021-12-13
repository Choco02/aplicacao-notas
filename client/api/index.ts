import axios from 'axios';

axios.defaults.baseURL = process.env.API_URL;

export const _api = () => axios;
