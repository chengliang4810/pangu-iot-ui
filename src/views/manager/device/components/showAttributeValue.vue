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

    <!-- <avue-data-tabs :option="attributeValueOption"></avue-data-tabs> -->

    <avue-data-display :option="attributeValueOption"></avue-data-display>
  </view>
</template>

<script setup name="DeviceSelect" lang="ts">
import { listDeviceAttributeByDeviceId } from '@/api/manager/deviceAttribute';
import { ComponentInternalInstance } from 'vue';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { iot_units, iot_attribute_type } = toRefs<any>(proxy?.useDict('iot_units', 'iot_attribute_type'));

// 组件参数
type Option = {
  deviceId: number | string,
  productId: number | string
}
const props = defineProps<Option>();

// 动态卡片
const attributeValueOption = ref({
  span: 6,
  data: [] as any
});

// 实时开关
const realTime = ref(false);

// 获取设备属性
const getDeviceAttribute = async () => {
  const res = await listDeviceAttributeByDeviceId(props.deviceId, true);
  res.data.map((item: any) => {
    console.log("item.value",item.value)
    attributeValueOption.value.data.push({
      title: item.attributeName + '(' + item.identifier + ')',
      // subtitle: iot_attribute_type.value.find((i: any) => i.value === item.attributeType)?.label,
      count: item.value || '-',
      decimals: 2,
      animation: false,
      // allcount: iot_units.value.find((i: any) => i.value === item.unit)?.label || '未设置单位',
      text: item.createTime,
      // color: 'rgb(64, 158, 255)',
    })
  })
}

onMounted(async () => {
  await getDeviceAttribute();
});
</script>
