<template>
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
        <n-button attr-type="button" type="primary" ml-auto w-80 @click="search">搜索</n-button>
        <n-button ml-10 w-80 @click="cleanUp">清除</n-button>
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script setup>
const emits = defineEmits(['search', 'cleanUp'])
const formValue = ref({ number: '', drwoNo: '', name: '' })
const search = () => {
  emits('search', formValue.value)
}
const cleanUp = () => {
  formValue.value = { number: '', drwoNo: '', name: '' }
  emits('cleanUp', formValue.value)
}
</script>

<style lang="scss" scoped></style>
