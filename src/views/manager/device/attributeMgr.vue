<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['manager:device:add']">新增</el-button>
          </el-col>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="设备主键" align="center" prop="id" v-if="false" />
        <el-table-column label="设备名称" align="center" prop="name">
          <template #default="scope">
            <el-button type="primary" @click="detailHandler(scope.row)" link>{{ scope.row.name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="设备编号" align="center" prop="code" />
        <el-table-column label="产品" align="center" prop="productId">
          <template #default="scope">
            <span>{{ getProduct(scope.row.productId)?.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备类型" prop="deviceType">
          <template #default=" scope ">
            <dict-tag :options="iot_device_type" :value="scope.row.deviceType" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="设备分组ID" align="center" prop="groupId" /> -->
        <el-table-column label="设备地址" align="center" prop="address" />
        <el-table-column label="启用状态" align="center" prop="status">
          <template #default=" scope ">
            <dict-tag :options=" iot_enable_status " :value=" scope.row.status " />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" min-width="100px" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="120px">
          <template #default=" scope ">
            <el-button link type="primary" v-if="scope.row.deviceType === 2" v-hasPermi=" ['manager:device:edit'] ">子设备(0)</el-button>
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi=" ['manager:device:edit'] "></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi=" ['manager:device:remove'] "></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show=" total > 0 "
        :total=" total "
        v-model:page=" queryParams.pageNum "
        v-model:limit=" queryParams.pageSize "
        @pagination=" getList "
      />
    </el-card>
  </div>
</template>

<script setup lang="ts" name="attributeMgr">
export interface attributeMgrProps {
  deviceId: string | number
  add?: boolean
  edit?: boolean
  delete?: boolean
}
const props = withDefaults(defineProps<attributeMgrProps>(), {
  add: true,
  edit: true,
  delete: true,
})

const dotStyle = computed(() => {
  // const backgroundColor = props.color ?? `var(--el-color-${props.type})`
  // const size = typeof props.size === 'string' ? props.size : `${props.size}px`
  return {  }
})
</script>
