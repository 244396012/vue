<template>
  <div class="page">
    <div class="default-style default-form">
      <el-row class="filterRow">
        <el-col :span="21">
          <div class="grid-content bg-purple pd-r-50 dotted-border-rg">
            <el-form :inline="true" class="demo-form-inline filterForm" label-width="70px">
            <el-form-item label="题号">
              <el-input v-model="form.questionNo" placeholder="请输入题号"></el-input>
            </el-form-item>
            <el-form-item label="语言">
              <el-select
                v-model="form.language" placeholder="请选择语言">
                <el-option
                  v-for="item in languageList"
                  :key="item.id"
                  :label="item.chineseName"
                  :value="item.englishName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="题目">
              <el-input v-model="form.questionTitle" placeholder="请输入题目"></el-input>
            </el-form-item>
            <el-form-item label="难度">
              <el-select
                v-model="form.level"
                placeholder="请选择难度">
                <el-option
                  v-for="item in $store.state.mod1.level"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select
                v-model="form.state"
                placeholder="请选择状态">
                <el-option
                  v-for="item in formSelect.stateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="添加时间">
              <el-date-picker
                v-model="form.rangeTime"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="初始时间"
                end-placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
          </el-form>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple-light">
            <el-button type="success" icon="el-icon-search" @click="showTableList">查 询</el-button>
            <el-button icon="el-icon-refresh" @click="resetSearch(form,showTableList)">重 置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="default-style">
      <el-row>
        <el-col :span="12">
          <el-button type="success" icon="el-icon-plus" @click.native="$router.push('/onlineTest/choice/create')">新建试题</el-button>
          <el-button @click="batchForbidAndUse({
            multipleSelection: multipleSelection,
            url: '/choiceQuestion/disableChoice',
            callback: showTableList})">批量禁用</el-button>
          <el-button @click="batchForbidAndUse({
            multipleSelection: multipleSelection,
            url: '/choiceQuestion/enableChoice',
            callback: showTableList})">批量启用</el-button>
          <el-button @click="deleteTableRows({
            multipleSelection: multipleSelection,
            url: '/choiceQuestion/deleteChoiceQuestion',
            callback: showTableList})">批量删除</el-button>
        </el-col>
        <el-col :span="12" class="rm-right">
          <el-button @click="downLoad(downloadUrl)" type="text">选择题模版下载</el-button>
          <el-button icon="el-icon-upload2" @click="$store.commit('showModal')">批量导入</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="default-style">
      <el-table
        border
        stripe
        :max-height="$store.state.tableHeight"
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange">
        <el-table-column
          fixed
          type="selection"
          width="40">
        </el-table-column>
        <el-table-column
          label="#"
          prop="num"
          width="40">
        </el-table-column>
        <el-table-column
          prop="questionNo"
          label="题号"
          width="90">
        </el-table-column>
        <el-table-column
          prop="language"
          label="语言"
          width="120">
        </el-table-column>
        <el-table-column
          prop="difficultLevel"
          label="难度等级"
          width="80">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="150"
          prop="questionRequirement"
          label="题目要求">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="150"
          prop="questionHead"
          label="题目">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="optiona"
          label="选项A">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="optionb"
          label="选项B">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="optionc"
          label="选项C">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="optiond"
          label="选项D">
        </el-table-column>
        <el-table-column
          prop="correctAnswer"
          label="正确答案"
          width="80">
        </el-table-column>
        <el-table-column
          label="状态"
          width="60">
          <template slot-scope="scope">
            {{scope.row.status ? '启用':'禁用'}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button type="text" @click="$router.push('/onlineTest/choice/'+scope.row.id)">查看</el-button>
            <el-button type="text"
                       @click="batchForbidAndUse({
                        multipleSelection: [scope.row],
                        url: scope.row.status?'/choiceQuestion/disableChoice':'/choiceQuestion/enableChoice',
                        callback: showTableList})">{{scope.row.status ? '禁用':'启用'}}</el-button>
            <el-button type="text" class="del"
                       @click="deleteTableRows({
                        id: scope.row.id,
                        url: '/choiceQuestion/deleteChoiceQuestion',
                        callback: showTableList})">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template v-if="totalTableList > 0">
        <pagination :callback="showTableList" :total="totalTableList"></pagination>
      </template>
      <modal-import :callback="showTableList"></modal-import>
    </div>
  </div>
</template>
<script>
  import pagination from '@/components/pagination'
  import modal_import from './modal_import'
  import { mapGetters } from 'vuex';
  export default {
    components: {
      pagination,
      'modal-import': modal_import
    },
    data (){
      return {
        loading: false,
        downloadUrl: '/choiceQuestion/downloadChoiceQuestionModel',
        totalTableList: 0,
        form: {
          questionNo: '',
          language: '',
          questionTitle: '',
          state: '',
          rangeTime: '',
          level: ''
        },
        formSelect: {
          stateOptions: [{label:'禁用',value:'0'},{label:'启用',value:'1'}]
        },
        tableData: [],
        multipleSelection: []
      }
    },
    created (){
      this.showTableList()
    },
    computed: {
      ...mapGetters([
        'languageList'
      ])
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //展示表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/choiceQuestion/listChoiceQuestions', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            questionNo: this.form.questionNo,
            questionHead: this.form.questionTitle,
            language : this.form.language,
            status: this.form.state,
            difficultLevel: this.form.level,
            startTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            endTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          if(res.data.code === '200' && res.data.data.content.length >= 0){
            this.tableData = [];
            res.data.data.content.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.data.totalElements
          }
          this.loading = false
        })
      }
    }
  }

</script>
