<template>
  <div class="p-2" v-if="checkDone">
    <!-- 产品基础信息 -->
    <el-card shadow="never">
      <template #header>
        <el-descriptions :title="product.name" border>
          <el-descriptions-item label="设备编号">{{ product.id }}</el-descriptions-item>
          <el-descriptions-item label="设备类型">
            <template v-for="dict in iot_device_type" :key="dict.value">
              <el-tag size="small" v-if="dict.value == product.type">{{ dict.label }}</el-tag>
            </template>
          </el-descriptions-item>
          <el-descriptions-item label="驱动">
            <template v-for="item in driverList" :key="item.id">
              <el-tag v-if="item.id ===  product.driverId" type="success">{{ item.displayName }}</el-tag>
            </template>
          </el-descriptions-item>
          <el-descriptions-item label="图标">
            <image-preview :src="product.icon" :width="50" :height="50" />
          </el-descriptions-item>
          <el-descriptions-item label="厂家">
            {{ product.manufacturer || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="型号">
            {{ product.model || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="备注"> {{ product.remark || '-' }}</el-descriptions-item>
        </el-descriptions>
      </template>

      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="属性管理" name="attributeMgr">
          <template v-slot:label>
            <div style="width: 100px; text-align: center;">属性管理</div>
          </template>
          <attributeMgr :productId="product.id"></attributeMgr>
        </el-tab-pane>
        <el-tab-pane label="功能管理" name="function">
          <template v-slot:label>
            <div style="width: 100px; text-align: center;">功能管理</div>
          </template>
          <functionMgr :productId="product.id"></functionMgr>
        </el-tab-pane>
        <!-- <el-tab-pane label="告警规则" name="alarm">Task</el-tab-pane> -->
        <el-tab-pane label="日志" name="log">Task</el-tab-pane>
        <el-tab-pane label="标签管理" name="tagMgr">Task</el-tab-pane>
        <el-tab-pane label="设备" name="childDevice">Task</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup name="ProductDetail" lang="ts">
import { treeDriver } from '@/api/manager/driver';
import { getProduct } from '@/api/manager/product';
import { DriverVO } from '@/api/manager/driver/types';
import { ProductVO } from '@/api/manager/product/types';
import { ComponentInternalInstance } from 'vue';

import attributeMgr from '@/views/manager/device/components/attributeMgr.vue';
import functionMgr from '@/views/manager/device/components/functionMgr.vue';
import router from '@/router';
const route = useRoute();

const driverList = ref<DriverVO[]>([]);

/**
 * 检查产品是否存在
 */
const product = ref<ProductVO>({} as ProductVO);
const checkDone = ref(false);
const checkProduct = async () => {
  const productId = route.params.id as string;
  if (!productId) {
    router.push({ path: '/404' });
    return
  }
  const res = await getProduct(productId);
  if (!res.data) {
    router.push({ path: '/404' });
    return;
  }else{
    product.value = res.data;
    checkDone.value = true;
  }
}
checkProduct();

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { iot_device_type } = toRefs<any>(proxy?.useDict('iot_device_type'));

const activeName = ref('attributeMgr')

/** 查询驱动列表 */
const getDriverList = async () => {
  const res = await treeDriver();
  driverList.value = res.data;
}

onMounted(() => {
  getDriverList()
});
</script>
