import axios from "axios";

const baseURL = "/api/campaigns";

// Campaigns
export const createCampaign = async (data) => await axios.post(baseURL, data);

export const editCampaign = async (id, data) => await axios.put(`${baseURL}/${id}`, data);

export const deleteCampagin = async (id) => await axios.delete(`${baseURL}/${id}`);

export const getCampaigns = async () => await axios.get(baseURL);

// Categories
export const getCategories = async (campagin_id) => await axios.get(`${baseURL}/${campagin_id}/category`);

export const createCategory = async (campagin_id, title, description, source) =>
  await axios.post(`${baseURL}/${campagin_id}/category`, { title, description, source });

export const deleteCategory = async (campagin_id, category_id) =>
  await axios.delete(`${baseURL}/${campagin_id}/category/${category_id}`);

export const editCategory = async (campagin_id, category_id, title, description, source) =>
  await axios.patch(`${baseURL}/${campagin_id}/category/${category_id}`, { title, description, source });

// Nominations
export const getNominations = async (campagin_id, category_id) =>
  await axios.get(`${baseURL}/${campagin_id}/category/${category_id}/nominations`);

export const createNomination = async (campagin_id, category_id, workId) =>
  await axios.post(`${baseURL}/${campagin_id}/category/${category_id}/nominations`, { work: workId });

export const deleteNomination = async (campagin_id, category_id, nominationId) =>
  await axios.delete(`${baseURL}/${campagin_id}/category/${category_id}/nominations/${nominationId}`);

export const editNomination = async (campagin_id, category_id, nominationId, workId) =>
  await axios.patch(`${baseURL}/${campagin_id}/category/${category_id}/nominations/${nominationId}`, { work: workId });

// Votes
export const addVote = async (campagin_id, category_id, nominationId) =>
  await axios.post(`${baseURL}/${campagin_id}/category/${category_id}/nominations/${nominationId}/vote`);

export const removeVote = async (campagin_id, category_id, nominationId) =>
  await axios.delete(`${baseURL}/${campagin_id}/category/${category_id}/nominations/${nominationId}/vote`);

// Works
export const getWork = async (workId) => await axios.get(`/api/work/${workId}`);
export const createWork = async (work) => await axios.post(`/api/work/${work.source}`, work);
export const deleteWork = async (workId) => await axios.delete(`/api/work/${workId}`);
export const editWork = async (workId, work) => await axios.patch(`/api/work/${workId}`, work);
