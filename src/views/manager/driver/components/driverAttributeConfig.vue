<template>
  <div class="p-2" v-loading="loading">
    <el-form ref="formRef" :model="form" label-width="80px">
      <el-form-item
        v-for="(item, index) in driverConfigList"
        :label="item.displayName"
        :key="item.id"
        :prop="index + '.value'"
        :rules="{
            required: item.required != 0,
            message: item.displayName + '不能为空',
            trigger: 'blur',
          }"
      >
        <el-input v-model="form[index].value" :placeholder="'请输入' + item.displayName" :disabled="!editStatus" clearable />
      </el-form-item>
      <el-form-item>
        <el-button v-if="!editStatus" @click="changeEditStatusHandler(true)">编 辑</el-button>
        <el-button v-if="editStatus" :loading="buttonLoading" type="primary" @click="submitForm">确 认</el-button>
        <el-button v-if="editStatus" @click="changeEditStatusHandler(false)">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup name="DriverAttributeConfig" lang="ts">
import { batchAddDriverAttributeValue, treeDriverAttribute } from '@/api/manager/driverAttribute';
import { DriverAttributeVO, DriverAttributeValueForm } from '@/api/manager/driverAttribute/types';
import { treeDriverAttributeValue } from '@/api/manager/driverAttributeValue';
import { DriverAttributeValueVO } from '@/api/manager/driverAttributeValue/types';
import { getProduct } from '@/api/manager/product';
import { ProductVO } from '@/api/manager/product/types';
import { ComponentInternalInstance } from 'vue';
import { ElForm } from 'element-plus';

type PropsType = {
  productId: string | number,
  deviceId: string | number
}

const props = withDefaults(defineProps<PropsType>(),{
  productId: undefined,
  deviceId: undefined
});

// 产品信息
const product = ref<ProductVO>({} as ProductVO);
const getProductById = async (productId: string | number) => {
  const res = await getProduct(productId);
  product.value = res.data;
}

// 驱动配置
const driverConfigList = ref<DriverAttributeVO[]>([]);
const getDriverAttribute = async (driverId: string | number) => {
  const res = await treeDriverAttribute({driverId: driverId});
  driverConfigList.value = res.data;
  // 初始化表单默认值
  form.value = driverConfigList.value.map(item => {
    return {
      id: undefined,
      gatewayDeviceId: props.deviceId,
      driverAttributeId: item.id,
      value: undefined
    }
  });
}

// 驱动已配置值
const driverConfigValueList = ref<DriverAttributeValueVO[]>([]);
const getDriverConfigValue = async (gatewayDeviceId: string | number) => {
  const res = await treeDriverAttributeValue({gatewayDeviceId: gatewayDeviceId});
  driverConfigValueList.value = res.data;
  // 初始化表单默认值
  form.value.map(item => {
    const driverConfigValue = driverConfigValueList.value.find(driverConfigValue => driverConfigValue.driverAttributeId === item.driverAttributeId);
    item.id = driverConfigValue?.id
    item.value = driverConfigValue?.value
  });
}

const changeEditStatusHandler = (status: boolean) => {
  // 如果输入框的值为空则设置添加默认值
  if (status == true){
    form.value.map(item => {
      if (!item.value) {
        const driverConfig = driverConfigList.value.find(driverConfig => driverConfig.id === item.driverAttributeId);
        item.value = driverConfig?.defaultValue;
      }
    });
  } else {
    //
    form.value.map(item => {
      const driverConfigValue =  driverConfigValueList.value.find(driverConfigValue => driverConfigValue.driverAttributeId === item.driverAttributeId);
      item.value = driverConfigValue?.value;
    });
  }
  editStatus.value = status;
}

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const editStatus = ref(false);

const buttonLoading = ref(false);
const loading = ref(true);

const formRef = ref(ElForm);

const form = ref([] as Array<DriverAttributeValueForm>);
/** 表单重置 */
const reset = () => {
  formRef.value.resetFields();
}

const submitForm = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      await batchAddDriverAttributeValue(form.value).finally(() => buttonLoading.value = false);
      await getDriverConfigValue(props.deviceId);
      editStatus.value = false;
      proxy?.$modal.msgSuccess("配置成功");
      buttonLoading.value = false;
    }
  });
}

onMounted(async () => {
  loading.value = true;
  await getProductById(props.productId);
  await getDriverAttribute(product.value.driverId);
  await getDriverConfigValue(props.deviceId);
  loading.value = false;
});
</script>
