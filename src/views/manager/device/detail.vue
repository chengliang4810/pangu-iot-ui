<template>
  <div class="p-2" v-if="checkDone">
    <!-- 设备基础信息 -->
    <el-card shadow="never">
      <template #header>
        <el-descriptions :title="device.name" border>
          <el-descriptions-item label="设备编号">{{ device.code }}</el-descriptions-item>
          <el-descriptions-item label="设备类型">
            <template v-for="dict in iot_device_type" :key="dict.value">
              <el-tag size="small" v-if="dict.value == device.deviceType">{{ dict.label }}</el-tag>
            </template>
          </el-descriptions-item>
          <el-descriptions-item label="所属产品">{{getProduct(device.productId)?.name}}</el-descriptions-item>
          <el-descriptions-item label="设备地址">
            {{ device.address || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="坐标">
            {{ device.position || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag size="small" v-if=" device.status == 1">启用</el-tag>
            <el-tag size="small" type="error" v-else>禁用</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="备注"> {{ device.remark || '-' }}</el-descriptions-item>
        </el-descriptions>
      </template>

      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane name="attribute">
          <template v-slot:label>
            <div style="width: 100px; text-align: center;">属性222</div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="属性管理" name="attributeMgr"></el-tab-pane>
        <el-tab-pane label="功能管理" name="function">Role</el-tab-pane>
        <!-- <el-tab-pane label="告警规则" name="alarm">Task</el-tab-pane> -->
        <el-tab-pane label="日志" name="log">Task</el-tab-pane>
        <el-tab-pane label="标签管理" name="tagMgr">Task</el-tab-pane>
        <el-tab-pane label="驱动配置" v-if="device.deviceType === 2" name="driverConfig">Task</el-tab-pane>
        <el-tab-pane label="子设备" v-if="device.deviceType === 2" name="childDevice">Task</el-tab-pane>
      </el-tabs>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['manager:device:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['manager:device:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['manager:device:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['manager:device:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
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
        <el-table-column label="坐标" align="center" prop="position" />
        <el-table-column label="启用状态" align="center" prop="status">
          <template #default=" scope ">
            <dict-tag :options=" iot_enable_status " :value=" scope.row.status " />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="描述" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
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
    <!-- 添加或修改设备对话框 -->
    <el-dialog :title="dialog.title " v-model="dialog.visible " width="500px" append-to-body>
      <el-form ref="deviceFormRef" :model=" form " :rules=" rules " label-width="80px">
        <!-- <el-form-item label="设备分组ID" prop="groupId">
          <el-input v-model="form.groupId" placeholder="请输入设备分组ID" />
        </el-form-item> -->
        <el-form-item label="设备编号" prop="code">
          <el-input v-model=" form.code " placeholder="请输入设备编号" />
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
          <el-input v-model=" form.name " placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="产品" prop="product">
          <el-select v-model=" form.productId " placeholder="请选择产品" clearable style="width:100%">
            <el-option v-for="item in productTree" :key=" item.id " :label=" item.name " :value=" item.id " />
          </el-select>
        </el-form-item>
        <el-form-item label="设备地址" prop="address">
          <el-input v-model=" form.address " placeholder="请输入设备地址" />
        </el-form-item>
        <el-form-item label="地址坐标" prop="position">
          <el-input v-model=" form.position " placeholder="请输入地址坐标" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model=" form.status ">
            <el-radio v-for="dict in iot_enable_status" :key=" dict.value " :label=" parseInt(dict.value) ">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model=" form.remark " type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading=" buttonLoading " type="primary" @click=" submitForm ">确 定</el-button>
          <el-button @click=" cancel ">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Device" lang="ts">
import { listDevice, getDevice, delDevice, addDevice, updateDevice } from '@/api/manager/device';
import { DeviceVO, DeviceQuery, DeviceForm } from '@/api/manager/device/types';
import { treeProduct } from '@/api/manager/product';
import { ProductVO } from '@/api/manager/product/types';
import { ComponentInternalInstance } from 'vue';
import { ElForm } from 'element-plus';
import router from '@/router';

const route = useRoute();


/**
 * 检查设备是否存在
 */
const device = ref<DeviceVO>({} as DeviceVO);
const checkDone = ref(false);
const checkDevice = async () => {
  const deviceId = route.params.id as string;
  if (!deviceId) {
    router.push({ path: '/404' });
    return
  }
  const res = await getDevice(deviceId);
  if (!res.data) {
    router.push({ path: '/404' });
    return;
  }else{
    device.value = res.data;
    checkDone.value = true;
  }
}
checkDevice();


const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { iot_enable_status } = toRefs<any>(proxy?.useDict('iot_enable_status'));
const { iot_device_type } = toRefs<any>(proxy?.useDict('iot_device_type'));

const productTree = ref<ProductVO[]>([]);
const deviceList = ref<DeviceVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const daterangeCreateTime = ref([]);

const queryFormRef = ref(ElForm);
const deviceFormRef = ref(ElForm);
const activeName = ref('attribute')

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: DeviceForm = {
  id: undefined,
  groupId: 0,
  productId: undefined,
  code: undefined,
  name: undefined,
  address: undefined,
  position: undefined,
  status: 1,
  remark: undefined
}
const data = reactive<PageData<DeviceForm, DeviceQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    groupId: undefined,
    productId: undefined,
    code: undefined,
    name: undefined,
    status: undefined,
    createTime: undefined,
  },
  rules: {
    id: [
      { required: true, message: "设备主键不能为空", trigger: "blur" }
    ],
    groupId: [
      { required: true, message: "设备分组ID不能为空", trigger: "blur" }
    ],
    productId: [
      { required: true, message: "产品ID不能为空", trigger: "change" }
    ],
    code: [
      { required: true, message: "设备编号不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "设备名称不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "启用状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询设备列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangeCreateTime && '' != daterangeCreateTime) {
    queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0];
    queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1];
  }
  const res = await listDevice(queryParams.value);
  deviceList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 查询产品树 */
const getTree = async () => {
  const res = await treeProduct();
  productTree.value = res.data;
}

/** 通过产品ID 查找产品信息 */
const getProduct = (productId: number) => {
  return productTree.value.find(item => item.id == productId);
}

/**
 * 切换到设备详情页面
 */
const detailHandler = (row: DeviceVO) => {
  router.push({ path: `/device/detail/${row.id}`, query: {} });
}
/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  deviceFormRef.value.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  daterangeCreateTime.value = [];
  queryFormRef.value.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: DeviceVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  dialog.visible = true;
  dialog.title = "添加设备";

  nextTick(() => {
    reset();
    // 根据查询条件选择产品
    form.value.productId = queryParams.value.productId || form.value.productId
  });
}

/** 修改按钮操作 */
const handleUpdate = (row?: DeviceVO) => {
  loading.value = true
  dialog.visible = true;
  dialog.title = "修改设备";
  nextTick(async () => {
    reset();
    const _id = row?.id || ids.value[0]
    const res = await getDevice(_id);
    loading.value = false;
    Object.assign(form.value, res.data);
  });
}

/** 提交按钮 */
const submitForm = () => {
  deviceFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateDevice(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addDevice(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: DeviceVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除设备编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delDevice(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('manager/device/export', {
    ...queryParams.value
  }, `device_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getTree();
  getList();
});
</script>
