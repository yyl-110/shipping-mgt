<template>
  <app-box title="拆机信息" type="collapse">
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
        ref="tableRef"
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="tableData"
        :pagination="false"
        :loading="tableLoading"
        flex-height
        min-h-300
        class="resizeTable"
        :row-key="rowKey"
        :scroll-x="1740"
      />
    </div>
  </app-box>
</template>

<script setup>
import { nextTick, onMounted } from 'vue'
import { getDisassemblyData, deleteDisassemblyData, saveDisassemblyData } from '../api'
import { defaultBtn, DisassembleMachinelInfoColumnsArr } from '../data'
import useHandle from '../hooks/useHandle'
import useRefreshPage from '../hooks/useRefreshPage'
import { RES_SUCCESS_CODE } from '../utils'
import { ShowOrEdit } from './tool'
import _ from 'lodash'
const { handleDelete } = useHandle()

const rowKey = (row) => row.id
const tableRef = ref(null)
/* 整机信息表格 */
const tableData = ref([])
const checkedRowKeys = ref([])
const tableLoading = ref(false)
const saveTableLoading = ref(false)

const isEdit = computed(() => window.isEdit)

const getDataIndex = (key, data) => {
  return data.findIndex((item) => item.id === key)
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
  ...DisassembleMachinelInfoColumnsArr.map((item) => {
    const obj = {
      title: item.label,
      key: item.key,
      width: item.width,
      render(row) {
        const index = getDataIndex(row.id, tableData.value)
        return h(ShowOrEdit, {
          value: row[item.key],
          type: item.type,
          onUpdateValue(v) {
            tableData.value[index][item.key] = v
          },
        })
      },
    }
    return obj
  }),
]

/* 获取整机信息表格数据 */
const fetchData = async () => {
  try {
    tableLoading.value = true
    const res = await getDisassemblyData({ oid: window.oid })
    if (res.code === RES_SUCCESS_CODE) {
      tableData.value = res?.data.map((item, index) => ({
        ...item,
        id: `${index}-${new Date().getTime()}`,
      }))
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    tableLoading.value = false
  }
}

const handleClick = async (item) => {
  switch (item.key) {
    case 1: // 新增
      tableData.value = [
        ...tableData.value,
        { id: `${tableData.value.length}-${new Date().getTime()}` },
      ]
      nextTick(() => {
        tableRef.value &&
          tableRef.value.scrollTo({
            left: 0,
            top: tableData.value.length * 100,
            behavior: 'smooth',
          })
      })
      break
    case 2: // 删除
      try {
        if (checkedRowKeys.value.length === 0) {
          $message.info('请勾选需要删除的数据！')
          return
        }
        const _tableData = _.cloneDeep(tableData.value)
        const data = _tableData
          .filter((val) => checkedRowKeys.value.includes(val?.id))
          .map((item) => {
            delete item.id
            return { ...item }
          })
        const deleteArr = data.map((item) => item.materialNumber)
        $dialog.confirm({
          content: `是否确认删除${deleteArr.join(',')}`,
          negativeText: '取消',
          positiveText: '确认',
          onPositiveClick: () => {
            tableData.value = tableData.value.filter(
              (item) => !checkedRowKeys.value.includes(item?.id)
            )
            checkedRowKeys.value = []
          },
        })
      } catch (error) {
        console.log('error:', error)
      }
      break
    case 3: // 保存
      try {
        const state = tableData.value.some((item) => !item.materialNumber)
        if (state) {
          $message.warning('物料编码不能为空')
          return
        }
        const _tableData = _.cloneDeep(tableData.value)
        saveTableLoading.value = true
        const res = await saveDisassemblyData({
          oid: window.oid,
          data: _tableData.map((item) => {
            delete item.id
            return { ...item }
          }),
        })
        if (res.code === RES_SUCCESS_CODE) {
          $message.success('保存成功！')
          fetchData()
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
  saveData: () => {
    const _tableData = _.cloneDeep(tableData.value)
    return saveDisassemblyData({
      oid: window.oid,
      data: _tableData.map((item) => {
        delete item.id
        return { ...item }
      }),
    })
  },
})
</script>

<style lang="scss" scoped></style>
