<template>
  <app-box title="发运基本信息" position-sticky left-0 top-0 z-9 bg-hex-fff>
    <n-form
      ref="formRef"
      :model="formValue"
      :rules="rules"
      label-placement="left"
      inline
      px-20
      size="small"
      pt-10
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="8" label="公司名称">
          <n-select
            v-model:value="formValue.company"
            placeholder="请选择"
            :options="companyValue"
            filterable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="8" label="销售型号">
          <n-select
            v-model:value="formValue.salesModel"
            placeholder="请选择"
            :options="salesModelValue"
            filterable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="8" label="设计型号">
          <n-input v-model:value="formValue.designModel" filterable placeholder="请输入设计型号" />
        </n-form-item-gi>
        <n-form-item-gi :span="8" label="发运数量（台）">
          <n-input-number
            v-model:value="formValue.shippingQuantity"
            :min="0"
            button-placement="both"
            class="baseInputNum"
          >
            <template #minus-icon>
              <the-icon icon="input_minus" :size="14" type="custom" />
            </template>
            <template #add-icon>
              <the-icon icon="input_add" :size="14" type="custom" />
            </template>
          </n-input-number>
        </n-form-item-gi>
        <n-form-item-gi :span="8" label="发运形式">
          <n-select
            v-model:value="formValue.shippingForm"
            placeholder="请选择"
            :options="shippingFormValue"
            filterable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="8" label="运输方式">
          <n-select
            v-model:value="formValue.transportation"
            placeholder="请选择"
            :options="transportationValue"
            filterable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="8" label="包装总成本">
          <n-input-number
            v-model:value="formValue.totalCost"
            :min="0"
            button-placement="both"
            class="baseInputNum"
          >
            <template #minus-icon>
              <the-icon icon="input_minus" :size="14" type="custom" />
            </template>
            <template #add-icon>
              <the-icon icon="input_add" :size="14" type="custom" />
            </template>
          </n-input-number>
          <n-button type="primary" ml-24 :disabled="isEdit" @click="clickCalcCost">
            点击计算
          </n-button>
        </n-form-item-gi>
        <n-form-item-gi :span="8" label="单台包装成本">
          <n-input v-model:value="formValue.eachCost" disabled />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="方案说明">
          <n-input
            v-model:value="formValue.schemeDescription"
            type="textarea"
            placeholder="请输入"
            show-count
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="特殊要求">
          <n-input
            v-model:value="formValue.specialRequirements"
            type="textarea"
            placeholder="请输入"
            show-count
          />
        </n-form-item-gi>
        <n-form-item-gi :span="24" class="noRule" flex flex-col justify-end pb-10>
          <n-button
            type="primary"
            ml-auto
            mt-auto
            w-100
            :loading="saveLoading"
            :disabled="isEdit"
            @click="saveData"
          >
            保存
          </n-button>
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </app-box>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { getBaseStructure, getShippingBasicData, saveShippingBasicData } from '../api'
import { RES_SUCCESS_CODE } from '../utils'
import AppBox from './common/AppBox.vue'
import useRefreshPage from '@/hooks/useRefreshPage'
import { useAppStore } from '../store'
import { storeToRefs } from 'pinia'
const rules = []
const formValue = ref({})
const companyValue = ref([])
const salesModelValue = ref([])
const shippingFormValue = ref([])
const transportationValue = ref([])
const saveLoading = ref(false)
const isEdit = computed(() => window.isEdit)

const { calcCost } = useAppStore()
const app = useAppStore()
const { totalCost, inputPackagingInfoState, inputPackagingAccesInfoState } = storeToRefs(app)

const fetchEnum = async () => {
  try {
    const res = await getBaseStructure({ oid: window.oid })
    companyValue.value = res?.data?.companyValue || []
    salesModelValue.value = res?.data?.salesModelValue || []
    shippingFormValue.value = res?.data?.shippingFormValue || []
    transportationValue.value = res?.data?.transportationValue || []
  } catch (error) {
    console.log('error:', error)
  }
}

/* 保存数据 */
const saveData = async () => {
  try {
    saveLoading.value = true
    const res = await saveShippingBasicData({ data: { ...formValue.value }, oid: window.oid })
    if (res.code === RES_SUCCESS_CODE) {
      $message.success('保存成功！')
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    saveLoading.value = false
  }
}

const fetchInfo = async () => {
  try {
    const res = await getShippingBasicData({ oid: window.oid })
    formValue.value = { ...res.data }
  } catch (error) {
    console.log('error:', error)
  }
}

const clickCalcCost = async () => {
  if (!inputPackagingInfoState.value) {
    $message.warning('包装材料数量、单价不能为空')
    return
  }
  if (!inputPackagingAccesInfoState.value) {
    $message.warning('包装辅料数量、单价不能为空')
    return
  }
  calcCost()
  formValue.value.totalCost = totalCost.value
}

onMounted(() => {
  fetchEnum()
  fetchInfo()
})

useRefreshPage(fetchInfo)

defineExpose({
  saveData: () => saveShippingBasicData({ data: { ...formValue.value }, oid: window.oid }),
})

watch(
  [() => formValue.value.totalCost, () => formValue.value.shippingQuantity],
  () => {
    try {
      formValue.value.eachCost = Number(
        ((formValue.value.totalCost || 0) / (formValue.value.shippingQuantity || 0)).toFixed(3)
      )
    } catch (error) {
      console.log('error:', error)
    }
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
::v-deep .n-form-item .n-form-item-feedback-wrapper {
  --n-feedback-height: 12px;
}
::v-deep .noRule {
  .n-form-item-feedback-wrapper {
    display: none;
  }
}
</style>
