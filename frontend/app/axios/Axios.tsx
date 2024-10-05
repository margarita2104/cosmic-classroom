import axios from 'axios'

const BASE_URL = (window.location.hostname === 'localhost')
        ? 'http://localhost:8000/'
        : 'https://cosmic-classroom.vercel.app'

export const AxiosPanelista = axios.create({
  baseURL: BASE_URL,
})