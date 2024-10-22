import { defineStore } from 'pinia'
import { useDark } from '@vueuse/core'

const isDark = useDark()
export const useAppStore = defineStore('app', {
  state() {
    return {
      collapsed: false,
      isDark,
      refreshFlag: false, // 刷新整个页面
      totalCost: 0,
      materialCost: 0, // 包装材料总价
      accessoriesCost: 0, // 包装辅料总价
    }
  },
  actions: {
    switchCollapsed() {
      this.collapsed = !this.collapsed
    },
    setCollapsed(collapsed) {
      this.collapsed = collapsed
    },
    /** 设置暗黑模式 */
    setDark(isDark) {
      this.isDark = isDark
    },
    /** 切换/关闭 暗黑模式 */
    toggleDark() {
      this.isDark = !this.isDark
    },
    refreshPage() {
      this.refreshFlag++ // 更新全局状态
    },
    updateMaterial(val) {
      this.materialCost = val
    },
    updateAccessories(val) {
      this.accessoriesCost = val
    },
    calcCost() {
      try {
        this.totalCost = Number((this.materialCost + this.accessoriesCost).toFixed(3))
      } catch (error) {
        console.log('error:', error)
      }
    },
  },
})
