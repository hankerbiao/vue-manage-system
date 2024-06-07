<template>
	<div>
		<TableSearch :query="query" :options="searchOpt"  />
		<div class="container">
			<TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
				:delFunc="handleDelete" :editFunc="handleEdit" :refresh="getData" :currentPage="page.index">
				<template #unit="{ rows }">
					￥{{ rows.unit }}
				</template>
				<template #place_true="{ rows }">
          {{ rows.place != -1 ? rows.place : 0 }}
				</template>
				<template #place="{ rows }">
					<el-tag :type="rows.place != -1 ? 'success' : 'danger'">
						{{ rows.place != -1 ? '晋级' : '淘汰' }}
					</el-tag>
				</template>
			</TableCustom>

		</div>
		<el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
			:close-on-click-modal="false" @close="closeDialog">
			<TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="updateData">

			</TableEdit>
		</el-dialog>
		<el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
			<TableDetail :data="viewData">

			</TableDetail>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, } from 'element-plus';
import {fetchAthletes} from '@/api/index';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import { TableItem } from '@/types/table';
import { FormOption, FormOptionList } from '@/types/form-option';

// 查询相关
const query = reactive({
	name: '',
});
const searchOpt = ref<FormOptionList[]>([
	{ type: 'input', label: '姓名：', prop: 'name' }
])

// 表格相关
let columns = ref([
	{ type: 'selection' },
	{ type: 'index', label: '序号', width: 55, align: 'center' },
	{ prop: 'name', label: '姓名' },
	{ prop: 'unit', label: '单位' },
	{ prop: 'place_true', label: '当前排名' },
	{ prop: 'place', label: '状态' },
])
const state = reactive({
  athlete_num: 0,
});

const page = reactive({
	index: 1,
	size: 20,
  get total() {
    return state.athlete_num;
  },
})
const tableData = ref<TableItem[]>([]);
const getData = async () => {
	const res = await fetchAthletes()
	tableData.value = res.data.data;
  state.athlete_num = res.data.data_length;
};
getData();

// 新增/编辑弹窗相关
let options = ref<FormOption>({
	labelWidth: '100px',
	span: 24,
	list: [
		{ type: 'input', label: '姓名', prop: 'name', required: true },
		{ type: 'unit', label: '单位', prop: 'unit', required: true },
		{ type: 'place', activeText: '晋级', inactiveText: '淘汰', label: '状态', prop: 'place', required: true },
		{ type: 'place', label: '当前排名', prop: 'place_true', required: true },
	]
})
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: TableItem) => {
	rowData.value = { ...row };
	isEdit.value = true;
	visible.value = true;
};
const updateData = () => {
	closeDialog();
	getData();
};

const closeDialog = () => {
	visible.value = false;
	isEdit.value = false;
};

// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
	row: {},
	list: []
});
const handleView = (row: TableItem) => {
	viewData.value.row = { ...row }
	viewData.value.list = [
		{
			prop: 'id',
			label: '用户ID',
		},
		{
			prop: 'name',
			label: '姓名',
		},
		{
			prop: 'unit',
			label: '单位',
		},
		{
			prop: 'place',
			label: '状态',
		},
		{
			prop: 'place_true',
			label: '当前排名',
		},
	]
	visible1.value = true;
};

// 删除相关
const handleDelete = (row: TableItem) => {
	ElMessage.success('删除成功');
}
</script>

<style scoped>

</style>
