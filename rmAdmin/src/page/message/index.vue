<template>
  <div class="page">
    <div class="message-filter">
      <el-badge :class="active === ''?'active':''">
        <el-button type="text" :disabled="loading" @click="filterMsg('')">所有消息</el-button>
      </el-badge>
      <el-badge :value="$store.state.noReadMsg" :class="active === 0?'active':''">
        <el-button type="text" :disabled="loading" @click="filterMsg(0)">未读消息</el-button>
      </el-badge>
      <el-badge :class="active === 1?'active':''">
        <el-button type="text" :disabled="loading" @click="filterMsg(1)">已读消息</el-button>
      </el-badge>
    </div>
    <div class="default-style">
      <el-table
        border
        stripe
        :max-height="$store.state.tableHeight"
        v-loading="loading"
        :data="tableData">
        <el-table-column
          prop="num"
          label="#"
          width="60">
        </el-table-column>
        <el-table-column
          min-width="90"
          label="状态">
          <template slot-scope="scope">
            <template v-if="+scope.row.status >= 1">已读</template>
            <template v-else><span style="color: #F56C6C">未读</span></template>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="head"
          label="消息标题">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="150"
          label="消息内容">
          <template slot-scope="scope"><div v-html="scope.row.content"></div></template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="150"
          prop="publishTime"
          label="发送时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="readDetail(scope.row, scope.$index)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template v-if="totalTableList > 0">
        <pagination ref="msgPagination" :callback="showTableList" :total="totalTableList"></pagination>
      </template>
    </div>
    <detail-modal :detail="detail"></detail-modal>
  </div>
</template>
<script>
  import pagination from '@/components/pagination';
  import detail from './detail';
  export default {
    components: {
      pagination,
      'detail-modal': detail
    },
    data (){
      return {
        active: '',
        defaultMsgStatus: '',
        loading: false,
        tableData: [],
        totalTableList: 0,
        detail: ''
      }
    },
    created (){
      this.active = 0;
      this.filterMsg(this.active);
    },
    methods: {
      //筛选消息类型
      filterMsg(type) {
        this.active = type;
        this.defaultMsgStatus = type;
        this.$refs.msgPagination && (this.$refs.msgPagination.currentPage = 1);
        type === 0 && (this.tableData = []);
        this.showTableList({
          pageNo: 1
        });
      },
      //消息列表
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 20;
        this.loading = true;
        this.$http.get('/notice/noticeList', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            status: this.defaultMsgStatus,
            noticeType: ''
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
          this.loading = false;
        })
      },
      //标为“已读”
      async setMsgRead (id){
        return await this.$http.put('/notice/updateNoticeStatus', this.$qs.stringify({
          noticeId: id,
          status: 1
        })).then(res => res)
      },
      //查看详情
      readDetail (row, idx){
        this.detail = row;
        this.$store.commit('showModal');
        //未读消息，标为已读
        if(row.status < 1){
          this.setMsgRead(row.id).then(data => {
            if(data.data.message === 'success'){
              setTimeout(() => {
                const trs = document.querySelectorAll('.el-table__body tr');
                if(trs[idx]){
                  const tarTd = trs[idx].childNodes[1];
                  if(tarTd){
                    tarTd.innerHTML = `<div class="cell">已读</div>`;
                  }
                }
                this.waitingMsg()
              }, 1000)
            }
          })
        }
      },
      //未读消息条数
      waitingMsg (){
        this.$http.get('/notice/getNoReadCount', {
          params: {
            status: 0
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.$store.state.noReadMsg = +res.data.data ? res.data.data : '';
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .message-filter{
    padding: 10px 15px 0;
    background: #fff;
    border-bottom: solid 1px #e6e6e6;
    font-size: 14px;
    .el-badge{
      button{
        padding: 14px 30px 20px;
        color: #909399;
        border-radius: 0;
      }
      &.active button{
        color: #159396;
        &::after{
          position: absolute;
          left: 0;
          bottom: 0;
          content: '';
          width: 100%;
          height: 2px;
          background: #159396;;
        }
      }
      &:hover button{
        cursor: pointer;
        color: #333;
      }
    }
    .el-badge__content.is-fixed{
      top: 6px;
      right: 26px;
    }
  }
</style>
