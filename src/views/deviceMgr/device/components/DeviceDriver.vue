<template>
  <div class="zeus-product basics">
    <div class="content">
      <el-card class="card">
        <div slot="header" class="header">
          <span>{{ displayName }} ({{ name }})
            <span v-if="status === true">
              <svg-icon icon-class="online" />
            </span>
            <span v-else>
              <svg-icon icon-class="offline" />
            </span>
          </span>
          <div>
            <el-button
              v-show="editing"
              size="mini"
              style="background-color: #EFF4F9"
              round
              @click="cancel"
            >
              取消
            </el-button>
            <el-button
              v-show="editing"
              :loading="loading"
              type="primary"
              size="mini"
              round
              @click="submit"
            >
              确定
            </el-button>
            <el-button
              v-show="!editing"
              size="mini"
              round
              @click="handleEdit"
            >
              <svg-icon icon-class="dialog_edit" style="margin-right: 5px" />
              编辑
            </el-button>
          </div>

        </div>
        <div v-loading="loading" class="row">
          <el-form ref="form" :model="attr" inline :disabled="!editing" size="mini" label-position="top">
            <el-form-item
              v-for="(attribute) in attributeList"
              :key="attribute.id"
              :label="attribute.displayName"
              :rules="[{required:true,message:`${attribute.displayName}不能为空`}]"
              :prop="attribute.id"
            >
              <el-input v-model="attr[attribute.id]" clearable />
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { updateDriverInfoBatch } from '@/api/driverInfo'
export default {
  name: 'DriverConfig',
  components: {

  },
  props: {
    displayName: { type: String, default: '' },
    name: { type: String, default: '' },
    status: Boolean,
    attributeList: { type: Array, default: () => [] },
    deviceId: { type: String, required: true }

  },
  data: function() {
    return {
      editing: false,
      attr: {},
      loading: false
    }
  },
  created() {
    this.attributeList.forEach(item => {
      this.$set(this.attr, item.id, item.value)
    })
  },
  methods: {
    handleEdit() {
      this.attributeList.forEach(item => {
        if (item.defaultValue && !this.attr[item.id]) {
          this.attr[item.id] = item.defaultValue
        }
      })
      this.editing = true
    },
    cancel() {
      this.editing = false
      this.$refs.form.resetFields()
      this.attributeList.forEach(item => {
        this.attr[item.id] = item.value
      })
    },
    submit() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          this.loading = true
          try {
            const res = await updateDriverInfoBatch({
              deviceId: this.deviceId,
              attributeValue: this.attr
            })
            if (res && res.code == 200) {
              this.$message.success('驱动配置更新成功')
              this.editing = false
              this.$emit('update')
            } else {
              this.$message.error('驱动更新失败')
              this.cancel()
            }
          } finally {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.basics {
  display: flex;
  align-items: stretch;
  justify-content: space-between;

  .left {
    flex: 0 0 84px;
    background: #F9FBFD;
    border-radius: 4px;
    padding: 15px 19px;
  }

  .content {
    flex: 1;
    margin: 0 14px;

    .card {
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    .row {
      min-height: 64px;
      border-radius: 4px;
      background: #F9FBFD;
      border: 1px solid #EFF4F9;
      display: flex;
      align-items: flex-end;
      flex-wrap: wrap;
      margin-bottom: 6px;
      margin-left: 0px !important;
      margin-right: 0px !important;
      padding:10px

    }
  }
}
</style>
