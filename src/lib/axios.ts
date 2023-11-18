import axios, { CreateAxiosDefaults } from 'axios';


const BaseConfig: CreateAxiosDefaults = {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json' },
};

export default axios.create(BaseConfig);
export const axiosAuth = axios.create(BaseConfig);
