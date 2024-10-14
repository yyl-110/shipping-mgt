import { NInput, NInputNumber } from 'naive-ui'
import { defineComponent } from 'vue'

export const ShowOrEdit = defineComponent({
  props: {
    value: [String, Number],
    onUpdateValue: [Function, Array],
    type: {
      type: String,
      default: 'text',
    },
  },
  setup(props) {
    const isEdit = ref(false)
    const inputRef = ref(null)
    const inputValue = ref(props.value)
    function handleOnClick() {
      isEdit.value = true
      nextTick(() => {
        inputRef.value.focus()
      })
    }
    function handleChange() {
      props.onUpdateValue(inputValue.value)
      isEdit.value = false
    }
    return () =>
      h(
        'div',
        {
          style: 'min-height: 22px',
          onClick: handleOnClick,
        },
        isEdit.value
          ? props.type === 'text'
            ? h(NInput, {
                ref: inputRef,
                value: inputValue.value,
                onUpdateValue: (v) => {
                  inputValue.value = v
                },
                onChange: handleChange,
                onBlur: handleChange,
              })
            : h(NInputNumber, {
                ref: inputRef,
                value: inputValue.value,
                onUpdateValue: (v) => {
                  inputValue.value = v
                },
                onChange: handleChange,
                onBlur: handleChange,
              })
          : props.value
      )
  },
})
