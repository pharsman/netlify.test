import axiosInstance from '@/hooks/AxiosInstance'

export const getVendors = async (params) => {
  return await axiosInstance.post('Vendors/Get', { ...params })
}

export const setVendorUpdate = async (params) => {
  return await axiosInstance.post('Vendors/Save', { ...params })
}
