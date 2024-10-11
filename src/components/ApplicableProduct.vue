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
        :columns="columns"
        :data="tableData"
        :pagination="false"
        flex-height
        min-h-300
        class="resizeTable"
      />
    </div>
  </app-box>
  <n-modal v-model:show="showModal" :mask-closable="false">
    <div w-1100 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>添加适用产品</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="showModal = false"
        />
      </header>
      <main min-h-300 px-20 pt-20>
        <n-form
          ref="formRef"
          :label-width="80"
          label-placement="left"
          :model="formValue"
          require-mark-placement="left"
          inline
        >
          <n-grid :cols="24">
            <n-form-item-gi :span="6" label="编号" path="number">
              <n-input
                v-model:value="formValue.number"
                placeholder="请输入"
                clearable
                @keydown.enter="search"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="6" label="名称" path="name">
              <n-input
                v-model:value="formValue.name"
                placeholder="请输入"
                clearable
                @keydown.enter="search"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="6" label="图号" path="drwoNo">
              <n-input
                v-model:value="formValue.drwoNo"
                placeholder="请输入"
                clearable
                @keydown.enter="search"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="6">
              <n-button attr-type="button" type="primary" ml-auto w-80 @click="search">
                搜索
              </n-button>
              <n-button ml-10 w-80>清除</n-button>
            </n-form-item-gi>
          </n-grid>
        </n-form>
        <n-data-table
          :columns="columns"
          :data="tableData"
          :pagination="false"
          :max-height="350"
          :min-height="200"
        />
      </main>
      <footer h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="showModal = false">取消</n-button>
        <n-button type="primary" @click="confirm">确定</n-button>
      </footer>
    </div>
  </n-modal>
</template>

<script setup>
import { onMounted } from 'vue'
import { getApplicableProductsData } from '../api'
import { defaultBtn } from '../data'

const formValue = ref({})
const showModal = ref(false)
/* 表格数据 */
const tableData = ref([])
const tableLoading = ref(false)
const fetchTableInfo = async () => {
  try {
    tableLoading.value = true
    const res = await getApplicableProductsData({})
    tableData.value = res.data
  } catch (error) {
    console.log('error:', error)
  } finally {
    tableLoading.value = false
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
    title: '物料编码',
    key: 'materialNumber',
  },
  {
    title: '物料描述',
    key: 'materialDesc',
  },
  {
    title: '设计型号',
    key: 'designModel',
  },
  {
    title: '配置',
    key: 'configuration',
  },
]

const handleClick = (item) => {
  switch (item.key) {
    case 1: // 新增
      showModal.value = true
      break

    default:
      break
  }
}
onMounted(() => {
  fetchTableInfo()
})
</script>

<style lang="scss" scoped></style>
