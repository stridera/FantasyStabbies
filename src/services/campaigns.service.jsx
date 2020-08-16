import axios from "axios";

export const createCampaign = async (
  campaignName,
  isPublic,
  nominationStartDate,
  votingStartDate,
  endDate,
  ageRequirement
) => {
  return await axios.post("/campaigns", {
    campaignName,
    isPublic,
    nominationStartDate,
    votingStartDate,
    endDate,
    ageRequirement,
  });
};

export const editCampaign = async (id, name, ageRequirement) => {
  return await axios.put(`/campaigns/${id}`, {
    name,
    ageRequirement,
  });
};

export const deleteCampagin = async (id) => {
  return await axios.delete(`/campaigns/${id}`);
};

export const getCampaigns = async () => {
  return await axios.get("/campaigns");
};
