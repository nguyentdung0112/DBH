import axios from "axios";

export const createBookingService = async (createBookingPayload) => {
  const token = localStorage.getItem("token");
  return await axios.post(
    "http://localhost:3000/create-booking",
    createBookingPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const getAllBookingsUserService = async (userId) => {
  const token = localStorage.getItem("token");
  return await axios.get(`http://localhost:3000/bookings/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getAllBookingsRoomService = async (roomId) => {
  const token = localStorage.getItem("token");
  return await axios.post(`http://localhost:3000/bookings/${roomId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
