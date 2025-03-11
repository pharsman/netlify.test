import axios from 'axios'
import { createToastNotification } from 'master-components-react'
import close from '@/assets/icons/close.svg?raw'
import { notificationStyle } from '@/utils/notificationStyle'

const isLocal = ~location.href.indexOf('localhost')

const commonConfig = {
  baseURL: isLocal ? 'https://oneadmin.upgaming.dev/api/' : '/api/',
  // baseURL: isLocal ? 'https://localhost:7126/hr/oneadmin/api' : '/api/',
}

//all permission  4b7a6d22-fc77-4d06-989a-0338c6431b05
//old token 1141e704-7b6c-48b2-bbad-17ff5eab73e6
const requestInterceptorCollback = (config) => {
  config.headers['Content-Type'] = 'application/json'
  config.headers.Authorization = `bearer ${localStorage.getItem('accessToken')}`
  //all permission  4b7a6d22-fc77-4d06-989a-0338c6431b05
  config.headers['ug-proxy'] = 'vending'

  return config
}

const axiosInstance = axios.create({ ...commonConfig })

axiosInstance.interceptors.request.use(requestInterceptorCollback)

axiosInstance.interceptors.response.use(
  (config) => {
    if (config.data && config.data.Error) {
      console.warn('Config', config.data.Error)

      // createToastNotification(config.data.Error, 3500, 'bottom-center', null, null, close, notificationStyle('error'))
    }
    return config
  },
  (err) => {
    if (err.data && err.data.Error) {
      console.err('Err', err.data.Error)

      // createToastNotification(err.data.Error, 3500, 'bottom-center', null, null, close, notificationStyle('error'))
    } else {
      console.error('Err', err.response.data)

      err.response ? console.error('Err', err.response.data) : console.error('Err', err.data)
    }

    return err
  }
)

export default axiosInstance
