import axios from "axios";

export const createPaymentURL = (roomId, paymentInfo) => {
  return axios.post(
    `http://localhost:3000/create-payment-url/${roomId}`,
    paymentInfo
  );
};
export const getPaymentDetailService = (params) => {
  return axios.get("http://localhost:3000/get-payment-detail", { params });
};
