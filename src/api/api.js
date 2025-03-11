import axiosInstance from "@/hooks/axios/axios";
import { createNotification } from "masterComponents/Notification";

const successNotify = () =>
  createNotification(
    "🥳 Changes successfully Applied",
    "success",
    1000,
    "bottom-center",
    2
  );

// _____ Setup Stages _____

export const getAllStages = async (searchWord) => {
  const resp = await axiosInstance.post("Setup/StageTypeGetAll", {
    SearchWord: searchWord || null,
  });
  return resp;
};

export const createStage = async (body) => {
  const resp = await axiosInstance.post("Setup/StageTypeCreate", body);
  if (!resp.Error && resp.data) {
    successNotify();
  }
  return resp;
};

export const deleteStage = async (id) => {
  const resp = await axiosInstance.post("Setup/StageTypeDelete", {
    ID: id,
  });
  if (!resp.Error && resp.data) {
    successNotify();
  }
  return resp;
};

export const updateStage = async (body) => {
  const resp = await axiosInstance.post("Setup/StageTypeUpdate", body);
  if (!resp.Error && resp.data) {
    successNotify();
  }
  return resp;
};

export const getSpecificStage = async (id) => {
  const resp = await axiosInstance.post("Setup/StageTypeGet", {
    ID: id,
  });

  return resp;
};

export const getCriteriaGroupsForDropdown = async (searchWord) => {
  const resp = await axiosInstance.post(
    "Setup/CriteriaGroupGetAllForDropdown",
    {
      SearchWord: searchWord || null,
    }
  );
  return resp;
};

// _____ Setup Criteria _____

export const getAllCriteria = async (searchWord) => {
  const resp = await axiosInstance.post("Setup/CriteriaGetAll", {
    SearchWord: searchWord || null,
  });
  return resp;
};

export const createCriteria = async (body) => {
  const resp = await axiosInstance.post("Setup/CriteriaCreate", body);
  if (!resp.Error && resp.data) {
    successNotify();
  }
  return resp;
};

export const updateCriteria = async (body) => {
  const resp = await axiosInstance.post("Setup/CriteriaUpdate", body);
  if (!resp.Error && resp.data) {
    successNotify();
  }
  return resp;
};

export const deleteCriteria = async (id) => {
  const resp = await axiosInstance.post("Setup/CriteriaDelete", {
    ID: id,
  });
  if (!resp.Error && resp.data) {
    successNotify();
  }
  return resp;
};

export const getScoreIndicators = async (id) => {
  const resp = await axiosInstance.post("Setup/CriteriaScoreIndicatorGetAll", {
    ID: id,
  });
  return resp;
};

// _____ Setup CriteriaGroup _____

export const getAllCriteriaGroup = async (searchWord) => {
  const resp = await axiosInstance.post("Setup/CriteriaGroupGetAll", {
    SearchWord: searchWord || null,
  });
  return resp;
};

export const getAllCriteriaGroupExtended = async (searchWord) => {
  const resp = await axiosInstance.post(
    "Setup/CriteriaGroupGetAllWithCriterias",
    {
      SearchWord: searchWord || null,
    }
  );
  return resp;
};

export const createCriteriaGroup = async (body) => {
  const resp = await axiosInstance.post("Setup/CriteriaGroupCreate", body);
  if (!resp.Error && resp.data) {
    successNotify();
  }
  return resp;
};

export const deleteCriteriaGroup = async (id) => {
  const resp = await axiosInstance.post("Setup/CriteriaGroupDelete", {
    ID: id,
  });
  if (!resp.Error && resp.data) {
    successNotify();
  }
  return resp;
};

export const updateCriteriaGroup = async (body) => {
  const resp = await axiosInstance.post("Setup/CriteriaGroupUpdate", body);
  if (!resp.Error && resp.data) {
    successNotify();
  }
  return resp;
};

export const getCriteriaGroup = async (id) => {
  const resp = await axiosInstance.post("Setup/CriteriaGroupCriteriaGetAll", {
    ID: id,
  });
  return resp;
};

export const getCriteriaForDropdown = async (searchWord) => {
  const resp = await axiosInstance.post("Setup/CriteriaGetAllForDropdown", {
    SearchWord: searchWord || null,
  });
  return resp;
};

// Setup Followups

export const createFollowUp = async (body) => {
  const resp = await axiosInstance.post("Setup/FollowUpCreate", body);
  if (!resp.Error && resp.data) {
    successNotify();
  }
  return resp;
};

export const deleteFollowUp = async (id) => {
  const resp = await axiosInstance.post("Setup/FollowUpDelete", { ID: id });
  if (!resp.Error && resp.data) {
    successNotify();
  }
  return resp;
};

export const editFollowUp = async (body) => {
  const resp = await axiosInstance.post("Setup/FollowUpUpdate", body);
  if (!resp.Error && resp.data) {
    successNotify();
  }
  return resp;
};

export const getFollowUp = async (val) => {
  const resp = await axiosInstance.post("Setup/FollowUpGetAll", {
    SearchWord: val || null,
  });
  return resp;
};

export const getFollowUpPlaceHolders = async () => {
  const resp = await axiosInstance.post("Setup/FollowUpPlaceholderGetAll");
  return resp;
};

export const getCandidateStatuses = async () => {
  const resp = await axiosInstance.post("TalentPool/CandidateStatusGetAll");
  return resp;
};

//TEST

export const devExtremeTest = async () => {
  const resp = await axiosInstance.post("Vacancy/ListGetForHead", {
    FunctionParams: JSON.stringify({ PageSize: 2 }),
    take: 10,
  });

  return resp;
};
