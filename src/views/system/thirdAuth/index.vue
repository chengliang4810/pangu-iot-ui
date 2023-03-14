<!-- 三方授权页面 -->
<template>
  <div class="view">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>三方授权</template>
      <template v-slot:subhead>三方授权后，三方平台可以通过授权码获取本平台的API权限。</template>
    </ListHeadTemplate>
    <SearchForm :params="formParams" :columns="columns" :buttons="buttons" :batch-buttons="batchButtons" :selected="ids.length > 0" @search="search" @cancel="ids = []" />
    <BusinessTable
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :selection="true"
      :icon="$route.meta.icon24"
      @select="handleSelect"
      @switchChange="switchChange"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange" />
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="'700px'"
      :show-close="false"
      @closed="dialogForm.name = ''"
    >
      <div slot="title" class="dialog-title zeus-flex-between">
        <div class="left">
          <svg-icon icon-class="dialog_add" />
          创建三方授权
        </div>
        <div class="right">
          <svg-icon icon-class="dialog_close" class="closeicon" />
          <svg-icon icon-class="dialog_onclose" class="closeicon" @click="dialogVisible = false" />
        </div>
      </div>
      <div class="dialog-body">
        <el-form ref="dialogForm" :rules="rules" :model="dialogForm" label-width="80px" label-position="top" class="dialog-form">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dialogForm.name" size="mini" />
          </el-form-item>
          <el-form-item label="过期时间" prop="expirationTime">
            <el-date-picker
              v-model="dialogForm.expirationTime"
              size="mini"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择过期时间"
            />
            <div class="el-form-item-tips zeus-inline-block zeus-ml-15">
              <svg-icon icon-class="tips" class="icon" />不填则不会过期
            </div>
          </el-form-item>
          <el-form-item label="启用" prop="status">
            <el-switch
              v-model="dialogForm.status"
              :active-value="true"
              :inactive-value="false"
              active-text="启用"
              inactive-text="禁用"
              active-color="#55BC8A"
              inactive-color="#AB2F29"
            />
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input v-model="dialogForm.remark" type="textarea" rows="2" size="mini" />
          </el-form-item>
        </el-form>
      </div>
      <el-footer class="dialog-footer-btn">
        <el-button size="mini" round @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" round @click="submit">确 定</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import { getTokenPageList, createToken, resetToken, deleteToken } from '@/api/token'

export default {
  name: 'ThirdAuth',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    ListHeadTemplate,
    BusinessTable,
    SearchForm,
    Pagination
  },
  data() {
    return {
      formParams: [
        {
          componentName: 'InputTemplate',
          keyName: 'name',
          label: '名称'
        }
      ],
      tableData: [],
      loading: false,
      dialogVisible: false,
      state: '',
      total: 0,
      size: 10,
      page: 1,
      dialogForm: {
        name: '',
        expirationTime: null,
        status: true,
        remark: ''
      },
      buttons: [
        {
          type: 'primary',
          label: '创建',
          event: 'add'
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      columns: [
        {
          label: '名称',
          prop: 'name',
          show: true
        },
        {
          label: '状态',
          prop: 'status',
          status: true,
          show: true
        },
        {
          label: '过期时间',
          prop: 'expirationTime',
          show: true,
          placeholder: '永不过期'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          show: true
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 160,
          idName: 'id',
          buttons: [
            {
              label: '重置token',
              event: 'handleResetToken',
              icon: 'list_token'
            }
          ]
        }
      ],
      batchButtons: [
        {
          type: 'danger',
          label: '删除',
          event: 'delete'
        }
      ],
      ids: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    search() {
      this.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      getTokenPageList({ ...this.form, pageSize: this.size, pageNum: this.page }).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    handleSelect(selection) {
      this.ids = selection.map((i) => {
        return i.id
      })
    },
    switchChange(val) {
      console.log(val)
    },
    add() {
      this.state = '创建'
      this.dialogVisible = true
    },
    // 删除
    delete() {
      this.$confirm('是否确认删除选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteToken(this.ids).then(async(res) => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.ids = []
            // 删除后重新请求数据
            await this.getList()
          }
        })
      })
    },
    handleResetToken(checkId) {
      this.$confirm('确认生成新的token? 本授权之前的token将会失效', '生成token', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        console.log(this.tableData)
        // 表格数据中找到该数据
        const { id } = this.tableData.find((item) => item.id == checkId)

        // 请求重置Token值接口
        const { data, code, msg } = await resetToken(id)

        if (code !== 200) this.showErrorMessage(this, msg)

        // 重置成功后， 展示token
        this.showToken(data)
      })
    },
    // 错误信息窗口
    showErrorMessage(that, msg) {
      that.$message({
        message: msg,
        type: 'error'
      })
    },
    async submit() {
      // 表单校验
      const check = await this.$refs['dialogForm'].validate()
      if (!check) return
      const formData = {
        ...this.dialogForm
      }

      // 请求接口
      const { data, code, msg } = await createToken(formData)

      if (code !== 200) {
        this.$message({
          message: msg,
          type: 'error'
        })
        return
      }

      this.dialogVisible = false

      this.showToken(data)
    },
    showToken(token, flush = true) {
      this.$alert(`<h4>token: ${token}</h4><div class="el-form-item-tips"><svg-icon icon-class="tips" />请自行保存token，关闭本窗口后将无法再查看本token。</div>`, '生成token', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '已保存',
        callback: action => {
          // 重新请求数据
          if (flush) this.getList()
          // 复制到剪切板
          // this.$message({
          //   type: 'info',
          //   message: `复制成功`
          // })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.view {
  height: 100%;
}
</style>
