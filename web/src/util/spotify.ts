import axios from './axios';

export const getCredentials = async () => {
    const { data } = await axios.get('/spotify/credentials');
    return data;
}