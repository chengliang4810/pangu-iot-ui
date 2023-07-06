<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
            <el-form-item label="属性名称" prop="attributeName">
              <el-input v-model="queryParams.attributeName" placeholder="请输入属性名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="标识符" prop="identifier">
              <el-input v-model="queryParams.identifier" placeholder="请输入标识符" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <el-col class="top-right-btn" :span="1.5" v-if="props.add">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['manager:deviceAttribute:add']">新增</el-button>
          </el-col>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="deviceAttributeList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" v-if="false" />
        <el-table-column label="属性名称" align="center" prop="attributeName" />
        <el-table-column label="标识符" align="center" prop="identifier" />
        <el-table-column label="属性类型" align="center" prop="attributeType">
          <template #default="scope">
            <dict-tag :options="iot_attribute_type" :value="scope.row.attributeType" />
          </template>
        </el-table-column>
        <el-table-column label="属性来源" align="center" :prop="deviceId">
          <template #default="scope">
            <span>{{ scope.row.deviceId == 0 ? '产品': '设备' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位" align="center" prop="unit">
          <template #default="scope">
            <dict-tag :options="iot_units" :value="scope.row.unit" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button
              v-if="deviceId != 0 && driverList.length > 0"
              link
              type="primary"
              icon="Edit"
              @click="handlePointConfig(scope.row)"
              v-hasPermi="['manager:deviceAttribute:edit']"
              >采集配置
            </el-button>
            <el-tooltip v-if="props.edit" content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manager:deviceAttribute:edit']"></el-button>
            </el-tooltip>
            <el-tooltip v-if="props.delete" content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['manager:deviceAttribute:remove']"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > (queryParams.pageSize || 10)"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
    <!-- 添加或修改设备属性对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="deviceAttributeFormRef" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="产品ID" prop="productId">
          <el-input v-model="form.productId" placeholder="请输入产品ID" />
        </el-form-item>
        <el-form-item label="设备编号" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备编号" />
        </el-form-item> -->
        <el-form-item label="属性名称" prop="attributeName">
          <el-input v-model="form.attributeName" placeholder="请输入属性名称" />
        </el-form-item>
        <el-form-item label="标识符" prop="identifier">
          <el-input v-model="form.identifier" placeholder="请输入标识符" />
        </el-form-item>
        <el-form-item label="属性类型" prop="attributeType">
          <el-select v-model="form.attributeType" placeholder="请选择属性类型" style="width: 100%;">
            <el-option v-for="dict in iot_attribute_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select v-model="form.unit" placeholder="请选择单位" style="width: 100%;">
            <el-option v-for="dict in iot_units" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="数据预处理代码" prop="pretreatmentScript">
          <el-input v-model="form.pretreatmentScript" type="textarea" placeholder="请输入内容" />
        </el-form-item> -->
        <!-- <el-form-item label="值映射ID" prop="valueMapId">
          <el-select v-model="form.valueMapId" placeholder="请选择值映射ID">
            <el-option v-for="dict in iot_units" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :title="pointDialog.title" v-loading="configFormLoading" v-model="pointDialog.visible" width="500px" append-to-body>
      <el-form ref="pointFormRef" :model="pointForm" label-width="80px">
        <el-form-item label="驱动" prop="driverId" v-if="driverList.length > 1">
          <el-select v-model="pointForm.driverId" placeholder="请选择驱动" style="width: 100%;" @change="driverChangeHandler">
            <el-option v-for="item in driverList" :key="item.id" :label="item.displayName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-for="(item, index) in pointAttributes"
          :label="item.displayName"
          :key="item.id"
          :prop="'pointAttributeConfig.'+ index +'.value'"
          :rules="{
            required: item.required != 0,
            message: item.displayName + '不能为空',
            trigger: 'blur',
          }"
        >
          <el-input v-model="pointForm.pointAttributeConfig[index].value" :placeholder="'请输入' + item.displayName + ', 如：' + item.defaultValue" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitPointForm">确 定</el-button>
          <el-button @click="pointConfigCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    {{ pointForm }}
  </div>
</template>

<script setup lang="ts" name="attributeMgr">
import { listDeviceAttribute, getDeviceAttribute, delDeviceAttribute, addDeviceAttribute, updateDeviceAttribute } from '@/api/manager/deviceAttribute';
import { DeviceAttributeVO, DeviceAttributeQuery, DeviceAttributeForm } from '@/api/manager/deviceAttribute/types';
import { treePointAttribute,  } from '@/api/manager/pointAttribute';
import { PointAttributeVO } from '@/api/manager/pointAttribute/types';
import { treePointAttributeValue } from '@/api/manager/pointAttributeValue';
import { PointAttributeValueBatchForm, PointAttributeValueVO } from '@/api/manager/pointAttributeValue/types';
import { ComponentInternalInstance } from 'vue';
import { ElForm } from 'element-plus';
import { treeParentDeviceDriver,  } from '@/api/manager/driver';
import { DriverVO } from '@/api/manager/driver/types'

export interface attributeMgrProps {
  productId: string | number
  deviceId?: string | number
  add?: boolean
  edit?: boolean
  delete?: boolean,
}

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { iot_units, iot_attribute_type } = toRefs<any>(proxy?.useDict('iot_units', 'iot_attribute_type'));

const props = withDefaults(defineProps<attributeMgrProps>(), {
  add: true,
  edit: true,
  delete: true,
  deviceId: 0,
})

const deviceAttributeList = ref<DeviceAttributeVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const configFormLoading = ref(false);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref(ElForm);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const pointDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: DeviceAttributeForm = {
  id: undefined,
  productId: props.productId,
  deviceId: props.deviceId,
  attributeName: undefined,
  identifier: undefined,
  attributeType: undefined,
  unit: undefined,
  pretreatmentScript: undefined,
  valueMapId: undefined,
  remark: undefined
}
const data = reactive<PageData<DeviceAttributeForm, DeviceAttributeQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceId: props.deviceId,
    productId: props.productId,
    attributeName: undefined,
    identifier: undefined,
  },
  rules: {
    id: [
      { required: true, message: "主键不能为空", trigger: "blur" }
    ],
    attributeName: [
      { required: true, message: "属性名称不能为空", trigger: "blur" }
    ],
    identifier: [
      { required: true, message: "标识符不能为空", trigger: "blur" }
    ],
    attributeType: [
      { required: true, message: "属性类型不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询设备属性列表 */
const getList = async () => {
  loading.value = true;
  const res = await listDeviceAttribute(queryParams.value);
  deviceAttributeList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 取消按钮 */
const pointConfigCancel = () => {
  // reset();
  pointDialog.visible = false;
}


/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  pointFormRef.value.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: DeviceAttributeVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  dialog.visible = true;
  dialog.title = "添加设备属性";
  nextTick(() => {
    reset();
  });
}

/** 修改按钮操作 */
const handleUpdate = (row?: DeviceAttributeVO) => {
  loading.value = true
  dialog.visible = true;
  dialog.title = "修改设备属性";
  nextTick(async () => {
    reset();
    const _id = row?.id || ids.value[0]
    const res = await getDeviceAttribute(_id);
    loading.value = false;
    Object.assign(form.value, res.data);
  });
}

/** 提交按钮 */
const submitForm = () => {
  pointFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateDeviceAttribute(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addDeviceAttribute(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: DeviceAttributeVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除设备属性编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delDeviceAttribute(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/**
 *  属性点位配置
 * @param row
 */
 const handlePointConfig = async (row?: DeviceAttributeVO) => {
  pointDialog.visible = true;
  pointDialog.title = `[${row?.attributeName}] 采集配置`;
  pointForm.value.deviceAttributeId = row?.id;
  await loadPointAttributeValue();
  nextTick(() => {
    reset();
  });
}


const driverList = ref<DriverVO[]>([]);
const getParendDeviceDriver = async () => {
  if (props.deviceId == 0 || props.deviceId == undefined) return;
  const res = await treeParentDeviceDriver(props.deviceId);
  driverList.value = res.data;
}


// 采集配置表单
const pointForm = ref<PointAttributeValueBatchForm   & {driverId?:string | number}>({pointAttributeConfig: [], deviceId: props.deviceId});
const pointFormRef = ref(ElForm);
const pointAttributes = ref([] as Array<PointAttributeVO>);
const initPointForm = async () => {
  if (driverList.value.length == 0) return;
  // 默认加载第一个驱动的采集配置
  pointForm.value.driverId = driverList.value[0].id;
  await driverChangeHandler()
}

/**
 * 加载点位属性值
 */
const pointAttributeValueList = ref([] as Array<PointAttributeValueVO>);
const loadPointAttributeValue = async () => {
  if (pointForm.value.deviceAttributeId == undefined) return;
  const res = await treePointAttributeValue({deviceAttributeId: pointForm.value.deviceAttributeId, deviceId: props.deviceId});
  pointAttributeValueList.value = res.data;
}

/**
 * 驱动选择事件
 * 重新加载采集配置
 */
const driverChangeHandler = async () => {
  configFormLoading.value = true;
  pointForm.value.pointAttributeConfig = [];
  const res = await treePointAttribute({driverId: pointForm.value.driverId});
  await loadPointAttributeValue();
  pointAttributes.value = res.data;

  pointAttributes.value.forEach(item => {
    const pointAttributeValue = pointAttributeValueList.value.find(value => value.pointAttributeId == item.id);
    pointForm.value.pointAttributeConfig?.push({
    attributeId: item.id,
    value: pointAttributeValue?.value || item.defaultValue
  })
  configFormLoading.value = false;
});
}

/** 提交按钮 */
const submitPointForm = () => {
  pointFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      await proxy?.$modal.msgSuccess("修改成功");
      pointDialog.visible = false;
      console.log(pointForm.value);
    }
  });
}

onMounted(async () => {
  loading.value = true;
  await getList();
  await getParendDeviceDriver();
  await initPointForm();
  loading.value = false;
});
</script>
