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
