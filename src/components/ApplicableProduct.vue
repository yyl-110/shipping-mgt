<template>
  <app-box title="适用产品" type="collapse">
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
  </app-box>
  <n-modal v-model:show="showModal" :mask-closable="false" @after-leave="closeModal">
    <div w-1100 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-16 font-bold text-hex-1d2129>添加适用产品</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="showModal = false"
        />
      </header>
      <main min-h-300 px-20 pt-20>
        <search-form @search="search" @clean-up="cleanUp" />

        <n-data-table
          v-model:checked-row-keys="checkedAddTableRowKeys"
          :columns="addColumns"
          :data="addTableData"
          :pagination="{
            pageSize: 10,
          }"
          :max-height="350"
          :min-height="200"
          :loading="addTableLoading"
          :scroll-x="1050"
          :row-key="rowKey"
        />
      </main>
      <footer h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="showModal = false">取消</n-button>
        <n-button type="primary" :loading="saveAddTableLoading" @click="confirm">确定</n-button>
      </footer>
    </div>
  </n-modal>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
import {
  deleteApplicableProductsData,
  getApplicableProductsData,
  queryApplicableProductsData,
  saveApplicableProductsData,
} from '../api'
import { defaultBtn } from '../data'
import { ShowOrEdit } from './tool'
import useHandle from '@/hooks/useHandle'
import { RES_SUCCESS_CODE } from '@/utils'
import useRefreshPage from '@/hooks/useRefreshPage'
const { handleDelete } = useHandle()

let formValue = reactive({ number: '', drwoNo: '', name: '' })
const showModal = ref(false)
/* 表格数据 */
const tableData = ref([])
const tableLoading = ref(false)
const saveTableLoading = ref(false)
const checkedRowKeys = ref([])
const rowKey = (row) => row.materialNumber

/* 新增弹框数据 */
const addTableData = ref([])
const addTableLoading = ref(false)
const checkedAddTableRowKeys = ref([])
const saveAddTableLoading = ref(false)

const isEdit = computed(() => window.isEdit)

const getDataIndex = (key, data) => {
  return data.findIndex((item) => item.materialNumber === key)
}

const fetchTableInfo = async () => {
  try {
    tableLoading.value = true
    const res = await getApplicableProductsData({ oid: window.oid })
    tableData.value = res.data
  } catch (error) {
    console.log('error:', error)
  } finally {
    tableLoading.value = false
  }
}

const fetchAddTableInfo = async () => {
  try {
    addTableLoading.value = true
    const res = await queryApplicableProductsData({ ...formValue, oid: window.oid })
    if (res.code === RES_SUCCESS_CODE) {
      addTableData.value = res.data
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    addTableLoading.value = false
  }
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
  },
  {
    title: '设计型号',
    key: 'designModel',
    render(row) {
      const index = getDataIndex(row.materialNumber, tableData.value)
      return h(ShowOrEdit, {
        value: row.designModel,
        onUpdateValue(v) {
          tableData.value[index].designModel = v
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

const addColumns = [
  {
    type: 'selection',
  },
  {
    title: '物料编码',
    key: 'materialNumber',
  },
  {
    title: '物料描述',
    key: 'materialDesc',
  },
  {
    title: '版本',
    key: 'version',
  },
  {
    title: '状态',
    key: 'states',
  },
  {
    title: '采购类型',
    key: 'purchaseType',
  },
  {
    title: '工厂',
    key: 'factory',
  },
]

const handleClick = async (item) => {
  switch (item.key) {
    case 1: // 新增
      showModal.value = true
      // fetchAddTableInfo()
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
          deleteApplicableProductsData,
          { data, oid: window.oid },
          '适用产品' + checkedRowKeys.value.join(',')
        )
        checkedRowKeys.value = []
        fetchTableInfo()
      } catch (error) {
        console.log('error:', error)
      }
      break
    case 3: // 保存
      try {
        saveTableLoading.value = true
        const res = await saveApplicableProductsData({
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
      fetchTableInfo()
      break
    default:
      break
  }
}
const search = (val) => {
  formValue = { ...val }
  fetchAddTableInfo()
}
const cleanUp = () => {
  formValue = { number: '', drwoNo: '', name: '' }
  fetchAddTableInfo()
}

const confirm = async () => {
  if (checkedAddTableRowKeys.value.length === 0) {
    $message.info('请勾选需要添加的适用产品')
    return
  }
  try {
    saveAddTableLoading.value = true
    const data = addTableData.value.filter((item) =>
      checkedAddTableRowKeys.value.includes(item.materialNumber)
    )
    const res = await saveApplicableProductsData({
      oid: window.oid,
      type: '1',
      data,
    })
    if (res.code === RES_SUCCESS_CODE) {
      $message.success('新增适用产品成功！')
      showModal.value = false
      fetchTableInfo()
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    saveAddTableLoading.value = false
  }
}

const closeModal = () => {
  addTableData.value = []
  checkedAddTableRowKeys.value = []
}

onMounted(() => {
  fetchTableInfo()
})

useRefreshPage(fetchTableInfo)

defineExpose({
  saveData: () =>
    saveApplicableProductsData({
      oid: window.oid,
      type: '0', //适用产品模块保存标识
      data: tableData.value,
    }),
})
</script>

<style lang="scss" scoped></style>
