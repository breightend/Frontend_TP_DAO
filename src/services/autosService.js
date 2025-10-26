import axios from 'axios';

const API_URL = 'http://localhost:3000/api/autos';

export const getAutos = async () => {
    const response = await axios.get(API_URL)
    return response.data
}

export const createAuto = async (autoData) => {
    const response = await axios.post(API_URL, autoData)
    return response.data
}

export const updateCar = async (id, autoData) => {
    const response = await axios.put(`${API_URL}/${id}`, autoData)
    return response.data
}

export const gatAviableCars = async () => {
    const response = await axios.get(`${API_URL}/available`)
    return response.data
}