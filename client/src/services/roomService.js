import api from "./api";

export const createRoom = async () => {
  const token = localStorage.getItem("token");
  const response = await api.post(
    "/rooms/create",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};
