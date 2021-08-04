import { makeUseAxios } from 'axios-hooks';
import Axios from 'axios';

const axios = Axios.create({
    baseURL: process.env.PROXY_URL || 'http://localhost:3000',
    withCredentials: true
});

export const useAxios = makeUseAxios({
    axios
});

export default axios;