import axiosInstance from "@/hooks/axios/axios";
import axiosOneAdmin from "@/hooks/axios/axionsOneadmin";
export const getCandidateBasicData = async (params) => {
  return await axiosInstance.post("CandidateProfile/BaseInfoGet", params);
};

export const getCandidateNotes = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateVacancyCommentGetAll",
    params
  );
};

export const deleteCandidateNote = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateVacancyCommentDelete",
    params
  );
};

export const updateCandidateNote = async (params) => {
  return await axiosInstance.post(
    "TalentPool/CandidateVacancyCommentUpdate",
    params
  );
};

export const getCandidateExperienceTab = async (params) => {
  return await axiosInstance.post("CandidateProfile/ExperienceTabGet", params);
};

export const updateCandidateExperienceTab = async (params) => {
  return await axiosInstance.post("CandidateProfile/ExperiencesUpdate", params);
};

export const updateCandidateRecommendersTab = async (params) => {
  return await axiosInstance.post(
    "CandidateProfile/RecommendersUpdate",
    params
  );
};

export const getCandidateEducationTab = async (params) => {
  return await axiosInstance.post("CandidateProfile/EducationTabGet", params);
};

export const updateCandidateEducationTab = async (params) => {
  return await axiosInstance.post("CandidateProfile/EducationsUpdate", params);
};

export const updateCandidateLanguages = async (params) => {
  return await axiosInstance.post("Candidate/LanguagesUpdate", params);
};

export const updateCandidateCompetencies = async (params) => {
  return await axiosInstance.post("Candidate/CompetenciesUpdate", params);
};

export const updateCandidateSkills = async (params) => {
  return await axiosInstance.post("Candidate/SkillsUpdate", params);
};

export const uploadCandidateDocuments = async (params) => {
  return await axiosInstance.post("Candidate/FilesUpload", params);
};

export const deleteCandidateDocuments = async (params) => {
  return await axiosInstance.post("Candidate/FileDelete", params);
};

export const getCandidateDocuments = async (params) => {
  return await axiosInstance.post("CandidateProfile/DocumentsTabGet", params);
};

export const getCandidateMessages = async (params) => {
  return await axiosInstance.post("CandidateProfile/MessagesTabGet", params);
};

export const getCandidateFollowUpContent = async (params) => {
  return await axiosInstance.post("Candidate/FollowUpTemplateGet", params);
};

export const sendCandidateMessage = async (params) => {
  return await axiosInstance.post("Candidate/FollowUpSend", params);
};

export const sendCandidateMessageAsReceiver = async (params) => {
  return await axiosInstance.post("Candidate/MessageSendAsReceiver", params);
};

export const getCandidateTimeline = async (params) => {
  return await axiosInstance.post("CandidateProfile/TimelineTabGet", params);
};

export const getCandidateCustomFields = async (params) => {
  return await axiosInstance.post("Candidate/CustomFieldsGet", params);
};

export const getCandidateStages = async (params) => {
  return await axiosInstance.post("CandidateProfile/StageTabGet", params);
};

export const updateCandidateStageScores = async (params) => {
  return await axiosInstance.post("Candidate/ScoresUpdate", params);
};

export const moveCandidateToNextStage = async (params) => {
  return await axiosInstance.post("Candidate/MoveToNextStage", params);
};

export const skipCandidateCurrentStage = async (params) => {
  return await axiosInstance.post("Candidate/SkipCurrentStage", params);
};

export const getCandidateFeedback = async (params) => {
  return await axiosInstance.post("CandidateProfile/LatestFeedbackGet", params);
};

export const getCandidateVacancyStageDetails = async (params) => {
  return await axiosInstance.post("Candidate/VacancyStageDetailsGet", params);
};

export const updateCustomField = async (params) => {
  return await axiosInstance.post("Candidate/CustomFieldsUpdate", params);
};

export const getCandidateDetailsForCV = async (params) => {
  return await axiosInstance.post("Candidate/DetailsGetForCv", params);
};

export const sentExportCV = async (params) => {
  return await axiosOneAdmin.post("Export/HtmlToPdf", params);
};

export const getDocument = async (params) => {
  return await axiosInstance.post("Candidate/FileGet", params);
};

export const getResume = async (params) => {
  return await axiosInstance.post("Candidate/ResumeGet", params);
};
