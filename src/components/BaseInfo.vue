<template>
  <div>
    <app-box title="发运基本信息">
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        inline
        p-20
        pb-0
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
            <n-input v-model:value="type" filterable placeholder="请输入设计型号" />
          </n-form-item-gi>
          <n-form-item-gi :span="8" label="发运数量（台）">
            <n-input-number v-model:value="formValue.num" :min="0" button-placement="both">
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
            <n-input-number v-model:value="formValue.cb" :min="0" button-placement="both">
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
            <n-input v-model:value="formValue.dtcb" disabled />
          </n-form-item-gi>
          <n-form-item-gi :span="20" label="方案说明">
            <n-input
              v-model:value="formValue.expression"
              type="textarea"
              placeholder="请输入"
              show-count
            />
          </n-form-item-gi>
          <n-form-item-gi :span="20" label="特殊要求">
            <n-input
              v-model:value="formValue.expression"
              type="textarea"
              placeholder="请输入"
              show-count
            />
          </n-form-item-gi>
          <n-form-item-gi :span="24">
            <n-button type="primary" ml-auto w-100>保存</n-button>
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </app-box>
    <ApplicableProduct />
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { getBaseStructure } from '../api'
import AppBox from './common/AppBox.vue'
const rules = []
const formValue = ref({})
const companyValue = ref([])
const salesModelValue = ref([])
const shippingFormValue = ref([])

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

onMounted(() => {
  fetchEnum()
})
</script>

<style lang="scss" scoped></style>
