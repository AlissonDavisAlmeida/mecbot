import axios from 'axios'

export const api = axios.create({
  baseURL: `http://localhost:${process.env.API_PORT ?? 4000}`, // backend NestJS
})