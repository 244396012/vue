<template>
  <div class="page">
    <div class="default-style">
      <div class="detail">
        <el-row class="exact">
          <el-col :span="6"><div class="grid-content bg-purple"><b style="font-size: 18px;">{{detail.userName}}</b>{{detail.userCode && '（'+detail.userCode+'）'}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>状态：</b>{{detail.status}}</div></el-col>
        </el-row>
        <el-row class="exact">
          <el-col :span="6"><div class="grid-content bg-purple"><b>翻译字数：</b>{{detail.wordCount}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>接单数：</b>{{detail.orderNum}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div><b>账户余额：</b>{{detail.accountRemain}}</el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>已提现：</b>{{detail.withdraw}}</div></el-col>
        </el-row>
        <template v-if="detail.userExtendList">
          <el-row class="exact" v-for="(item, index) in detail.userExtendList" :key="item.id">
            <el-col :span="6"><div class="grid-content bg-purple"><b>语言对{{(index+1) | formatNum}}：</b>{{item.sourceLanguageName + '->' + item.targetLanguageName}}</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple-light"><b>等级：</b>{{item.levelName}}</div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple"></div><b>领域：</b>{{item.areaName}}</el-col>
          </el-row>
        </template>
      </div>
    </div>
    <div class="default-style">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="译员信息" name="first">
            <div class="detail">
              <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">基本信息
                <template v-if="interpreterDetail.userExtension && interpreterDetail.userExtension.userSource === '绿色通道译员'">
                  <template v-if="baseinfo.show">
                    <el-button type="success" icon="el-icon-edit"
                               style="float: right"
                               @click="baseinfo.show = false">修改</el-button>
                  </template>
                  <template v-else>
                    <el-button type="success"
                               @click="modifyBase"
                               :disabled="baseBtn.disabled"
                               style="float: right;margin-left: 10px">{{baseBtn.txt}}</el-button>
                    <el-button @click="baseinfo.show = true" style="float: right;">取消</el-button>
                  </template>
                </template>
              </p>
              <table class="parttime-table">
                <tr>
                  <td class="name">译员编号</td><td>{{interpreterDetail.userCode}}</td>
                  <td class="name">译员昵称</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{interpreterDetail.nickName}}</span>
                    <input v-else v-model="baseinfo.nickName" type="text" >
                  </td>
                  <td class="name">真实姓名</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{interpreterDetail.userName}}</span>
                    <input v-else v-model="baseinfo.realName" type="text">
                  </td>
                  <td class="name">登录帐号</td><td>{{interpreterDetail.account}}</td>
                </tr>
                <tr>
                  <td class="name">母语</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{interpreterDetail.userExtension && interpreterDetail.userExtension.motherTongue}}</span>
                    <el-select v-else
                               v-model="baseinfo.language" placeholder="母语">
                      <el-option
                        v-for="item in $store.state.languageList"
                        :key="item.id"
                        :label="item.chineseName"
                        :value="item.chineseName">
                      </el-option>
                    </el-select>
                  </td>
                  <td class="name">出生日期</td><td>{{interpreterDetail.userExtension && interpreterDetail.userExtension.birthday}}</td>
                  <td class="name">翻译年限</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{interpreterDetail.userExtension && interpreterDetail.userExtension.translateYear}}</span>
                    <el-select v-else
                               v-model="baseinfo.transYear" placeholder="翻译年限">
                      <el-option
                        v-for="item in formSelect.transYearOptions"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </td>
                  <td class="name">性别</td><td>{{interpreterDetail.sex}}</td>
                </tr>
                <tr>
                  <td class="name">国籍</td><td style="padding: 0">
                    <span v-if="baseinfo.show">{{interpreterDetail.userExtension && interpreterDetail.userExtension.nationality}}</span>
                    <el-select v-else
                               v-model="baseinfo.national" placeholder="国籍">
                      <el-option
                        v-for="item in formSelect.nationalOptions"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </td>
                  <td class="name">邮箱</td><td>{{interpreterDetail.email}}</td>
                  <td class="name">QQ</td><td colspan="3">{{interpreterDetail.qq}}</td>
                </tr>
              </table>
              <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">账号信息</p>
              <table class="parttime-table">
                <tr>
                  <td class="name">注册时间</td><td>{{interpreterDetail.userExtension && interpreterDetail.userExtension.gmtCreate}}</td>
                  <td class="name">成为译员时间</td><td>{{interpreterDetail.userExtension && interpreterDetail.userExtension.translatorDate}}</td>
                  <td class="name">账号状态</td><td>{{interpreterDetail.isEnabled | formatStatus}}</td>
                  <td class="name">接单开关</td><td>{{interpreterDetail.userExtension && interpreterDetail.userExtension.orderTaked ? '开启' : '关闭'}}</td>
                </tr>
                <tr>
                  <td class="name">译员类型</td><td colspan="7">{{interpreterDetail.userExtension && interpreterDetail.userExtension.userSource}}</td>
                </tr>
              </table>
              <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">简历信息
                <template v-if="interpreterDetail.userExtension && interpreterDetail.userExtension.userSource === '绿色通道译员'">
                  <template v-if="resumeinfo.show">
                    <el-button type="success" icon="el-icon-edit"
                               style="float: right"
                               @click="resumeinfo.show = false">修改</el-button>
                  </template>
                  <template v-else>
                    <el-button type="success"
                               @click="modifyResume"
                               :disabled="resumeBtn.disabled"
                               style="float: right;margin-left: 10px">{{resumeBtn.txt}}</el-button>
                    <el-button @click="resumeinfo.show = true" style="float: right;">取消</el-button>
                  </template>
                </template>
              </p>
              <table class="parttime-table">
                <template v-if="interpreterDetail.userExtension && interpreterDetail.userExtension.userSource === '绿色通道译员'">
                  <tr>
                    <td class="name" rowspan="2">学历信息</td>
                    <td class="name">毕业院校</td><td style="padding: 0;">
                      <span v-if="resumeinfo.show">{{interpreterDetail.educationList[0].graduatedSchoolName}}（{{interpreterDetail.educationList[0].schoolType}}）</span>
                      <template v-else>
                        <input v-model="resumeinfo.school" type="text" style="width: 51%">
                        <el-select v-model="resumeinfo.schoolType" style="width: 45%">
                          <el-option value="国内">国内</el-option>
                          <el-option value="国外">国外</el-option>
                        </el-select>
                      </template>
                    </td>
                      <td class="name">专业</td><td style="padding: 0;">
                      <span v-if="resumeinfo.show">{{interpreterDetail.educationList[0].major}}</span>
                      <input v-else v-model="resumeinfo.profession" type="text">
                    </td>
                      <td class="name">学历</td><td style="padding: 0;">
                      <span v-if="resumeinfo.show">{{interpreterDetail.educationList[0].degree}}</span>
                      <el-select v-else v-model="resumeinfo.record" placeholder="学历">
                        <el-option
                          v-for="item in formSelect.recordOptions"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </td>
                  </tr>
                  <tr>
                    <td class="name">毕业时间</td><td colspan="5" style="padding: 0;">
                    <span v-if="resumeinfo.show">{{interpreterDetail.educationList[0].graduatedDate.slice(0,7)}}</span>
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
                  <template v-for="(item,index) in interpreterDetail.educationList">
                    <tr>
                      <td class="name" v-if="index === 0" :rowspan="interpreterDetail.educationList.length*2">学历信息</td>
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
                  <td class="name" colspan="1">技能证书</td>
                  <td colspan="6">
                    <div class="td-item" v-for="(item,index) in interpreterDetail.userSkillList" :key="index">
                      <img :src="'http://'+item.userCertificatePath" alt="404">
                      <p>{{item.userCertificateType}}</p>
                    </div>
                  </td>
                </tr>
                <template v-for="(item, index) in interpreterDetail.workExperienceList">
                  <tr>
                    <td class="name" v-if="index === 0" :rowspan="interpreterDetail.workExperienceList.length*2">工作经验</td>
                    <td class="name">公司名称</td><td>{{item.companyName}}</td>
                    <td class="name">工作时间</td><td colspan="3">{{item.startDatetime.slice(0,7)}} - {{item.endDatetime.slice(0,7)}}</td>
                  </tr>
                  <tr>
                    <td class="name">职位描述</td><td colspan="5">{{item.workDescribe}}</td>
                  </tr>
                </template>
                <template v-for="(item, index) in interpreterDetail.projectExperienceList">
                  <tr>
                    <td class="name" v-if="index === 0" :rowspan="interpreterDetail.workExperienceList.length*2">项目经历</td>
                    <td class="name">项目名称</td><td>{{item.projectName}}</td>
                    <td class="name">项目时间</td><td>{{item.startDatetime.slice(0,7)}} - {{item.endDatetime.slice(0,7)}}</td>
                    <td class="name">所属公司</td><td>{{item.companyName}}</td>
                  </tr>
                  <tr>
                    <td class="name">项目描述</td><td colspan="5">{{item.projectDescribe}}</td>
                  </tr>
                </template>
                <tr>
                  <td class="name" colspan="1">个性标签及擅长领域</td>
                  <td colspan="6">
                    <template v-if="interpreterDetail.userExtension && interpreterDetail.userExtension.individualization">
                      <el-tag v-for="item in interpreterDetail.userExtension.individualization.split(/[,，]/)" :key="item">{{item}}</el-tag>
                    </template>
                    <template v-if="interpreterDetail.userExtension && interpreterDetail.userExtension.area">
                      <el-tag v-for="item in interpreterDetail.userExtension.area.split(/[,，]/)" :key="item">{{item}}</el-tag>
                    </template>
                  </td>
                </tr>
              </table>
              <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">身份认证
                <template v-if="interpreterDetail.userExtension
                && interpreterDetail.userExtension.userSource === '绿色通道译员'
                && interpreterDetail.userExtension.certificatePassed === 0">
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
                  <td class="name">认证状态</td><td>{{interpreterDetail.userExtension && interpreterDetail.userExtension.certificatePassed ?'已认证':'未认证'}}</td>
                  <td class="name">真实姓名</td><td>{{interpreterDetail.userName}}</td>
                  <td class="name">证件类型</td><td style="padding: 0;">
                    <span v-if="identy.show">{{interpreterDetail.userExtension && interpreterDetail.userExtension.certificateType}}</span>
                    <el-select v-else v-model="identy.cardType" placeholder="证件类型">
                      <el-option
                        v-for="item in formSelect.cardOptions"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </td>
                  <td class="name">证件号码</td><td style="padding: 0;">
                    <span v-if="identy.show">{{interpreterDetail.userExtension && interpreterDetail.userExtension.certificateNumFuzzy}}</span>
                    <input v-else v-model="identy.cardNum" type="text">
                  </td>
                </tr>
              </table>
              <p class="sy-bold sy-title" style="overflow: auto;margin-bottom: 8px;line-height: 38px;">结算认证
                <el-button type="text" style="float: right;cursor: auto">默认结算方式：{{interpreterDetail.settleList | filterCard}}</el-button>
              </p>
              <table class="parttime-table">
                <template v-for="item in interpreterDetail.settleList">
                  <template v-if="item.selttleName === '银行卡'">
                    <tr>
                      <td class="name" rowspan="2">银行卡结算</td>
                      <td class="name">真实姓名</td><td>{{item.realName}}</td>
                      <td class="name">证件号码</td><td>{{interpreterDetail.userExtension && interpreterDetail.userExtension.certificateNumFuzzy}}</td>
                      <td class="name">银行卡号</td><td>{{item.settleAccountFuzzy}}</td>
                    </tr>
                    <tr>
                      <td class="name">开户银行</td><td>{{item.bankDeposit}}</td>
                      <td class="name">开户支行</td><td colspan="3">{{item.bankBranch}}</td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td class="name" rowspan="1">支付宝结算</td>
                      <td class="name">真实姓名</td><td>{{item.realName}}</td>
                      <td class="name">证件号码</td><td>{{interpreterDetail.userExtension && interpreterDetail.userExtension.certificateNumFuzzy}}</td>
                      <td class="name">支付宝账号</td><td>{{item.settleAccountFuzzy}}</td>
                    </tr>
                  </template>
                </template>
              </table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="测试情况" name="second">
            <el-table
              border
              stripe
              :max-height="$store.state.tableHeight"
              v-loading="loading"
              :data="testDetail.tableData">
              <el-table-column
                prop="num"
                label="#"
                width="40">
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
                prop="targetLanguage"
                label="语言">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                label="语言对">
                <template slot-scope="scope">{{scope.row.originLanguage}} -> {{scope.row.targetLanguage}}</template>
              </el-table-column>
              <el-table-column
                width="100"
                prop="examResult"
                label="测试结果">
              </el-table-column>
              <el-table-column
                width="110"
                prop="auditor"
                label="测试审核人">
              </el-table-column>
              <el-table-column
                width="110"
                prop="setLevel"
                label="测试后定级">
              </el-table-column>
              <el-table-column
                width="80"
                prop="comment"
                label="备注">
              </el-table-column>
            </el-table>
            <template v-if="testDetail.total > 0">
              <test-pagination :callback="showTestDetail" :total="testDetail.total"></test-pagination>
            </template>
          </el-tab-pane>
          <el-tab-pane label="订单情况" name="third">
            <el-table
              border
              stripe
              :max-height="$store.state.tableHeight"
              v-loading="loading"
              :data="orderDetail.tableData">
              <el-table-column
                prop="num"
                label="#"
                width="40">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="taskId"
                label="订单编号">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="taskName"
                label="订单名称">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="projectName"
                label="项目名称">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="languageZh"
                label="语言对">
              </el-table-column>
              <el-table-column
                width="90"
                prop="orderTypeZh"
                label="订单类型">
              </el-table-column>
              <el-table-column
                width="100"
                prop="workLoad"
                label="订单数量">
              </el-table-column>
              <el-table-column
                width="100"
                prop="orderPrice"
                label="订单金额">
              </el-table-column>
              <el-table-column
                width="120"
                prop="settlementPrice"
                label="译员结算金额">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="requireTime"
                label="要求完成时间">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="realCompletTime"
                label="实际完成时间">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="80"
                prop="domainZh"
                label="领域">
              </el-table-column>
              <el-table-column
                width="80"
                prop="taskStatusZh"
                label="订单状态">
              </el-table-column>
            </el-table>
            <template v-if="orderDetail.total > 0">
              <test-pagination :callback="showOrderDetail" :total="orderDetail.total"></test-pagination>
            </template>
          </el-tab-pane>
          <el-tab-pane label="账户记录" name="fourth">
            <el-table
              border
              stripe
              :max-height="$store.state.tableHeight"
              v-loading="loading"
              :data="accountDetail.tableData">
              <el-table-column
                prop="num"
                label="#"
                width="40">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="gmtCreate"
                label="时间">
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="amount"
                label="金额(元)">
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="changeType"
                label="变动类型">
              </el-table-column>
              <el-table-column
                min-width="110"
                prop="settleType"
                label="结算方式">
              </el-table-column>
              <el-table-column
                min-width="110"
                prop="account"
                label="到账账户">
              </el-table-column>
              <el-table-column
                min-width="110"
                prop="balance"
                label="账户剩余(元)">
              </el-table-column>
            </el-table>
            <template v-if="accountDetail.total > 0">
              <account-pagination :callback="showAccountDetail" :total="accountDetail.total"></account-pagination>
            </template>
          </el-tab-pane>
          <el-tab-pane label="积分记录" name="fifth">
            <el-table
              border
              stripe
              :max-height="$store.state.tableHeight"
              v-loading="loading"
              :data="scoreDetail.tableData">
              <el-table-column
                prop="num"
                label="#"
                width="40">
              </el-table-column>
              <el-table-column
                min-width="110"
                prop="gmtCreate"
                label="发放时间">
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="desc"
                label="积分变更">
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="inOutCome"
                label="积分">
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="totalPoint"
                label="累计积分">
              </el-table-column>
            </el-table>
            <template v-if="scoreDetail.total > 0">
              <score-pagination :callback="showScoreDetail" :total="scoreDetail.total"></score-pagination>
            </template>
          </el-tab-pane>
          <el-tab-pane label="红包发放详情" name="sixth">
            <el-table
              border
              stripe
              :max-height="$store.state.tableHeight"
              v-loading="loading"
              :data="packetDetail.tableData">
              <el-table-column
                prop="num"
                label="#"
                width="40">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="gmtCreate"
                label="发放时间">
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="desc"
                label="发放事由">
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="amount"
                label="红包金额">
              </el-table-column>
              <el-table-column
                min-width="110"
                prop="redbagType"
                label="红包类型">
              </el-table-column>
              <el-table-column
                min-width="110"
                prop="unlockRate"
                label="解锁比例">
              </el-table-column>
              <el-table-column
                min-width="110"
                prop="amountTotal"
                label="红包累计">
              </el-table-column>
            </el-table>
            <template v-if="packetDetail.total > 0">
              <packet-pagination :callback="showPacketDetail" :total="packetDetail.total"></packet-pagination>
            </template>
          </el-tab-pane>
          <el-tab-pane label="签到详情" name="seventh">
            <el-row style="margin: 0;padding: 0;text-align: right;">
              <el-button type="text">连续签到：{{sign.continuityCount}}天</el-button>
              <el-button type="text">总签到次数：{{sign.total}}天</el-button>
            </el-row>
            <el-table
              border
              stripe
              :max-height="$store.state.tableHeight"
              v-loading="loading"
              :data="signDetail.tableData">
              <el-table-column
                prop="num"
                label="#"
                width="40">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="signDate"
                label="日期">
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="mark"
                label="是否签到">
                <template slot-scope="scope">{{scope.row.mark ? '已签到':'未签到'}}</template>
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="gmtCreate"
                label="签到时间">
              </el-table-column>
              <el-table-column
                min-width="110"
                prop="integral"
                label="签到奖励">
                <template slot-scope="scope">+{{scope.row.integral}}积分</template>
              </el-table-column>
            </el-table>
            <template v-if="signDetail.total > 0">
              <sign-pagination :callback="showSignDetail" :total="signDetail.total"></sign-pagination>
            </template>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>
<script>
  import pagination from '@/components/pagination'
  export default {
    components: {
      'test-pagination': pagination,
      'order-pagination': pagination,
      'account-pagination': pagination,
      'score-pagination': pagination,
      'packet-pagination': pagination,
      'sign-pagination': pagination
    },
    data (){
      return {
        activeName: 'first',
        interpreterDetail: '',
        detail: {
          userId: '',
          userName: '--',
          userCode: '--',
          status: '--',
          wordCount: '--',
          orderNum: '--',
          accountRemain: '--',
          withdraw: '--',
          userExtendList: ''
        },
        baseinfo: {
          show: true,
          nickName: '',
          realName: '',
          transYear: '',
          national: '',
          language: ''
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
        baseBtn: {
          disabled: false,
          txt: '保存'
        },
        resumeBtn: {
          disabled: false,
          txt: '保存'
        },
        identyBtn: {
          disabled: false,
          txt: '保存'
        },
        formSelect: {
          nationalOptions: ['中国'],
          cardOptions: ['身份证','护照'],
          recordOptions: ['博士','硕士','本科','大专','其他'],
          transYearOptions:['1年以内','1-3年','3-5年','5年-10年','10年以上']
        },
        loading: false,
        testDetail: {
          load: false,
          total: 0,
          tableData: []
        },
        orderDetail: {
          load: false,
          total: 0,
          tableData: []
        },
        accountDetail: {
          load: false,
          total: 0,
          tableData: []
        },
        scoreDetail: {
          load: false,
          total: 0,
          tableData: []
        },
        packetDetail: {
          load: false,
          total: 0,
          tableData: []
        },
        signDetail: {
          load: false,
          total: 0,
          tableData: []
        },
        sign: {
          continuition: '--',
          total: '--'
        }
      }
    },
    filters: {
      formatNum (num){
        switch (num){
          case 1: return '一';
          case 2: return '二';
          case 3: return '三';
          case 4: return '四';
          case 5: return '五';
          case 6: return '六';
          case 7: return '七';
          case 8: return '八';
          case 9: return '九';
          case 10: return '十';
        }
      },
      formatStatus (status){
        switch (status){
          case -1: return '冻结';
          case 0: return '停用';
          case 1: return '启用';
        }
      },
      filterCard (data){
        let result = '';
        if(typeof data === 'object'){
          data.forEach(item => {
            if(item.settleDefault){
              result = item.selttleName;
              return result;
            }
          });
        }
        return result;
      }
    },
    mounted (){
      this.showDetail();
      this.showBalanceDetail();
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event);
        if(tab.label === '测试情况' && !this.testDetail.load){
          this.showTestDetail()
        }else if(tab.label === '订单情况' && !this.orderDetail.load){
          this.showOrderDetail()
        }else if(tab.label === '账户记录' && !this.accountDetail.load){
          this.showAccountDetail()
        }else if(tab.label === '积分记录' && !this.scoreDetail.load){
          this.showScoreDetail()
        }else if(tab.label === '红包发放详情' && !this.packetDetail.load){
          this.showPacketDetail()
        }else if(tab.label === '签到详情' && !this.signDetail.load){
          this.showSignDetail();
          this.showSignTotal();
        }
      },
      //获取详情数据
      showDetail (){
        this.$http.get('/userExtension/getPartTimeStaffByUserId', {
          params: {
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.detail.userId = res.data.data.id;
            this.detail.userName = res.data.data.userName;
            this.detail.userCode = res.data.data.userCode;
            this.detail.status = res.data.data.userExtension.translatorIdleStatus;
            this.detail.userExtendList = res.data.data.userExtendList;
            this.interpreterDetail = res.data.data;
            this.baseinfo.nickName = res.data.data.nickName;
            this.baseinfo.realName = res.data.data.userName;
            this.baseinfo.qq = res.data.data.qq;
            this.baseinfo.email = res.data.data.email;
            this.baseinfo.birthday = res.data.data.userExtension.birthday;
            this.baseinfo.sex = res.data.data.sex;
            if(res.data.data.userExtension){
              this.baseinfo.language = res.data.data.userExtension.motherTongue;
              this.baseinfo.transYear = res.data.data.userExtension.translateYear;
              this.baseinfo.national = res.data.data.userExtension.nationality;
              this.identy.cardNum = res.data.data.userExtension.certificateNum;
              this.identy.cardType = res.data.data.userExtension.certificateType;
              this.identy.userName = res.data.data.userName;
            }
            if(res.data.data.educationList.length > 0){
              this.resumeinfo.id = res.data.data.educationList[0].id;
              this.resumeinfo.school = res.data.data.educationList[0].graduatedSchoolName;
              this.resumeinfo.schoolType = res.data.data.educationList[0].schoolType;
              this.resumeinfo.profession = res.data.data.educationList[0].major;
              this.resumeinfo.record = res.data.data.educationList[0].degree;
              this.resumeinfo.graduateTime = res.data.data.educationList[0].graduatedDate.slice(0,7);
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
            this.detail.wordCount = res.data.data.wordCount;
            this.detail.orderNum = res.data.data.receiptCount;
            this.detail.accountRemain = res.data.data.balance;
            this.detail.withdraw = res.data.data.withDraw;
          }
        })
      },
      //修改基本信息
      modifyBase (){
        for(let prop in this.baseinfo){
          if(prop !== 'show'
            && prop !== 'qq'
            && prop !== 'sex'
            && prop !== 'email'
            && prop !== 'birthday'
            && this.baseinfo[prop].trim() === ''){
            this.$message({
              type: 'warning',
              message: '请输入相关信息'
            });
            return false;
          }
        }
        this.baseBtn.disabled = true;
        this.baseBtn.txt = '保存中';
        this.$http.post('/userExtension/addBasicInfo', this.$qs.stringify({
          QQ: this.baseinfo.qq,
          sex: this.baseinfo.sex,
          email: this.baseinfo.email,
          birthday: this.baseinfo.birthday,
          nickName: this.baseinfo.nickName,
          realName: this.baseinfo.realName,
          motherTogue: this.baseinfo.language,
          nationality: this.baseinfo.national,
          tranlateYear: this.baseinfo.transYear,
          userId: this.detail.userId
        })).then(res => {
          if(res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: '修改成功'
            });
            this.baseinfo.show = true;
            this.baseBtn.disabled = false;
            this.baseBtn.txt = '保存';
            this.showDetail()
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
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
        this.resumeBtn.txt = '保存中';
        this.$http.post('/userExtension/addEducationInfo', this.$qs.stringify({
          schoolType: this.resumeinfo.schoolType,
          major: this.resumeinfo.profession,
          graduatedSchoolName: this.resumeinfo.school,
          graduatedDate: this.resumeinfo.graduateTime,
          degree: this.resumeinfo.record,
          id: this.resumeinfo.id,
          userId: this.detail.userId
        })).then(res => {
          if(res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: '修改成功'
            });
            this.resumeinfo.show = true;
            this.resumeBtn.disabled = false;
            this.resumeBtn.txt = '保存';
            this.showDetail()
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
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
              message: '身份认证成功'
            });
            this.identy.show = true;
            this.identyBtn.disabled = false;
            this.identyBtn.txt = '保存';
            this.showDetail()
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
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
            res.data.data.content.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.testDetail.tableData.push(item)
            });
            this.testDetail.total = res.data.data.totalElements;
            this.testDetail.load = true;
          }
          this.loading = false
        })
      },
      //订单情况
      showOrderDetail (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/task/listTaskDetailInfo', {
          params: {
            page: config.pageNo,
            limit: config.pageSize,
            userCode: this.detail.userCode
          }
        }).then(res => {
          if(res.data.success && res.data.data.list.length >= 0){
            this.orderDetail.tableData = [];
            res.data.data.list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.orderDetail.tableData.push(item)
            });
            this.orderDetail.total = res.data.data.totalRow;
            this.orderDetail.load = true;
          }
          this.loading = false
        })
      },
      //账户记录
      showAccountDetail (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/finance/listFinanceDetail', {
          params: {
            page: config.pageNo-1,
            limit: config.pageSize,
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success' && res.data.data.content.length >= 0){
            this.accountDetail.tableData = [];
            res.data.data.content.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.accountDetail.tableData.push(item)
            });
            this.accountDetail.total = res.data.data.totalElements;
            this.accountDetail.load = true;
          }
          this.loading = false
        })
      },
      //积分记录
      showScoreDetail (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/pointDetail/listPointDetail', {
          params: {
            page: config.pageNo-1,
            limit: config.pageSize,
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success' && res.data.data.content.length >= 0){
            this.scoreDetail.tableData = [];
            res.data.data.content.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.scoreDetail.tableData.push(item)
            });
            this.scoreDetail.total = res.data.data.totalElements;
            this.scoreDetail.load = true;
          }
          this.loading = false
        })
      },
      //红包发放详情
      showPacketDetail (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/redBagDetail/listAllRedBagDetail', {
          params: {
            page: config.pageNo-1,
            limit: config.pageSize,
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success' && res.data.data.content.length >= 0){
            this.packetDetail.tableData = [];
            res.data.data.content.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.packetDetail.tableData.push(item)
            });
            this.packetDetail.total = res.data.data.totalElements;
            this.packetDetail.load = true;
          }
          this.loading = false
        })
      },
      //签到详情
      showSignDetail (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/sign/listSignInfo', {
          params: {
            page: config.pageNo-1,
            limit: config.pageSize,
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success' && res.data.data.content.length >= 0){
            this.signDetail.tableData = [];
            res.data.data.content.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.signDetail.tableData.push(item)
            });
            this.signDetail.total = res.data.data.totalElements;
            this.signDetail.load = true;
          }
          this.loading = false
        })
      },
      //签到总天数、连续签到
      showSignTotal (){
        this.$http.get('/sign/getSignSummary', {
          params: {
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.sign.continuityCount = res.data.data.signContinuityCount;
            this.sign.total = res.data.data.signTotalCount;
          }
        })
      }
    }
  }
</script>
