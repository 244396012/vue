<template>
  <div class="page">
    <div class="default-style default-form">
      <el-row class="filterRow">
        <el-col :span="21">
          <div class="grid-content bg-purple dotted-border-rg">
            <el-form :inline="true" class="demo-form-inline filterForm" label-width="70px">
              <el-form-item label="专业领域" class="width620">
                <el-select
                  @change="selectSecondField"
                  v-model="form.field" placeholder="请选择一级领域">
                  <el-option
                    v-for="item in $store.state.fieldOptions"
                    :key="item.id"
                    :label="item.fullSpecialtyName"
                    :value="item.id">
                  </el-option>
                </el-select>
                <label class="sep">-</label>
                <el-select
                  v-model="form.secondField" placeholder="请选择二级领域">
                  <el-option
                    v-for="item in formSelect.secondOptions"
                    :key="item.id"
                    :label="item.fullSpecialtyName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="题号">
                <el-input v-model="form.questionNo" placeholder="请输入题号"></el-input>
              </el-form-item>
              <el-form-item label="试题难度">
                <el-select
                  v-model="form.level"
                  placeholder="请选择难度">
                  <el-option
                    v-for="item in $store.state.select.level"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="语言对" class="width620">
                <el-select
                  v-model="form.languageSource"
                  placeholder="请选择原文语言">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.chineseName">
                  </el-option>
                </el-select>
                <label class="sep">-</label>
                <el-select
                  v-model="form.languageTarget"
                  placeholder="请选择译文语言">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.chineseName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select
                  v-model="form.status"
                  placeholder="请选择状态">
                  <el-option
                    v-for="item in formSelect.statusOtions"
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
            <el-button type="success" icon="el-icon-search" @click="doSearch(showTableList)">查 询</el-button>
            <el-button icon="el-icon-refresh" @click="doExtraSearch">重 置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="default-style">
      <el-row>
        <el-col :span="12">
          <el-button type="success" icon="el-icon-circle-plus-outline" @click.native="$router.push('/onlineTest/trans/create')">新建试题</el-button>
          <el-button @click="batchForbidAndUse({
            multipleSelection: multipleSelection,
            url: '/translationQuestion/disableTranslation',
            callback: showTableList})">批量禁用</el-button>
          <el-button @click="batchForbidAndUse({
            multipleSelection: multipleSelection,
            url: '/translationQuestion/enableTranslation',
            callback: showTableList})">批量启用</el-button>
          <el-button @click="deleteTableRows({
            multipleSelection: multipleSelection,
            url: '/translationQuestion/deleteTranslationQuestion',
            callback: showTableList})" icon="el-icon-delete">批量删除</el-button>
        </el-col>
        <el-col :span="12" class="rm-right">
          <el-button @click="downLoad(downloadUrl)" type="text">翻译题模版下载</el-button>
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
          prop="num"
          label="#"
          width="40">
        </el-table-column>
        <el-table-column
          prop="questionNo"
          label="题号"
          width="100">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="专业领域">
          <template slot-scope="scope">{{scope.row.domains | formatDomain}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="语言对">
          <template slot-scope="scope">{{scope.row.orignLanguage}} -> {{scope.row.targetLanguage}}</template>
        </el-table-column>
        <el-table-column
          prop="difficultLevel"
          label="难度等级"
          width="80">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="150"
          prop="orignContent"
          label="原文">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="150"
          prop="targetContent"
          label="参考译文">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="80"
          prop="createUser"
          label="添加人">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="gmtCreate"
          label="添加时间">
        </el-table-column>
        <el-table-column
          width="80"
          prop="correctRate"
          label="通过率">
        </el-table-column>
        <el-table-column
          prop="status"
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
            <el-button type="text" @click.native="$router.push('/onlineTest/trans/'+scope.row.id)">查看</el-button>
            <el-button type="text"
                       @click="batchForbidAndUse({
                        multipleSelection: [scope.row],
                        url: scope.row.status?'/translationQuestion/disableTranslation':'/translationQuestion/enableTranslation',
                        callback: showTableList})">{{scope.row.status ? '禁用':'启用'}}</el-button>
            <el-button type="text" class="del"
                       @click.native="deleteTableRows({
                        url: '/translationQuestion/deleteTranslationQuestion',
                        id: scope.row.id,
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
  import pagination from '@/components/pagination';
  import modal_import from './modal_import';
  import { formatDomains } from '@/common/filter';
  export default {
    components: {
      pagination,
      'modal-import': modal_import
    },
    data (){
      return {
        downloadUrl: '/translationQuestion/downloadTranslationQuestionModel',
        form: {
          questionNo: '',
          languageSource: '',
          languageTarget: '',
          field: '',
          secondField: '',
          status: '',
          level: '',
          rangeTime: ''
        },
        formSelect: {
          statusOtions: [{label:'禁用',value:'0'},{label:'启用',value:'1'}],
          secondOptions: []
        },
        loading: false,
        tableData: [],
        totalTableList: 0,
        multipleSelection: []
      }
    },
    filters: {
      formatDomain: formatDomains
    },
    created (){
      this.showTableList();
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      doExtraSearch (){
        this.formSelect.secondOptions = [];
        this.resetSearch(this.form, this.showTableList)
      },
      //获取二级领域
      selectSecondField (id){
        const result = this.$store.state.fieldOptions.find(item => {
          return item.id === id;
        });
        const sid = result.specialtyId || '';
        this.form.secondField = '';
        this.formSelect.secondOptions = [];
        this.getSecondField(sid).then(res => {
          this.formSelect.secondOptions = res;
        });
      },
      //展示表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        let url = '/translationQuestion/listTranslationQuestions';
        if(this.form.field && !this.form.secondField){
          url += '?domainIds='+ this.form.field +'&onlyFirstDomain=true'
        }else if(this.form.secondField){
          url += '?domainIds='+this.form.secondField
        }
        this.$http.get(url, {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            questionNo: this.form.questionNo,
            orignLanguage : this.form.languageSource,
            targetLanguage : this.form.languageTarget,
            status: this.form.status,
            difficultLevel: this.form.level,
            startTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            endTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.tableData = [];
            const list = res.data.data.content;
            list.forEach((item, index) => {
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
