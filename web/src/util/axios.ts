import { makeUseAxios } from 'axios-hooks';
import Axios from 'axios';

const axios = Axios.create({
    // @ts-ignore
    baseURL: window._env_.REACT_APP_PROXY_URL || 'http://localhost:3000',
    withCredentials: true
});

export const useAxios = makeUseAxios({
    axios
});

export default axios;