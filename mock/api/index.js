import { Random } from 'mockjs'

export default [
  {
    url: '/Windchill/ptc1/shippingProcess/getPullDownBoxMessage',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
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
        message: 'ok',
        code: '200',
        'data|10': [
          {
            materialNumber: () => Random.id(),
            materialDesc: () => Random.ctitle(4, 15),
            designModel: () => Random.ctitle(4, 15),
            configuration: () => Random.ctitle(4, 15),
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
        message: 'ok',
        code: '200',
        'data|10': [
          {
            materialNumber: () => Random.id(),
            materialDesc: () => Random.ctitle(4, 15),
            'length|+1': 20,
            'width|+1': 20,
            'height|1-200': 2,
            'weight|+1': 10,
            configuration: () => Random.ctitle(4, 15),
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/getDisassemblyData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        'data|10': [
          {
            materialNumber: () => Random.id(),
            materialDesc: () => Random.ctitle(4, 15),
            'productLength|+1': 20,
            'productWidth|+1': 20,
            'productHeight|1-200': 2,
            'productSingleWeight|+1': 10,
            'productWeight|+1': 10,
            'packingWidth|+1': 20,
            'packingHeight|+1': 20,
            'packingLength|+1': 20,
            'packingWeight|1-200': 2,
            'grossWeight|+1': 10,
            packingType: () => Random.ctitle(4),
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/getShippingBasicData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: {
          oid: () => Random.id(),
          company: () => Random.ctitle(4),
          salesModel: '销售型号',
          designModel: '设计型号',
          shippingForm: '发运形式',
          'shippingQuantity|+1': 20,
          'totalCost|+1': 100,
          eachCost: '单台包装成本',
          transportation: '运输方式',
          schemeDescription: '方案说明',
          specialRequirements: '特殊要求',
        },
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/queryApplicableProductsData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        'data|10-20': [
          {
            materialNumber: () => Random.id(),
            materialDesc: () => Random.ctitle(10, 20),
            version: () => Random.id(5),
            'states|1': ['已发布', '已停止'],
            purchaseType: '采购类型',
            factory: '工厂',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/getPackagingMaterialsData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        'data|2': [
          {
            materialNumber: () => Random.id(),
            materialDesc: () => Random.ctitle(10, 20),
            'length|+1': 20,
            'width|+1': 20,
            'height|1-200': 2,
            'weight|+1': 10,
            'unitPrice|+1': 10,
            'quantity|+1': 10,
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/savePackagingMaterialsData',
    method: 'post',
    response: () => {
      return {
        message: '失败',
        code: '200',
        data: '',
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/queryPackagingMaterialsData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        'data|10': [
          {
            materialNumber: () => Random.id(),
            materialDesc: () => Random.ctitle(10, 20),
            'length|+1': 20,
            'width|+1': 20,
            'height|1-200': 2,
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/queryPackagingAuxMaterialsData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        'data|10': [
          {
            materialNumber: () => Random.id(),
            materialDesc: () => Random.ctitle(10, 20),
            'length|+1': 20,
            'width|+1': 20,
            'height|1-200': 2,
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/getPackagingAuxMaterialsData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: [],
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/savePackagingAuxMaterialsData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: '',
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/deletePackagingAuxMaterialsData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: '',
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/deletePackagingMaterialsData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: '',
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/getMaterialPrice',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        'data|10': [
          {
            materialNumber: () => Random.id(),
            'unitPrice|+1': 10,
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/queryCompleteMachineData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        'data|10-20': [
          {
            materialNumber: () => Random.id(),
            materialDesc: () => Random.ctitle(10, 20),
            version: () => Random.id(5),
            'states|1': ['已发布', '已停止'],
            purchaseType: '采购类型',
            factory: '工厂',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/queryShippingMaterialData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        'data|10-20': [
          {
            materialNumber: () => Random.id(),
            materialDesc: () => Random.ctitle(10, 20),
            englishDesc: () => Random.ctitle(10, 20),
            'states|1': ['已发布', '已停止'],
            purchaseType: '采购类型',
            factory: '工厂',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/getAllShippingPartsData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        'data|2': [
          {
            materialNumber: () => Random.id(),
            materialDesc: () => Random.ctitle(10, 20),
            shippingPartDesc: () => Random.ctitle(10, 20),
            'length|+1': 20,
            'width|+1': 20,
            'height|1-200': 2,
            'netWeight|1-200': 2,
            'grossWeight|+1': 10,
            'quantity|+1': 10,
            'shippingMaterialItems|5': [
              {
                materialNumber: () => Random.id(),
                materialDesc: () => Random.ctitle(10, 20),
                englishDesc: () => Random.ctitle(10, 20),
                quantity: '10',
                'length|+1': 20,
                'width|+1': 20,
                'height|1-200': 2,
                'weight|1-200': 2,
                'totalWeight|1-200': 2,
              },
            ],
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/getShippingPartsData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: {
          materialNumber: () => Random.id(),
          materialDesc: () => Random.ctitle(10, 20),
          shippingPartDesc: () => Random.ctitle(10, 20),
          'length|+1': 20,
          'width|+1': 20,
          'height|1-200': 2,
          'netWeight|1-200': 2,
          'grossWeight|+1': 10,
          'quantity|+1': 10,
          'shippingMaterialItems|5': [
            {
              materialNumber: () => Random.id(),
              materialDesc: () => Random.ctitle(10, 20),
              englishDesc: () => Random.ctitle(10, 20),
              'quantity|+1': 10,
              'length|+1': 20,
              'width|+1': 20,
              'height|1-200': 2,
              'weight|1-200': 2,
              'totalWeight|1-200': 2,
            },
          ],
        },
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/saveApplicableProductsData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: '',
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/deleteApplicableProductsData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: '',
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/deleteCompleteMachineData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: '',
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/saveShippingBasicData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: '',
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/deleteDisassemblyData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: '',
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/saveDisassemblyData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: '',
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/deleteShippingPartsData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: '',
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/saveShippingPartsData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: '',
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/deletePackingInfoData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: '',
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/savePackingInfoData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: '',
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/getPackingInfoData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: {
          boxNumber: () => Random.ctitle(4),
          packingType: () => Random.ctitle(4),
          specifications: () => Random.ctitle(4),
          'totalNetWeight|+1': 10,
          'totalGrossWeight|+1': 10,
          remark: () => Random.ctitle(10, 18),
          'shippingPartsItems|1-10': [
            {
              shippingPartDesc: () => Random.ctitle(4, 10),
              packagingMaterialDesc: () => Random.ctitle(4, 10),
              'quantity|+1': 1,
              'length|+1': 1,
              'width|+1': 1,
              'height|+1': 1,
              'netWeight|+1': 1,
              'grossWeight|+1': 1,
            },
          ],
        },
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/uploadFile',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: '',
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/batchImportExcel',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: '',
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/removeAttachment',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        data: '',
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/saveCompleteMachineData',
    method: 'post',
    response: () => {
      return {
        message: '保存失败',
        code: '200',
        data: '',
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/getAttachments',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        'data|2': [
          {
            attachmentId: () => Random.id(),
            attachmentName: () => Random.title(5, 10),
            attachmentUrl: () => Random.url(),
            attachmentDesc: () => Random.title(5, 10),
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/ptc1/shippingProcess/getAllPackingInfoData',
    method: 'post',
    response: () => {
      return {
        message: 'ok',
        code: '200',
        'data|2': [
          {
            boxNumber: () => Random.ctitle(4),
            packingType: () => Random.ctitle(4),
            specifications: () => Random.ctitle(4),
            'totalNetWeight|+1': 10,
            'totalGrossWeight|+1': 10,
            remark: () => Random.ctitle(10, 18),
            'shippingPartsItems|1-10': [
              {
                shippingPartDesc: () => Random.ctitle(4, 10),
                packagingMaterialDesc: () => Random.ctitle(4, 10),
                'quantity|+1': 1,
                'length|+1': 1,
                'width|+1': 1,
                'height|+1': 1,
                'netWeight|+1': 1,
                'grossWeight|+1': 1,
              },
            ],
          },
        ],
      }
    },
  },
]
