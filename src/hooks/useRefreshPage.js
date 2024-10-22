import { storeToRefs } from 'pinia'
import { useAppStore } from '../store'
import { watch } from 'vue'

export default function (fn) {
  const appStore = useAppStore()
  const { refreshFlag } = storeToRefs(appStore)

  /* 全局状态-组件统一刷新 */
  watch(refreshFlag, () => {
    fn()
  })
}
