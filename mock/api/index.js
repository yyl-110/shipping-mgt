import { Random } from 'mockjs'

export default [
  {
    url: '/Windchill/ptc1/shippingProcess/getPullDownBoxMessage',
    method: 'post',
    response: () => {
      return {
        success: true,
        msg: 'ok',
        code: '200',
        //集合内-key:对应的表格输入列 value:下拉选项值
        data: {
          //公司名称
          companyValue: [
            {
              label: '挖机',
              value: 'XCMG_WJ',
            },
            {
              label: '巴西',
              value: 'XCMG_BX',
            },
          ],
          //销售型号
          salesModelValue: [
            {
              label: '销售型号1',
              value: 'salesModel1',
            },
            {
              label: '销售型号2',
              value: 'salesModel2',
            },
          ],
          //发运形式
          shippingFormValue: [
            {
              label: '发运形式1',
              value: 'shippingForm1',
            },
            {
              label: '发运形式2',
              value: 'shippingForm2',
            },
          ],
          //运输方式
          transportationValue: [
            {
              label: '运输方式1',
              value: 'transportation1',
            },
            {
              label: '运输方式2',
              value: 'transportation2',
            },
          ],
        },
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/getApplicableProductsData',
    method: 'post',
    response: () => {
      return {
        success: true,
        msg: 'ok',
        code: '200',
        'data|10': [
          {
            materialNumber: () => Random.id(),
            materialDesc: () => Random.ctitle(4 - 15),
            designModel: () => Random.ctitle(4 - 15),
            configuration: () => Random.ctitle(4 - 15),
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/getCompleteMachineData',
    method: 'post',
    response: () => {
      return {
        success: true,
        msg: 'ok',
        code: '200',
        'data|10': [
          {
            materialNumber: () => Random.id(),
            materialDesc: () => Random.ctitle(4 - 15),
            length: () => Random.number,
            'width|+1': 20,
            'height|1-200': 2,
            'weight|+1': 10,
            configuration: () => Random.ctitle(4 - 15),
          },
        ],
      }
    },
  },
]
