<template>
  <div class="page">
    <div class="default-style">
      <div class="detail" style="padding-bottom: 5px">
        <el-row class="exact">
          <el-col :span="6"><div class="grid-content bg-purple"><b style="font-size: 18px;">
            {{userDetail.userName}}</b>{{userDetail.userCode && '（'+userDetail.userCode+'）'}}</div></el-col>
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
              <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">基本信息</p>
              <table class="parttime-table">
                <tr>
                  <td class="name">译员编号</td><td>{{userDetail.userCode}}</td>
                  <td class="name">译员昵称</td><td>{{userDetail.nickName}}</td>
                  <td class="name">真实姓名</td><td>{{userDetail.userName}}</td>
                  <td class="name">性别</td><td>{{userDetail.sex}}</td>
                </tr>
                <tr>
                  <td class="name">母语</td><td>
                  {{userDetail.userExtension && userDetail.userExtension.motherTongue}}
                  </td>
                  <td class="name">出生日期</td><td>{{userDetail.userExtension && userDetail.userExtension.birthday}}</td>
                  <td class="name">翻译年限</td><td>
                  {{userDetail.userExtension && userDetail.userExtension.translateYear}}
                  </td>
                  <td class="name">国籍</td><td>
                  {{userDetail.userExtension && userDetail.userExtension.nationality}}
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
              </table>
              <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">账号信息</p>
              <table class="parttime-table">
                <tr>
                  <td class="name">注册时间</td><td>{{userDetail.userExtension && userDetail.userExtension.gmtCreate}}</td>
                  <td class="name">成为译员时间</td><td>{{userDetail.userExtension && userDetail.userExtension.translatorDate}}</td>
                  <td class="name">账号状态</td><td>{{userDetail.userExtension && userDetail.isEnabled | formatStatus}}</td>
                  <td class="name">接单开关</td><td>{{userDetail.userExtension && userDetail.userExtension.orderTaked ? '开启' : '关闭'}}</td>
                </tr>
                <tr>
                  <td class="name">译员类型</td><td>{{userDetail.userExtension && userDetail.userExtension.userSource}}</td>
                  <td class="name">绑定手机号</td><td>{{userDetail.telephone}}</td>
                  <td class="name">绑定邮箱</td><td colspan="3">{{userDetail.email}}</td>
                </tr>
              </table>
              <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">简历信息</p>
              <table class="parttime-table">
                <template v-if="userDetail.userExtension && userDetail.userExtension.userSource === '绿通用户'">
                  <tr>
                    <td class="name" rowspan="2">学历信息</td>
                    <td class="name">毕业院校</td><td>{{userDetail.educationList[0].graduatedSchoolName}}（{{userDetail.educationList[0].schoolType}}）</td>
                    <td class="name">专业</td><td>{{userDetail.educationList[0].major}}</td>
                    <td class="name">学历</td><td>{{userDetail.educationList[0].degree}}</td>
                  </tr>
                  <tr>
                    <td class="name">毕业时间</td><td colspan="5">{{userDetail.educationList[0].graduatedDate.slice(0,7)}}</td>
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
                      <el-image
                        style="width: 100px; height: 100px"
                        :src="item.userCertificatePath"
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
                      <el-tag v-for="item in userDetail.userExtension.individualization.split(/[,，]/)" :key="item">{{item}}</el-tag>
                    </template>
                    <template v-if="userDetail.userExtension && userDetail.userExtension.area">
                      <el-tag v-for="item in userDetail.userExtension.area.split(/[,，]/)" :key="item">{{item}}</el-tag>
                    </template>
                  </td>
                </tr>
              </table>
              <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">身份认证</p>
              <table class="parttime-table">
                <tr>
                  <td class="name">认证状态</td><td>{{userDetail.userExtension && userDetail.userExtension.certificatePassed ?'已认证':'未认证'}}</td>
                  <td class="name">真实姓名</td><td>{{userDetail.userName}}</td>
                  <td class="name">证件类型</td><td>{{userDetail.userExtension && userDetail.userExtension.certificateType}}</td>
                  <td class="name">证件号码</td><td>{{userDetail.userExtension && userDetail.userExtension.certificateNumFuzzy}}</td>
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
                  <td class="name">结算类型</td>
                  <td class="name">当前结算类型</td>
                  <td colspan="5">
                       {{userDetail.userExtension && userDetail.userExtension.defaultSettleType !== ''?userDetail.userExtension.defaultSettleType:'默认'}}
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
                  width="90"
                  prop="sourceFrom"
                  label="测试类型">
                </el-table-column>
                <el-table-column
                  width="110"
                  prop="preLevle"
                  label="测试前等级">
                </el-table-column>
                <el-table-column
                  width="90"
                  prop="examType"
                  label="试题类型">
                  <template slot-scope="scope">{{scope.row.examType === 'select'?'选择题':'翻译题'}}</template>
                </el-table-column>
                <el-table-column
                  width="90"
                  prop="questionLevel"
                  label="试题等级">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  min-width="110"
                  label="语言对">
                  <template slot-scope="scope" v-if="scope.row.originLanguage">{{scope.row.originLanguage}} -> {{scope.row.targetLanguage}}</template>
                </el-table-column>
                <el-table-column
                  width="100"
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
            <detail-skill ref="skill" :detail="skillDetail" :callback="showDetail"></detail-skill>
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
  import { formatNum, formatAccountStatus } from '@/common/filter';
  import detailSkill from '@/page/parttimeUser/component/detailSkill';
  import detailComment from '@/page/parttimeUser/component/detailComment';
  import detailAccount from '@/page/parttimeUser/component/detailAccount';
  import detailScore from '@/page/parttimeUser/component/detailScore';
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
        skillDetail: {},
        userDetail: {}, //译员详情
        accountDetail: {}, //账户详情
        baseinfo: {
          show: true,
          nickName: '',
          realName: '',
          transYear: '',
          national: '',
          language: '',
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
        loading: false,
        testDetail: {
          total: 0,
          tableData: []
        }
      }
    },
    filters: {
      formatNum: formatNum,
      formatStatus:formatAccountStatus
    },
    created (){
      this.$http.interceptors.request.use(
        req => {
          const token = this.$route.query.t;
          if(token){
            req.headers.common['Authorization'] = 'bearer ' + token
          }
          return req
        },
        err => {
          return err
        }
      );
      this.showDetail();
      this.showBalanceDetail();
      this.showTestDetail();
    },
    computed: {
      ...mapState('select',{
        cardOptions: state => state.idCardOptions,
        payOptions: state => state.payOptions,
        recordOptions: state => state.recordOptions
      })
    },
    methods: {
      handleClick(tab) {
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
              this.skillDetail.userSource = _data.userExtension && _data.userExtension.userSource || '';
              this.skillDetail.userExtendList = _data.userExtendList;
              this.skillDetail.transYear = _data.userExtension.translateYear;
              this.skillDetail.transDate = _data.userExtension.translatorDate;
              this.skillDetail = Object.assign({}, this.skillDetail);
              this.baseinfo.birthday = _data.userExtension.birthday;
              this.baseinfo.language = _data.userExtension.motherTongue;
              this.baseinfo.transYear = _data.userExtension.translateYear;
              this.baseinfo.national = _data.userExtension.nationality;
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
            this.skillDetail.wordCount = res.data.data.wordCount;
          }
        })
      },
      //测试情况
      showTestDetail (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.post('/exam/admin/getUserExamDetail', this.$qs.stringify({
          pageNo: config.pageNo-1,
          pageSize: config.pageSize,
          userId: this.$route.params.id
        })).then(res => {
          if(res.data.code === '200' && res.data.data.content.length >= 0){
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
