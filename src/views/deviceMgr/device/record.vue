<!-- 日志页面 -->
<template>
  <div class="record">
    <div class="search zeus-pl-20">
      <div>
        <div class="zeus-right radio">
          <div v-for="(item, index) in radioList" :key="index" class="radio-button" :class="form.logType === item ? 'activity' :''" @click="changeRadio(item)">
            {{ item }}
          </div>
        </div>
      </div>
      <div style="flex: 1">
        <SearchForm :params="formParams" :columns="columns" @search="search" />
      </div>
    </div>
    <el-table
      v-if="form.logType === '告警日志'"
      v-loading="loading"
      :data="tableData"
      style="width: 100%;padding: 0 12px 12px 12px;"
      :height="'calc(100% - 242px)'"
      class="table"
    >
      <el-table-column v-for="(item, index) in columns" :key="index" :label="item.label">
        <template slot-scope="scope">
          <span v-if="item.prop === 'buttons'" class="setting-buttons">
            <el-button
              v-if="scope.row.acknowledgedStr === '未确认' && scope.row.statusStr !== '已解决'"
              type="text"
              class="setting-button"
              round
              size="mini"
              @click="affirm(scope.row.eventId)"
            >
              <svg-icon icon-class="list_affirm" />
              确认
            </el-button>
            <el-button
              v-if="scope.row.statusStr === '未解决'"
              type="text"
              class="setting-button"
              round
              size="mini"
              @click="solve(scope.row.eventId)"
            >
              <svg-icon icon-class="list_affirm" />
              解决
            </el-button>
          </span>
          <span v-else-if="item.prop === 'deviceName'" class="event" @click="detail(scope.row.deviceId)">
            {{ scope.row[item.prop] ? scope.row[item.prop] : '-' }}
          </span>
          <span v-else-if="item.prop === 'severity'">
            <dict-tag :options="dict.type.event_level" :value="scope.row.severity" />
          </span>
          <span v-else>
            {{ scope.row[item.prop] ? scope.row[item.prop] : '-' }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <BusinessTable
      v-else
      :table-data="tableData"
      :columns="columns2"
      :loading="loading"
      :h="'calc(100% - 115px)'"
      :icon="$route.meta.icon24"
    />
    <Pagination :total="total" :size="size" :current-page="page" @handleCurrentChange="handleCurrentChange" />
  </div>
</template>

<script>
import BusinessTable from '@/components/Basics/BusinessTable'
import SearchForm from '@/components/Basics/SearchForm'
import Pagination from '@/components/Basics/Pagination'
import { getLogByPage } from '@/api/deviceMgr'
import { acknowledgement, getAlarmByPage, resolve } from '@/api/alarm'

export default {
  dicts: ['event_level', 'service_trigger_type'],
  name: 'Record',
  provide() {
    return {
      farther: this
    }
  },
  components: {
    BusinessTable,
    SearchForm,
    Pagination
  },
  data() {
    return {
      formParams: [
        {
          componentName: 'DateTimePickerTemplate',
          keyName: 'time',
          label: '触发时间'
        }
      ],
      radioList: ['告警日志', '功能日志'],
      form: {
        logType: '告警日志',
        time: []
      },
      tableData: [],
      loading: false,
      total: 0,
      size: 10,
      page: 1,
      columns: [
        {
          label: '触发时间',
          prop: 'clock',
          show: true
        },
        {
          label: '解决时间',
          prop: 'rclock',
          show: true
        },
        {
          label: '告警级别',
          prop: 'severity',
          propDict: 'event_level',
          show: true
        },
        {
          label: '内容',
          prop: 'name',
          show: true
        },
        {
          label: '解决状态',
          prop: 'statusStr',
          show: true
        },
        {
          label: '确认状态',
          prop: 'acknowledgedStr',
          show: true
        },
        {
          label: '',
          prop: 'buttons',
          show: true,
          width: 160
        }
      ],
      columns2: [
        {
          label: '执行类型',
          prop: 'executeType',
          propDict: 'service_trigger_type',
          show: true
        },
        {
          label: '触发时间',
          prop: 'createTime',
          show: true
        },
        {
          label: '功能名称',
          prop: 'serviceName',
          show: true
        },
        {
          label: '输入参数',
          prop: 'param',
          show: true
        },
        {
          label: '状态',
          prop: 'executeStatus',
          propEvent: 'executeStatus',
          show: true
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    executeTypeName(item) {
      // 0手动触发  1场景触发
      return item == 0 ? '手动触发 ' : '场景触发'
    },
    executeStatus(item) {
      // 0手动触发  1场景触发
      return item == 0 ? '失败 ' : '成功'
    },
    search() {
      this.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      if (this.form.logType === '告警日志') {
        if (this.form.time && this.form.time.length) {
          this.form.timeFrom = this.form.time[0] / 1000
          this.form.timeTill = this.form.time[1] / 1000
        } else {
          this.form.timeFrom = ''
          this.form.timeTill = ''
        }
        getAlarmByPage({ ...this.form, pageSize: this.size, pageNum: this.page, deviceId: this.$route.query.id }).then((res) => {
          this.loading = false
          if (res.code == 200) {
            res.data.rows.map((i) => {
              if (i.rClock == '0') {
                i.rClock = '-'
              }
              if (i.status) {
                i.statusName = i.status
                this.$delete(i, 'status')
              }
              return i
            })
            this.tableData = res.data.rows
            this.total = res.data.total
          }
        }).catch(() => {
          this.loading = false
        })
      } else {
        if (this.form.time && this.form.time.length) {
          this.form.timeFrom = this.form.time[0]
          this.form.timeTill = this.form.time[1]
        } else {
          this.form.timeFrom = ''
          this.form.timeTill = ''
        }
        getLogByPage({ ...this.form, pageSize: this.size, pageNum: this.page, deviceId: this.$route.query.id }).then((res) => {
          this.loading = false
          if (res.code == 200) {
            this.tableData = res.data.rows
            this.total = res.data.total
          }
        }).catch(() => {
          this.loading = false
        })
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    changeRadio(val) {
      this.form.logType = val
      this.search()
    },
    /* 解决 */
    solve(eventId) {
      // 确认框
      this.$confirm('是否确认并解决该告警?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const i = this.tableData.find((item) => {
          return item.eventId === eventId
        })
        if (i.statusName === '已解决') {
          this.$message({
            message: '当前记录已解决,不可重复操作',
            type: 'warning'
          })
          return false
        }
        resolve({ eventId }).then((res) => {
          if (res.code == '200') {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getList()
          }
        })
      })
    },
    /* 确认 */
    affirm(eventId) {
      const i = this.tableData.find((item) => {
        return item.eventId === eventId
      })
      if (i.acknowledged === '已确认') {
        this.$message({
          message: '当前记录已确认,不可重复操作',
          type: 'warning'
        })
        return false
      }
      acknowledgement({ eventId }).then((res) => {
        if (res.code == '200') {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getList()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.record{
  height: 100%;
}
.search{
  background-color: #F9FBFD;
  display: flex;
  align-items: center;
}
.radio {
  width: 214px;
  height: 33px;
  line-height: 28px;
  padding: 2px;
  border-radius: 25px;
  border: 1px #CCD3DB solid;
  display: flex;

  .radio-button {
    flex: 1;
    text-align: center;
    font-size: 12px;
    color: #5F708A;
    cursor: pointer;
  }

  .activity {
    background-color: #36435C;
    color: #fff;
    border-radius: 25px;
  }

}
</style>
