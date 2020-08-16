import axios from "axios";

export const login = async () => {
  return await axios.get("/auth/user");
};

export const logout = async () => {
  return await axios.get("/auth/logout");
};
