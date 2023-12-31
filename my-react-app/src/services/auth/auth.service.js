import axios from "axios";

export const signIn = async (email, password) => {
  return axios.post(`http://localhost:3000/user/sign-in`, {
    email,
    password,
  });
};

export const signUp = async (signUpPayload) => {
  return axios.post(`http://localhost:3000/user/sign-up`, signUpPayload);
};

export const updateUserService = async (updatePayload) => {
  const token = localStorage.getItem("token");
  return axios.put(`http://localhost:3000/user/update`, updatePayload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllUserPagination = async (page, perPage) => {
  const token = localStorage.getItem("token");

  return await axios.get("http://localhost:3000/user/pagination", {
    params: {
      page,
      perPage,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const forgotPassword = async (email) => {
  return axios.post(`http://localhost:3000/user/forgot-password`, {
    email,
  });
};
export const resetPassword = async (resetPasswordPayload) => {
  return axios.post(
    `http://localhost:3000/user/reset-password`,
    resetPasswordPayload
  );
};
export const getUserProfile = async () => {
  const token = localStorage.getItem("token");

  return await axios.get(`http://localhost:3000/user/get-profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const deleteUserService = async (userId) => {
  return await axios.delete(`http://localhost:3000/user/delete/${userId}`);
};

export const updateStatusUserService = async (userId, status) => {
  return await axios.put(
    `http://localhost:3000/user/updateStatus/${userId}`,
    status
  );
};

