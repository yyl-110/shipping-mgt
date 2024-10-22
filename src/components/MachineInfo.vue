<template>
  <app-box title="整机信息" type="collapse">
    <div flex>
      <n-button
        v-for="item in defaultBtn"
        :key="item.key"
        attr-type="button"
        type="primary"
        mr-12
        w-90
        :loading="item.key === 3 && saveTableLoading"
        :disabled="isEdit"
        @click="handleClick(item)"
      >
        <template v-if="item.icon" #icon>
          <TheIcon :icon="item.icon" type="custom" :size="16" class="mr-3" color="#fff" />
        </template>
        {{ item.label }}
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
      />
    </div>
    <AddMachineModal ref="addModalRef" handle-confirm="fetchData" />
  </app-box>
</template>

<script setup>
import { onMounted } from 'vue'
import { deleteCompleteMachineData, getCompleteMachineDat, saveCompleteMachineData } from '../api'
import AddMachineModal from './common/AddMachineModal.vue'
import { defaultBtn } from '../data'
import useHandle from '../hooks/useHandle'
import { ShowOrEdit } from './tool'
import useRefreshPage from '@/hooks/useRefreshPage'
import { RES_SUCCESS_CODE } from '../utils'

const { handleDelete } = useHandle()
const rowKey = (row) => row.materialNumber
/* 整机信息表格 */
const tableData = ref([])
const checkedRowKeys = ref([])
const tableLoading = ref(false)
const saveTableLoading = ref(false)

const isEdit = computed(() => window.isEdit)

const getDataIndex = (key, data) => {
  return data.findIndex((item) => item.materialNumber === key)
}

/* 新增表格数据 */
const addModalRef = ref(null)
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
  {
    title: '配置',
    key: 'configuration',
    render(row) {
      const index = getDataIndex(row.materialNumber, tableData.value)
      return h(ShowOrEdit, {
        value: row.configuration,
        onUpdateValue(v) {
          tableData.value[index].configuration = v
        },
      })
    },
  },
]
/* 获取整机信息表格数据 */
const fetchData = async () => {
  try {
    tableLoading.value = true
    const res = await getCompleteMachineDat({ oid: window.oid })
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
      addModalRef.value.show()
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
          deleteCompleteMachineData,
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
        const res = await saveCompleteMachineData({
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

onMounted(() => {
  fetchData()
})

useRefreshPage(fetchData)

defineExpose({
  saveData: () =>
    saveCompleteMachineData({
      oid: window.oid,
      type: '0', //适用产品模块保存标识
      data: tableData.value,
    }),
})
</script>

<style lang="scss" scoped></style>
