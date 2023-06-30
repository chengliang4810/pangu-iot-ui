<template>
  <view>
    <!-- <el-row :gutter="20">
      <el-col :offset="1" span="6">
        <el-checkbox v-model="realTime" label="定时刷新" />
      </el-col>
      <el-col span="6" v-if="realTime">
        <el-select>
          <el-option label="2" value="2" />
          <el-option label="5" value="5" />
          <el-option label="10" value="10" />
          <el-option label="20" value="20" />
          <el-option label="30" value="30" />
        </el-select>
        秒刷新一次
      </el-col>
    </el-row> -->

    <avue-data-tabs :option="attributeValueOption"></avue-data-tabs>
    <pagination
      v-show="total > (queryParams.pageSize || 10)"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getDeviceAttribute"
    />
  </view>
</template>

<script setup name="DeviceSelect" lang="ts">
import { listDeviceAttribute } from '@/api/manager/deviceAttribute';
import { ComponentInternalInstance } from 'vue';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { iot_units, iot_attribute_type } = toRefs<any>(proxy?.useDict('iot_units', 'iot_attribute_type'));

// 组件参数
type Option = {
  deviceId: number | string,
  productId: number | string
}
const props = defineProps<Option>();

// 分页
const total = ref(0);
const queryParams = ref({
  pageNum: 1,
  pageSize: 10
});

// 动态卡片
const attributeValueOption = ref({
  span: 6,
  data: [] as any
});

// 实时开关
const realTime = ref(false);

// 获取设备属性
const getDeviceAttribute = async () => {
  const res = await listDeviceAttribute({
    deviceId: props.deviceId,
    productId: props.productId,
    pageNum: 1,
    pageSize: 10
  });
  total.value = res.total;
  res.rows.map((item: any) => {
    attributeValueOption.value.data.push({
      title: item.attributeName + '(' + item.identifier + ')',
      subtitle: iot_attribute_type.value.find((i: any) => i.value === item.attributeType)?.label,
      count: Math.floor(Math.random() * 10000) + '',
      allcount: iot_units.value.find((i: any) => i.value === item.unit)?.label || '未设置单位',
      text: item.createTime,
      color: 'rgb(64, 158, 255)',
    })
  })
}

onMounted(async () => {
  await getDeviceAttribute();
});
</script>
