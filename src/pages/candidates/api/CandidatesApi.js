import axiosInstance from "@/hooks/axios/axios";

//common

export const getMobileCodes = async (params) => {
  return await axiosInstance.post("Common/MobileCodeGetAll", params);
};

export const getGenders = async () => {
  return await axiosInstance.post("Common/GenderGetAll");
};

export const getCountries = async (params) => {
  return await axiosInstance.post("Common/CountryGetAll", params);
};

export const getCities = async (params) => {
  return await axiosInstance.post("Common/CityGetAll", params);
};

export const getCurrency = async () => {
  return await axiosInstance.post("Common/CurrencyGetAll");
};

export const getIndustries = async (params) => {
  return await axiosInstance.post("TalentPool/IndustryGetAll", params);
};

export const getDegrees = async (params) => {
  return await axiosInstance.post("Common/DegreeGetAll", params);
};

export const getSeniorities = async (params) => {
  return await axiosInstance.post("TalentPool/SeniorityGetAll", params);
};

export const getCompetencies = async (params) => {
  return await axiosInstance.post("TalentPool/CompetencyGetAll", params);
};

export const getSkills = async (params) => {
  return await axiosInstance.post("TalentPool/SkillGetAll", params);
};

export const setSkillCreate = async (params) => {
  return await axiosInstance.post("TalentPool/SkillCreate", params);
};

export const setSkillDelete = async (params) => {
  return await axiosInstance.post("TalentPool/SkillDelete", params);
};

export const setCompetencyCreate = async (params) => {
  return await axiosInstance.post("TalentPool/CompetencyCreate", params);
};

export const getCompetency = async (params) => {
  return await axiosInstance.post("TalentPool/CompetencyGetAll", params);
};

export const setCompetencyDelete = async (params) => {
  return await axiosInstance.post("TalentPool/CompetencyDelete", params);
};

export const getLanguages = async (params) => {
  return await axiosInstance.post("Common/LanguageGetAll", params);
};

//add candidate steps

export const setCandidatePersonalInformation = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidatePersonalInfoUpdate",
    params
  );
};

export const getCandidatePersonalInformation = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidatePersonalInfoGet",
    params
  );
};

export const setCandidateExperience = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateExperienceUpdate",
    params
  );
};

export const getCandidateExperience = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateExperienceGetForUpdate",
    params
  );
};

export const getVacancyJobs = async (params) => {
  return await axiosInstance.post("Vacancy/GetAllForDropdown", params);
};

export const getCandidatesBoard = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateStagesBoardGetByVacancy",
    params
  );
};

export const getVacanciesList = async (params) => {
  return await axiosInstance.post(
    "TalentPool/VacancyGetAllForPipeline",
    params
  );
};

export const setCandidateSkills = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateSkillsAndCompetenciesUpdate",
    params
  );
};

export const getCandidateSkills = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateSkillsAndCompetenciesGetForUpdate",
    params
  );
};

export const setCandidateEducations = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateEducationsUpdate",
    params
  );
};

export const getCandidateEducations = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateEducationsGetForUpdate",
    params
  );
};

export const setCandidateRecommenders = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateRecommendersUpdate",
    params
  );
};

export const getCandidateRecommenders = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateRecommendersGetForUpdate",
    params
  );
};

export const getCurrentCandidatesVacancyList = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CurrentCandidateVacancyListGet",
    params
  );
};

export const getCandidateStatuses = async (params) => {
  return await axiosInstance.post("TalentPool/CandidateStatusGetAll", params);
};

export const getCandidateSummary = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateVacanciesSummaryGet",
    params
  );
};

export const setCandidateVacancyStatus = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateVacancyStatusCreate",
    params
  );
};

export const setCandidateVacancyFavorite = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateVacancyToggleFavorite",
    params
  );
};

export const setCandidateStage = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateVacancyStageChange",
    params
  );
};

export const setCandidateLike = async (params) => {
  return await axiosInstance.post(
    "TalentPool/SharedCandidateVacancyToggleLike",
    params
  );
};

export const setCandidateShareWithHead = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateVacancyShareWithHead",
    params
  );
};

export const setCandidateMarkAsBlackListed = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateVacancyMarkAsBlackListed",
    params
  );
};

export const setCandidateArchive = async (params) => {
  return await axiosInstance.post("TalentPool/CandidateVacancyArchive", params);
};

export const setCandidateBulkShareWithHead = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateVacancyBulkShareWithHead",
    params
  );
};

export const setCandidateBulkMarkAsBlackListed = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateVacancyBulkMarkAsBlackListed",
    params
  );
};

export const setCandidateBulkArchive = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateVacancyBulkArchive",
    params
  );
};

export const getFollowUps = async (params) => {
  return await axiosInstance.post("Setup/FollowUpGetAllForDropdown", params);
};

export const getFollowUpContent = async (params) => {
  return await axiosInstance.post("Setup/FollowUpGet", params);
};

export const sendFollowUp = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateVacancyFollowUpBulkSend",
    params
  );
};

export const getComments = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateVacancyCommentGetAll",
    params
  );
};

export const createComment = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateVacancyCommentCreate",
    params
  );
};

export const getArchivedCandidates = async (params) => {
  return await axiosInstance.post(
    "TalentPool/ArchivedCandidateVacancyListGet",
    params
  );
};

export const setMoveCandidatesToCurrentList = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateNewVacancyBulkAssign",
    params
  );
};

export const getSharedToManagerCandidates = async (params) => {
  return await axiosInstance.post(
    "TalentPool/SharedCandidateVacancyListGet",
    params
  );
};

export const exportCandidateVacancies = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateVacanciesExcelExport",
    params
  );
};

export const getUnits = async (params) => {
  return await axiosInstance.post("Common/OrgUnitGetAllByOffice", params);
};

export const getCandidateAssembleStepsCheck = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateAssembleStepsCheck",
    params
  );
};
