import axiosInstance from "@/hooks/axios/axios";

export const gerPreviewInternal = async (params) => {
  const resp = await axiosInstance.post(`Vacancy/PreviewGetInternal`, {
    ...params,
  });
  return resp;
};

export const getAllInternal = async (params) => {
  const resp = await axiosInstance.post("Vacancy/ActiveGetAllInternal", {
    ...params,
  });
  return resp;
};

export const getGenders = async () => {
  const resp = await axiosInstance.post("Common/GenderGetAll", {
    ...params,
  });
  return resp;
};

export const getCities = async (params) => {
  const resp = await axiosInstance.post("Common/CityGetAll", {
    ...params,
  });
  return resp;
};

export const getCountries = async (params) => {
  const resp = await axiosInstance.post("Common/CountryGetAll", {
    ...params,
  });
  return resp;
};

export const getIndustries = async () => {
  const resp = await axiosInstance.post("TalentPool/IndustryGetAll", {
    ...params,
  });
  return resp;
};

export const getDegrees = async () => {
  const resp = await axiosInstance.post("Common/DegreeGe    tAll", {
    ...params,
  });
  return resp;
};

export const getLanguages = async (params) => {
  const resp = await axiosInstance.post("Common/LanguageGetAll", {
    ...params,
  });
  return resp;
};

export const setCareerApply = async (params) => {
  const resp = await axiosInstance.post("Vacancy/InternalApply", {
    ...params,
  });
  return resp;
};

