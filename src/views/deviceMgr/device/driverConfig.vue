<!-- 驱动配置页面 -->
<template>
  <div v-show="!dialogVisible" class="info">
    <div v-for="item in driverConfig" :key="item.id" class="zeus-product basics">
      <div class="content">
        <el-card class="card">
          <div slot="header" class="header">
            <span>{{ item.displayName }} ({{ item.name }})
              <span v-if="item.status === true">
                <svg-icon icon-class="online" />
              </span>
              <span v-else>
                <svg-icon icon-class="offline" />
              </span>
            </span>
            <el-button size="mini" round @click="handleEditShow(item)">
              <svg-icon icon-class="dialog_edit" style="margin-right: 5px" />
              编辑
            </el-button>
          </div>
          <el-row :gutter="18" class="row">
            <el-col v-for="(attribute) in item.attributeList" :key="attribute.id" :span="6">
              <div class="info_i">
                <div class="con">{{ attribute.value || '-' }}</div>
                <div class="tit">{{ attribute.displayName }}</div>
              </div>
            </el-col>
          </el-row>
        </el-card></div>
    </div>
    <div v-if="dialogVisible">
      <FormTemplate :up="'驱动配置'" :state="'编辑配置信息'" :but-loading="butLoading" @submit="submit" @cancel="dialogVisible = false">
        <template v-slot:main>
          <deviceForm ref="deviceForm" v-model="dialogForm" :state="'编辑'" :product-list="productList" :device-group="deviceGroup" />
        </template>
      </FormTemplate>
    </div>
  </div>
</template>

<script>
import FormTemplate from '@/components/Slots/FormTemplate'
import deviceForm from '@/views/deviceMgr/device/deviceForm'

export default {
  name: 'DriverConfig',
  components: {
    deviceForm,
    FormTemplate
  },
  props: {
    infoData: {
      type: Object,
      default() {
        return {}
      }

    },
    driverConfig: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      // 搜索关键字
      keyword: '',
      dialogVisible: false,
      butLoading: false,
      dialogForm: {},
      rules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        productId: [
          { required: true, message: '请选择产品', trigger: 'change' }
        ]
      },
      productList: [],
      deviceGroup: [],
      dialogMap: false
    }
  },
  watch: {

  },
  created() {

  },
  methods: {
    /**
     * @description: 编辑表单页面
     */
    handleEditShow() {
      this.dialogVisible = true
    },
    search(e) {
      console.log(e)
    },
    submit() {
      if (this.$refs.deviceForm.validateForm()) {
        this.butLoading = true
        // updateDevice(this.dialogForm).then((res) => {
        //   if (res.code == 200) {
        //     this.$message({
        //       message: '修改成功',
        //       type: 'success'
        //     })
        //     this.dialogVisible = false
        //     this.$emit('updata')
        //   }
        //   this.butLoading = false
        // }).catch(() => {
        //   this.butLoading = false
        // })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
  .bm-view2 {
    width: 100%;
    height: 500px;
    background-color: #F6F7FA;
  }
  .no-key{
    margin-top: 180px;

    div{
      color: #36435c;
    }
  }
  .tips{
    width: 100%;
    height: 32px;
    line-height: 32px;
    background-color: #CDE5FF;
    color: #36435C;
    font-size: 12px;
    padding-left: 20px;

    .icon{
      color: #50A1FB;
      margin-right: 4px;
    }
  }

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
        .header{
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .el-button {
            padding: 3px 20px;
            border: 1px solid #EFF4F9;
            background: #EFF4F9;
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

        .info_i {
          padding: 15px 9px;
          width: 100%;

          .con {
            width: 100%;
            //text-overflow: ellipsis;
            //white-space: nowrap;
            //overflow: hidden;
            font-size: 13px;
            color: #242E42;
            font-weight: bold;
            margin-bottom: 5px;
            word-wrap:break-word;
          }

          .group-item {
            display: inline-block;
            background-color: #E3E9EF;
            padding: 4px 5px;
            margin-right: 5px;
            margin-bottom: 2px;
            margin-top: 2px;
            border-radius: 2px;
          }

          .show-map {
            font-size: 12px;
            color: #1A84F9;
          }

          .tit {
            font-size: 12px;
            color: #79879C;
          }
        }
      }
    }

    .right {
      flex: 0 0 62px;

      .el-button {
        padding: 5px 9px;
        border: 1px solid #EFF4F9;
        background: #EFF4F9;
      }

      .el-button:hover {
        border: 1px solid #CCD3DB;
        background: #E3E9EF;
      }
    }
  }
}
</style>
