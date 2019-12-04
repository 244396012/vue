<template>
  <div class="page">
    <div class="default-style default-form">
      <div class="filter-row">
        <div class="search">
          <el-input v-model="form.title" placeholder="文章标题"></el-input>
          <el-select v-model="form.status" placeholder="文章状态">
            <el-option
              v-for="item in formSelect.statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="form.label" placeholder="文章标签">
            <el-option
              v-for="item in formSelect.labelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="form.title" placeholder="发布者名称" class="width110"></el-input>
          <el-date-picker v-model="form.confirmTime"
                          :clearable="false"
                          :unlink-panels="true"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          range-separator="-"
                          start-placeholder="提交时间"
                          end-placeholder="结束时间">
          </el-date-picker>
          <el-date-picker v-model="form.releaseTime"
                          :clearable="false"
                          :unlink-panels="true"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          range-separator="-"
                          start-placeholder="发布时间"
                          end-placeholder="结束时间">
          </el-date-picker>
          <el-button type="success" @click="doSearch(showTableList)">查 询</el-button>
          <el-button class="reset" @click="resetSearch(form,showTableList)">重 置</el-button>
        </div>
        <div class="button" >
          <el-button type="success" @click.native="$router.push('/article/interpreter/label')">文章标签管理</el-button>
        </div>
      </div>
    </div>
    <div class="default-style">
      <el-table
        border
        stripe
        :max-height="$store.state.tableHeight"
        v-loading="loading"
        :data="tableData">
        <el-table-column
          fixed
          label="#"
          width="60">
          <template slot-scope="scope">
            <el-badge v-if="scope.row.isFeatured" value="精选" class="item">{{scope.row.num}}</el-badge>
            <el-badge v-else class="item">{{scope.row.num}}</el-badge>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="140"
          prop="articleTitle"
          label="文章标题">
        </el-table-column>
        <el-table-column
          min-width="120"
          prop="account"
          label="封面">
          <template slot-scope="scope">
            <img class="thumb" :src="scope.row.coverId" alt="">
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="lable"
          label="标签">
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="publishUser"
          label="发布者">
        </el-table-column>
        <el-table-column
          width="120"
          prop="status"
          label="发布状态">
          <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
        </el-table-column>
        <el-table-column
          width="100"
          prop="viewCount"
          label="浏览数">
        </el-table-column>
        <el-table-column
          width="100"
          prop="likeNumber"
          label="点赞数">
        </el-table-column>
        <el-table-column
          width="100"
          prop="commentsNumber"
          label="评论数">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="submissionTime"
          label="提交时间">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="publishTime"
          label="发布时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="188">
          <template slot-scope="scope">
            <el-button type="text" @click="$router.push('/article/interpreter/detail/'+scope.row.id)">查看</el-button>
            <template v-if="+scope.row.status === 3">
              <el-button type="text"
                         v-if="!scope.row.isFeatured"
                         @click="setCullingEssay(scope.row.id, 1)">设为精选</el-button>
              <el-button type="text"
                         v-else
                         @click="setCullingEssay(scope.row.id, 0)">取消精选</el-button>
              <el-button type="text" @click="cancelReleaseEssay(scope.row.id)">撤回发布</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <template v-if="totalTableList > 0">
        <pagination :callback="showTableList" :total="totalTableList"></pagination>
      </template>
    </div>
  </div>
</template>
<script>
  import pagination from '@/components/pagination'
  export default {
    components: {
      pagination
    },
    data (){
      return {
        loading: false,
        totalTableList: 0,
        form: {
          releaser: '',
          title: '',
          status: '',
          label: '',
          confirmTime: '',
          releaseTime: ''
        },
        formSelect: {
          statusOptions: [
            {label:'草稿箱', value: '0'},
            {label:'待审核', value: '1'},
            {label:'审核未通过', value: '2'},
            {label:'已发布', value: '3'},
            {label:'发布撤回', value: '4'}
          ],
          labelOptions: [
            {label:'翻译交流', value: '翻译交流'},
            {label:'生活日常', value: '生活日常'},
            {label:'心得体会', value: '心得体会'}
          ]
        },
        tableData: []
      }
    },
    filters: {
      formatStatus(sts){
        switch (+sts){
          case 0: return '草稿箱';
          case 1: return '待审核';
          case 2: return '审核未通过';
          case 3: return '已发布';
          case 4: return '发布撤回';
          default: return sts;
        }
      }
    },
    mounted (){
       this.showTableList()
    },
    methods: {
      //展示表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 20;
        this.loading = true;
        this.$http.get('/interpreterArticle/interpreterArticleList', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            publishUserId: this.form.releaser,
            articleTitle: this.form.title,
            label: this.form.label,
            status: this.form.status,
            publishStartTime: this.form.releaseTime.length>0 ? this.form.releaseTime[0]+' 00:00:00' : '',
            publishEndTime: this.form.releaseTime.length>0 ? this.form.releaseTime[1]+' 23:55:55' : '',
            submitStartTime: this.form.confirmTime.length>0 ? this.form.confirmTime[0]+' 00:00:00' : '',
            submitEndTime: this.form.confirmTime.length>0 ? this.form.confirmTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.tableData = [];
            const list = res.data.data.content;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item);
            });
            this.totalTableList = res.data.data.totalElements;
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
          this.loading = false;
        })
      },
      //撤回发布
      cancelReleaseEssay (id){
        this.$prompt('撤回理由', '是否确认撤回', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S/,
          inputErrorMessage: '请输入撤回理由'
        }).then(({ value }) => {
          this.$http.put('/interpreterArticle/cancelPulish', this.$qs.stringify({
            articleId: id,
            desc: value
          })).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '撤回成功'
              });
              this.doSearch(this.showTableList)
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
        }).catch(() => {})
      },
      //设为精选
      setCullingEssay (id, status){
        this.$confirm('是否确认此操作', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.put('/interpreterArticle/setSelection', this.$qs.stringify({
            articleId: id,
            status: status
          })).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '设置成功'
              });
              this.doSearch(this.showTableList)
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
