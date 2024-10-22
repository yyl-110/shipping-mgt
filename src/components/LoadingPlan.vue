<template>
  <app-box title="装载方案" type="collapse">
    <template #title>
      <n-button text ml-20 :disabled="isEdit" @click="add($event)">
        <template #icon>
          <the-icon icon="add" :size="24" type="custom" />
        </template>
      </n-button>
    </template>
    <n-spin :show="loading">
      <div w-full>
        <app-box
          v-for="(item, index) in mainTableInfo"
          :key="item.boxNumber"
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
          <div>
            <n-data-table
              :columns="columns"
              :data="[item]"
              :pagination="false"
              :min-height="100"
              :scroll-x="1100"
              :row-key="rowKey"
              :bottom-bordered="false"
              :bordered="false"
            />
          </div>
          <app-box title="发运部件明细" type="collapse">
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
              :data="item.shippingPartsItems || []"
              :pagination="false"
              :min-height="200"
              :scroll-x="1300"
              :row-key="rowKey1"
              class="resizeTable"
              flex-height
            />
          </app-box>
        </app-box>
      </div>
    </n-spin>
    <AddPackingInfoModal ref="AddPackingInfoRef" @handle-confirm="confirm" />
  </app-box>
</template>

<script setup>
import { onMounted } from 'vue'
import { deletePackingInfoData, getAllPackingInfoData, savePackingInfoData } from '../api'
import { shippingBtn } from '../data'
import useHandle from '../hooks/useHandle'
import useRefreshPage from '../hooks/useRefreshPage'
import { RES_SUCCESS_CODE } from '../utils'
import { ShowOrEdit } from './tool'
import _ from 'lodash-es'

const { handleDelete } = useHandle()

const loading = ref(false)
const mainTableInfo = ref([])
const clickIndex = ref(-1)
const selectIndex = ref(-1)
const checkedAddTableRowKeys = ref([])
const shippingTableRef = ref(null)
const AddPackingInfoRef = ref(null)
const saveLoading = ref(false)

const isEdit = computed(() => window.isEdit)

const rowKey = (row) => row.boxNumber
const rowKey1 = (row) => row.id
const getDataIndex = (key, data) => {
  return data.findIndex((item) => item.id === key)
}

const getTitle = (index) => {
  return `装箱信息${index + 1}`
}

const btnList = [
  { label: '新增', icon: 'addBtn', key: 1 },
  { label: '删除', icon: 'del', key: 2 },
]

const columns = [
  {
    title: '箱号',
    key: 'boxNumber',
  },
  {
    title: '装箱类型',
    key: 'packingType',
  },
  {
    title: '规格',
    key: 'specifications',
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
    title: '发运部件描述',
    key: 'shippingPartDesc',
    width: 180,
    render(row) {
      const index = getDataIndex(row.id, mainTableInfo.value[inx].shippingPartsItems)
      return h(ShowOrEdit, {
        value: row.shippingPartDesc,
        onUpdateValue(v) {
          mainTableInfo.value[inx].shippingPartsItems[index].shippingPartDesc = v
        },
      })
    },
  },
  {
    title: '包装材料描述',
    width: 180,
    key: 'packagingMaterialDesc',
    render(row) {
      const index = getDataIndex(row.id, mainTableInfo.value[inx].shippingPartsItems)
      return h(ShowOrEdit, {
        value: row.packagingMaterialDesc,
        onUpdateValue(v) {
          mainTableInfo.value[inx].shippingPartsItems[index].packagingMaterialDesc = v
        },
      })
    },
  },
  {
    title: '数量',
    key: 'quantity',
    width: 120,
    render(row) {
      const index = getDataIndex(row.id, mainTableInfo.value[inx].shippingPartsItems)
      return h(ShowOrEdit, {
        value: row.quantity,
        type: 'number',
        onUpdateValue(v) {
          mainTableInfo.value[inx].shippingPartsItems[index].quantity = v
          try {
            /* 更新净重 */
            mainTableInfo.value[inx].totalNetWeight = mainTableInfo.value[
              inx
            ].shippingPartsItems.reduce((pre, cut) => {
              return pre + (cut?.netWeight || 0) * (cut?.quantity || 0)
            }, 0)
            /* 更新毛重 */
            mainTableInfo.value[inx].totalGrossWeight = mainTableInfo.value[
              inx
            ].shippingPartsItems.reduce((pre, cut) => {
              return pre + (cut?.grossWeight || 0) * (cut?.quantity || 0)
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
      const index = getDataIndex(row.id, mainTableInfo.value[inx].shippingPartsItems)
      return h(ShowOrEdit, {
        value: row.length,
        type: 'number',
        onUpdateValue(v) {
          mainTableInfo.value[inx].shippingPartsItems[index].length = v
        },
      })
    },
  },
  {
    title: '宽（mm）',
    key: 'width',
    width: 120,
    render(row) {
      const index = getDataIndex(row.id, mainTableInfo.value[inx].shippingPartsItems)
      return h(ShowOrEdit, {
        value: row.width,
        type: 'number',
        onUpdateValue(v) {
          mainTableInfo.value[inx].shippingPartsItems[index].width = v
        },
      })
    },
  },
  {
    title: '高（mm）',
    key: 'height',
    width: 120,
    render(row) {
      const index = getDataIndex(row.id, mainTableInfo.value[inx].shippingPartsItems)
      return h(ShowOrEdit, {
        value: row.height,
        type: 'number',
        onUpdateValue(v) {
          mainTableInfo.value[inx].shippingPartsItems[index].height = v
        },
      })
    },
  },
  {
    title: '净重（kg）',
    key: 'netWeight',
    width: 120,
    render(row) {
      const index = getDataIndex(row.id, mainTableInfo.value[inx].shippingPartsItems)
      return h(ShowOrEdit, {
        value: row.netWeight,
        type: 'number',
        onUpdateValue(v) {
          mainTableInfo.value[inx].shippingPartsItems[index].netWeight = v
          try {
            /* 更新净重 */
            mainTableInfo.value[inx].totalNetWeight = mainTableInfo.value[
              inx
            ].shippingPartsItems.reduce((pre, cut) => {
              return pre + (cut?.netWeight || 0) * (cut?.quantity || 0)
            }, 0)
          } catch (error) {
            console.log('error:', error)
          }
        },
      })
    },
  },
  {
    title: '毛重（kg）',
    key: 'grossWeight',
    width: 120,
    render(row) {
      const index = getDataIndex(row.id, mainTableInfo.value[inx].shippingPartsItems)
      return h(ShowOrEdit, {
        value: row.grossWeight,
        type: 'number',
        onUpdateValue(v) {
          mainTableInfo.value[inx].shippingPartsItems[index].grossWeight = v
          try {
            /* 更新毛重 */
            mainTableInfo.value[inx].totalGrossWeight = mainTableInfo.value[
              inx
            ].shippingPartsItems.reduce((pre, cut) => {
              return pre + (cut?.grossWeight || 0) * (cut?.quantity || 0)
            }, 0)
          } catch (error) {
            console.log('error:', error)
          }
        },
      })
    },
  },
]

const add = (e) => {
  e.stopPropagation()
  AddPackingInfoRef.value.show('1')
}
const handleClick = async (e, val, item, index) => {
  clickIndex.value = index
  e.stopPropagation()
  switch (val.key) {
    case 1: // 编辑
      AddPackingInfoRef.value.show('0', item?.boxNumber)
      break
    case 2: // 删除
      try {
        await handleDelete(
          deletePackingInfoData,
          { data: { ...item }, oid: window.oid },
          item.boxNumber
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
        const _mainTableInfo = _.cloneDeep(mainTableInfo.value)
        const info = _mainTableInfo[index].shippingPartsItems.map((item) => {
          delete item.id
          return item
        })
        const data = {
          type: '0',
          oid: window.oid,
          data: { ..._mainTableInfo[index], shippingPartsItems: info },
        }
        const res = await savePackingInfoData(data)
        if (res.code === RES_SUCCESS_CODE) {
          $message.success('保存成功')
          fetchData()
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

const detailedClick = async (e, val, detailedInfo, index) => {
  e.stopPropagation()
  let { shippingPartsItems = [] } = detailedInfo || {}
  // eslint-disable-next-line no-case-declarations
  const list = [...shippingPartsItems]
  switch (val?.key) {
    case 1: // 新增
      selectIndex.value = index
      list.push({
        id: `${list.length}-${new Date().getTime()}`,
      })
      mainTableInfo.value[index] = { ...detailedInfo, shippingPartsItems: list }
      nextTick(() => {
        shippingTableRef.value &&
          shippingTableRef.value.length &&
          shippingTableRef.value[index].scrollTo({
            left: 0,
            top: list.length * 100,
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
            const { shippingPartsItems = [] } = detailedInfo || {}
            const data = shippingPartsItems.filter(
              (val) => !checkedAddTableRowKeys.value.includes(val?.id)
            )
            mainTableInfo.value[index] = { ...mainTableInfo.value[index], shippingPartsItems: data }
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
    const res = await getAllPackingInfoData({ oid: window.oid })
    if (res?.code === RES_SUCCESS_CODE) {
      mainTableInfo.value = res.data.map((item, index) => {
        const data = item?.shippingPartsItems.map((val, inx) => {
          return {
            id: `${index}-${inx}-${new Date().getTime()}`,
            ...val,
          }
        })
        return { ...item, shippingPartsItems: data }
      })
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

const confirm = () => {
  fetchData()
}

onMounted(() => {
  fetchData()
})
useRefreshPage(fetchData)

defineExpose({
  // saveData: () =>
  //   mainTableInfo.value.map((item) =>
  //     saveShippingPartsData({ type: '0', oid: window.oid, data: { ...item } })
  //   ),
})
</script>

<style lang="scss" scoped>
::v-deep .n-collapse .n-collapse-item .n-collapse-item {
  margin-left: 16px;
}
</style>
