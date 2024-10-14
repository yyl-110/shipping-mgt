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
          <n-button quaternary color="#fff" mr-10>一键保存</n-button>
          <n-button quaternary color="#fff" mr-10>批量导入</n-button>
          <n-button quaternary color="#fff">批量导出</n-button>
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
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </AppProvider>
</template>

<script setup>
import AppProvider from '~/src/components/AppProvider.vue'
import { onBeforeMount, ref } from 'vue'
import { menuOptions } from './data'

const navWrapper = ref([])
const contentRef = ref(null)
const activeValue = ref(1)

/** 滚动监听  */
const handleScroll = (e) => {
  const scrollY = e.target.scrollTop
  for (var i = 0; i < navWrapper.value.length; i++) {
    if (scrollY + 50 > navWrapper.value[i]?.$el.offsetTop) {
      activeValue.value = i + 1
    }
  }
}

const setRef = (el) => {
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
    top: navWrapper.value[val - 1]?.$el.offsetTop,
    behavior: 'smooth',
  })
}
onBeforeMount(() => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  window.oid = urlParams.get('oid')
})

onMounted(() => {})
</script>

<style lang="scss" scoped></style>
