<template>
  <app-box title="包装辅料信息" type="collapse">
    <div flex>
      <n-button
        v-for="item in defaultBtn"
        :key="item.key"
        attr-type="button"
        type="primary"
        mr-12
        w-90
        :disabled="isEdit"
        :loading="item.key === 3 && saveTableLoading"
        @click="handleClick(item)"
      >
        <template v-if="item.icon" #icon>
          <TheIcon :icon="item.icon" type="custom" :size="16" class="mr-3" color="#fff" />
        </template>
        {{ item.label }}
      </n-button>
      <n-button ml-30 type="primary" :loading="priceLoading" :disabled="isEdit" @click="getPrice">
        获取价格
      </n-button>
    </div>
    <div class="tableWrap" mt-16>
      <n-data-table
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="tableData"
        :pagination="false"
        :loading="tableLoading"
        flex-height
        min-h-300
        class="resizeTable"
        :row-key="rowKey"
        :scroll-x="1200"
      />
    </div>
    <AddPackageModal ref="addModalRef" @handle-confirm="fetchData" />
  </app-box>
</template>

<script setup>
import { onMounted } from 'vue'
import {
  deletePackagingAuxMaterialsData,
  getMaterialPrice,
  getPackagingAuxMaterialsData,
  savePackagingAuxMaterialsData,
} from '../api'
import { defaultBtn } from '../data'
import useHandle from '../hooks/useHandle'
import { RES_SUCCESS_CODE } from '../utils'
import { ShowOrEdit } from './tool'
import AddPackageModal from './common/AddPackageModal.vue'
import useRefreshPage from '../hooks/useRefreshPage'
import { useAppStore } from '../store'
import _ from 'lodash-es'

const { handleDelete } = useHandle()

const { updateAccessories, updatePackagingAccesInfoState } = useAppStore()

const rowKey = (row) => row.materialNumber
/* 表格 */
const tableData = ref([])
const checkedRowKeys = ref([])
const tableLoading = ref(false)
const saveTableLoading = ref(false)
const priceLoading = ref(false)
const addModalRef = ref(null)

const isEdit = computed(() => window.isEdit)

const getDataIndex = (key, data) => {
  return data.findIndex((item) => item.materialNumber === key)
}

const columns = [
  {
    type: 'selection',
  },
  {
    title: '序号',
    key: 'no',
    width: '100',
    align: 'center',
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: h('div', {}, [h('span', { class: 'text-red' }, '*'), '物料编码']),
    key: 'materialNumber',
  },
  {
    title: '物料描述',
    key: 'materialDesc',
    width: 200,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '数量',
    key: 'quantity',
    render(row) {
      const index = getDataIndex(row.materialNumber, tableData.value)
      return h(ShowOrEdit, {
        value: row.quantity,
        type: 'number',
        onUpdateValue(v) {
          tableData.value[index].quantity = v
        },
      })
    },
  },
  {
    title: '单价（元）',
    key: 'unitPrice',
  },
  {
    title: '长（mm）',
    key: 'length',
    render(row) {
      const index = getDataIndex(row.materialNumber, tableData.value)
      return h(ShowOrEdit, {
        value: row.length,
        type: 'number',
        onUpdateValue(v) {
          tableData.value[index].length = v
        },
      })
    },
  },
  {
    title: '宽（mm）',
    key: 'width',
    render(row) {
      const index = getDataIndex(row.materialNumber, tableData.value)
      return h(ShowOrEdit, {
        value: row.width,
        type: 'number',
        onUpdateValue(v) {
          tableData.value[index].width = v
        },
      })
    },
  },
  {
    title: '高（mm）',
    key: 'height',
    render(row) {
      const index = getDataIndex(row.materialNumber, tableData.value)
      return h(ShowOrEdit, {
        value: row.height,
        type: 'number',
        onUpdateValue(v) {
          tableData.value[index].height = v
        },
      })
    },
  },
  {
    title: '重量（kg）',
    key: 'weight',
    render(row) {
      const index = getDataIndex(row.materialNumber, tableData.value)
      return h(ShowOrEdit, {
        value: row.weight,
        type: 'number',
        onUpdateValue(v) {
          tableData.value[index].weight = v
        },
      })
    },
  },
]
/* 获取表格数据 */
const fetchData = async () => {
  try {
    tableLoading.value = true
    const res = await getPackagingAuxMaterialsData({ oid: window.oid })
    console.log('res:', res)
    tableData.value = res.data
  } catch (error) {
    console.log('error:', error)
  } finally {
    tableLoading.value = false
  }
}

const handleClick = async (item) => {
  switch (item.key) {
    case 1: // 新增
      addModalRef.value.show(2)
      break
    case 2: // 删除
      try {
        if (checkedRowKeys.value.length === 0) {
          $message.info('请勾选需要删除的数据！')
          return
        }
        const data = tableData.value.filter((val) =>
          checkedRowKeys.value.includes(val?.materialNumber)
        )
        await handleDelete(
          deletePackagingAuxMaterialsData,
          { data, oid: window.oid },
          checkedRowKeys.value.join(',')
        )
        checkedRowKeys.value = []
        fetchData()
      } catch (error) {
        console.log('error:', error)
      }
      break
    case 3: // 保存
      try {
        saveTableLoading.value = true
        const res = await savePackagingAuxMaterialsData({
          oid: window.oid,
          type: '0', //适用产品模块保存标识
          data: tableData.value,
        })
        if (res.code === RES_SUCCESS_CODE) {
          $message.success('保存成功！')
        }
      } catch (error) {
        console.log('error:', error)
      } finally {
        saveTableLoading.value = false
      }
      break
    case 4: // 刷新
      fetchData()
      break
    default:
      break
  }
}

const getPrice = async () => {
  try {
    priceLoading.value = true
    const list = tableData.value.map((item) => item.materialNumber)
    const res = await getMaterialPrice({ oid: window.oid, data: list })
    if (res.code === RES_SUCCESS_CODE) {
      $message.success('操作成功')
      tableData.value = tableData.value.map((item) => {
        const obj = res.data.find((val) => val.materialNumber === item?.materialNumber) || {}
        return { ...item, ...obj }
      })
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    priceLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})

useRefreshPage(fetchData)

defineExpose({
  saveData: () =>
    savePackagingAuxMaterialsData({
      oid: window.oid,
      type: '0', //适用产品模块保存标识
      data: tableData.value,
    }),
})

watch(
  () => tableData.value,
  () => {
    const total = tableData.value.reduce((acc, current) => {
      const val = current.quantity * current.unitPrice
      return acc + val
    }, 0)
    updateAccessories(total)
    const state = tableData.value.every(
      (item) => _.isNumber(item.quantity) && _.isNumber(item.unitPrice)
    )
    updatePackagingAccesInfoState(state)
  },
  { deep: true }
)
</script>

<style lang="scss" scoped></style>
