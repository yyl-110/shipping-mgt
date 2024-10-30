<template>
  <n-modal v-model:show="showModal" :mask-closable="false" @after-leave="closeModal">
    <div w-1100 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-16 font-bold text-hex-1d2129>添加整机信息</span>
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
import { queryCompleteMachineData, saveCompleteMachineData } from '~/src/api'
import { RES_SUCCESS_CODE } from '~/src/utils'

const emits = defineEmits(['handleConfirm'])

let formValue = reactive({ number: '', drwoNo: '', name: '' })
const showModal = ref(false)
const addTableData = ref([])
const addTableLoading = ref(false)
const checkedAddTableRowKeys = ref([])
const saveAddTableLoading = ref(false)
const rowKey = (row) => row.materialNumber

const fetchAddTableInfo = async () => {
  try {
    addTableLoading.value = true
    const res = await queryCompleteMachineData({ ...formValue, oid: window.oid })
    if (res.code === RES_SUCCESS_CODE) {
      addTableData.value = res.data
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    addTableLoading.value = false
  }
}

const show = () => {
  showModal.value = true
  // fetchAddTableInfo()
}

const confirm = async () => {
  if (checkedAddTableRowKeys.value.length === 0) {
    $message.info('请勾选需要添加的整机信息')
    return
  }
  try {
    saveAddTableLoading.value = true
    const data = addTableData.value.filter((item) =>
      checkedAddTableRowKeys.value.includes(item.materialNumber)
    )
    const res = await saveCompleteMachineData({
      oid: window.oid,
      type: '1',
      data,
    })
    if (res.code === RES_SUCCESS_CODE) {
      $message.success('新增整机成功！')
      showModal.value = false
      emits('handleConfirm')
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    saveAddTableLoading.value = false
  }
}

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

const search = (val) => {
  formValue = { ...val }
  fetchAddTableInfo()
}
const cleanUp = (val) => {
  formValue = { ...val }
  fetchAddTableInfo()
}

const closeModal = () => {
  checkedAddTableRowKeys.value = []
  addTableData.value = []
}

defineExpose({
  show,
})
</script>

<style lang="scss" scoped></style>
