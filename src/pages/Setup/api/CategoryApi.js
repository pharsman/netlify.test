import axiosInstance from '@/hooks/AxiosInstance'

export const getCategory = async (params) => {
  return await axiosInstance.post('Categories/Get', { ...params })
}

export const setCategoryUpdate = async (params) => {
  return await axiosInstance.post('Categories/Save', { ...params })
}

export const getProductsForSetup = async (params) => {
  return await axiosInstance.post('Products/GetForSetup', { ...params })
}

export const setProductsForSetup = async (params) => {
  return await axiosInstance.post('Products/SaveMany', { ...params })
}

