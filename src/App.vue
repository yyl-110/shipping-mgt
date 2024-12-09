<template>
  <AppProvider>
    <n-layout h-full>
      <n-layout-header
        style="height: 52px"
        bordered
        flex
        items-center
        bg-primary
        text-16
        font-bold
        text-white
      >
        <header min-w-160 text-center>发运方案</header>
        <div class="flex" ml-auto pr-20>
          <n-button quaternary color="#fff" mr-10 :disabled="eidtState" @click="save">
            一键保存
          </n-button>
          <n-button quaternary color="#fff" mr-10 :disabled="eidtState" @click="batchImport">
            批量导入
            <input ref="fileInput" hidden type="file" @change="handleFileChange" />
          </n-button>
          <n-button quaternary color="#fff" @click="batchExport">批量导出</n-button>
        </div>
      </n-layout-header>
      <n-layout position="absolute" style="top: 52px; bottom: 0" has-sider>
        <n-layout-sider
          :width="160"
          content-style="padding: 12px;"
          bordered
          h-full
          :native-scrollbar="false"
        >
          <n-menu
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
            :value="activeValue"
            @update:value="menuChange"
          />
        </n-layout-sider>
        <n-layout-content
          ref="contentRef"
          content-style="padding: 12px;flex:1;padding-top:0 "
          :native-scrollbar="false"
          @scroll="handleScroll"
        >
          <div w-full>
            <n-spin :show="loading">
              <BaseInfo :ref="setRef" />
              <!-- 适用 -->
              <ApplicableProduct />
              <MachineInfo :ref="setRef" />
              <DisassembleMachinelInfo :ref="setRef" />
              <PackagingInfo :ref="setRef" />
              <PackagingAccesInfo :ref="setRef" />
              <MaterialPacking :ref="setRef" />
              <LoadingPlan :ref="setRef" />
              <Enclosure :ref="setRef" />
            </n-spin>
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </AppProvider>
</template>

<script setup>
import AppProvider from '~/src/components/AppProvider.vue'
import { computed, onBeforeMount, onUpdated, ref } from 'vue'
import { menuOptions } from './data'
import { batchExportExcel, batchImportExcel } from './api'
import { isArray, RES_SUCCESS_CODE } from './utils'
import { useAppStore } from './store'
import _ from 'lodash-es'

const { refreshPage } = useAppStore()

const navWrapper = ref([])
const contentRef = ref(null)
const activeValue = ref(1)
const loading = ref(false)
const fileInput = ref(null)

/** 滚动监听  */
const handleScroll = (e) => {
  const scrollY = e.target.scrollTop
  for (var i = 0; i < navWrapper.value.length; i++) {
    if (scrollY + 50 > navWrapper.value[i]?.$el.offsetTop - navWrapper.value[0].$el.clientHeight) {
      activeValue.value = i + 1
    }
  }
}

const setRef = (el) => {
  if (navWrapper.value.length === 8) {
    return
  }
  navWrapper.value.push(el)
}

/* 导航点击 */
const menuChange = (val) => {
  if (val === 1) {
    contentRef.value?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    return
  }
  activeValue.value = val
  contentRef.value?.scrollTo({
    top: navWrapper.value[val - 1]?.$el.offsetTop - navWrapper.value[0].$el.clientHeight,
    behavior: 'smooth',
  })
}
onBeforeMount(() => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  window.oid = urlParams.get('oid')
  window.isEdit = urlParams.get('isEdit') !== 'true'
})

const eidtState = computed(() => window.isEdit)

/* 批量导出 */
const batchExport = async () => {
  try {
    loading.value = true
    const res = await batchExportExcel({ oid: window.oid })
    if (res.code === RES_SUCCESS_CODE) {
      $message.success('导出成功')
      window.open(res?.data?.fileUrl)
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}
/* 批量导入 */
const batchImport = async () => {
  fileInput.value.click()
  // try {
  //   loading.value = true
  //   const res = await batchImportExcel({ oid: window.oid })
  //   if (res.code === RES_SUCCESS_CODE) {
  //     $message.success('导入成功')
  //     refreshPage()
  //   }
  // } catch (error) {
  //   console.log('error:', error)
  // } finally {
  //   loading.value = false
  // }
}

const save = async () => {
  let apiList = []
  try {
    navWrapper.value.forEach((item) => {
      if (item?.saveData) {
        apiList.push(item?.saveData)
      }
    })
    const res = await Promise.all(_.flatten(apiList.map((item) => item())))
    if (!res?.some((item) => item.code !== RES_SUCCESS_CODE)) {
      $message.success('保存成功！')
      refreshPage()
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
    apiList = []
  }
}

const handleFileChange = async (e) => {
  try {
    loading.value = true
    const fileData = e.target.files[0]
    const formData = new FormData()
    formData.append('oid', window.oid)
    formData.append('file', fileData)
    const res = await batchImportExcel(formData)
    if (res.code === RES_SUCCESS_CODE) {
      $message.success('导入成功')
      refreshPage()
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {})
</script>

<style lang="scss" scoped></style>
