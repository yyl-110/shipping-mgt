<template>
  <app-box title="发运基本信息" left-0 top-0 z-9 bg-hex-fff>
    <n-form
      ref="formRef"
      :model="formValue"
      :rules="rules"
      label-placement="left"
      inline
      px-20
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
          <n-button type="primary" ml-24>点击计算</n-button>
        </n-form-item-gi>
        <n-form-item-gi :span="8" label="单台包装成本">
          <n-input v-model:value="formValue.eachCost" disabled />
        </n-form-item-gi>
        <n-form-item-gi :span="20" label="方案说明">
          <n-input
            v-model:value="formValue.schemeDescription"
            type="textarea"
            placeholder="请输入"
            show-count
          />
        </n-form-item-gi>
        <n-form-item-gi :span="16" label="特殊要求">
          <n-input
            v-model:value="formValue.specialRequirements"
            type="textarea"
            placeholder="请输入"
            show-count
          />
        </n-form-item-gi>
        <n-form-item-gi :span="6" class="noRule" flex flex-col justify-end pb-16>
          <n-button type="primary" ml-auto mt-auto w-100 :loading="saveLoading" @click="saveData">
            保存
          </n-button>
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </app-box>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { getBaseStructure, getShippingBasicData, saveShippingBasicData } from '../api'
import { RES_SUCCESS_CODE } from '../utils'
import AppBox from './common/AppBox.vue'
const rules = []
const formValue = ref({})
const companyValue = ref([])
const salesModelValue = ref([])
const shippingFormValue = ref([])
const saveLoading = ref(false)

const fetchEnum = async () => {
  try {
    const res = await getBaseStructure({})
    companyValue.value = res?.data?.companyValue || []
    salesModelValue.value = res?.data?.salesModelValue || []
    shippingFormValue.value = res?.data?.shippingFormValue || []
  } catch (error) {
    console.log('error:', error)
  }
}

/* 保存数据 */
const saveData = async () => {
  try {
    saveLoading.value = true
    const res = await saveShippingBasicData({ ...formValue.value })
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

onMounted(() => {
  fetchEnum()
  fetchInfo()
})
</script>

<style lang="scss" scoped>
::v-deep .n-form-item .n-form-item-feedback-wrapper {
  --n-feedback-height: 16px;
}
::v-deep .noRule {
  .n-form-item-feedback-wrapper {
    display: none;
  }
}
</style>
