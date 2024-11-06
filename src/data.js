export const menuOptions = [
  {
    label: '发运基本信息',
    key: 1,
  },
  {
    label: '整机信息',
    key: 2,
  },
  {
    label: '拆机信息',
    key: 3,
  },
  {
    label: '包装材料信息',
    key: 4,
  },
  {
    label: '包装辅材信息',
    key: 5,
  },
  {
    label: '物料装箱明细',
    key: 6,
  },
  {
    label: '装载方案',
    key: 7,
  },
  {
    label: '附件',
    key: 8,
  },
]

export const defaultBtn = [
  { label: '新增', icon: 'addBtn', key: 1 },
  { label: '删除', icon: 'del', key: 2 },
  { label: '保存', icon: '', key: 3 },
  { label: '刷新', icon: 'icon_resetting', key: 4 },
]
/* 发运部件按钮 */
export const shippingBtn = [
  { label: '编辑', icon: 'edit', key: 1 },
  { label: '删除', icon: 'del', key: 2 },
  { label: '保存', icon: '', key: 3 },
  { label: '刷新', icon: 'icon_resetting', key: 4 },
]

export const DisassembleMachinelInfoColumnsArr = [
  {
    width: 120,
    type: 'text',
    key: 'materialNumber',
    label: h('div', {}, [h('span', { class: 'text-red' }, '*'), '物料编码']),
  },
  { width: 120, type: 'text', key: 'materialDesc', label: '物料描述' },
  { width: 120, type: 'number', key: 'productLength', label: '产品长(mm)' },
  { width: 120, type: 'number', key: 'productWidth', label: '产品宽(mm)' },
  { width: 120, type: 'number', key: 'productHeight', label: '产品高(mm)' },
  { width: 120, type: 'number', key: 'productSingleWeight', label: '产品单重(kg)' },
  { width: 120, type: 'number', key: 'productWeight', label: '总净重(kg)' },
  { width: 120, type: 'text', key: 'packingType', label: '包装类型' },
  { width: 120, type: 'number', key: 'packingLength', label: '包装长(mm)' },
  { width: 120, type: 'number', key: 'packingWidth', label: '包装宽(mm)' },
  { width: 120, type: 'number', key: 'packingHeight', label: '包装高(mm)' },
  { width: 120, type: 'number', key: 'packingWeight', label: '包装重量(kg)' },
  { width: 120, type: 'number', key: 'grossWeight', label: '毛重(kg)' },
]
