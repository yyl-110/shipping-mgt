<template>
  <n-modal v-model:show="showModal" :mask-closable="false" @after-leave="closeModal">
    <div w-1150 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-16 font-bold text-hex-1d2129>
            {{ modalType === '0' ? '编辑' : '添加' }}装箱单信息
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
        <m-spin :show="loading">
          <div px-30>
            <n-data-table
              :columns="addColumns"
              :data="addTableData"
              :pagination="false"
              :min-height="100"
              :scroll-x="1340"
              :row-key="rowKey"
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
              :scroll-x="1420"
              :row-key="rowKey"
            />
          </app-box>
        </m-spin>
      </main>
      <footer h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="showModal = false">取消</n-button>
        <n-button type="primary" :loading="saveAddTableLoading" @click="confirm">确定</n-button>
      </footer>
    </div>
  </n-modal>
  <ShippingComponentsModal ref="shippingComponentsRef" @handle-confirm="confirmChooseShipping" />
</template>

<script setup>
import { NInput, NInputNumber, NSelect } from 'naive-ui'
import { watch } from 'vue'
import { getPackagingMaterialsData, getShippingPartsData, saveShippingPartsData } from '~/src/api'
import useHandle from '~/src/hooks/useHandle'
import { RES_SUCCESS_CODE } from '~/src/utils'
import { ShowOrEdit } from '../tool'

const emits = defineEmits(['handleConfirm'])
const showModal = ref(false)
const addTableData = ref([])
const detailedTableData = ref([])
const selectMaterialNumber = ref('')
const saveAddTableLoading = ref(false)
const loading = ref(false)
const shippingComponentsRef = ref(null)
const tableRef = ref(null)
const modalType = ref('0') // 0 编辑 1 新增

const checkedAddTableRowKeys = ref([])
const rowKey = (row) => row.materialNumber
const getDataIndex = (key, data) => {
  return data.findIndex((item) => item.materialNumber === key)
}

const btnList = [
  { label: '新增', icon: 'addBtn', key: 1 },
  { label: '删除', icon: 'del', key: 2 },
]
const options = ref([])
const addColumns = [
  {
    title: '发运部件描述',
    key: 'shippingPartDesc',
    width: 200,
    render(row, index) {
      return h(NInput, {
        placeholder: '请输入',
        value: row.shippingPartDesc,
        filterable: true,
        onUpdateValue(v) {
          addTableData.value[index].shippingPartDesc = v
        },
      })
    },
  },
  {
    title: '包装材料编码',
    key: 'materialNumber',
    width: 200,
    render(row, index) {
      return h(NSelect, {
        placeholder: '请选择',
        options: options.value,
        value: selectMaterialNumber.value,
        valueField: 'materialNumber',
        labelField: 'materialNumber',
        filterable: true,
        async onUpdateValue(v, item) {
          // const obj = options.value.find((item) => item.value === v)
          const { width, materialDesc, height, length, quantity } = item || {}
          addTableData.value[index].materialNumber = v
          selectMaterialNumber.value = v
          // await fetchData()
          addTableData.value[index].materialDesc = materialDesc
          addTableData.value[index].height = height
          addTableData.value[index].length = length
          addTableData.value[index].width = width
          addTableData.value[index].quantity = quantity
        },
      })
    },
  },
  {
    title: '包装材料描述',
    key: 'materialDesc',
    width: 200,
    render(row, index) {
      return h(NInput, {
        placeholder: '请输入',
        value: row.materialDesc,
        filterable: true,
        onUpdateValue(v) {
          addTableData.value[index].materialDesc = v
        },
      })
    },
  },
  {
    title: '数量',
    key: 'quantity',
    width: 140,
    render(row, index) {
      return h(NInputNumber, {
        placeholder: '请输入',
        value: row.quantity,
        onUpdateValue(v) {
          addTableData.value[index].quantity = v
        },
      })
    },
  },
  {
    title: '毛重（kg）',
    key: 'grossWeight',
  },
  {
    title: '净重（kg）',
    key: 'netWeight',
  },
  {
    title: '长（mm）',
    key: 'length',
  },
  {
    title: '宽（mm）',
    key: 'width',
  },
  {
    title: '高（mm）',
    key: 'height',
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
    title: h('div', {}, [h('span', { class: 'text-red' }, '*'), '物料编码']),
    key: 'materialNumber',
    width: 180,
  },
  {
    title: '中文描述',
    width: 180,
    key: 'materialDesc',
  },
  {
    title: '英文描述',
    key: 'englishDesc',
    width: 180,
  },
  {
    title: '数量',
    key: 'quantity',
    width: 120,
    render(row) {
      const index = getDataIndex(row.materialNumber, detailedTableData.value)
      return h(ShowOrEdit, {
        value: row.quantity,
        type: 'number',
        onUpdateValue(v) {
          detailedTableData.value[index].quantity = v
          /* 计算总重量 */
          detailedTableData.value[index].totalWeight =
            v * detailedTableData.value[index].weight || 0
        },
      })
    },
  },
  {
    title: '长（mm）',
    key: 'length',
    width: 120,
    render(row) {
      const index = getDataIndex(row.materialNumber, detailedTableData.value)
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
      const index = getDataIndex(row.materialNumber, detailedTableData.value)
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
      const index = getDataIndex(row.materialNumber, detailedTableData.value)
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
    title: '重量（kg）',
    key: 'weight',
    width: 120,
    render(row) {
      const index = getDataIndex(row.materialNumber, detailedTableData.value)
      return h(ShowOrEdit, {
        value: row.weight,
        type: 'number',
        onUpdateValue(v) {
          detailedTableData.value[index].weight = v
          /* 计算总重量 */
          detailedTableData.value[index].totalWeight =
            v * detailedTableData.value[index].quantity || 0
        },
      })
    },
  },
  {
    title: '总重量（kg）',
    key: 'totalWeight',
    width: 120,
    // render(row) {
    //   const index = getDataIndex(row.materialNumber, detailedTableData.value)
    //   console.log('index:', index, detailedTableData.value[index])
    //   return 111
    // },
  },
]

/**
 * @param {*} type '0' 编辑 '1' 新增
 * @param {*} number 编辑需要传的编码
 * @return {*}
 */
const show = (type, number) => {
  modalType.value = type
  showModal.value = true
  if (type === '0') {
    selectMaterialNumber.value = number
    fetchData()
  } else {
    addTableData.value = [{ materialNumber: null }]
    selectMaterialNumber.value = null
  }
  fetchPackageList()
}

/* 获取包装材料编码列表-包装材料编码下拉列表 */
const fetchPackageList = async () => {
  try {
    const res = await getPackagingMaterialsData({ oid: window.oid })
    if (res.code === RES_SUCCESS_CODE) {
      options.value = res.data || []
    }
  } catch (error) {
    console.log('error:', error)
  }
}

const fetchData = async () => {
  try {
    loading.value = true
    const res = await getShippingPartsData({
      oid: window.oid,
      materialNumber: selectMaterialNumber.value,
    })
    if (res.code === RES_SUCCESS_CODE) {
      const { shippingMaterialItems = [] } = res?.data || {}
      detailedTableData.value = shippingMaterialItems
      addTableData.value = [res?.data]
      selectMaterialNumber.value = res?.data.materialNumber
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

const handleClick = async (e, item) => {
  e.stopPropagation()
  switch (item.key) {
    case 1:
      shippingComponentsRef.value.show()
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
              (val) => !checkedAddTableRowKeys.value.includes(val?.materialNumber)
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

/**
 * 添加发运部件物料明细 弹框点击确定回调函数
 * @return {*}
 */
const confirmChooseShipping = (data) => {
  const list = data.map((item) => ({
    materialNumber: item?.materialNumber,
    materialDesc: item?.materialDesc,
    englishDesc: item?.englishDesc,
  }))
  const materialNumberList = detailedTableData.value.map((item) => item?.materialNumber)
  const state = list.some((item) => materialNumberList.includes(item?.materialNumber))
  if (state) {
    $message.error('包装材料编码相同不能重复添加')
    return
  }
  detailedTableData.value = [...detailedTableData.value, ...list]
  shippingComponentsRef.value.hide()
  nextTick(() => {
    tableRef.value &&
      tableRef.value.scrollTo({
        left: 0,
        top: detailedTableData.value.length * 100,
        behavior: 'smooth',
      })
  })
}

const confirm = async () => {
  try {
    saveAddTableLoading.value = true
    const obj = {
      oid: window.oid,
      type: modalType.value,
      data: { ...addTableData.value[0], shippingMaterialItems: detailedTableData.value },
    }
    const res = await saveShippingPartsData({ ...obj })
    if (res?.code === RES_SUCCESS_CODE) {
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

defineExpose({
  show,
})

const closeModal = () => {
  checkedAddTableRowKeys.value = []
  detailedTableData.value = []
}

watch(
  () => detailedTableData.value,
  () => {
    const weight = detailedTableData.value.reduce((pre, cut) => {
      return pre + Number(cut?.weight || 0)
    }, 0)
    const totalWeight = detailedTableData.value.reduce((pre, cut) => {
      return pre + Number(cut?.totalWeight || 0)
    }, 0)
    addTableData.value[0].netWeight = weight // 净重
    addTableData.value[0].grossWeight = totalWeight // 毛重
  },
  {
    deep: true,
  }
)
</script>

<style lang="scss" scoped></style>
