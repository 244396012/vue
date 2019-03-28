<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>{{breads.originalName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breads.curName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!--筛选-->
    <div class="filter pd-bg mg-top">
      <el-row>
        <el-col :span="19"><div class="grid-content bg-purple">
          <el-row>
            <el-col :span="12">语料名称：
              <el-input v-model="fileName" style="display: inline-block;width: 60%" placeholder="请输入语料名称"></el-input>
            </el-col>
            <el-col :span="12">所属领域：
              <el-select v-model="area1.value" placeholder="全部" style="width: 35%">
                <el-option
                  v-for="item in area1.list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-model="area2.value" placeholder="二级分类" style="width: 35%">
                <el-option
                  v-for="item in area2.list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" style="height: 40px;line-height: 40px;position: relative">导入时间：&nbsp;
              <el-date-picker style="position: absolute;width: 60%;"
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
    <div class="pd-bg mg-top" style="text-align: right;padding-right: 20px;padding-left: 20px;">
      <el-button type="primary" icon="el-icon-upload2">上传语料</el-button>
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
          prop="fileName"
          label="语料名称">
        </el-table-column>
        <el-table-column
          prop="type"
          label="所属分类">
        </el-table-column>
        <el-table-column
          prop="language"
          label="语言对">
        </el-table-column>
        <el-table-column
          prop="num"
          label="语料数">
        </el-table-column>
        <el-table-column
          prop="time"
          label="导入时间">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" class="detail" @click="detailData(scope.row.id)">查看</el-button>
            <el-button type="text" class="download" @click="editData()">编辑</el-button>
            <el-button type="text" class="put" @click="addData()">添加</el-button>
            <el-button type="text" class="delete" @click="deleteData(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination></pagination>
      <upload></upload>
      <edit></edit>
    </div>
  </div>
</template>
<script>
  import { getBread } from '@/utils'
  import pagination from '@/components/Pagination'
  import edit from './Modal_Edit'
  import upload from './Modal_Upload'
  export default {
    components: {
      pagination, upload, edit
    },
    data (){
      return {
        breads: {
          curName: '',
          originalName: ''
        },
        //文件名称
        fileName: '',
        //领域：一级、二级
        area1: {
          list: [],
          value: ''
        },
        area2: {
          list: [],
          value: ''
        },
        time: '',//新建时间
        tableData: [
          {
            id: 1,
            fileName: '术语',
            type: '术语',
            language: '术语',
            num: '术语',
            time: '术语'
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
        this.$router.push('/dataMg/data/'+id)
      },
      //编辑
      editData(id) {

      },
      //添加
      addData(id) {

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

