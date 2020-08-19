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

// Questions
export const getQuestions = async (campaignId) => {
  return await axios.get(`${baseURL}/${campaignId}/questions`);
};

export const createQuestion = async (campaignId, question, source) => {
  return await axios.post(`${baseURL}/${campaignId}/questions`, { question, source });
};

export const deleteQuestion = async (campaignId, questionId) => {
  return await axios.delete(`${baseURL}/${campaignId}/questions/${questionId}`);
};

export const editQuestion = async (campaignId, questionId, question, source) => {
  return await axios.patch(`${baseURL}/${campaignId}/questions/${questionId}`, { question, source });
};
