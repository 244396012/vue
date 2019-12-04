<template>
  <div class="page">
    <div class="default-style">
      <div class="detail" style="padding-bottom: 5px">
        <el-row class="exact">
          <el-col :span="6"><div class="grid-content bg-purple"><b style="font-size: 18px;">
            {{userDetail.userName}}</b>{{'（'+$route.query.code+'）'}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>译员状态：</b>{{userDetail.userExtension && userDetail.userExtension.translatorIdleStatus}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>兼职类型：</b>{{userDetail.userExtension && userDetail.userExtension.skills}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div><b>译侠值：</b>{{userDetail.yxTotalScore?userDetail.yxTotalScore:'--'}}分</el-col>
        </el-row>
        <el-row class="exact">
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>接单数：</b>{{accountDetail.receiptCount}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"><b>翻译字数：</b>{{accountDetail.wordCount?accountDetail.wordCount:'--'}}字</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>任务平均分：</b>{{accountDetail.orderAverageScore?accountDetail.orderAverageScore:'--'}}分</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"><b>投诉次数：</b>{{accountDetail.numberOfComplaints}}</div></el-col>
        </el-row>
      </div>
    </div>
    <div class="default-style">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="译员信息" name="first">
            <div class="detail">
              <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">基本信息
                <template v-if="userDetail.userExtension && userDetail.userExtension.userSource === '绿通用户'">
                  <template v-if="baseinfo.show">
                    <el-button type="success" icon="el-icon-edit"
                               style="float: right"
                               @click="modifyBaseInit">修改</el-button>
                  </template>
                  <template v-else>
                    <el-button type="success"
                               @click="modifyBase"
                               :disabled="baseBtn.disabled"
                               style="float: right;margin-left: 10px">保存</el-button>
                    <el-button @click="baseinfo.show = true" style="float: right;">取消</el-button>
                  </template>
                </template>
              </p>
              <table class="parttime-table">
                <tr>
                  <td class="name">译员编号</td><td>{{$route.query.code}}</td>
                  <td class="name">译员昵称</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{userDetail.nickName}}</span>
                    <input v-else v-model="baseinfo.nickName" type="text" >
                  </td>
                  <td class="name">真实姓名</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{userDetail.userName}}</span>
                    <input v-else v-model="baseinfo.realName" type="text">
                  </td>
                  <td class="name">性别</td><td>{{userDetail.sex}}</td>
                </tr>
                <tr>
                  <td class="name">母语</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{userDetail.userExtension && userDetail.userExtension.motherTongue}}</span>
                    <el-select v-else
                               v-model="baseinfo.language" multiple placeholder="母语">
                      <el-option
                        v-for="item in $store.state.languageList"
                        :key="item.id"
                        :label="item.chineseName"
                        :value="item.chineseName">
                      </el-option>
                    </el-select>
                  </td>
                  <td class="name">出生日期</td><td>{{userDetail.userExtension && userDetail.userExtension.birthday}}</td>
                  <td class="name">翻译年限</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{userDetail.userExtension && userDetail.userExtension.translateYear}}</span>
                    <el-select v-else v-model="baseinfo.transYear" placeholder="翻译年限">
                      <el-option
                        v-for="item in formSelect.transYearOptions"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </td>
                  <td class="name">国籍</td><td style="padding: 0">
                    <span v-show="baseinfo.show">{{userDetail.userExtension && userDetail.userExtension.nationality}}</span>
                    <div class="areaPicker" v-show="!baseinfo.show">
                      <select v-model="baseinfo.areaOther"
                              style="position: absolute; left: -9999px"
                              name="areaOther" id="areaOther"></select>
                      <select v-model="baseinfo.areaSandbar"
                              style="width: 100px"
                              name="areaSandbar" id="areaSandbar"></select>
                      <select v-model="baseinfo.areaNationality"
                              style="width: 110px"
                              name="areaNationality" id="areaNationality"></select>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="name">手机</td><td>{{userDetail.telephone}}</td>
                  <td class="name">邮箱</td><td>{{userDetail.email}}</td>
                  <td class="name">常住地址</td>
                  <td colspan="3" style="padding: 0">
                    <span>{{userDetail.userExtension && userDetail.userExtension.permanentAddress}}</span>
                  </td>
                </tr>
                <tr>
                  <td class="name">微信</td><td>{{baseinfo.contactObj['微信']}}</td>
                  <td class="name">QQ</td><td>{{baseinfo.contactObj['QQ']}}</td>
                  <td class="name">座机</td><td>{{baseinfo.contactObj['座机']}}</td>
                  <td class="name">Skype</td><td>{{baseinfo.contactObj['Skype']}}</td>
                </tr>
                <tr>
                  <td class="name">备注</td><td colspan="7">{{userDetail.userExtension && userDetail.userExtension.remark}}</td>
                </tr>
              </table>
              <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">账号信息</p>
              <table class="parttime-table">
                <tr>
                  <td class="name">注册时间</td><td>{{userDetail.userExtension && userDetail.userExtension.gmtCreate}}</td>
                  <td class="name">成为译员时间</td><td>{{userDetail.userExtension && userDetail.userExtension.translatorDate}}</td>
                  <td class="name">账号状态</td><td>{{userDetail.userExtension && userDetail.isEnabled | formatStatus}}</td>
                  <td class="name">接单开关</td><td>{{userDetail.userExtension && userDetail.userExtension.receipt ? '开启' : '关闭'}}</td>
                </tr>
                <tr>
                  <td class="name">译员类型</td><td>{{userDetail.userExtension && userDetail.userExtension.userSource}}</td>
                  <td class="name">绑定手机号</td><td>{{userDetail.telephone}}</td>
                  <td class="name">绑定邮箱</td><td colspan="3">{{userDetail.email}}</td>
                </tr>
              </table>
              <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">简历信息
                <template v-if="userDetail.userExtension && userDetail.userExtension.userSource === '绿通用户'">
                  <template v-if="resumeinfo.show">
                    <el-button type="success" icon="el-icon-edit"
                               style="float: right"
                               @click="resumeinfo.show = false">修改</el-button>
                  </template>
                  <template v-else>
                    <el-button type="success"
                               @click="modifyResume"
                               :disabled="resumeBtn.disabled"
                               style="float: right;margin-left: 10px">保存</el-button>
                    <el-button @click="resumeinfo.show = true" style="float: right;">取消</el-button>
                  </template>
                </template>
              </p>
              <table class="parttime-table">
                <template v-if="userDetail.userExtension && userDetail.userExtension.userSource === '绿通用户' && userDetail.educationList.length>0">
                  <tr>
                    <td class="name" rowspan="2">学历信息</td>
                    <td class="name">毕业院校</td>
                    <td style="padding: 0;">
                      <span v-if="resumeinfo.show">
                        {{userDetail.educationList[0].graduatedSchoolName}}（{{userDetail.educationList[0].schoolType}}）
                      </span>
                      <template v-else>
                        <input v-model="resumeinfo.school" type="text" style="width: 51%">
                        <el-select v-model="resumeinfo.schoolType" style="width: 45%">
                          <el-option value="国内">国内</el-option>
                          <el-option value="国外">国外</el-option>
                        </el-select>
                      </template>
                    </td>
                    <td class="name">专业</td><td style="padding: 0;">
                      <span v-if="resumeinfo.show">{{userDetail.educationList[0].major}}</span>
                      <input v-else v-model="resumeinfo.profession" type="text">
                    </td>
                    <td class="name">学历</td><td style="padding: 0;">
                      <span v-if="resumeinfo.show">{{userDetail.educationList[0].degree}}</span>
                      <el-select v-else v-model="resumeinfo.record" placeholder="学历">
                        <el-option
                          v-for="item in recordOptions"
                          :key="item"
                          :label="item"
                          :value="item"></el-option>
                      </el-select>
                    </td>
                  </tr>
                  <tr>
                    <td class="name">毕业时间</td><td colspan="5" style="padding: 0;">
                    <span v-if="resumeinfo.show">{{userDetail.educationList[0].graduatedDate.slice(0,7)}}</span>
                    <el-date-picker v-else
                                    v-model="resumeinfo.graduateTime"
                                    type="month"
                                    value-format="yyyy-MM"
                                    placeholder="毕业时间">
                    </el-date-picker>
                  </td>
                  </tr>
                </template>
                <template v-else>
                  <template v-for="(item,index) in userDetail.educationList">
                    <tr>
                      <td class="name"
                          style="font-size: 14px"
                          v-if="index === 0"
                          :rowspan="userDetail.educationList.length*2">学历信息</td>
                      <td class="name">毕业院校</td><td style="padding: 0;">
                        <span>{{item.graduatedSchoolName}}（{{item.schoolType}}）</span>
                      </td>
                        <td class="name">专业</td><td style="padding: 0;">
                        <span>{{item.major}}</span>
                      </td>
                        <td class="name">学历</td><td style="padding: 0;">
                        <span>{{item.degree}}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="name">毕业时间</td><td colspan="5" style="padding: 0;">
                        <span>{{item.graduatedDate.slice(0,7)}}</span>
                      </td>
                    </tr>
                  </template>
                </template>
                <tr>
                  <td class="name">技能证书</td>
                  <td colspan="6">
                    <div class="td-item" v-for="(item,index) in userDetail.userSkillList" :key="index">
                      <el-image :src="item.userCertificatePath"
                                :preview-src-list="[item.userCertificatePath]"></el-image>
                      <p>{{item.userCertificateType}}</p>
                    </div>
                  </td>
                </tr>
                <template v-for="(item, index) in userDetail.workExperienceList">
                  <tr>
                    <td class="name"
                        style="font-size: 14px"
                        v-if="index === 0"
                        :rowspan="userDetail.workExperienceList.length*2">工作经验</td>
                    <td class="name">公司名称</td><td>{{item.companyName}}</td>
                    <td class="name">工作时间</td><td colspan="3">{{item.startDatetime.slice(0,7)}} - {{item.endDatetime.slice(0,7)}}</td>
                  </tr>
                  <tr>
                    <td class="name">职位描述</td><td colspan="5">{{item.workDescribe}}</td>
                  </tr>
                </template>
                <template v-for="(item, index) in userDetail.projectExperienceList">
                  <tr>
                    <td class="name"
                        style="font-size: 14px"
                        v-if="index === 0"
                        :rowspan="userDetail.workExperienceList.length*2">项目经历</td>
                    <td class="name">项目名称</td><td>{{item.projectName}}</td>
                    <td class="name">项目时间</td><td>{{item.startDatetime.slice(0,7)}} - {{item.endDatetime.slice(0,7)}}</td>
                    <td class="name">所属公司</td><td>{{item.companyName}}</td>
                  </tr>
                  <tr>
                    <td class="name">项目描述</td><td colspan="5">{{item.projectDescribe}}</td>
                  </tr>
                </template>
                <tr>
                  <td class="name">个性标签及擅长领域</td>
                  <td colspan="6">
                    <template v-if="userDetail.userExtension && userDetail.userExtension.individualization">
                      <el-tag v-for="item in userDetail.userExtension.individualization.split(',')" :key="item">{{item}}</el-tag>
                    </template>
                    <template v-if="userDetail.userExtension && userDetail.userExtension.area">
                      <el-tag v-for="item in userDetail.userExtension.area.split(',')" :key="item">{{item}}</el-tag>
                    </template>
                  </td>
                </tr>
              </table>
              <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">身份认证
                <template v-if="identy.show">
                  <el-button type="success" icon="el-icon-edit"
                             style="float: right"
                             @click="identy.show = false">帮助认证</el-button>
                </template>
                <template v-else>
                  <el-button type="success"
                             @click="modifyIdenty"
                             :disabled="identyBtn.disabled"
                             style="float: right;margin-left: 10px">保存</el-button>
                  <el-button @click="identy.show = true" style="float: right;">取消</el-button>
                </template>
                <el-button type="success" icon="el-icon-camera"
                           style="float: right;margin-right: 10px"
                           @click="$store.commit('showModal')">免认证</el-button>
              </p>
              <table class="parttime-table">
                <tr>
                  <td class="name">认证状态</td><td>{{userDetail.userExtension && userDetail.userExtension.certificatePassed ?'已认证':'未认证'}}</td>
                  <td class="name">真实姓名</td><td>{{userDetail.userName}}</td>
                  <td class="name">证件类型</td><td style="padding: 0;">
                    <span v-if="identy.show">{{userDetail.userExtension && userDetail.userExtension.certificateType}}</span>
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
                    <span v-if="identy.show">{{userDetail.userExtension && userDetail.userExtension.certificateNum}}</span>
                    <input v-else v-model="identy.cardNum" type="text">
                  </td>
                </tr>
                <tr>
                  <td class="name">证件照正/反面</td>
                  <td colspan="7">
                    <div class="td-item" v-for="(item, index) in certiImg" :key="index">
                      <el-image :src="item"
                                :preview-src-list="[item]"></el-image>
                    </div>
                  </td>
                </tr>
              </table>
              <p class="sy-bold sy-title" style="overflow: auto;margin-bottom: 8px;line-height: 38px;">结算认证</p>
              <table class="parttime-table">
                <template v-for="item in userDetail.settleList">
                  <template v-if="item.selttleName === '银行卡'">
                    <tr>
                      <td class="name" rowspan="2" style="font-size: 14px">银行卡结算</td>
                      <td class="name">真实姓名</td><td>{{item.realName}}</td>
                      <td class="name">证件号码</td><td>{{userDetail.userExtension.certificateNumFuzzy}}</td>
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
                      <td class="name">证件号码</td><td>{{userDetail.userExtension.certificateNumFuzzy}}</td>
                      <td class="name">{{item.selttleName}}账号</td><td>{{item.settleAccountFuzzy}}</td>
                    </tr>
                  </template>
                </template>
                <tr>
                  <td class="name">当前结算类型</td>
                  <td colspan="6">
                     <span style="vertical-align: -6px;padding: 0"
                           v-if="payWay.show">{{userDetail.userExtension && userDetail.userExtension.defaultSettleType !== ''?userDetail.userExtension.defaultSettleType:'默认'}}</span>
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
                                 style="float: right;margin-left: 10px">保存</el-button>
                      <el-button @click="payWay.show = true" style="float: right;">取消</el-button>
                    </template>
                  </td>
                </tr>
              </table>
              <p class="sy-bold sy-title" style="overflow: auto;margin-bottom: 8px;line-height: 38px;">测试记录</p>
              <el-table
                border
                stripe
                :max-height="$store.state.tableHeight"
                v-loading="loading"
                :data="testDetail.tableData">
                <el-table-column
                  prop="num"
                  label="#"
                  width="50">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  min-width="110"
                  prop="examStartTime"
                  label="测试时间">
                </el-table-column>
                <el-table-column
                  min-width="90"
                  prop="sourceFrom"
                  label="测试类型">
                </el-table-column>
                <el-table-column
                  min-width="110"
                  prop="preLevle"
                  label="测试前等级">
                </el-table-column>
                <el-table-column
                  min-width="90"
                  prop="examType"
                  label="试题类型">
                  <template slot-scope="scope">{{scope.row.examType === 'select'?'选择题':'翻译题'}}</template>
                </el-table-column>
                <el-table-column
                  min-width="90"
                  prop="questionLevel"
                  label="试题等级">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  min-width="120"
                  label="语言对">
                  <template slot-scope="scope" v-if="scope.row.originLanguage">{{scope.row.originLanguage}} -> {{scope.row.targetLanguage}}</template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  width="120"
                  prop=""
                  label="专业领域">
                  <template slot-scope="scope">{{scope.row.subDomains | formatDomainsStr}}</template>
                </el-table-column>
                <el-table-column
                  min-width="100"
                  prop="examResult"
                  label="测试结果">
                </el-table-column>
                <el-table-column
                  width="110"
                  prop="setLevel"
                  label="测试后定级">
                </el-table-column>
                <el-table-column
                  width="110"
                  prop="auditor"
                  label="测试审核人">
                </el-table-column>
                <el-table-column
                  width="80"
                  prop="comment"
                  label="备注">
                </el-table-column>
              </el-table>
              <template v-if="testDetail.total > 0">
                <pagination :callback="showTestDetail" :total="testDetail.total"></pagination>
              </template>
            </div>
          </el-tab-pane>
          <el-tab-pane label="技能类型" name="second">
            <detail-skill ref="skill"></detail-skill>
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
    <free-certificate :callback="showDetail"></free-certificate>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import pagination from '@/components/pagination';
  import { formatNum, formatAccountStatus,formatDomainsStr } from '@/common/filter';
  import detailSkill from './component/detailSkill';
  import detailComment from './component/detailComment';
  import detailAccount from './component/detailAccount';
  import detailScore from './component/detailScore';
  import freeCertification from '@/page/parttimeUser/component/freeCertification';
  import '@/common/area';
  export default {
    components: {
      pagination,
      'detail-skill': detailSkill,
      'detail-comment': detailComment,
      'detail-account': detailAccount,
      'detail-score': detailScore,
      'free-certificate': freeCertification
    },
    data (){
      return {
        activeName: 'first',
        certiImg: [],
        userDetail: {}, //译员详情
        accountDetail: {}, //账户详情
        baseinfo: {
          show: true,
          nickName: '',
          realName: '',
          transYear: '',
          nationArr: [],
          areaOther: '',
          areaSandbar: '',
          areaNationality: '',
          language: [],
          contactObj: {}
        },
        resumeinfo: {
          show: true,
          id: '',
          school: '',
          schoolType: '',
          profession: '',
          record: '',
          graduateTime: ''
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
        baseBtn: { disabled: false },
        resumeBtn: { disabled: false },
        identyBtn: { disabled: false },
        payWayBtn: { disabled: false },
        loading: false,
        testDetail: {
          total: 0,
          tableData: []
        },
        formSelect: {
          transYearOptions:['1年以内','1-3年','3-5年','5年-10年','10年以上']
        }
      }
    },
    filters: {
      formatNum: formatNum,
      formatDomainsStr: formatDomainsStr,
      formatStatus:formatAccountStatus
    },
    created (){
      //初始化地区插件
      this.$nextTick(() => {
        new window._PCAS("areaOther", "areaSandbar", "areaNationality");
        setTimeout(() => {
          this.baseinfo.areaOther = '其它';
          setTimeout(() => {
            const event = document.createEvent("HTMLEvents");
            event.initEvent("change", false, true);
            document.querySelector('#areaOther').dispatchEvent(event);
            this.baseinfo.areaSandbar = '亚洲';
            this.baseinfo.areaNationality = '中国大陆';
          }, 500)
        }, 1000);
      });
      this.showDetail();
      this.showBalanceDetail();
      this.showTestDetail();
    },
    computed: {
      ...mapState('select',{
        cardOptions: state => state.idCardOptions,
        recordOptions: state => state.recordOptions
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
      //修改基本信息，初始化地区插件
      modifyBaseInit (){
        this.baseinfo.areaSandbar = '';
        this.baseinfo.areaNationality = '';
        this.baseinfo.show = false;
        this.baseinfo.areaSandbar = this.baseinfo.nationArr[0];
        setTimeout(() => {
          const event = document.createEvent("HTMLEvents");
          event.initEvent("change", false, true);
          document.querySelector('#areaSandbar').dispatchEvent(event);
          this.baseinfo.areaNationality = this.baseinfo.nationArr[1];
        }, 1000)
      },
      //获取详情数据
      showDetail (){
        this.$http.get('/userExtension/findResumeByUserId', {
          params: {
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            const _data = res.data.data;
            this.userDetail = _data;
            this.baseinfo.nickName = _data.nickName;
            this.baseinfo.realName = _data.userName;
            this.baseinfo.email = _data.email;
            this.baseinfo.sex = _data.sex;
            if(_data.userExtension){
              this.baseinfo.birthday = _data.userExtension.birthday;
              this.baseinfo.language = _data.userExtension.motherTongue.split(',') || [];
              this.baseinfo.transYear = _data.userExtension.translateYear;
              this.baseinfo.moneyCode = _data.userExtension.currencyCode;
              this.baseinfo.moneyName = _data.userExtension.currencyName;
              this.baseinfo.address = _data.userExtension.permanentAddress;
              this.baseinfo.contactInfo = _data.userExtension.contactInfo;
              const contactArr = _data.userExtension.contactInfo && JSON.parse(_data.userExtension.contactInfo) || [];
              contactArr.forEach(item => {
                Object.assign(this.baseinfo.contactObj, item);
              });
              this.identy.cardNum = _data.userExtension.certificateNum;
              this.identy.cardType = _data.userExtension.certificateType;
              this.identy.userName = _data.userName;
              this.payWay.type = _data.userExtension.defaultSettleType;
              this.baseinfo.nationArr = _data.userExtension.nationality.split(' ') || [];
              this.certiImg = _data.userExtension.certificateImg && JSON.parse(_data.userExtension.certificateImg) || [];
            }
            if(_data.educationList && _data.educationList.length > 0){
              this.resumeinfo.id = _data.educationList[0].id;
              this.resumeinfo.school = _data.educationList[0].graduatedSchoolName;
              this.resumeinfo.schoolType = _data.educationList[0].schoolType;
              this.resumeinfo.profession = _data.educationList[0].major;
              this.resumeinfo.record = _data.educationList[0].degree;
              this.resumeinfo.graduateTime = _data.educationList[0].graduatedDate.slice(0,7);
            }
          }
        })
      },
      //获取财务相关信息
      showBalanceDetail (){
        this.$http.get('/userExtension/getOrderWithDrawDetail', {
          params: {
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.accountDetail = res.data.data;
          }
        })
      },
      //修改基本信息
      modifyBase (){
        this.baseBtn.disabled = true;
        this.$http.post('/userExtension/addBasicInfo', this.$qs.stringify({
          currencyCode: this.baseinfo.moneyCode,
          currencyName: this.baseinfo.moneyName,
          permanentAddress: this.baseinfo.address,
          contactInfoJSON: this.baseinfo.contactInfo,
          nationality: this.baseinfo.areaSandbar+' '+this.baseinfo.areaNationality,
          tranlateYear: this.baseinfo.transYear,
          birthday: this.baseinfo.birthday,
          nickName: this.baseinfo.nickName,
          realName: this.baseinfo.realName,
          motherTogue: this.baseinfo.language.toString(),
          email: this.baseinfo.email,
          sex: this.baseinfo.sex,
          userId: this.$route.params.id
        })).then(res => {
          if(res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: '修改成功'
            });
            this.baseinfo.show = true;
            this.showDetail()
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
          this.baseBtn.disabled = false;
        })
      },
      //修改简历信息
      modifyResume (){
        for(let prop in this.resumeinfo){
          if(prop !== 'show' && this.resumeinfo[prop].trim() === ''){
            this.$message({
              type: 'warning',
              message: '请输入相关信息'
            });
            return false;
          }
        }
        this.resumeBtn.disabled = true;
        this.$http.post('/userExtension/addEducationInfo', this.$qs.stringify({
          schoolType: this.resumeinfo.schoolType,
          major: this.resumeinfo.profession,
          graduatedSchoolName: this.resumeinfo.school,
          graduatedDate: this.resumeinfo.graduateTime,
          degree: this.resumeinfo.record,
          id: this.resumeinfo.id,
          userId: this.$route.params.id
        })).then(res => {
          if(res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: '修改成功'
            });
            this.resumeinfo.show = true;
            this.showDetail()
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
          this.resumeBtn.disabled = false;
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
        this.$http.post('/userExtension/identityUser', this.$qs.stringify({
          certificateType: this.identy.cardType,
          identifyId: this.identy.cardNum,
          realName: this.identy.userName,
          userId: this.$route.params.id
        })).then(res => {
          if(res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: '身份认证成功'
            });
            this.identy.show = true;
            this.showDetail()
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
          this.identyBtn.disabled = false;
        })
      },
      //修改结算方式
      modifyPayWay (){
        this.payWayBtn.disabled = true;
        this.$http.post('/financeNew/setDefaultSettleType', this.$qs.stringify({
          userCode: this.$route.query.code,
          settleType: this.payWay.type
        })).then(res => {
          if(res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: '修改成功'
            });
            this.payWay.show = true;
            this.showDetail()
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
          this.payWayBtn.disabled = false;
        })
      },
      //测试情况
      showTestDetail (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 20;
        this.loading = true;
        this.$http.post('/exam/admin/getUserExamDetail', this.$qs.stringify({
          pageNo: config.pageNo-1,
          pageSize: config.pageSize,
          userId: this.$route.params.id
        })).then(res => {
          if(res.data.message === 'success'){
            this.testDetail.tableData = [];
            const list = res.data.data.content;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.testDetail.tableData.push(item)
            });
            this.testDetail.total = res.data.data.totalElements;
          }
          this.loading = false
        })
      }
    }
  }
</script>
