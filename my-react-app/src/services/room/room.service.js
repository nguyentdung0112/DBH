import axios from "axios";
export const getAllRoomPagination = async (page, perPage, sortValue) => {
  const token = localStorage.getItem("token");

  return await axios.get("http://localhost:3000/room/pagination", {
    params: {
      page,
      perPage,
      sortValue,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// Get All
export const getAllRoomsService = async () => {
  return await axios.get("http://localhost:3000/room/get-detail-all-rooms");
};
export const getRoomlastestService = async () => {
  return await axios.get("http://localhost:3000/room/getRoomLastest");
};
// get One
export const getRoomService = async (roomId) => {
  return await axios.get(
    `http://localhost:3000/room/get-detail-room/${roomId}`
  );
};
export const getRoomBookingService = async (roomId) => {
  return await axios.get(
    `http://localhost:3000/room/get-detail-room-booking/${roomId}`
  );
};

export const getAllRoomsUserService = async (userId) => {
  const token = localStorage.getItem("token");
  return await axios.get(`http://localhost:3000/room/getRoomOfUser/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Update one
export const updateRoomService = async (roomId, updatePayload) => {
  return await axios.put(
    `http://localhost:3000/room/updateRoom/${roomId}`,
    updatePayload
  );
};
export const updateStatusRoomService = async (roomId, status) => {
  return await axios.put(
    `http://localhost:3000/room/updateStatus/${roomId}`,
    status
  );
};


// Create
export const createRoomService = async (createdPayload) => {
  const token = localStorage.getItem("token");

  return await axios.post(
    "http://localhost:3000/room/createRoom",
    createdPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// delete
export const deleteRoomService = async (roomId) => {
  return await axios.delete(`http://localhost:3000/room/${roomId}`);
};

export const searchRoomService = async (search, page, perPage) => {
  return await axios.get(`http://localhost:3000/room/search`, {
    params: {
      search,
      page,
      perPage,
    },
  });
};

export const apiGetProvinces = async () => {
  return await axios.get(`https://vapi.vnappmob.com/api/province`);
};
export const apiGetDistrictsOfProvinces = async (provinceId) => {
  return await axios.get(
    `https://vapi.vnappmob.com/api/province/district/${provinceId}`
  );
};
export const apiGetWardsOfDistrict = async (districtId) => {
  return await axios.get(
    `https://vapi.vnappmob.com/api/province/ward/${districtId}`
  );
};
