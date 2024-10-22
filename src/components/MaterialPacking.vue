<template>
  <app-box title="物料装箱明细" type="collapse" @after-leave="closeModal">
    <template #title>
      <n-button text ml-20 :disabled="isEdit" @click="add">
        <template #icon>
          <the-icon icon="add" :size="24" type="custom" />
        </template>
      </n-button>
    </template>
    <n-spin :show="loading">
      <div w-full>
        <app-box
          v-for="(item, index) in mainTableInfo"
          :key="item.materialNumber"
          :title="getTitle(index)"
          type="collapse"
        >
          <template #title>
            <div ml-12 flex>
              <n-button
                v-for="val in shippingBtn"
                :key="val.key"
                attr-type="button"
                type="primary"
                size="small"
                :loading="saveLoading && val.key === 3 && clickIndex === index"
                mr-12
                w-90
                :disabled="isEdit"
                @click="handleClick($event, val, item, index)"
              >
                <template v-if="val.icon" #icon>
                  <TheIcon :icon="val.icon" type="custom" :size="16" class="mr-3" color="#fff" />
                </template>
                {{ val.label }}
              </n-button>
            </div>
          </template>
          <div px-20>
            <n-data-table
              :columns="columns"
              :data="[item]"
              :pagination="false"
              :min-height="100"
              :scroll-x="1200"
              :row-key="rowKey"
              :bottom-bordered="false"
              :bordered="false"
            />
          </div>
          <app-box title="物料明细" type="collapse">
            <template #title>
              <div ml-12 flex>
                <n-button
                  v-for="val in btnList"
                  :key="val.key"
                  attr-type="button"
                  type="primary"
                  size="small"
                  mr-12
                  w-90
                  :disabled="isEdit"
                  @click="detailedClick($event, val, item, index)"
                >
                  <template v-if="val.icon" #icon>
                    <TheIcon :icon="val.icon" type="custom" :size="16" class="mr-3" color="#fff" />
                  </template>
                  {{ val.label }}
                </n-button>
              </div>
            </template>
            <n-data-table
              ref="shippingTableRef"
              v-model:checked-row-keys="checkedAddTableRowKeys"
              :columns="detailedTableColumns(index)"
              :data="item.shippingMaterialItems || []"
              :pagination="false"
              :min-height="200"
              :scroll-x="1300"
              :row-key="rowKey"
              class="resizeTable"
              flex-height
            />
          </app-box>
        </app-box>
      </div>
    </n-spin>
    <!-- 新增发运部件弹框 -->
    <AddMaterialPackingModal ref="AddMaterialPackingRef" @handle-confirm="confirm" />
    <!-- 新增发运部件物料明细 -->
    <ShippingComponentsModal ref="shippingComponentsRef" @handle-confirm="confirmChooseShipping" />
  </app-box>
</template>

<script setup>
import { nextTick, onMounted, watch } from 'vue'
import { deleteShippingPartsData, getAllShippingPartsData, saveShippingPartsData } from '../api'
import { shippingBtn } from '../data'
import useHandle from '../hooks/useHandle'
import useRefreshPage from '../hooks/useRefreshPage'
import { RES_SUCCESS_CODE } from '../utils'
import { ShowOrEdit } from './tool'
const { handleDelete } = useHandle()

const loading = ref(false)
const mainTableInfo = ref([])
const AddMaterialPackingRef = ref(null)
const tableData = ref([])
const checkedAddTableRowKeys = ref([])
const shippingComponentsRef = ref(null)
const selectIndex = ref(-1) // 记录点击新增的物料明细的index
const shippingTableRef = ref(null)
const saveLoading = ref(false)
const clickIndex = ref(-1)

const isEdit = computed(() => window.isEdit)

const rowKey = (row) => row.materialNumber

const getTitle = (index) => {
  return `发运部件${index + 1}`
}
const getDataIndex = (key, data) => {
  return data.findIndex((item) => item.materialNumber === key)
}
const btnList = [
  { label: '新增', icon: 'addBtn', key: 1 },
  { label: '删除', icon: 'del', key: 2 },
]

const columns = [
  {
    title: '发运部件描述',
    key: 'shippingPartDesc',
    width: 200,
  },
  {
    title: '包装材料编码',
    key: 'materialNumber',
    width: 200,
  },
  {
    title: '包装材料描述',
    key: 'materialDesc',
    width: 200,
  },
  {
    title: '数量',
    key: 'quantity',
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

const detailedTableColumns = (inx) => [
  {
    type: 'selection',
  },
  {
    title: '序号',
    key: 'no',
    width: 60,
    align: 'center',
    render(row, i) {
      return i + 1
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
      const index = getDataIndex(row.materialNumber, mainTableInfo.value[inx].shippingMaterialItems)
      return h(ShowOrEdit, {
        value: row.quantity,
        type: 'number',
        onUpdateValue(v) {
          mainTableInfo.value[inx].shippingMaterialItems[index].quantity = v
          try {
            /* 更新总重 */
            mainTableInfo.value[inx].shippingMaterialItems[index].totalWeight =
              v * (mainTableInfo.value[inx].shippingMaterialItems[index].weight || 0)

            /* 更新毛重 */
            mainTableInfo.value[inx].grossWeight = mainTableInfo.value[
              inx
            ].shippingMaterialItems.reduce((pre, cut) => {
              return pre + (cut?.totalWeight || 0)
            }, 0)
          } catch (error) {
            console.log('error:', error)
          }
        },
      })
    },
  },
  {
    title: '长（mm）',
    key: 'length',
    width: 120,
    render(row) {
      const index = getDataIndex(row.materialNumber, mainTableInfo.value[inx].shippingMaterialItems)
      return h(ShowOrEdit, {
        value: row.length,
        type: 'number',
        onUpdateValue(v) {
          mainTableInfo.value[inx].shippingMaterialItems[index].length = v
        },
      })
    },
  },
  {
    title: '宽（mm）',
    key: 'width',
    width: 120,
    render(row) {
      const index = getDataIndex(row.materialNumber, mainTableInfo.value[inx].shippingMaterialItems)
      return h(ShowOrEdit, {
        value: row.width,
        type: 'number',
        onUpdateValue(v) {
          mainTableInfo.value[inx].shippingMaterialItems[index].width = v
        },
      })
    },
  },
  {
    title: '高（mm）',
    key: 'height',
    width: 120,
    render(row) {
      const index = getDataIndex(row.materialNumber, mainTableInfo.value[inx].shippingMaterialItems)
      return h(ShowOrEdit, {
        value: row.height,
        type: 'number',
        onUpdateValue(v) {
          mainTableInfo.value[inx].shippingMaterialItems[index].height = v
        },
      })
    },
  },
  {
    title: '单个重量（kg）',
    key: 'weight',
    width: 140,
    render(row) {
      const index = getDataIndex(row.materialNumber, mainTableInfo.value[inx].shippingMaterialItems)
      return h(ShowOrEdit, {
        value: row.weight,
        type: 'number',
        onUpdateValue(v) {
          mainTableInfo.value[inx].shippingMaterialItems[index].weight = v
          try {
            /* 更新净重 */
            mainTableInfo.value[inx].netWeight = mainTableInfo.value[
              inx
            ].shippingMaterialItems.reduce((pre, cut) => {
              return pre + (cut?.weight || 0)
            }, 0)
            /* 更新总重 */
            mainTableInfo.value[inx].shippingMaterialItems[index].totalWeight =
              v * (mainTableInfo.value[inx].shippingMaterialItems[index].quantity || 0)

            /* 更新毛重 */
            mainTableInfo.value[inx].grossWeight = mainTableInfo.value[
              inx
            ].shippingMaterialItems.reduce((pre, cut) => {
              return pre + (cut?.totalWeight || 0)
            }, 0)
          } catch (error) {
            console.log('error:', error)
          }
        },
      })
    },
  },
  {
    title: '总重量（kg）',
    key: 'totalWeight',
    width: 120,
  },
]

/* 新增物料 */
const add = (e) => {
  e.stopPropagation()
  AddMaterialPackingRef.value.show('1')
}
const fetchData = async () => {
  try {
    loading.value = true
    const res = await getAllShippingPartsData({ oid: window.oid })
    mainTableInfo.value = res.data
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

const confirm = () => {
  fetchData()
}

/* 发运部件操作 */
const handleClick = async (e, val, item, index) => {
  clickIndex.value = index
  e.stopPropagation()
  switch (val.key) {
    case 1: // 编辑
      AddMaterialPackingRef.value.show('0', item.materialNumber)
      break
    case 2: // 删除
      try {
        await handleDelete(
          deleteShippingPartsData,
          { data: { ...item }, oid: window.oid },
          item.materialNumber
        )
        checkedAddTableRowKeys.value = []
        fetchData()
      } catch (error) {
        console.log('error:', error)
      }
      break
    case 3: // 保存
      try {
        saveLoading.value = true
        const data = { type: '0', oid: window.oid, data: mainTableInfo.value[index] }
        const res = await saveShippingPartsData(data)
        if (res.code === RES_SUCCESS_CODE) {
          $message.success('保存成功')
        }
      } catch (error) {
        console.log('error:', error)
      } finally {
        saveLoading.value = false
      }
      break
    case 4: // 刷新
      fetchData()
      break

    default:
      break
  }
}

/* 物料明细按钮 */
const detailedClick = async (e, val, detailedInfo, index) => {
  e.stopPropagation()
  switch (val?.key) {
    case 1: // 新增
      selectIndex.value = index
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
            const { shippingMaterialItems = [] } = detailedInfo || {}
            const data = shippingMaterialItems.filter(
              (val) => !checkedAddTableRowKeys.value.includes(val?.materialNumber)
            )
            mainTableInfo.value[index] = { ...mainTableInfo[index], shippingMaterialItems: data }
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
  const { shippingMaterialItems = [] } = mainTableInfo.value[selectIndex.value] || {}
  const materialNumberList = shippingMaterialItems.map((item) => item?.materialNumber)
  const state = list.some((item) => materialNumberList.includes(item?.materialNumber))
  if (state) {
    $message.error('包装材料编码相同不能重复添加')
    return
  }
  const shippingMaterialList = [...shippingMaterialItems, ...list]
  mainTableInfo.value[selectIndex.value] = {
    ...mainTableInfo.value[selectIndex.value],
    shippingMaterialItems: shippingMaterialList,
  }
  shippingComponentsRef.value.hide()
  nextTick(() => {
    shippingTableRef.value[selectIndex.value] &&
      shippingTableRef.value[selectIndex.value].scrollTo({
        left: 0,
        top: shippingMaterialList.length * 100,
        behavior: 'smooth',
      })
  })
}

const closeModal = () => {
  checkedAddTableRowKeys.value = []
}

onMounted(() => {
  fetchData()
})
useRefreshPage(fetchData)

defineExpose({
  saveData: () =>
    mainTableInfo.value.map((item) =>
      saveShippingPartsData({ type: '0', oid: window.oid, data: { ...item } })
    ),
})
</script>

<style lang="scss" scoped>
::v-deep .n-collapse .n-collapse-item .n-collapse-item {
  margin-left: 16px;
}
</style>
