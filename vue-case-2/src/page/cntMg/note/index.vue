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
            <el-col :span="12">帖子标题：
              <el-input v-model="title" style="display: inline-block;width: 60%;" placeholder="请输入帖子标题"></el-input>
            </el-col>
            <el-col :span="12" style="height: 40px;line-height: 40px;position: relative;">创建时间：&nbsp;
              <el-date-picker style="position: absolute;width: 70%;"
                              v-model="createTime"
                              type="daterange"
                              value-format="yyyy-MM-dd"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </el-col>
          </el-row>
        </div></el-col>
        <el-col :span="5"><div class="grid-content bg-purple-light" style="line-height: 60px;">
          <el-button type="primary" @click="getNoteList">筛 选</el-button>
          <el-button @click="resetList">重 置</el-button>
        </div></el-col>
      </el-row>
    </div>
    <div class="pd-bg mg-top" style="text-align: right;padding-right: 20px;padding-left: 20px;">
      <el-button type="primary" @click="$router.push('/cntMg/edit/ft')">发 帖</el-button>
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
          prop="num"
          width="50">
        </el-table-column>
        <el-table-column
          prop="title"
          label="帖子标题">
        </el-table-column>
        <el-table-column
          prop="gmtCreate"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="articleState"
          label="状态">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
			<template v-if="scope.row.articleState !== '草稿'">
				<el-button type="text" class="detail" @click="$router.push('/cntMg/'+scope.row.id)">详情</el-button>
				<el-button type="text" class="orange" @click="topData(scope.row.id,scope.row.isTop)">{{scope.row.isTop | formatTop}}</el-button>
				<el-button type="text" class="put" @click="hiddenData(scope.row.id,scope.row.articleState)">{{scope.row.articleState | formatHidden}}</el-button>
			</template>
            <el-button type="text" class="download" @click="$router.push('/cntMg/edit/'+scope.row.id)">编辑</el-button>
            <el-button type="text" class="delete" @click="deleteData(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template v-if="totalNote > 0">
        <pagination :callback="getNoteList" :total="totalNote"></pagination>
      </template>
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
        title: '',
        createTime: '',
        tableData: [],
        totalNote: 0,
        loading: false
      }
    },
    mounted (){
      this.breads = getBread({
        router: this.$router,
        routes: this.$route
      })
      this.getNoteList()
    },
    filters: {
      formatTop (top){
        return top ? '取消置顶' : '置顶'
      },
      formatHidden (state){
        return state === '发布' ? '隐藏' : '发布'
      }
    },
    methods: {
      // 筛选、获取帖子列表
      getNoteList (config){
        config = config || {}
        config.pageNo = config.pageNo || 1
        config.pageSize = config.pageSize || 10
        this.loading = true
        this.$http.get('/dictionary/article/searchList',{
          params: {
            page: config.pageNo-1,
            pageSize: config.pageSize,
            startTime: this.createTime ? this.createTime[0]+' 00:00:00' : '',
            endTime: this.createTime ? this.createTime[1]+' 23:55:55' : '',
            title: this.title
          }
        }).then(res => {
            if(res.data.message === 'success'){
              this.tableData = []
              res.data.data.content.forEach((item, index) => {
                item.num = (index + 1) + (config.pageNo-1)*config.pageSize
                this.tableData.push(item)
              })
              this.totalNote = res.data.data.totalElements
            }
            this.loading = false
          })
      },
      // 重置筛选
      resetList (){
        this.title = ''
        this.createTime = ''
        this.getNoteList()
      },
      //置顶、取消置顶
      topData(id, istop) {
        let url = !istop
        ? '/dictionary/article/top'
        : '/dictionary/article/cancelTop'
        this.$http.post(url,this.$qs.stringify({
          id: id
        })).then(res => {
          if(res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: !istop?'置顶成功':'取消置顶成功'
            })
            this.getNoteList()
          } else {
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      //隐藏、发布
      hiddenData(id, ishidden) {
        let url = ''
        const data = {}
        if(ishidden === '发布'){
          url = '/dictionary/article/cancel'
          data.id = id
        }else{
          url = '/dictionary/article/pub'
          data.id = id
          data.isTop = false
        }
        this.$http.post(url,this.$qs.stringify(data))
          .then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: ishidden==='发布'?'隐藏成功':'发布成功'
              })
              this.getNoteList()
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
        })
      },
      //删除
      deleteData(id) {
        this.$confirm('是否确认删除，删除后无法撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/dictionary/article/deleteArticle',{
            params: {
              id: id
            }
          }).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getNoteList()
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>

