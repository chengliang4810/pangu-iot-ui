<!--列表页面表格组件内的按钮组件-->
<template>
  <div class="setting-buttons">
    <el-button
      v-for="(item, but_index) in buttonList"
      :key="but_index"
      slot="reference"
      type="text"
      class="setting-button"
      round
      size="mini"
      @click="handleClick(item.event)"
    >
      <svg-icon v-if="item.icon" :icon-class="item.icon" />
      {{ item.label }}
    </el-button>
  </div>
</template>

<script>
export default {
  inject: ['farther'],
  name: 'OperationButtons',
  props: {
    buttons: {
      type: Array,
      default() {
        return []
      }
    },
    dataId: {
      type: [Number, String],
      default() {
        return null
      }
    },
    index: {
      type: Number,
      default() {
        return null
      }
    },
    problemId: {
      type: Number,
      default() {
        return null
      }
    },
    status: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  computed: {
    buttonList() {
      const arr = []
      this.buttons.forEach((item) => {
        if (!item) return
        if (this.status === true && item.label !== '启用') {
          arr.push(item)
        }
        if (this.status === false && item.label !== '禁用') {
          arr.push(item)
        }
      })
      return arr
    }
  },
  created() {
    // console.log(this.buttons)
  },
  methods: {
    handleClick(eventName) {
      console.log('this.father---', this.father)
      this.farther[eventName](this.dataId)
    }
  }
}
</script>

