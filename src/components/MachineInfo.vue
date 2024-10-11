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
</template>

<script setup>
import { onMounted } from 'vue'
import { getCompleteMachineDat } from '../api'
import { defaultBtn } from '../data'
const tableData = ref([])
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
  {
    title: '重量（kg）',
    key: 'weight',
  },
  {
    title: '配置',
    key: 'configuration',
  },
]
const fetchData = async () => {
  try {
    const res = await getCompleteMachineDat({})
    console.log('res:', res)
    tableData.value = res.data
  } catch (error) {
    console.log('error:', error)
  }
}
onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped></style>
