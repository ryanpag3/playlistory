import { AxiosError } from 'axios'
import { useHistory } from 'react-router'

export const handleError = (history: any, error: AxiosError) => {
    if (error?.response?.status === 401) {
        history.push('/login');
    }
}