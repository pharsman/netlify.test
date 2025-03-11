import axiosInstance from '@/hooks/AxiosInstance'

export const getProducts = async (params) => {
  return await axiosInstance.post('Products/DetailsGet', { ...params })
}
export const setProductsUpdate = async (params) => {
  return await axiosInstance.post('Products/Save', { ...params })
}

export const getAllCategories = async (params) => {
  return await axiosInstance.post('Categories/GetALL', { ...params })
}

