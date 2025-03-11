import axiosInstance from '@/hooks/AxiosInstance'

export const getCouriers = async (params) => {
  return await axiosInstance.post('Couriers/Get', { ...params })
}

export const setCourierUpdate = async (params) => {
  return await axiosInstance.post('Couriers/Save', { ...params })
}

export const getAllUsersForSave = async (params) => {
  return await axiosInstance.post('Couriers/GetUsersForSave', { ...params })
}
