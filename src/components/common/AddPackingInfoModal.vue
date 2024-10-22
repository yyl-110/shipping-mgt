<template>
  <n-modal v-model:show="showModal" :mask-closable="false" @after-leave="closeModal">
    <div w-1150 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-16 font-bold text-hex-1d2129>
            {{ modalType === '0' ? '编辑' : '添加' }}装箱信息
          </span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="showModal = false"
        />
      </header>
      <main min-h-300 px-20>
        <n-spin :show="loading">
          <div px-30>
            <n-data-table
              :columns="addColumns"
              :data="addTableData"
              :pagination="false"
              :min-height="100"
              :scroll-x="1200"
              :bottom-bordered="false"
              :bordered="false"
            />
          </div>
          <app-box title="物料明细" type="collapse" mt-12>
            <template #title>
              <n-button
                v-for="item in btnList"
                :key="item.key"
                type="primary"
                ml-20
                size="small"
                @click="handleClick($event, item)"
              >
                <template #icon>
                  <the-icon :icon="item.icon" :size="16" type="custom" />
                </template>
                {{ item.label }}
              </n-button>
            </template>
            <n-data-table
              ref="tableRef"
              v-model:checked-row-keys="checkedAddTableRowKeys"
              :columns="detailedTableColumns"
              :data="detailedTableData"
              :pagination="false"
              :min-height="200"
              :max-height="300"
              :scroll-x="1300"
              :row-key="rowKey"
            />
          </app-box>
        </n-spin>
      </main>
      <footer h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="showModal = false">取消</n-button>
        <n-button type="primary" :loading="saveAddTableLoading" @click="confirm">确定</n-button>
      </footer>
    </div>
  </n-modal>
</template>

<script setup>
import { NInput } from 'naive-ui'
import { getPackingInfoData, savePackingInfoData } from '~/src/api'
import { RES_SUCCESS_CODE } from '~/src/utils'
import { ShowOrEdit } from '../tool'
import _ from 'lodash-es'

const emits = defineEmits(['handleConfirm'])
const showModal = ref(false)
const addTableData = ref([])
const detailedTableData = ref([])
const saveAddTableLoading = ref(false)
const loading = ref(false)
const shippingComponentsRef = ref(null)
const tableRef = ref(null)
const modalType = ref('0') // 0 编辑 1 新增
const boxNumber = ref('')
const checkedAddTableRowKeys = ref([])

const rowKey = (row) => row.id

const btnList = [
  { label: '新增', icon: 'addBtn', key: 1 },
  { label: '删除', icon: 'del', key: 2 },
]

const getDataIndex = (key, data) => {
  return data.findIndex((item) => item.id === key)
}

const addColumns = [
  {
    title: '箱号',
    key: 'boxNumber',
    render(row, index) {
      return h(NInput, {
        placeholder: '请输入',
        value: row.boxNumber,
        filterable: true,
        onUpdateValue(v) {
          addTableData.value[index].boxNumber = v
        },
      })
    },
  },
  {
    title: '装箱类型',
    key: 'packingType',
    render(row, index) {
      return h(NInput, {
        placeholder: '请输入',
        value: row.packingType,
        filterable: true,
        onUpdateValue(v) {
          addTableData.value[index].packingType = v
        },
      })
    },
  },
  {
    title: '规格',
    key: 'specifications',
    render(row, index) {
      return h(NInput, {
        placeholder: '请输入',
        value: row.specifications,
        filterable: true,
        onUpdateValue(v) {
          addTableData.value[index].specifications = v
        },
      })
    },
  },
  {
    title: '总净重（kg）',
    key: 'totalNetWeight',
  },
  {
    title: '总毛重（kg）',
    key: 'totalGrossWeight',
  },
  {
    title: '备注',
    key: 'remark',
    render(row, index) {
      return h(NInput, {
        placeholder: '请输入',
        value: row.remark,
        filterable: true,
        onUpdateValue(v) {
          addTableData.value[index].remark = v
        },
      })
    },
  },
]

const detailedTableColumns = [
  {
    type: 'selection',
  },
  {
    title: '序号',
    key: 'no',
    width: 60,
    align: 'center',
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: h('div', {}, [h('span', { class: 'text-red' }, '*发运部件描述')]),
    key: 'shippingPartDesc',
    width: 180,
    render(row) {
      const index = getDataIndex(row.id, detailedTableData.value)
      return h(ShowOrEdit, {
        value: row.shippingPartDesc,
        onUpdateValue(v) {
          detailedTableData.value[index].shippingPartDesc = v
        },
      })
    },
  },
  {
    title: '包装材料描述',
    width: 180,
    key: 'packagingMaterialDesc',
    render(row) {
      const index = getDataIndex(row.id, detailedTableData.value)
      return h(ShowOrEdit, {
        value: row.packagingMaterialDesc,
        onUpdateValue(v) {
          detailedTableData.value[index].packagingMaterialDesc = v
        },
      })
    },
  },
  {
    title: '数量',
    key: 'quantity',
    width: 120,
    render(row) {
      const index = getDataIndex(row.id, detailedTableData.value)
      return h(ShowOrEdit, {
        value: row.quantity,
        type: 'number',
        onUpdateValue(v) {
          detailedTableData.value[index].quantity = v
        },
      })
    },
  },
  {
    title: '长（mm）',
    key: 'length',
    width: 120,
    render(row) {
      const index = getDataIndex(row.id, detailedTableData.value)
      return h(ShowOrEdit, {
        value: row.length,
        type: 'number',
        onUpdateValue(v) {
          detailedTableData.value[index].length = v
        },
      })
    },
  },
  {
    title: '宽（mm）',
    key: 'width',
    width: 120,
    render(row) {
      const index = getDataIndex(row.id, detailedTableData.value)
      return h(ShowOrEdit, {
        value: row.width,
        type: 'number',
        onUpdateValue(v) {
          detailedTableData.value[index].width = v
        },
      })
    },
  },
  {
    title: '高（mm）',
    key: 'height',
    width: 120,
    render(row) {
      const index = getDataIndex(row.id, detailedTableData.value)
      return h(ShowOrEdit, {
        value: row.height,
        type: 'number',
        onUpdateValue(v) {
          detailedTableData.value[index].height = v
        },
      })
    },
  },
  {
    title: '净重（kg）',
    key: 'netWeight',
    width: 120,
    render(row) {
      const index = getDataIndex(row.id, detailedTableData.value)
      return h(ShowOrEdit, {
        value: row.netWeight,
        type: 'number',
        onUpdateValue(v) {
          detailedTableData.value[index].netWeight = v
        },
      })
    },
  },
  {
    title: '毛重（kg）',
    key: 'grossWeight',
    width: 120,
    render(row) {
      const index = getDataIndex(row.id, detailedTableData.value)
      return h(ShowOrEdit, {
        value: row.grossWeight,
        type: 'number',
        onUpdateValue(v) {
          detailedTableData.value[index].grossWeight = v
        },
      })
    },
  },
]

const confirm = async () => {
  try {
    saveAddTableLoading.value = true
    const _shippingPartsItems = _.cloneDeep(detailedTableData.value)
    const obj = {
      oid: window.oid,
      type: modalType.value,
      data: {
        ...addTableData.value[0],
        shippingPartsItems: _shippingPartsItems.map((item) => {
          delete item.id
          return item
        }),
      },
    }
    const state = detailedTableData.value.some((item) => !item.shippingPartDesc)
    if (state) {
      $message.warning('发运部件不能为空')
      return
    }
    const res = await savePackingInfoData(obj)
    if (res.code === RES_SUCCESS_CODE) {
      $message.success(modalType.value === '0' ? '编辑成功' : '新增成功')
      emits('handleConfirm')
      showModal.value = false
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    saveAddTableLoading.value = false
  }
}
const handleClick = async (e, item) => {
  e.stopPropagation()
  switch (item.key) {
    case 1: // 新增
      detailedTableData.value.push({
        id: `${detailedTableData.value.length}-${new Date().getTime()}`,
      })
      nextTick(() => {
        tableRef.value &&
          tableRef.value.scrollTo({
            left: 0,
            top: detailedTableData.value.length * 100,
            behavior: 'smooth',
          })
      })
      break
    case 2: // 删除
      try {
        if (checkedAddTableRowKeys.value.length === 0) {
          $message.info('请勾选需要删除的数据！')
          return
        }
        $dialog.confirm({
          content: '是否确认删除',
          negativeText: '取消',
          positiveText: '确认',
          onPositiveClick: () => {
            const data = detailedTableData.value.filter(
              (val) => !checkedAddTableRowKeys.value.includes(val?.id)
            )
            detailedTableData.value = [...data]
            checkedAddTableRowKeys.value = []
          },
        })
      } catch (error) {
        console.log('error:', error)
      }
      break

    default:
      break
  }
}
const fetchData = async () => {
  try {
    loading.value = true
    const res = await getPackingInfoData({
      oid: window.oid,
      boxNumber: boxNumber.value,
    })
    if (res.code === RES_SUCCESS_CODE) {
      const { shippingPartsItems = [] } = res?.data || {}
      detailedTableData.value = shippingPartsItems.map((val, inx) => {
        return {
          id: `${inx}-${new Date().getTime()}`,
          ...val,
        }
      })
      addTableData.value = [res?.data]
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

const show = (type, val) => {
  modalType.value = type
  showModal.value = true
  /* 编辑 */
  if (type === '0') {
    boxNumber.value = val
    fetchData()
  } else {
    detailedTableData.value = []
    addTableData.value = [{}]
  }
}

const closeModal = () => {
  checkedAddTableRowKeys.value = []
}

defineExpose({
  show,
})

watch(
  () => detailedTableData.value,
  () => {
    const netWeight = detailedTableData.value.reduce((pre, cut) => {
      return pre + (cut?.netWeight || 0) * (cut?.quantity || 0)
    }, 0)
    const grossWeight = detailedTableData.value.reduce((pre, cut) => {
      return pre + (cut?.grossWeight || 0) * (cut?.quantity || 0)
    }, 0)
    addTableData.value[0].totalNetWeight = netWeight // 总净重
    addTableData.value[0].totalGrossWeight = grossWeight // 总毛重
  },
  {
    deep: true,
  }
)
</script>

<style lang="scss" scoped></style>
