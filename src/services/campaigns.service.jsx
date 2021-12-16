import axios from "axios";

const baseURL = "/api/campaigns";

// Campaigns
export const createCampaign = async (data) => {
  return await axios.post(baseURL, data);
};

export const editCampaign = async (id, data) => {
  return await axios.put(`${baseURL}/${id}`, data);
};

export const deleteCampagin = async (id) => {
  return await axios.delete(`${baseURL}/${id}`);
};

export const getCampaigns = async () => {
  return await axios.get(baseURL);
};

// Categories
export const getCategories = async (campaignId) => {
  return await axios.get(`${baseURL}/${campaignId}/category`);
};

export const createCategory = async (campaignId, category, source) => {
  return await axios.post(`${baseURL}/${campaignId}/category`, { category, source });
};

export const deleteCategory = async (campaignId, categoryId) => {
  return await axios.delete(`${baseURL}/${campaignId}/category/${categoryId}`);
};

export const editCategory = async (campaignId, categoryId, category, source) => {
  return await axios.patch(`${baseURL}/${campaignId}/category/${categoryId}`, { category, source });
};
