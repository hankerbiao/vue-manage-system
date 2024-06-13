<template>
  <div>
    <div class="container">
      <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
                   :delFunc="handleDelete" :page-change="changePage" :editFunc="handleEdit" :refresh="getData">
        <template #toolbarBtn>
          <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增赛程</el-button>
        </template>
        <template #status="{ rows }">
          <el-tag type="success" v-if="rows.status">进行中</el-tag>
          <el-tag type="danger" v-else>已结束</el-tag>
        </template>
      </TableCustom>
    </div>
    <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
               :close-on-click-modal="false" @close="closeDialog">
      <TableAdd :update="updateData" :cancel="closeDialog"/>
    </el-dialog>
    <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
      <TableDetail :data="viewData">
        <template #status="{ rows }">
          <el-tag type="success" v-if="rows.status == 0">待开始</el-tag>
          <el-tag type="success" v-if="rows.status == 1">进行中</el-tag>
          <el-tag type="danger" v-else>已结束</el-tag>
        </template>
      </TableDetail>
    </el-dialog>
  </div>
</template>
<script setup lang="ts" name="system-role">
import {ref, reactive} from 'vue';
import {ElMessage} from 'element-plus';
import {Role} from '@/types/role';
import {fetchDatas} from '@/api';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import {CirclePlusFilled} from '@element-plus/icons-vue';
import {FormOption} from '@/types/form-option';

// 表格相关
let columns = ref([
  {type: 'index', label: '序号', width: 55, align: 'center'},
  {prop: 'name', label: '赛程名称'},
  {prop: 'red_key', label: '红方运动员'},
  {prop: 'cyan_key', label: '青方运动员'},
  {prop: 'status', label: '状态'},
  {prop: 'operator', label: '操作', width: 250},
])
const page = reactive({
  index: 1,
  size: 10,
  total: 20,
})

const tableData = ref<Role[]>([]);
const getData = async () => {
  try {
    const res = await fetchDatas('/api/v1/schedules/');
    if (res && res.data && res.data.data) {
      tableData.value = res.data.data;
      page.total = tableData.value.length;
    } else {
      console.error('Unexpected response structure:', res);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


getData()

// 修改页码时重新获取数据
const changePage = (val: number) => {
  page.index = val;
  getData();
};

// 新增/编辑弹窗相关
const options = ref<FormOption>({
  labelWidth: '100px',
  span: 24,
  list: [
    {type: 'input', label: '赛程名称', prop: 'name', required: true},
    {type: 'input', label: '红方运动员', prop: 'red_key', required: true},
    {type: 'input', label: '青方运动员', prop: 'cyan_key', required: true},
    {type: 'switch', label: '状态', prop: 'status', required: false, activeText: '进行中', inactiveText: '已结束'},
  ]
});
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref<Role | {}>({});

const handleEdit = (row: Role) => {
  rowData.value = {...row};
  isEdit.value = true;
  visible.value = true;
};

interface UpdateData {
  name: string,
  red_key: string,
  status: boolean
}

// 更新数据并刷新表格
const updateData = async (data: UpdateData) => {
  try {
    // 这里调用更新数据的API
    // await updateDataAPI(data);

    ElMessage.success('更新成功');
    closeDialog();
    await getData();
  } catch (error) {
    ElMessage.error('更新失败');
    console.error('Error updating data:', error);
  }
};

// 关闭弹窗相关
const closeDialog = () => {
  visible.value = false;
  isEdit.value = false;
  rowData.value = {};
};

// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
  row: {},
  list: [],
  column: 1
});

// 表格展示相关
const handleView = (row: Role) => {
  viewData.value.row = {...row};
  viewData.value.list = [
    {
      prop: 'id',
      label: '角色ID',
    },
    {
      prop: 'name',
      label: '赛程名称',
    },
    {
      prop: 'red_key',
      label: '红方运动员',
    },
    {
      prop: 'cyan_key',
      label: '青方运动员',
    },
    {
      prop: 'status',
      label: '角色状态',
    },
  ];
  visible1.value = true;
};

// 删除相关
const handleDelete = (row: Role) => {
  ElMessage.success('删除成功');
};

</script>


<style scoped></style>