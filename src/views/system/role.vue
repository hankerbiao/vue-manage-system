<template>
  <div>
    <div class="container">
      <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
                   :delFunc="handleDelete" :page-change="changePage" :editFunc="handleEdit">
        <template #toolbarBtn>
          <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增赛程</el-button>
        </template>
        <template #status="{ rows }">
          <el-tag type="success" v-if="rows.status">启用</el-tag>
          <el-tag type="danger" v-else>禁用</el-tag>
        </template>
      </TableCustom>
    </div>
    <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
               :close-on-click-modal="false" @close="closeDialog">
<!--      <TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="updateData"/>-->
          <TableAdd :update="updateData" :cancel="closeDialog"/>
    </el-dialog>
    <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
      <TableDetail :data="viewData">
        <template #status="{ rows }">
          <el-tag type="success" v-if="rows.status">启用</el-tag>
          <el-tag type="danger" v-else>禁用</el-tag>
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
  {prop: 'name', label: '角色名称'},
  {prop: 'key', label: '角色标识'},
  {prop: 'status', label: '状态'},
  {prop: 'operator', label: '操作', width: 250},
])
const page = reactive({
  index: 1,
  size: 10,
  total: 0,
})


const tableData = ref<Role[]>([]);
const getData = async () => {
  const res = await fetchDatas('/api/v1/schedules/')
  tableData.value = res.data.data
};
getData();

const changePage = (val: number) => {
  page.index = val;
  getData();
};

// 新增/编辑弹窗相关
const options = ref<FormOption>({
  labelWidth: '100px',
  span: 24,
  list: [
    {type: 'input', label: '角色名称', prop: 'name', required: true},
    {type: 'input', label: '角色标识', prop: 'key', required: true},
    {type: 'switch', label: '状态', prop: 'status', required: false, activeText: '启用', inactiveText: '禁用'},
  ]
})
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: Role) => {
  rowData.value = {...row};
  isEdit.value = true;
  visible.value = true;
};

interface UpdateData {
  name: string,
  key: string,
  status: boolean
}

// 更新数据
const updateData = (data: UpdateData) => {
  closeDialog();
  getData();
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
  viewData.value.row = {...row}
  viewData.value.list = [
    {
      prop: 'id',
      label: '角色ID',
    },
    {
      prop: 'name',
      label: '角色名称',
    },
    {
      prop: 'key',
      label: '角色标识',
    },
    {
      prop: 'status',
      label: '角色状态',
    },
  ]
  visible1.value = true;
};

// 删除相关
const handleDelete = (row: Role) => {
  ElMessage.success('删除成功');
}

</script>

<style scoped></style>