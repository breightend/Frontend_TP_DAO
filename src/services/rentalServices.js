import axios from "axios";

const API_URL = "http://localhost:3000/api/rentals";

export const getRentals = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
export const createRental = async (rentalData) => {
  const response = await axios.post(API_URL, rentalData);
  return response.data;
}