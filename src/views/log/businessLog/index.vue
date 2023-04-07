<!-- 操作日志页面 -->
<template>
  <div class="business-log">
    <ListHeadTemplate>
      <template v-slot:logo>
        <svg-icon :icon-class="$route.meta.icon48" style="font-size: 48px" />
      </template>
      <template v-slot:title>操作日志</template>
      <template v-slot:subhead />
    </ListHeadTemplate>
    <SearchForm :params="formParams" @search="search" />
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      size="small"
      :height="'calc(100% - 242px)'"
      class="table"
    >
      <el-table-column width="48">
        <template>
          <svg-icon :icon-class="$route.meta.icon24" style="font-size: 24px" />
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in columns" :key="index" :label="item.label">
        <template slot-scope="scope">
          <span v-if="item.prop === 'message'">
            <el-button v-clipboard:copy="scope.row[item.prop]" v-clipboard:success="onCopy" v-clipboard:error="onError" type="text" class="copy">
              <svg-icon icon-class="copy" />
            </el-button>
            <el-tooltip v-if="scope.row[item.prop]" effect="dark" :content="scope.row[item.prop]" placement="left" class="zeus-inline-block">
              <span class="massage zeus-inline-block">
                {{ scope.row[item.prop] }}</span>
            </el-tooltip>
            <span v-else class="massage zeus-inline-block">-</span>
          </span>
          <span v-else-if="item.prop === 'status'">
            <el-tag v-if="scope.row[item.prop] == 0" type="success">成功</el-tag>
            <el-tag v-else type="danger">失败</el-tag>
          </span>
          <span v-else>
            {{ scope.row[item.prop] ? scope.row[item.prop] : '-' }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" :size="form.maxRow" :current-page="form.page" @handleCurrentChange="handleCurrentChange" />
  </div>
</template>

<script>
import ListHeadTemplate from '@/components/Slots/ListHeadTemplate'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import { getLogList } from '@/api/log'

export default {
  provide() {
    return {
      farther: this
    }
  },
  name: 'BusinessLog',
  components: {
    ListHeadTemplate,
    SearchForm,
    Pagination
  },
  data() {
    return {
      form: {
        logName: '',
        logType: '',
        beginTime: '',
        endTime: '',
        time: [],
        pageSize: 20,
        pageNum: 1
      },
      tableData: [],
      loading: false,
      total: 0,
      columns: [
        {
          label: '操作时间',
          prop: 'operTime',
          show: true
        },
        {
          label: '操作人',
          prop: 'operName',
          show: true
        },
        {
          label: 'IP地址',
          prop: 'operIp',
          show: true
        },
        {
          label: '类型',
          prop: 'requestMethod',
          show: true
        },
        {
          label: '日志名称',
          prop: 'title',
          show: true
        },

        {
          label: '状态',
          prop: 'status',
          show: true
        }
      ],
      formParams: [
        {
          componentName: 'DateTimePickerTemplate',
          keyName: 'time'
        },
        {
          componentName: 'InputTemplate',
          keyName: 'logName	',
          label: '日志名称'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    search() {
      this.form.page = 1
      if (this.form.time && this.form.time.length) {
        this.form.beginTime = this.form.time[0]
        this.form.endTime = this.form.time[1]
      } else {
        this.form.beginTime = ''
        this.form.endTime = ''
      }
      this.getList()
    },
    getList() {
      this.loading = true
      getLogList(this.form).then((res) => {
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
      this.form.pageNum = val
      this.getList()
    },
    onCopy() {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    onError() {
      this.$message.error('复制失败,请重试')
    }
  }
}
</script>
<style lang="scss" scoped>
.business-log{
  height: 100%;
}
.table{
  padding: 0 12px;
  font-size: 12px;
}
.massage{
  width: 200px!important;
  margin-left: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
.copy{
  cursor: pointer;
}
</style>
