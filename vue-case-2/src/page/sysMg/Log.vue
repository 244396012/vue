<template>
  <div class="data-page">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>{{breads.originalName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breads.curName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!--筛选-->
    <div class="filter pd-bg mg-top">
      <el-row>
        <el-col :span="19"><div class="grid-content bg-purple">
          <el-row>
            <el-col :span="12">帐号：
              <el-input v-model="account" style="display: inline-block;width: 60%"  placeholder="请输入帐号"></el-input>
            </el-col>
            <el-col :span="12">操作类型：
              <el-select v-model="field.value" placeholder="全部">
                <el-option
                  v-for="item in field.list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" style="height: 40px;line-height: 40px;position: relative">时间：&nbsp;
              <el-date-picker style="position: absolute;width: 60%"
                              v-model="time"
                              type="daterange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </el-col>
          </el-row>
        </div></el-col>
        <el-col :span="5"><div class="grid-content bg-purple-light">
          <el-button type="primary">筛 选</el-button>
        </div></el-col>
      </el-row>
    </div>
    <!--列表内容-->
    <div class="table mg-top">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          label="#"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="date"
          label="操作日期">
        </el-table-column>
        <el-table-column
          prop="module"
          label="操作模块">
        </el-table-column>
        <el-table-column
          prop="type"
          label="操作类型">
        </el-table-column>
        <el-table-column
          prop="log"
          label="操作记录">
        </el-table-column>
      </el-table>
      <pagination></pagination>
    </div>
  </div>
</template>
<script>
  import { getBread } from '@/utils'
  import pagination from '@/components/Pagination'
  export default {
    components: {
      pagination
    },
    data (){
      return {
        breads: {
          curName: '',
          originalName: ''
        },
        account: '',
        field: {
          list: [],
          value: ''
        },
        time: '',
        tableData: [
          {
            id: 1,
            name: '术语',
            phone: '术语',
            date: '术语',
            module: '术语',
            type: '术语',
            log: '术语'
          }
        ],
        loading: false
      }
    },
    mounted (){
      this.breads = getBread({
        router: this.$router,
        routes: this.$route
      })
    },
    methods: {
      //查看详情
      detailData(id) {
        this.$router.push('/dataMg/term/'+id)
      },
      //编辑
      editData(id) {

      },
      //删除
      deleteData(id) {
        this.$confirm('是否确认删除，删除后无法撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(id)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }).catch(() => {})
      }
    }
  }
</script>
<style lang="scss">
  @import "../../style/main";
</style>
