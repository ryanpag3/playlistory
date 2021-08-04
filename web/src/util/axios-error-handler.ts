import { AxiosError } from 'axios'

export const handleError = (history: any, error: AxiosError) => {
    if (error?.response?.status === 401) {
        history.push('/login');
    }
}