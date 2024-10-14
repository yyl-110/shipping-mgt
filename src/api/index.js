import { post } from '../utils/request'
export const getBaseStructure = (params) =>
  post('/Windchill/ptc1/shippingProcess/getPullDownBoxMessage', params)
export const saveShippingBasicData = (params) =>
  post('/Windchill/ptc1/shippingProcess/saveShippingBasicData', params) // 保存发运基本信息
export const getApplicableProductsData = (params) =>
  post('/Windchill/ptc1/shippingProcess/getApplicableProductsData', params) // 获取适用产品信息
export const getCompleteMachineDat = (params) =>
  post('/Windchill/ptc1/shippingProcess/getCompleteMachineData', params) // 整机信息接口
export const getShippingBasicData = (params) =>
  post('/Windchill/ptc1/shippingProcess/getShippingBasicData', params) // 获取发运基本信息
export const queryApplicableProductsData = (params) =>
  post('/Windchill/ptc1/shippingProcess/queryApplicableProductsData', params) // 新增发运基本信息
/**
 * @param {*} params "type":"1"//新增适用产品模块保存标识,加此标识不需要前端校验数据 "type":"0"//适用产品模块保存标识
 * @return {*}
 */
export const saveApplicableProductsData = (params) =>
  post('/Windchill/ptc1/shippingProcess/saveApplicableProductsData', params) // 保存适用产品信息 新增适用产品信息查询接口
export const deleteApplicableProductsData = (params) =>
  post('/Windchill/ptc1/shippingProcess/deleteApplicableProductsData', params) // 删除适用产品信息
export const deleteCompleteMachineData = (params) =>
  post('/Windchill/ptc1/shippingProcess/deleteCompleteMachineData', params) // 删除整机信息信息
/**
 * @param {*} params "type":"1"//新增整机信息确定标识,加此标识不需要前端校验数据 "type":"0"//整机模块保存标识
 * @return {*}
 */
export const saveCompleteMachineData = (params) =>
  post('/Windchill/ptc1/shippingProcess/saveCompleteMachineData', params) // 保存整机信息  新增整机信息确定接口
export const queryCompleteMachineData = (params) =>
  post('/Windchill/ptc1/shippingProcess/queryCompleteMachineData', params) // 整机信息查询接口
export const getDisassemblyData = (params) =>
  post('/Windchill/ptc1/shippingProcess/getDisassemblyData', params) // 获取拆机信息
export const deleteDisassemblyData = (params) =>
  post('/Windchill/ptc1/shippingProcess/deleteDisassemblyData', params) // 删除拆机信息
export const saveDisassemblyData = (params) =>
  post('/Windchill/ptc1/shippingProcess/saveDisassemblyData', params) // 删除拆机信息
export const getPackagingMaterialsData = (params) =>
  post('/Windchill/ptc1/shippingProcess/getPackagingMaterialsData', params) // 获取包装材料信息
export const getPackagingAuxMaterialsData = (params) =>
  post('/Windchill/ptc1/shippingProcess/getPackagingAuxMaterialsData', params) // 获取包装辅料信息
export const queryPackagingMaterialsData = (params) =>
  post('/Windchill/ptc1/shippingProcess/queryPackagingMaterialsData', params) // 新增包装材料信息查询接口
export const queryPackagingAuxMaterialsData = (params) =>
  post('/Windchill/ptc1/shippingProcess/queryPackagingAuxMaterialsData', params) // 新增包装辅料信息查询接口
/**
 * @param {*} params "type":"0"//包装材料保存标识 "type":"1"//新增包装材料信息确定标识,加此标识不需要前端校验数据
 * @return {*}
 */
export const savePackagingMaterialsData = (params) =>
  post('/Windchill/ptc1/shippingProcess/savePackagingMaterialsData', params) // 新增包装材料信息确定接口 保存包装材料信息
export const savePackagingAuxMaterialsData = (params) =>
  post('/Windchill/ptc1/shippingProcess/savePackagingAuxMaterialsData', params) // 新增包装辅料信息确定接口 保存包装辅料信息

export const deletePackagingMaterialsData = (params) =>
  post('/Windchill/ptc1/shippingProcess/deletePackagingMaterialsData', params) // 删除包装材料信息
export const deletePackagingAuxMaterialsData = (params) =>
  post('/Windchill/ptc1/shippingProcess/deletePackagingAuxMaterialsData', params) // 删除包装辅料信息
export const getMaterialPrice = (params) =>
  post('/Windchill/ptc1/shippingProcess/getMaterialPrice', params) // 获取价格信息
