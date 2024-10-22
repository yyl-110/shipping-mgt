<template>
  <div class="appbox">
    <div v-if="type === 'default'">
      <div class="title" h-52 flex items-center>
        <div class="line" mr-8 h-18 w-4 bg-primary></div>
        <span text-16 font-bold text-hex-1d2129>{{ title }}</span>
        <slot name="title" />
      </div>
      <slot />
    </div>
    <n-collapse v-else-if="type === 'collapse'" mb-12 :default-expanded-names="['1']">
      <n-collapse-item name="1">
        <template #header>
          <div h-42 flex items-center>
            <span text-15 font-bold text-hex-1d2129>{{ title }}</span>
            <slot name="title" />
          </div>
        </template>
        <div px-10>
          <slot />
        </div>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'default',
  },
})
</script>

<style lang="scss" scoped>
.appbox {
  .title {
    border-bottom: 1px solid #eaeaea;
  }
}
</style>
