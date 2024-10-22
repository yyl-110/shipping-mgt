<template>
  <app-box title="附件（装箱方案）">
    <template #title>
      <n-button
        type="primary"
        ml-40
        size="small"
        :loading="uploadLoading"
        :disabled="isEdit"
        @click="upload($event)"
      >
        <template #icon>
          <the-icon icon="upload" :size="20" type="custom" />
        </template>
        点击上传
      </n-button>
      <input ref="fileInput" hidden type="file" @change="handleFileChange" />
    </template>
    <div class="tableWrap" mt-16 px-12 pb-20>
      <n-data-table
        :columns="columns"
        :data="tableData"
        :pagination="false"
        :loading="loading"
        :row-key="rowKey"
        :scroll-x="1200"
        :max-height="150"
        :min-height="100"
      />
    </div>
  </app-box>
</template>

<script setup>
import { NButton, NIcon } from 'naive-ui'
import SvgIcon from '@/components/icon/SvgIcon.vue'

import { onMounted } from 'vue'
import { getAttachments, removeAttachment, uploadFile } from '../api'
import { RES_SUCCESS_CODE } from '../utils'
import useRefreshPage from '../hooks/useRefreshPage'
import useHandle from '../hooks/useHandle'
const loading = ref(false)
const tableData = ref([])
const fileInput = ref(null)
const uploadLoading = ref(false)

const { handleDelete } = useHandle()

const isEdit = computed(() => window.isEdit)

const rowKey = (row) => row.attachmentId

const columns = [
  {
    title: '序号',
    key: 'no',
    width: '100',
    align: 'center',
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: '文件名',
    key: 'attachmentName',
  },
  {
    title: '附件说明',
    key: 'attachmentDesc',
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    render(row, inx) {
      return h(
        NButton,
        {
          text: true,
          onClick: () => del(row),
          class: ' w-30 h-30',
        },
        {
          default: () =>
            h(
              NIcon,
              { size: 16, color: '#1890FF' },
              { default: () => h(SvgIcon, { icon: 'del' }) }
            ),
        }
      )
    },
  },
]

const fetchData = async () => {
  try {
    loading.value = true
    const res = await getAttachments({ oid: window.oid })
    if (res?.code === RES_SUCCESS_CODE) {
      tableData.value = res.data
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}
const upload = (e) => {
  e.stopPropagation()
  fileInput.value.click()
}

const handleFileChange = async (e) => {
  try {
    uploadLoading.value = true
    const fileData = e.target.files[0]
    const formData = new FormData()
    formData.append('oid', window.oid)
    formData.append('file', fileData)
    const res = await uploadFile(formData)
    if (res.code === RES_SUCCESS_CODE) {
      $message.success('上传成功')
      fetchData()
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    uploadLoading.value = false
  }
}

const del = async (row) => {
  try {
    await handleDelete(
      removeAttachment,
      { oid: window.oid, attachmentId: row?.attachmentId },
      row.attachmentName
    )
    fetchData()
  } catch (error) {
    console.log('error:', error)
  }
}

onMounted(() => {
  fetchData()
})
useRefreshPage(fetchData)
</script>

<style lang="scss" scoped></style>
