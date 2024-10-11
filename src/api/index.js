import { post } from '../utils/request'
export const getBaseStructure = (params) =>
  post('/Windchill/ptc1/shippingProcess/getPullDownBoxMessage', params)
export const getApplicableProductsData = (params) =>
  post('/Windchill/ptc1/shippingProcess/getApplicableProductsData', params) // 获取适用产品信息
export const getCompleteMachineDat = (params) =>
  post('/Windchill/ptc1/shippingProcess/getCompleteMachineData', params) // 整机信息接口
