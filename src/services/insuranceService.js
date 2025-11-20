import axios from "axios";

const API_URL = "http://localhost:3000/api/seguros";

export const getInsurances = async () => {
  const response = await axios.get(`${API_URL}/seguros`);
  return response.data;
};
export const createInsurance = async (insuranceData) => {
  const isFormData = insuranceData instanceof FormData;
  const config = {
    headers: {},
  };

  if (isFormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  const response = await axios.post(
    `${API_URL}/createSeguro`,
    insuranceData,
    config
  );
  return response.data;
};
