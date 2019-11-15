<template>
  <div class="page">
    <div class="default-style">
      <div class="detail" style="padding-bottom: 5px">
        <el-row class="exact">
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <b style="font-size: 18px;">{{detail.teamName}}</b>{{detail.userCode && '（'+detail.userCode+'）'}}
            </div>
          </el-col>
        </el-row>
        <el-row class="exact">
          <el-col :span="6"><div class="grid-content bg-purple"><b>翻译字数：</b>{{detail.wordCount?detail.wordCount:'--'}}字</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>接单数：</b>{{detail.orderNum}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div><b>投诉次数：</b>{{detail.complain}}</el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>团队状态：</b>{{detail.teamStatus}}</div></el-col>
        </el-row>
        <el-row class="exact">
          <el-col :span="6"><div class="grid-content bg-purple"></div><b>订单平均分：</b>{{detail.orderAveg?detail.orderAveg:'--'}}分</el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>译侠值：</b>{{detail.totalScore?detail.totalScore:'--'}}分</div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple-light"><b>兼职类型：</b>{{detail.interType}}</div></el-col>
        </el-row>
      </div>
    </div>
    <div class="default-style">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="团队信息" name="first">
            <div class="detail">
              <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">团队基本信息
                <el-button v-if="baseinfo.show"
                           type="success"
                           icon="el-icon-edit"
                           style="float: right"
                           @click="baseinfo.show = false">修改</el-button>
                <template v-else>
                  <el-button type="success"
                             @click="modifyTeamBase"
                             :disabled="baseBtn.disabled"
                             style="float: right;margin-left: 10px">{{baseBtn.txt}}</el-button>
                  <el-button @click="baseinfo.show = true" style="float: right;">取消</el-button>
                </template>
              </p>
              <table class="parttime-table">
                <tr>
                  <td class="name">登录账号</td><td colspan="7">{{teamBaseInfo.primaryContactMobile}}</td>
                </tr>
                <tr>
                  <td class="name">团队名称</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{teamBaseInfo.teamName}}</span>
                    <input v-else v-model="baseinfo.teamName" type="text" >
                  </td>
                  <td class="name">专职人数</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{teamBaseInfo.fullTimeNumber}}</span>
                    <input v-else v-model="baseinfo.fullTimeNumber" type="number" >
                  </td>
                  <td class="name">统一社会信用代码</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{teamBaseInfo.unifiedSocialCreditCode}}</span>
                    <input v-else v-model="baseinfo.unifiedSocialCreditCode" type="text">
                  </td>
                  <td class="name">纳税类型</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{teamBaseInfo.typesOfTaxPayment}}</span>
                    <el-select v-else v-model="baseinfo.typesOfTaxPayment">
                      <el-option value="一般纳税人">一般纳税人</el-option>
                      <el-option value="小规模纳税人">小规模纳税人</el-option>
                      <el-option value="其他">其他</el-option>
                    </el-select>
                  </td>
                </tr>
                <tr>
                  <td class="name">发票类型</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{teamBaseInfo.invoiceType}}</span>
                    <el-select v-else v-model="baseinfo.invoiceType">
                      <el-option value="增值税专用发票">增值税专用发票</el-option>
                      <el-option value="普通发票">普通发票</el-option>
                      <el-option value="不开发票">不开发票</el-option>
                    </el-select>
                  </td>
                  <td class="name">币种</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{teamBaseInfo.currencyName}}</span>
                    <el-select v-else v-model="baseinfo.currencyName">
                      <el-option value="人民币">人民币</el-option>
                      <el-option value="美元"></el-option>
                      <el-option value="欧元"></el-option>
                      <el-option value="英镑"></el-option>
                    </el-select>
                  </td>
                  <td class="name">团队所在地</td><td style="padding: 0" colspan="3">
                    <span v-if="baseinfo.show">{{teamBaseInfo.location}}</span>
                    <div class="areaPicker" v-show="!baseinfo.show">
                      <select v-model="baseinfo.province" class="province" name="provincePicker" id="provincePicker"></select>
                      <select v-model="baseinfo.city" class="city" name="cityPicker" id="cityPicker"></select>
                      <select v-model="baseinfo.area" class="area" name="areaPicker" id="areaPicker"></select>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="name">主要联系人</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{teamBaseInfo.primaryContactName}}</span>
                    <input v-else v-model="baseinfo.primaryContactName" type="text">
                  </td>
                  <td class="name">手机号码</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{teamBaseInfo.primaryContactMobile}}</span>
                    <input v-else v-model="baseinfo.primaryContactMobile" type="text" >
                  </td>
                  <td class="name">邮箱</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{teamBaseInfo.primaryContactEmail}}</span>
                    <input v-else v-model="baseinfo.primaryContactEmail" type="text">
                  </td>
                  <td class="name">微信</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{baseinfo.primaryObj['微信']}}</span>
                    <input v-else v-model="baseinfo.primaryObj['微信']" type="text">
                  </td>
                </tr>
                <tr>
                  <td class="name">QQ</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{baseinfo.primaryObj['QQ']}}</span>
                    <input v-else v-model="baseinfo.primaryObj['QQ']" type="text">
                  </td>
                  <td class="name">座机</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{baseinfo.primaryObj['座机']}}</span>
                    <input v-else v-model="baseinfo.primaryObj['座机']" type="text">
                  </td>
                  <td class="name">Skype</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{baseinfo.primaryObj['Skype']}}</span>
                    <input v-else v-model="baseinfo.primaryObj['Skype']" type="text">
                  </td>
                </tr>
                <tr>
                  <td class="name">次要联系人</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{teamBaseInfo.otherContactName}}</span>
                    <input v-else v-model="baseinfo.otherContactName" type="text">
                  </td>
                  <td class="name">手机号码</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{teamBaseInfo.otherContactMobile}}</span>
                    <input v-else v-model="baseinfo.otherContactMobile" type="text" >
                  </td>
                  <td class="name">邮箱</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{teamBaseInfo.otherContactEmail}}</span>
                    <input v-else v-model="baseinfo.otherContactEmail" type="text">
                  </td>
                  <td class="name">微信</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{baseinfo.otherObj['微信']}}</span>
                    <input v-else v-model="baseinfo.otherObj['微信']" type="text">
                  </td>
                </tr>
                <tr>
                  <td class="name">QQ</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{baseinfo.otherObj['QQ']}}</span>
                    <input v-else v-model="baseinfo.otherObj['QQ']" type="text">
                  </td>
                  <td class="name">座机</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{baseinfo.otherObj['座机']}}</span>
                    <input v-else v-model="baseinfo.otherObj['座机']" type="text">
                  </td>
                  <td class="name">Skype</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{baseinfo.otherObj['Skype']}}</span>
                    <input v-else v-model="baseinfo.otherObj['Skype']" type="text">
                  </td>
                </tr>
              </table>
              <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">账号信息</p>
              <table class="parttime-table">
                <tr>
                  <td class="name">注册时间</td><td>{{teamBaseInfo.gmtCreate}}</td>
                  <td class="name">成为团队时间</td><td>{{teamBaseInfo.auditTime}}</td>
                  <td class="name">账号状态</td><td>{{accountInfo.isEnabled | formatStatus}}</td>
                  <td class="name">接单开关</td><td>{{accountInfo.userExtension && accountInfo.userExtension.orderTaked?'开启':'关闭'}}</td>
                </tr>
                <tr>
                  <td class="name">兼职类型</td><td colspan="7">{{accountInfo.userExtension && accountInfo.userExtension.skills}}</td>
                </tr>
              </table>
              <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">身份认证
                <template v-if="accountInfo.userExtension && +accountInfo.userExtension.certificatePassed !== 1">
                  <template v-if="identy.show">
                    <el-button type="success" icon="el-icon-edit"
                               style="float: right"
                               @click="identy.show = false">帮助认证</el-button>
                  </template>
                  <template v-else>
                    <el-button type="success"
                               @click="modifyIdenty"
                               :disabled="identyBtn.disabled"
                               style="float: right;margin-left: 10px">{{identyBtn.txt}}</el-button>
                    <el-button @click="identy.show = true" style="float: right;">取消</el-button>
                  </template>
                </template>
              </p>
              <table class="parttime-table">
                <tr>
                  <td class="name">认证状态</td><td>{{accountInfo.userExtension && accountInfo.userExtension.certificatePassed ?'已认证':'未认证'}}</td>
                  <td class="name">真实姓名</td><td>{{accountInfo.userExtension && accountInfo.userExtension.realName}}</td>
                  <td class="name">证件类型</td><td style="padding: 0;">
                    <span v-if="identy.show">{{accountInfo.userExtension && accountInfo.userExtension.certificateType}}</span>
                    <el-select v-else v-model="identy.cardType" placeholder="证件类型">
                      <el-option
                        v-for="item in cardOptions"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </td>
                  <td class="name">证件号码</td><td style="padding: 0;">
                    <span v-if="identy.show">{{accountInfo.userExtension && accountInfo.userExtension.certificateNumFuzzy}}</span>
                    <input v-else v-model="identy.cardNum" type="text">
                  </td>
                </tr>
              </table>
              <p class="sy-bold sy-title" style="overflow: auto;margin-bottom: 8px;line-height: 38px;">结算认证</p>
              <table class="parttime-table">
                <template v-for="item in financeInfo.settleList">
                  <template v-if="item.selttleName === '银行卡'">
                    <tr>
                      <td class="name" rowspan="2" style="font-size: 14px">银行卡结算</td>
                      <td class="name">真实姓名</td><td>{{item.realName}}</td>
                      <td class="name">证件号码</td><td>{{accountInfo.userExtension.certificateNumFuzzy}}</td>
                      <td class="name">银行卡号</td><td>{{item.settleAccountFuzzy}}</td>
                    </tr>
                    <tr>
                      <td class="name">开户银行</td><td>{{item.bankDeposit}}</td>
                      <td class="name">开户支行</td><td colspan="3">{{item.bankBranch}}</td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td class="name" rowspan="1" style="font-size: 14px">{{item.selttleName}}结算</td>
                      <td class="name">真实姓名</td><td>{{item.realName}}</td>
                      <td class="name">证件号码</td><td>{{accountInfo.userExtension.certificateNumFuzzy}}</td>
                      <td class="name">{{item.selttleName}}账号</td><td>{{item.settleAccountFuzzy}}</td>
                    </tr>
                  </template>
                </template>
                <tr>
                  <td class="name">结算类型</td>
                  <td class="name">当前结算类型</td>
                  <td colspan="5">
                    <span style="vertical-align: -6px;padding: 0"
                          v-if="payWay.show">{{accountInfo.userExtension && accountInfo.userExtension.defaultSettleType !== ''?accountInfo.userExtension.defaultSettleType:'默认'}}</span>
                    <el-select v-else v-model="payWay.type" placeholder="结算类型" style="width: 150px">
                      <el-option value="" label="默认"></el-option>
                      <el-option value="校企合作" label="校企合作"></el-option>
                      <el-option value="非全日制" label="非全日制"></el-option>
                    </el-select>
                    <template v-if="payWay.show">
                      <el-button type="success" icon="el-icon-edit"
                                 style="float: right"
                                 @click="payWay.show = false">修改</el-button>
                    </template>
                    <template v-else>
                      <el-button type="success"
                                 @click="modifyPayWay"
                                 :disabled="payWayBtn.disabled"
                                 style="float: right;margin-left: 10px">{{payWayBtn.txt}}</el-button>
                      <el-button @click="payWay.show = true" style="float: right;">取消</el-button>
                    </template>
                  </td>
                </tr>
              </table>
              <p class="sy-bold sy-title" style="overflow: auto;margin-bottom: 8px;line-height: 38px;">添加记录</p>
              <el-table
                border
                stripe
                :max-height="$store.state.tableHeight"
                v-loading="loading"
                :data="tableData">
                <el-table-column
                  prop="num"
                  label="#"
                  width="50">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  min-width="100"
                  prop="gmtCreate"
                  label="添加时间">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  min-width="120"
                  label="领域">
                  <template slot-scope="scope">{{scope.row.domainName | formatDomain}}</template>
                </el-table-column>
                <el-table-column
                  min-width="80"
                  prop="levelName"
                  label="等级">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  min-width="100"
                  prop="sourceLangaugeName"
                  label="源语言">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  min-width="120"
                  prop="targetLanguageName"
                  label="目标语言">
                </el-table-column>
                <el-table-column
                  min-width="80"
                  prop="auditStatus"
                  label="测试结果">
                </el-table-column>
                <el-table-column
                  min-width="95"
                  prop="auditUserName"
                  label="测试审核人">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  min-width="100"
                  prop="remarks"
                  label="备注">
                </el-table-column>
              </el-table>
              <template v-if="totalTableList > 0">
                <pagination :callback="showTestList" :total="totalTableList"></pagination>
              </template>
            </div>
          </el-tab-pane>
          <el-tab-pane label="技能类型" name="second">
            <detail-skill ref="skill" :detail="detail"></detail-skill>
          </el-tab-pane>
          <el-tab-pane label="任务与评价" name="third">
            <detail-comment ref="comment"></detail-comment>
          </el-tab-pane>
          <el-tab-pane label="账户记录" name="fourth">
            <detail-account ref="account"></detail-account>
          </el-tab-pane>
          <el-tab-pane label="积分与签到" name="fifth">
            <detail-score ref="score"></detail-score>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import pagination from '@/components/pagination';
  import {formatAccountStatus,formatDomainsStr} from '@/common/filter';
  import detailComment from '@/page/parttimeUser/component/detailComment';
  import detailAccount from '@/page/parttimeUser/component/detailAccount';
  import detailScore from '@/page/parttimeUser/component/detailScore';
  import detailSkill from './component/detailSkill'
  import '@/common/area';
  export default {
    components: {
      pagination,
      'detail-skill': detailSkill,
      'detail-comment': detailComment,
      'detail-account': detailAccount,
      'detail-score': detailScore
    },
    data (){
      return {
        activeName: 'first',
        detail: {
          teamId: '',
          userId: '',
          teamName: '--',
          userCode: '--',
          wordCount: '--',
          orderNum: '--',
          complain: '--',
          accountRemain: '--',
          withdraw: '--',
          teamStatus: '--',
          orderAveg: '--',
          totalScore: '--',
          cashType: '--',
          interType: ''
        },
        teamBaseInfo: '',
        accountInfo: '',
        financeInfo: '',
        baseinfo: {
          show: true,
          currencyCode: '',
          currencyName: '',
          fullTimeNumber: '',
          province: '',
          city: '',
          area: '',
          otherContactEmail: '',
          otherContactMobile: '',
          otherContactName: '',
          primaryContactEmail: '',
          primaryContactName: '',
          primaryContactMobile: '',
          teamName: '',
          typesOfTaxPayment: '',
          unifiedSocialCreditCode: '',
          invoiceType: '',
          primaryObj: {},
          otherObj: {}
        },
        identy: {
          show: true,
          userName: '',
          cardNum: '',
          cardType: ''
        },
        payWay: {
          show: true,
          type: ''
        },
        baseBtn: {
          disabled: false,
          txt: '保存'
        },
        identyBtn: {
          disabled: false,
          txt: '保存'
        },
        payWayBtn: {
          disabled: false,
          txt: '保存'
        },
        loading: false,
        totalTableList: 0,
        tableData: []
      }
    },
    filters: {
      formatDomain: formatDomainsStr,
      formatStatus: formatAccountStatus
    },
    created (){
      this.showMainDetail();
      this.showTestList();
      this.$nextTick(() => {
         new window._PCAS("provincePicker", "cityPicker", "areaPicker")
      })
    },
    computed: {
      ...mapState('select',{
        cardOptions: state => state.idCardOptions
      })
    },
    methods: {
      handleClick(tab, event) {
        if (tab.label === '技能类型'){
          this.$refs.skill.getSelectOptions();
          this.$refs.skill.showDetail();
        }else if (tab.label === '任务与评价'){
          this.$refs.comment.showScore();
          this.$refs.comment.showLabels();
          this.$refs.comment.showTableList()
        }else if(tab.label === '账户记录'){
          this.$refs.account.showTableList()
        }else if(tab.label === '积分与签到'){
          this.$refs.score.showScoreDetail();
          this.$refs.score.showSignDetail();
          this.$refs.score.showSignTotal()
        }
      },
      //获取信息
      showMainDetail (){
        //获取账户信息
        this.$http.get('/userExtension/getPartTimeStaffByUserId', {
          params: {
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            const _data = res.data.data;
            this.detail.userId = _data.userExtension.userId;
            this.detail.teamName = _data.nickName;
            this.detail.userCode = _data.userCode;
            this.detail.complain = _data.userExtension.numberOfComplaints;
            this.detail.teamStatus = _data.userExtension.translatorIdleStatus;
            this.detail.interType = _data.userExtension.skills;
            this.accountInfo = _data;
            this.identy.cardNum = _data.userExtension.certificateNum;
            this.identy.cardType = _data.userExtension.certificateType;
          }
        });
        //获取团队基本信息
        this.$http.get('/team/findTeamByUserId', {
          params: {
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.teamBaseInfo = res.data.data;
            this.detail.teamId = this.teamBaseInfo.id;
            this.identy.userName = this.teamBaseInfo.primaryContactName;
            //修改时，填充团队基本信息
            this.baseinfo.teamName = this.teamBaseInfo.teamName;
            this.baseinfo.fullTimeNumber = this.teamBaseInfo.fullTimeNumber;
            this.baseinfo.unifiedSocialCreditCode = this.teamBaseInfo.unifiedSocialCreditCode;
            this.baseinfo.typesOfTaxPayment = this.teamBaseInfo.typesOfTaxPayment;
            this.baseinfo.invoiceType = this.teamBaseInfo.invoiceType;
            this.baseinfo.currencyCode = this.teamBaseInfo.currencyCode;
            this.baseinfo.currencyName = this.teamBaseInfo.currencyName;
            const addressArr = this.teamBaseInfo.location && this.teamBaseInfo.location.split(' ') || [];
            if(addressArr.length > 0){
              this.baseinfo.province = addressArr[0];
              setTimeout(() => {
                const event = document.createEvent("HTMLEvents");
                event.initEvent("change", false, true);
                document.querySelector('.province').dispatchEvent(event);
                this.baseinfo.city = addressArr[1];
                this.baseinfo.area = addressArr[2];
              }, 10)
            }
            this.baseinfo.primaryContactName = this.teamBaseInfo.primaryContactName;
            this.baseinfo.primaryContactMobile = this.teamBaseInfo.primaryContactMobile;
            this.baseinfo.primaryContactEmail = this.teamBaseInfo.primaryContactEmail;
            this.baseinfo.otherContactEmail = this.teamBaseInfo.otherContactEmail;
            this.baseinfo.otherContactMobile = this.teamBaseInfo.otherContactMobile;
            this.baseinfo.otherContactName = this.teamBaseInfo.otherContactName;
            const priContact = this.teamBaseInfo.primaryContactInfo && JSON.parse(this.teamBaseInfo.primaryContactInfo) || [],
              othContact = this.teamBaseInfo.otherContactInfo && JSON.parse(this.teamBaseInfo.otherContactInfo) || [];
            priContact.forEach(item => {
              Object.assign(this.baseinfo.primaryObj, item);
            });
            othContact.forEach(item => {
              Object.assign(this.baseinfo.otherObj, item);
            });
          }
        });
        //获取译侠值
        this.$http.post('/orderAndComment/getTotalScoreInfo', this.$qs.stringify({
          userCode: this.$route.params.id
        })).then(res => {
          this.detail.totalScore = res.data.totalScore;
          this.detail.orderAveg = res.data.orderAverageScore;
        });
        //获取账户金额
        this.$http.get('/userExtension/getOrderWithDrawDetail', {
          params: {
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.detail.cashType = res.data.data.currencyName;
            this.detail.wordCount = res.data.data.wordCount;
            this.detail.orderNum = res.data.data.receiptCount;
            this.detail.accountRemain = res.data.data.balance;
            this.detail.withdraw = res.data.data.withDraw;
          }
        });
        //获取财务信息
        this.$http.get('/userExtension/findResumeByUserId', {
          params: {
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.financeInfo = res.data.data;
            this.payWay.type = res.data.data.userExtension.defaultSettleType;
          }
        })
      },
      //修改团队基本信息
      modifyTeamBase (){
        for(let prop in this.baseinfo){
          if(prop === 'teamName' ||
            prop === 'fullTimeNumber' ||
            prop === 'unifiedSocialCreditCode' ||
            prop === 'primaryContactEmail' ||
            prop === 'primaryContactMobile' ||
            prop === 'primaryContactName'
          ){
            if(this.baseinfo[prop] === ''){
              this.$message({
                type: 'warning',
                message: '请填写相关项'
              });
              return false;
            }
          }
        }
        switch (this.baseinfo.currencyName){
          case '人民币': this.baseinfo.currencyCode = 'CNY';break;
          case '美元': this.baseinfo.currencyCode = 'USD';break;
          case '欧元': this.baseinfo.currencyCode = 'Euro';break;
          case '英镑': this.baseinfo.currencyCode = 'Pound';break;
        };
        let priInfo = [], othInfo = [];
        for(let key in this.baseinfo.primaryObj){
          const obj = {};
          obj[key] = this.baseinfo.primaryObj[key];
          priInfo.push(obj)
        };
        for(let key in this.baseinfo.otherObj){
          const obj = {};
          obj[key] = this.baseinfo.otherObj[key];
          othInfo.push(obj)
        };
        this.baseBtn.disabled = true;
        this.baseBtn.txt = '保存中';
        this.$http.put('/team/addTeamBasicInfo', {
          "id": this.detail.teamId,
          "currencyCode": this.baseinfo.currencyCode,
          "currencyName": this.baseinfo.currencyName,
          "fullTimeNumber": this.baseinfo.fullTimeNumber,
          "invoiceType": this.baseinfo.invoiceType,
          "location": this.baseinfo.province+' '+this.baseinfo.city+' '+this.baseinfo.area,
          "otherContactEmail": this.baseinfo.otherContactEmail,
          "otherContactInfo": JSON.stringify(othInfo),
          "otherContactMobile": this.baseinfo.otherContactMobile,
          "otherContactName": this.baseinfo.otherContactName,
          "primaryContactEmail": this.baseinfo.primaryContactEmail,
          "primaryContactMobile": this.baseinfo.primaryContactMobile,
          "primaryContactInfo": JSON.stringify(priInfo),
          "primaryContactName": this.baseinfo.primaryContactName,
          "teamName": this.baseinfo.teamName,
          "typesOfTaxPayment": this.baseinfo.typesOfTaxPayment,
          "unifiedSocialCreditCode": this.baseinfo.unifiedSocialCreditCode
        }).then(res => {
          if(res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: '修改成功'
            });
            this.baseinfo.show = true;
            this.showMainDetail()
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
          this.baseBtn.disabled = false;
          this.baseBtn.txt = '保存';
        })
      },
      //修改身份认证
      modifyIdenty (){
        for(let prop in this.identy){
          if(prop !== 'show' && this.identy[prop].trim() === ''){
            this.$message({
              type: 'warning',
              message: '请输入相关信息'
            });
            return false;
          }
        }
        this.identyBtn.disabled = true;
        this.identyBtn.txt = '保存中';
        this.$http.post('/userExtension/identityUser', this.$qs.stringify({
          certificateType: this.identy.cardType,
          identifyId: this.identy.cardNum,
          realName: this.identy.userName,
          userId: this.detail.userId
        })).then(res => {
          if(res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: '认证成功'
            });
            this.identy.show = true;
            this.showMainDetail()
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
          this.identyBtn.disabled = false;
          this.identyBtn.txt = '保存';
        })
      },
      //修改结算方式
      modifyPayWay (){
        this.payWayBtn.disabled = true;
        this.payWayBtn.txt = '修改中';
        this.$http.post('/financeNew/setDefaultSettleType', this.$qs.stringify({
          userCode: this.detail.userCode,
          settleType: this.payWay.type
        })).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.payWay.show = true;
              this.showMainDetail()
            }else{
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
            this.payWayBtn.disabled = false;
            this.payWayBtn.txt = '保存';
          })
      },
      //团队审核记录
      showTestList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/team/listTeamPassInfo', {
          params: {
            page: config.pageNo-1,
            limit: config.pageSize,
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.tableData = [];
            const list = res.data.data.results;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.data.totalCount
          }
          this.loading = false
        })
      }
    }
  }
</script>
