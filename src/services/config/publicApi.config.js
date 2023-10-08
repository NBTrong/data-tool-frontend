import axios from 'axios';
import baseUrl from './baseUrl';

const publicApi = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default publicApi;
