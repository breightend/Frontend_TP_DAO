import axios from 'axios';

const API_URL = 'http://localhost:3000/api/employees';

export const getEmployees = async () => {
    const response = await axios.get(API_URL)
    return response.data
}

export const createEmployee = async (employeeData) => {
    const response = await axios.post(API_URL, employeeData)
    return response.data
}

export const updateemployee = async (employeeId, employeeData) => {
    const response = await axios.put(`${API_URL}/${employeeId}`, employeeData)
    return response.data
}

export const deleteEmployee = async (employeeId) => {
    const response = await axios.delete(`${API_URL}/${employeeId}`)
    return response.data
}

export const getEmployeeById = async (employeeId) => {
    const response = await axios.get(`${API_URL}/${employeeId}`)
    return response.data
}