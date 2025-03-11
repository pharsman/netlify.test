import axiosOneAdmin from "@/hooks/axios/axionsOneadmin";
import axiosInstance from "@/hooks/axios/axios";

export const getOffices = async () => {
  return await axiosInstance.post("Common/OfficeGetAll");
};

export const getUnits = async (parameters) => {
  return await axiosInstance.post("Common/OrgUnitGetAllByOffice", parameters);
};

export const getHeadOfUnit = async (parameters) => {
  return await axiosInstance.post("/Common/UserGetAllByOrgUnit", parameters);
};

export const getJobs = async (parameters) => {
  return await axiosInstance.post("Common/JobGetAllByOrgUnit", parameters);
};

export const getWorkingTypes = async (parameters) => {
  return await axiosInstance.post("Common/WorkingTypeGetAll", parameters);
};

export const getCurrencies = async (parameters) => {
  return await axiosInstance.post("Common/CurrencyGetAll", parameters);
};

export const getSalarieTypes = async (parameters) => {
  return await axiosInstance.post("Common/SalaryTypeGetAll", parameters);
};

export const getSingleVacancyDetails = async (parameters) => {
  return await axiosInstance.post("Vacancy/RequestGetForUpdate ", parameters);
};

export const setVacancyRequest = async (parameters) => {
  return await axiosInstance.post("Vacancy/RequestCreate", parameters);
};

export const setVacancyUpdate = async (parameters) => {
  return await axiosInstance.post("Vacancy/RequestUpdate", parameters);
};

export const deleteRequestVacancy = async (parameters) => {
  return await axiosInstance.post("Vacancy/RequestDelete", parameters);
};

export const getVacancyForHeads = async (parameters) => {
  return await axiosInstance.post("Vacancy/CardsGetForHead", parameters);
};

export const getVacancyForHr = async (parameters) => {
  return await axiosInstance.post("Vacancy/CardsGetForHr", parameters);
};

export const getVacancyForRecruiters = async (parameters) => {
  return await axiosInstance.post("Vacancy/CardsGetForRecruiter", parameters);
};

export const getVacancyDetails = async (parameters) => {
  return await axiosInstance.post("Vacancy/BasicDetailsGet", parameters);
};

export const getVacancyComments = async (parameters) => {
  return await axiosInstance.post("Vacancy/CommentGetAll", parameters);
};

export const getVacancyList = async (parameters) => {
  return await axiosInstance.post("Vacancy/ListGetForHead", parameters);
};

export const setUpdateVacancyStatus = async (parameters) => {
  return await axiosInstance.post("Vacancy/StatusCreate", parameters);
};

export const getRequestListsHr = async (parameters) => {
  return await axiosInstance.post("Vacancy/RequestsListGet", parameters);
};

export const getRecruitersList = async (parameters) => {
  return await axiosInstance.post("Recruiter/GetAll", parameters);
};

export const setAssignRecruiters = async (parameters) => {
  return await axiosInstance.post("Vacancy/AssignRecruiters", parameters);
};

export const getCurrentVacanciesForHr = async (parameters) => {
  return await axiosInstance.post("Vacancy/CurrentsListGetForHr", parameters);
};

export const getCurrentVacanciesForRecruiter = async (parameters) => {
  return await axiosInstance.post(
    "Vacancy/CurrentsListGetForRecruiter",
    parameters
  );
};

export const getSummary = async (parameters) => {
  return await axiosInstance.post("Vacancy/SummaryGet", parameters);
};

export const getStageTypes = async (parameters) => {
  return await axiosInstance.post(
    "Setup/StageTypeGetAllForDropdown",
    parameters
  );
};

export const getStageCriterias = async (parameters) => {
  return await axiosInstance.post(
    "Setup/CriteriaGroupCriteriaGetAll",
    parameters
  );
};

export const setShareWithManager = async (parameters) => {
  return await axiosInstance.post("Vacancy/ShareWithHead", parameters);
};

export const getFinishedVacancies = async (parameters) => {
  return await axiosInstance.post("Vacancy/FinishedListGetForHr", parameters);
};

export const getFinishedVacanciesRecruiter = async (parameters) => {
  return await axiosInstance.post(
    "Vacancy/FinishedListGetForRecruiter",
    parameters
  );
};

export const getForDuplicate = async (parameters) => {
  return await axiosInstance.post("Vacancy/GetForDuplicate", parameters);
};

export const setDuplicateVacancy = async (parameters) => {
  return await axiosInstance.post("Vacancy/Duplicate", parameters);
};

export const getFinishedVacanciesForRecruiters = async (parameters) => {
  return await axiosInstance.post(
    "Vacancy/FinishedListGetForRecruiter",
    parameters
  );
};

export const getAssembleGeneral = async (parameters) => {
  return await axiosInstance.post("Vacancy/AssembleGeneralGet", parameters);
};

export const getContractTypes = async (parameters) => {
  return await axiosInstance.post("Common/ContractTypeGetAll", parameters);
};

export const getCities = async (parameters) => {
  return await axiosInstance.post("Common/CityGetAll", parameters);
};

export const setAssembleVacancyGeneralUpdate = async (parameters) => {
  return await axiosInstance.post("Vacancy/AssembleGeneralUpdate", parameters);
};

export const getStepsComplitionStatus = async (parameters) => {
  return await axiosInstance.post("Vacancy/AssembleStepsCheck", parameters);
};

export const getAssembleStages = async (parameters) => {
  return await axiosInstance.post("Vacancy/AssembleStagesGet", parameters);
};

export const setAssembleVacancyStages = async (parameters) => {
  return await axiosInstance.post("Vacancy/AssembleStagesUpdate", parameters);
};

export const getCriteriaGroup = async (parameters) => {
  return await axiosInstance.post(
    "Setup/CriteriaGroupCriteriaGetAll",
    parameters
  );
};

export const getRecruitmentDocumentTemplates = async (parameters) => {
  return await axiosOneAdmin.post(
    "Documents/RecruitmentUserAssignedTemplatesGet",
    parameters
  );
};

export const getDocumentContent = async (parameters) => {
  return await axiosOneAdmin.post(
    "Documents/TemplateGetHTMLContent",
    parameters
  );
};

export const getAssembleDocumentTemplateDetails = async (parameters) => {
  return await axiosInstance.post("Vacancy/AssembleDescriptionGet", parameters);
};

export const setUpdateAssembleDocument = async (parameters) => {
  return await axiosInstance.post(
    "Vacancy/AssembleDescriptionUpdate",
    parameters
  );
};

export const getAssemblePlacementData = async (parameters) => {
  return await axiosInstance.post("Vacancy/GetAllForDropdown", parameters);
};

export const getAssemblePlacementChannels = async (parameters) => {
  return await axiosInstance.post("Common/PlacementChannelGetAll", parameters);
};

export const getAssemblePlacementDetails = async (parameters) => {
  return await axiosInstance.post("Vacancy/AssemblePlacementGet", parameters);
};

export const setAssemblePlacement = async (parameters) => {
  return await axiosInstance.post(
    "Vacancy/AssemblePlacementUpdate",
    parameters
  );
};

export const getAassembleFormKeys = async (parameters) => {
  return await axiosInstance.post("Vacancy/FormFieldKeysGet", parameters);
};

export const setAssembleFormFields = async (parameters) => {
  return await axiosInstance.post(
    "Vacancy/AssembleApplyFormUpdate",
    parameters
  );
};

export const getAssembleFormFields = async (parameters) => {
  return await axiosInstance.post("Vacancy/AssembleApplyFormGet", parameters);
};

export const getAssemblePreview = async (parameters) => {
  return await axiosInstance.post("Vacancy/AssemblePreviewGet", parameters);
};

/////export

export const getExportCurrentListForHr = async (parameters) => {
  return await axiosInstance.post(
    "Vacancy/CurrentsListExportForHr",
    parameters
  );
};

export const getExportCurrentListForRecruiter = async (parameters) => {
  return await axiosInstance.post(
    "Vacancy/CurrentsListExportForRecruiter",
    parameters
  );
};

export const getExportFinishedListForHr = async (parameters) => {
  return await axiosInstance.post(
    "Vacancy/FinishedListExportForHr",
    parameters
  );
};

export const getExportFinishedListForRecruiter = async (parameters) => {
  return await axiosInstance.post(
    "Vacancy/FinishedListExportForRecruiter",
    parameters
  );
};

export const getExportRequestedListForHr = async (parameters) => {
  return await axiosInstance.post("Vacancy/RequestsListExport", parameters);
};

export const getExportListForManager = async (parameters) => {
  return await axiosInstance.post("Vacancy/ListExportForHead", parameters);
};

//export assembled vacancy

export const exportAssembledDocument = async (parameters) => {
  return await axiosOneAdmin.post("Export/HtmlToPdf", parameters);
};
