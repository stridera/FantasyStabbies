import axios from "axios";

const baseURL = "/api/campaigns";

// Campaigns
export const createCampaign = async (data) => await axios.post(baseURL, data);

export const editCampaign = async (id, data) => await axios.put(`${baseURL}/${id}`, data);

export const deleteCampagin = async (id) => await axios.delete(`${baseURL}/${id}`);

export const getCampaigns = async () => await axios.get(baseURL);

// Categories
export const getCategories = async (campaignId) => await axios.get(`${baseURL}/${campaignId}/category`);

export const createCategory = async (campaignId, title, description, source) =>
  await axios.post(`${baseURL}/${campaignId}/category`, { title, description, source });

export const deleteCategory = async (campaignId, categoryId) =>
  await axios.delete(`${baseURL}/${campaignId}/category/${categoryId}`);

export const editCategory = async (campaignId, categoryId, title, description, source) =>
  await axios.patch(`${baseURL}/${campaignId}/category/${categoryId}`, { title, description, source });

// Nominations
export const getNominations = async (campaignId, categoryId) =>
  await axios.get(`${baseURL}/${campaignId}/category/${categoryId}/nominations`);

export const createNomination = async (campaignId, work) =>
  await axios.post(`${baseURL}/${campaignId}/category/${categoryId}/nominations`, { work });

export const deleteNomination = async (campaignId, categoryId, nominationId) =>
  await axios.delete(`${baseURL}/${campaignId}/category/${categoryId}/nominations/${nominationId}`);

export const editNomination = async (campaignId, categoryId, nominationId, work) =>
  await axios.patch(`${baseURL}/${campaignId}/category/${categoryId}/nominations/${nominationId}`, { work });
