<template>
  <el-form :model="form" label-width="auto" style="max-width: 600px">
    <el-form-item label="赛程名称：">
      <el-input v-model="form.name"/>
    </el-form-item>
    <el-form-item label="选择场地：">
      <el-select v-model="form.region" placeholder="please select your zone">
        <el-option label="A 场地" value="shanghai"/>
        <el-option label="B 场地" value="beijing"/>
      </el-select>
    </el-form-item>
    <el-form-item label="红方运动员：">
      <el-autocomplete
          v-model="state1"
          :fetch-suggestions="querySearch"
          clearable
          class="inline-input w-50"
          placeholder="Please Input"
          @select="handleSelect"
      />
      <el-text class="red-label" type="danger" style="margin-left: 20px"> i am red</el-text>
    </el-form-item>
    <el-form-item label="青方运动员：">
      <el-autocomplete
          v-model="state2"
          :fetch-suggestions="querySearch"
          clearable
          class="inline-input w-50"
          placeholder="Please Input"
          @select="handleSelect"
      />
      <el-text class="cyan-label" type="primary" style="margin-left: 20px">i am cyan</el-text>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {reactive} from 'vue'
import {onMounted, ref} from 'vue'

const {update} = defineProps({
  update: {
    type: Function,
    required: true
  }
});
// do not use same name with ref
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

const onSubmit = () => {
  update()  // 更新页面信息
}


interface RestaurantItem {
  value: string
  link: string
}

const state1 = ref('')
const state2 = ref('')

const restaurants = ref<RestaurantItem[]>([])
const querySearch = (queryString: string, cb: any) => {
  const results = queryString
      ? restaurants.value.filter(createFilter(queryString))
      : restaurants.value
  // call callback function to return suggestions
  cb(results)
}
const createFilter = (queryString: string) => {
  return (restaurant: RestaurantItem) => {
    return (
        restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}
const loadAll = () => {
  return [
    {value: 'vue', link: 'https://github.com/vuejs/vue'},
    {value: 'element', link: 'https://github.com/ElemeFE/element'},
    {value: 'cooking', link: 'https://github.com/ElemeFE/cooking'},
    {value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui'},
    {value: 'vuex', link: 'https://github.com/vuejs/vuex'},
    {value: 'vue-router', link: 'https://github.com/vuejs/vue-router'},
    {value: 'babel', link: 'https://github.com/babel/babel'},
  ]
}

const handleSelect = (item: RestaurantItem) => {
  console.log(item)
}

onMounted(() => {
  restaurants.value = loadAll()
})
</script>
