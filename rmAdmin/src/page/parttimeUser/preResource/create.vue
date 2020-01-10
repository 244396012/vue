<template>
  <div class="page">
    <div class="default-style">
      <div class="detail form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm green-form-p">
          <el-form-item label="用户帐号：" required class="small-line" style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item prop="phone">
                <el-input v-model="ruleForm.phone" clearable placeholder="请输入手机号/邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="padding-left: 10px;color: #999;font-size: 12px">注：该用户帐号为译员的登录账号</el-col>
          </el-form-item>
          <el-form-item label="真实姓名：" required class="small-line" style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item :prop="'realName'"
                            :rules="{ required: true, message: '请输入真实姓名', trigger: 'blur' }">
                <el-input v-model="ruleForm.realName" clearable placeholder="请输入译员真实姓名"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="兼职类型：" required class="small-line" style="margin-bottom: 0px">
            <el-col :span="20">
              <el-form-item prop="partTimeType"
                            :rules="{ type: 'array',required: true, message: '请选择兼职类型', trigger: 'change' }"
                            style="margin-bottom: 6px">
                <el-checkbox-group v-model="ruleForm.partTimeType">
                  <el-checkbox label="笔译">笔译</el-checkbox>
                  <el-checkbox label="DTP">DTP</el-checkbox>
                  <el-checkbox label="会展">会展</el-checkbox>
                  <el-checkbox label="外派">外派</el-checkbox>
                  <el-checkbox label="培训">培训</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-form-item>
          <!-- 笔译 -->
          <template v-if="ruleForm.partTimeType.includes('笔译')">
            <el-form-item label="语言信息（必填）" style="margin-bottom: 0px">
              <el-button type="success" icon="el-icon-circle-plus-outline" @click="addLanPair">添加语言对</el-button>
            </el-form-item>
            <div class="lan-item" v-for="(item, index) in ruleForm.language" :key="index">
              <el-form-item label="语言对：" required style="margin-bottom: 0px">
                <el-col :span="10">
                  <el-select class="exact" v-model="item.origin" placeholder="源语言">
                    <el-option
                      v-for="lg in $store.state.languageList"
                      :key="lg.id"
                      :label="lg.chineseName"
                      :value="lg.chineseName+','+lg.englishName+','+lg.englishSimpleName"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="1" style="text-align: center">-</el-col>
                <el-col :span="10">
                  <el-select class="exact" v-model="item.target" placeholder="目标语言">
                    <el-option
                      v-for="lg in $store.state.languageList"
                      :key="lg.id"
                      :label="lg.chineseName"
                      :value="lg.chineseName+','+lg.englishName+','+lg.englishSimpleName"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="2" style="text-align: right">
                  <el-button type="text" class="del" v-if="index>0" @click="deleteLan(ruleForm.language, index)">删除</el-button>
                </el-col>
              </el-form-item>
              <el-form-item label="行业领域：" required style="margin-bottom: 0px">
                <el-col :span="10">
                  <el-select class="exact"
                             @change="getSecondFieldFn(index)"
                             v-model="item.firstField" placeholder="一级领域">
                    <el-option
                      v-for="fd in $store.state.fieldOptions"
                      :key="fd.id"
                      :label="fd.fullSpecialtyName"
                      :value="fd.fullSpecialtyName"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="1" style="text-align: center">-</el-col>
                <el-col :span="10">
                  <el-select class="exact"
                             multiple
                             :collapse-tags="true"
                             v-model="item.secondField" placeholder="二级领域">
                    <el-option
                      v-for="fd in item.secondFieldOptions"
                      :key="fd.id"
                      :label="fd.fullSpecialtyName"
                      :value="fd.fullSpecialtyName"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="译员等级：" required>
                <el-col :span="10">
                  <el-select class="exact" v-model="item.level" placeholder="请选择该语种等级">
                    <el-option
                      v-for="lv in memberLevel"
                      :key="lv"
                      :label="lv"
                      :value="lv"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
            </div>
          </template>
          <!-- DTP -->
          <template v-if="ruleForm.partTimeType.includes('DTP')">
            <div style="line-height: 40px;font-weight: 700">DTP技能信息（必填）</div>
            <div class="lan-item dtp">
              <el-form-item label="DTP排版经验：" required>
                <el-col :span="10">
                  <el-select class="exact" v-model="ruleForm.dtpPair.exper" placeholder="请选择排版经验">
                    <el-option label="1年以下" value="1年以下"></el-option>
                    <el-option label="1~2年" value="1~2年"></el-option>
                    <el-option label="2~3年" value="2~3年"></el-option>
                    <el-option label="3年以上" value="3年以上"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="擅长软件：" required class="small-line">
                <el-col :span="24">
                  <el-checkbox-group v-model="ruleForm.dtpPair.software">
                    <el-checkbox label="Word">Word</el-checkbox>
                    <el-checkbox label="Excel">Excel</el-checkbox>
                    <el-checkbox label="PowerPoint">PowerPoint</el-checkbox>
                    <el-checkbox label="Photoshop">Photoshop</el-checkbox>
                    <el-checkbox label="FrameMaker">FrameMaker</el-checkbox>
                    <el-checkbox label="AutoCAD">AutoCAD</el-checkbox>
                    <el-checkbox label="PageMaker">PageMaker</el-checkbox>
                    <el-checkbox label="Illustrator">Illustrator</el-checkbox>
                    <el-checkbox label="QuarkXpress">QuarkXpress</el-checkbox>
                    <el-checkbox label="Pm">Pm</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-form-item>
              <el-form-item label="任务标签：" required class="small-line">
                <el-col :span="20">
                  <el-checkbox-group v-model="ruleForm.dtpPair.taskLabel">
                    <el-checkbox
                      v-for="(item, index) of formSelect.dtpTaskOptions"
                      :key="index" :label="item.handleType+','+item.id">{{item.handleType}}</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-form-item>
            </div>
          </template>
          <!-- 会展 -->
          <div v-show="ruleForm.partTimeType.includes('会展')">
            <div style="line-height: 40px;font-weight: 700">会展技能信息（必填）</div>
            <div class="lan-item">
              <el-form-item label="口译经验：" required style="margin-bottom: 5px">
                <el-col :span="10">
                  <el-select class="exact" v-model="ruleForm.meetingPair.exper" placeholder="请选择口译经验">
                    <el-option label="1年以下" value="1年以下"></el-option>
                    <el-option label="1~3年" value="1~3年"></el-option>
                    <el-option label="3~5年" value="3~5年"></el-option>
                    <el-option label="5年以上" value="5年以上"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="服务地区：" required style="margin-bottom: 0px">
                <el-col :span="24">
                  <div class="areaPicker">
                    <select v-model="ruleForm.meetingPair.province"
                            style="width: 120px"
                            @change="resetProvince(ruleForm.meetingPair)"
                            name="serviceprovince" id="serviceprovince"></select>
                    <select v-model="ruleForm.meetingPair.city"
                            style="width: 120px"
                            name="servicecity" id="servicecity"></select>
                    <select v-model="ruleForm.meetingPair.area"
                            style="width: 120px"
                            name="servicearea" id="servicearea"></select>
                  </div>
                </el-col>
              </el-form-item>
              <el-form-item label="口译类型：" required style="margin-bottom: 0px">
                <el-col :span="24">
                  <el-checkbox-group v-model="ruleForm.meetingPair.type">
                    <el-checkbox label="同声传译">同声传译</el-checkbox>
                    <el-checkbox label="陪同口译">陪同口译</el-checkbox>
                    <el-checkbox label="大型活动">大型活动</el-checkbox>
                    <el-checkbox label="交替传译">交替传译</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-form-item>
              <el-form-item label="语种信息：" required>
                <el-col :span="5">
                  <el-select class="exact" v-model="ruleForm.meetingPair.language" placeholder="擅长语言">
                    <el-option
                      v-for="lg in $store.state.languageList"
                      :key="lg.id"
                      :label="lg.chineseName"
                      :value="lg.chineseName"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-select class="exact"
                             v-model="ruleForm.meetingPair.firstField"
                             @change="getSecondFieldBaseFn(ruleForm.meetingPair.firstField, ruleForm.meetingPair)"
                             placeholder="一级领域">
                    <el-option
                      v-for="fd in $store.state.fieldOptions"
                      :key="fd.id"
                      :label="fd.fullSpecialtyName"
                      :value="fd.fullSpecialtyName"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-select class="exact"
                             v-model="ruleForm.meetingPair.secondField"
                             multiple
                             :collapse-tags="true"
                             placeholder="二级领域">
                    <el-option
                      v-for="fd in ruleForm.meetingPair.secondFieldOptions"
                      :key="fd.id"
                      :label="fd.fullSpecialtyName"
                      :value="fd.fullSpecialtyName+','+fd.specialtyId"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-button type="success" icon="el-icon-circle-plus-outline"
                             @click="addLanBasePair(ruleForm.meetingPair, ruleForm.meetingPair.languagePair)">添加语种</el-button>
                </el-col>
              </el-form-item>
              <el-row v-if="ruleForm.meetingPair.languagePair.length > 0">
                <el-col :span="1">&nbsp;</el-col>
                <el-col :span="22">
                  <el-table
                    border
                    stripe
                    max-height="220"
                    class="exact-table"
                    :data="ruleForm.meetingPair.languagePair">
                    <el-table-column
                      min-width="80"
                      prop="language"
                      label="擅长语言">
                    </el-table-column>
                    <el-table-column
                      prop="firstField"
                      min-width="80"
                      label="一级领域">
                    </el-table-column>
                    <el-table-column
                      min-width="120"
                      label="二级领域">
                      <template slot-scope="scope">{{
                        scope.row.secondField.reduce((prev, curr) => {
                            return prev +' '+ curr.split(',')[0]
                        }, '')
                      }}</template>
                    </el-table-column>
                    <el-table-column
                      fixed="right"
                      label="操作"
                      width="60">
                      <template slot-scope="scope">
                        <el-button type="text" class="del"
                                   @click="deleteLan(ruleForm.meetingPair.languagePair, scope.row.$index)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </div>
          </div>
          <!-- 外派 -->
          <template v-if="ruleForm.partTimeType.includes('外派')">
            <div style="line-height: 40px;font-weight: 700">外派技能信息（必填）</div>
            <div class="lan-item">
              <el-form-item label="外派经验：" required style="margin-bottom: 5px">
                <el-col :span="10">
                  <el-select class="exact" v-model="ruleForm.sendPair.exper" placeholder="请选择外派经验">
                    <el-option value="1年以下">1年以下</el-option>
                    <el-option value="1~2年">1~2年</el-option>
                    <el-option value="2~3年">2~3年</el-option>
                    <el-option value="3~4年">3~4年</el-option>
                    <el-option value="4~5年">4~5年</el-option>
                    <el-option value="5年以上">5年以上</el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="外派特长：" required class="small-line" style="margin-bottom: 0px">
                <el-col :span="24">
                  <el-checkbox-group v-model="ruleForm.sendPair.skill">
                    <el-checkbox label="普通翻译（内勤、后勤、采购等）">普通翻译（内勤、后勤、采购等）</el-checkbox>
                    <el-checkbox label="技术翻译（商务、文档等）">技术翻译（商务、文档等）</el-checkbox>
                    <el-checkbox label="首席术翻译（项目经理助理、翻译管理）">首席术翻译（项目经理助理、翻译管理）</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-form-item>
              <el-form-item label="语种信息：" required>
                <el-col :span="5">
                  <el-select class="exact" v-model="ruleForm.sendPair.language" placeholder="擅长语言">
                    <el-option
                      v-for="lg in $store.state.languageList"
                      :key="lg.id"
                      :label="lg.chineseName"
                      :value="lg.chineseName"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-select class="exact"
                             v-model="ruleForm.sendPair.firstField"
                             @change="getSecondFieldBaseFn(ruleForm.sendPair.firstField, ruleForm.sendPair)"
                             placeholder="一级领域">
                    <el-option
                      v-for="fd in $store.state.fieldOptions"
                      :key="fd.id"
                      :label="fd.fullSpecialtyName"
                      :value="fd.fullSpecialtyName"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-select class="exact"
                             v-model="ruleForm.sendPair.secondField"
                             multiple
                             :collapse-tags="true"
                             placeholder="二级领域">
                    <el-option
                      v-for="fd in ruleForm.sendPair.secondFieldOptions"
                      :key="fd.id"
                      :label="fd.fullSpecialtyName"
                      :value="fd.fullSpecialtyName+','+fd.specialtyId"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-button type="success" icon="el-icon-circle-plus-outline"
                             @click="addLanBasePair(ruleForm.sendPair, ruleForm.sendPair.languagePair)">添加语种</el-button>
                </el-col>
              </el-form-item>
              <el-row v-if="ruleForm.sendPair.languagePair.length > 0">
                <el-col :span="1">&nbsp;</el-col>
                <el-col :span="22">
                  <el-table
                    border
                    stripe
                    max-height="220"
                    class="exact-table"
                    :data="ruleForm.sendPair.languagePair">
                    <el-table-column
                      min-width="80"
                      prop="language"
                      label="擅长语言">
                    </el-table-column>
                    <el-table-column
                      prop="firstField"
                      min-width="80"
                      label="一级领域">
                    </el-table-column>
                    <el-table-column
                      min-width="120"
                      label="二级领域">
                      <template slot-scope="scope">{{
                        scope.row.secondField.reduce((prev, curr) => {
                            return prev +' '+ curr.split(',')[0]
                        }, '')
                        }}</template>
                    </el-table-column>
                    <el-table-column
                      fixed="right"
                      label="操作"
                      width="60">
                      <template slot-scope="scope">
                        <el-button type="text" class="del"
                                   @click="deleteLan(ruleForm.sendPair.languagePair, scope.row.$index)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </div>
          </template>
          <!-- 培训 -->
          <template v-if="ruleForm.partTimeType.includes('培训')">
            <div style="line-height: 40px;font-weight: 700">培训技能信息（必填）</div>
            <div class="lan-item">
              <el-form-item label="培训经验：" required style="margin-bottom: 5px">
                <el-col :span="10">
                  <el-select class="exact" v-model="ruleForm.trainPair.exper" placeholder="请选择培训经验">
                    <el-option value="1年以下">1年以下</el-option>
                    <el-option value="1~5年">1~5年</el-option>
                    <el-option value="5~10年">5~10年</el-option>
                    <el-option value="10年以上">10年以上</el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="职场软技能：" required style="margin-bottom: 0px">
                <el-col :span="24">
                  <el-checkbox-group v-model="ruleForm.trainPair.skill">
                    <el-checkbox label="面试求职">面试求职</el-checkbox>
                    <el-checkbox label="职场沟通">职场沟通</el-checkbox>
                    <el-checkbox label="呼叫中心">呼叫中心</el-checkbox>
                    <el-checkbox label="职业规划">职业规划</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-form-item>
              <el-form-item label="培训师培训：" required style="margin-bottom: 0px">
                <el-col :span="24">
                  <el-checkbox-group v-model="ruleForm.trainPair.train">
                    <el-checkbox label="培训师培训">培训师培训</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-form-item>
              <el-form-item label="海外学习经历：" required style="margin-bottom: 0px">
                <el-col :span="10">
                  <el-select class="exact" v-model="ruleForm.trainPair.abroad" placeholder="请选择海外学习经历">
                    <el-option value="有">有</el-option>
                    <el-option value="无">无</el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="海外工作经历：" required style="margin-bottom: 0px">
                <el-col :span="10">
                  <el-select class="exact" v-model="ruleForm.trainPair.abroadWork" placeholder="请选择海外工作经历">
                    <el-option value="有">有</el-option>
                    <el-option value="无">无</el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="语种信息：" required>
                <el-col :span="5">
                  <el-select class="exact" v-model="ruleForm.trainPair.language" placeholder="擅长语言">
                    <el-option
                      v-for="lg in $store.state.languageList"
                      :key="lg.id"
                      :label="lg.chineseName"
                      :value="lg.chineseName"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-select class="exact"
                             v-model="ruleForm.trainPair.firstField"
                             @change="getSecondFieldBaseFn(ruleForm.trainPair.firstField, ruleForm.trainPair)"
                             placeholder="一级领域">
                    <el-option
                      v-for="fd in $store.state.fieldOptions"
                      :key="fd.id"
                      :label="fd.fullSpecialtyName"
                      :value="fd.fullSpecialtyName"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-select class="exact"
                             v-model="ruleForm.trainPair.secondField"
                             multiple
                             :collapse-tags="true"
                             placeholder="二级领域">
                    <el-option
                      v-for="fd in ruleForm.trainPair.secondFieldOptions"
                      :key="fd.id"
                      :label="fd.fullSpecialtyName"
                      :value="fd.fullSpecialtyName+','+fd.specialtyId"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-button type="success" icon="el-icon-circle-plus-outline"
                             @click="addLanBasePair(ruleForm.trainPair, ruleForm.trainPair.languagePair)">添加语种</el-button>
                </el-col>
              </el-form-item>
              <el-row v-if="ruleForm.trainPair.languagePair.length > 0">
                <el-col :span="1">&nbsp;</el-col>
                <el-col :span="22">
                  <el-table
                    border
                    stripe
                    max-height="220"
                    class="exact-table"
                    :data="ruleForm.trainPair.languagePair">
                    <el-table-column
                      min-width="80"
                      prop="language"
                      label="擅长语言">
                    </el-table-column>
                    <el-table-column
                      prop="firstField"
                      min-width="80"
                      label="一级领域">
                    </el-table-column>
                    <el-table-column
                      min-width="120"
                      label="二级领域">
                      <template slot-scope="scope">{{
                        scope.row.secondField.reduce((prev, curr) => {
                            return prev +' '+ curr.split(',')[0]
                        }, '')
                        }}</template>
                    </el-table-column>
                    <el-table-column
                      fixed="right"
                      label="操作"
                      width="60">
                      <template slot-scope="scope">
                        <el-button type="text" class="del"
                                   @click="deleteLan(ruleForm.trainPair.languagePair, scope.row.$index)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </div>
          </template>
          <el-form-item label="基本信息（必填）" style="margin-bottom: 0px"></el-form-item>
          <div class="in-item">
            <el-form-item label="译员昵称：" class="small-line" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-input v-model="ruleForm.baseInfo.nickName" clearable placeholder="请设置译员昵称"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="国籍：" required style="margin-bottom: 0px">
              <el-col :span="24">
                <select v-model="ruleForm.baseInfo.areaOther"
                        style="position: absolute; left: -9999px"
                        name="areaOther" id="areaOther"></select>
                <div class="areaPicker" style="margin: 5px 0 -5px;">
                  <select v-model="ruleForm.baseInfo.areaSandbar"
                          style="width: 148px"
                          name="areaSandbar" id="areaSandbar"></select>
                  <select v-model="ruleForm.baseInfo.areaNationality"
                          @change="selectNation(ruleForm.baseInfo.areaNationality)"
                          style="width: 148px"
                          name="areaNationality" id="areaNationality"></select>
                </div>
              </el-col>
            </el-form-item>
            <el-form-item label="母语：" class="small-line" required style="margin-bottom: 5px">
              <el-col :span="12">
                <el-select class="exact" v-model="ruleForm.baseInfo.language" multiple clearable placeholder="请选择母语">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.chineseName">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="翻译年限：" class="small-line" required style="margin-bottom: 5px">
              <el-col :span="12">
                <el-select class="exact" v-model="ruleForm.baseInfo.transYear" clearable placeholder="请选择翻译年限">
                  <el-option
                    v-for="item in formSelect.transYearOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="币种：" class="small-line" required style="margin-bottom: 5px">
              <el-col :span="12">
                <el-select class="exact" v-model="ruleForm.baseInfo.currency" clearable placeholder="请选择币种">
                  <el-option
                    v-for="item of formSelect.currencyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="常住地址：" class="small-line" required style="margin-bottom: 0px">
              <el-col :span="24">
                <div class="areaPicker">
                  <select v-model="ruleForm.baseInfo.province"
                          style="width: 148px"
                          @change="resetProvince(ruleForm.baseInfo)"
                          name="deliverprovince" id="deliverprovince"></select>
                  <select v-model="ruleForm.baseInfo.city"
                          style="width: 148px"
                          name="delivercity" id="delivercity"></select>
                  <select v-model="ruleForm.baseInfo.area"
                          style="width: 150px"
                          name="deliverarea" id="deliverarea"></select>
                </div>
              </el-col>
            </el-form-item>
          </div>
          <el-form-item label="学历信息（必填）" style="margin-bottom: 0px"></el-form-item>
          <div class="xl-item">
            <el-form-item label="毕业院校：" class="small-line" required style="margin-bottom: 5px">
              <el-col :span="12">
                <el-input v-model="ruleForm.recordInfo.school" clearable placeholder="请输入译员毕业院校"></el-input>
              </el-col>
              <el-col :span="4" style="padding-left: 5px">
                <el-select class="exact" v-model="ruleForm.recordInfo.schoolType">
                  <el-option key="国内" label="国内" value="国内"></el-option>
                  <el-option key="国外" label="国外" value="国外"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="专业：" class="small-line" required style="margin-bottom: 5px">
              <el-col :span="12">
                <el-input v-model="ruleForm.recordInfo.major" clearable placeholder="请输入译员专业"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="学历：" class="small-line" required style="margin-bottom: 5px">
              <el-col :span="12">
                <el-select class="exact" v-model="ruleForm.recordInfo.record" clearable placeholder="请选择学历">
                  <el-option
                    v-for="item in recordOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="毕业时间：" class="small-line" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-date-picker
                  style="width: 100%"
                  v-model="ruleForm.recordInfo.graduateTime"
                  type="month"
                  value-format="yyyy-MM"
                  placeholder="请选择毕业时间">
                </el-date-picker>
              </el-col>
            </el-form-item>
          </div>
          <el-form-item label="身份信息（必填）" style="margin-bottom: 0px"></el-form-item>
          <div class="sf-item">
            <el-form-item label="真实姓名：" class="small-line" required style="margin-bottom: 5px">
              <el-col :span="12">
                <el-input v-model="ruleForm.realName" disabled></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="证件类型：" class="small-line" required style="margin-bottom: 5px">
              <el-col :span="12">
                <el-select class="exact" v-model="ruleForm.identyInfo.identyType" clearable placeholder="请选择证件类型">
                  <el-option
                    v-for="item in formSelect.cardOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="证件号码：" class="small-line" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-input v-model="ruleForm.identyInfo.identyNo" clearable placeholder="请输入译员证件号码"></el-input>
              </el-col>
            </el-form-item>
          </div>
          <el-form-item label="备注：" style="margin: 20px 0;width: 59%">
           <el-input type="textarea" v-model="ruleForm.remark" clearable placeholder="请输入备注信息"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 1rem">
            <el-button type="success"
                       @click="submitForm('ruleForm')"
                       :disabled="btn.disabled">提 交</el-button>
            <el-button @click="$router.push('/parttimeUser/preResource')">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import '@/common/area';
  export default {
    data() {
      let validateAccount = (rule, value, callback) => {
        if(!value){
          return callback(new Error('请输入用户账号'));
        }else if(!(this.regPhone.test(value) || this.regEmail.test(value))){
          return callback(new Error('请输入正确的手机/邮箱'));
        }
        callback();
      };
      return {
        ruleForm: {
          phone: '',
          realName: '',
          partTimeType: [],
          //语言信息（笔译）
          language: [
            {
              origin: '',
              target: '',
              firstField: '',
              secondField: [],
              secondFieldOptions: [],
              level: ''
            }
          ],
          //dtp
          dtpPair: {
            exper: '',
            software: [],
            taskLabel: [],
          },
          //会展
          meetingPair: {
            exper: '',
            province: '',
            city: '',
            area: '',
            type: [],
            language: '',
            firstField: '',
            secondField: [],
            secondFieldOptions: [],
            languagePair: []
          },
          //外派
          sendPair: {
            exper: '',
            skill: [],
            language: '',
            firstField: '',
            secondField: [],
            secondFieldOptions: [],
            languagePair: []
          },
          //培训
          trainPair: {
            exper: '',
            skill: [],
            train: [],
            abroad: '',
            abroadWork: '',
            language: '',
            firstField: '',
            secondField: [],
            secondFieldOptions: [],
            languagePair: []
          },
          //学历信息
          baseInfo: {
            nickName: '',
            areaNationality: '',
            areaSandbar: '',
            areaOther: '',
            language: [],
            transYear: '',
            currency: '',
            province: '',
            city: '',
            area: ''
          },
          //学历信息
          recordInfo: {
            school: '',
            schoolType: '国内',
            record: '',
            major: '',
            graduateTime: ''
          },
          //身份认证
          identyInfo: {
            identyType: '',
            identyNo: ''
          },
		      remark: ''
        },
        formSelect: {
          currencyOptions: [
            {label: '人民币', value: 'CNY'},
            {label: '美元', value: 'USD'},
            {label: '欧元', value: 'EUR'},
            {label: '英镑', value: 'GBP'}
          ],
          cardOptions: ['身份证'],
          transYearOptions:['1年以内','1-3年','3-5年','5年-10年','10年以上'],
          dtpTaskOptions: []
        },
        rules: {
          phone: [{ validator: validateAccount, trigger: ['blur', 'change'] }]
        },
        btn: {
          disabled: false
        }
      };
    },
    computed: {
      ...mapState('select', {
        memberLevel: state => state.memberLevel
      }),
      ...mapState('select', {
        recordOptions: state => state.recordOptions
      }),
      ...mapState(['regPhone','regEmail','regCard'])
    },
    created (){
      //初始化地区插件
      this.$nextTick(() => {
        new window._PCAS("deliverprovince", "delivercity", "deliverarea");
        new window._PCAS("areaOther", "areaSandbar", "areaNationality");
        new window._PCAS("serviceprovince", "servicecity", "servicearea");
        setTimeout(() => {
          this.ruleForm.baseInfo.areaOther = '其它';
          setTimeout(() => {
            const event = document.createEvent("HTMLEvents");
            event.initEvent("change", false, true);
            document.querySelector('#areaOther').dispatchEvent(event);
            this.ruleForm.baseInfo.areaSandbar = '亚洲';
            this.ruleForm.baseInfo.areaNationality = '中国大陆';
          }, 500)
        }, 10)
      });
      this.$http.get('/newSkillController/listUnitPriceDtp')
        .then(res => {
          if(res.data.success){
            this.formSelect.dtpTaskOptions = res.data.data;
          }
        });
    },
    methods: {
      resetProvince (address){
        address.city = '';
        address.area = '';
      },
      //获取二级领域（通用）
      getSecondFieldBaseFn (value, field){
        let result = this.$store.state.fieldOptions.find(item => {
          return item.fullSpecialtyName === value && item.specialtyId;
        });
        field.secondField = [];
        this.getSecondField(result.specialtyId).then(res => {
          field.secondFieldOptions = res;
        });
      },
      //添加语言（通用）
      addLanBasePair (target, lanPair){
        if(target.language === '' || target.firstField === '' || target.secondField.length < 1){
          this.$message.warning('请先选择语言信息');
          return false
        }
        lanPair.push({
          language: target.language,
          firstField: target.firstField,
          secondField: target.secondField
        });
        target.language = '';
        target.firstField = '';
        target.secondField = [];
        target.secondFieldOptions = [];
      },
      //删除语言
      deleteLan (target, index){
        target.splice(index, 1);
      },
      //添加语言（笔译）
      addLanPair (){
        this.ruleForm.language.push({
          origin: '',
          target: '',
          firstField: '',
          secondField: [],
          secondFieldOptions: [],
          level: ''
        })
      },
      //获取二级领域（笔译）
      getSecondFieldFn (index){
        const findLan =  this.ruleForm.language[index],
          fieldName = findLan.firstField;
        let result = this.$store.state.fieldOptions.find(item => {
          return item.fullSpecialtyName === fieldName && item.specialtyId;
        });
        findLan.secondField = [];
        this.getSecondField(result.specialtyId).then(res => {
          findLan.secondFieldOptions = res;
        });
      },
      //选择国籍为“中国大陆”，只能选身份证
      selectNation (val){
        if(val === '中国大陆'){
          this.formSelect.cardOptions = ['身份证'];
        }else{
          this.formSelect.cardOptions = ['身份证','港澳通行证','往来台湾通行证','护照'];
        }
        this.ruleForm.identyInfo.identyType = '';
      },
      //提交
      submitForm (formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //笔译
            const languageInfoLst = [];
            if(this.ruleForm.partTimeType.includes('笔译')){
              const lan = this.ruleForm.language;
              const uniqueArr = [];
              for(let i = 0, len = lan.length; i < len; i++){
                const item = lan[i];
                for(let key in item){
                  if(item[key] === '' || (key === 'secondField' && item[key].length < 1)){
                    this.$message({
                      type: 'warning',
                      message: '请先完善语言信息'
                    });
                    return false;
                  }
                }
                if(item.origin === item.target){
                  this.$message({
                    type: 'warning',
                    message: '请选择不同的语言对'
                  });
                  return false;
                }
                if(uniqueArr.includes(item.origin+item.target+item.firstField)){
                  this.$message({
                    type: 'warning',
                    message: '请选择不同的语言信息'
                  });
                  return false;
                }
                uniqueArr.push(item.origin+item.target+item.firstField);
                let firstFieldId = '',
                  secondFieldIds = [];
                let result = this.$store.state.fieldOptions.find(ff => {
                  return ff.fullSpecialtyName === item.firstField;
                });
                item.secondField.forEach(sf => {
                  let result = item.secondFieldOptions.find(fd => {
                    return fd.fullSpecialtyName === sf ;
                  });
                  secondFieldIds.push(result.id);
                });
                firstFieldId = result.id;
                const obj = {
                  "domain": JSON.stringify([item.firstField]),
                  "domainId": JSON.stringify([firstFieldId]),
                  "level": item.level.slice(1),
                  "originLanguageSimpleCode": item.origin.split(',')[2],
                  "originLanguageCode": item.origin.split(',')[1],
                  "originLanguageName": item.origin.split(',')[0],
                  "subDomain": JSON.stringify(item.secondField),
                  "subDomainId": JSON.stringify(secondFieldIds),
                  "targetLanguageSimpleCode": item.target.split(',')[2],
                  "targetLanguageCode": item.target.split(',')[1],
                  "targetLanguageName": item.target.split(',')[0]
                };
                languageInfoLst.push(obj);
              }
            }
            //DTP
            const dtp = {
              "dtpEditionExperience": '',
              "dtpSoftware": [],
              "dtpTaskLable": []
            };
            if(this.ruleForm.partTimeType.includes('DTP')){
              Object.assign(dtp, {
                "dtpEditionExperience": this.ruleForm.dtpPair.exper,
                "dtpSoftware": this.ruleForm.dtpPair.software,
                "dtpTaskLable": this.ruleForm.dtpPair.taskLabel.map(item => {
                  const temp = item.split(',');
                  return {
                    "dtpLableCode": temp[1],
                    "dtpLableName": temp[0]
                  }
                })
              });
              for(let key in dtp){
                if(dtp[key].length < 1){
                  this.$message.warning('请完善DTP技能信息');
                  return null
                }
              }
            }
            //会展
            const meeting = {
              "interProvince": "",
              "interCity": "",
              "interCounty": "",
              "interLanguageAreaInfo": [],
              "interpretationExperience": "",
              "interpretationTypes": []
            };
            if(this.ruleForm.partTimeType.includes('会展')){
              const tempArr = [];
              this.ruleForm.meetingPair.languagePair.forEach(item => {
                const fieldName = item.secondField.map(field => {
                  return field.split(',')[0]
                }) || [];
                const fieldCode = item.secondField.map(field => {
                  return field.split(',')[1]
                }) || [];
                const obj = {
                  "firstAreaName": item.firstField,
                  "firstAreaCode": this.$store.state.mapFirstDomain[item.firstField],
                  "langaugeName": item.language,
                  "languageCode": this.$store.state.mapLanguageListN_C[item.language],
                  "secondAreaCode": fieldCode.toString(),
                  "secondAreaName": fieldName.toString()
                };
                tempArr.push(obj)
              });
              Object.assign(meeting, {
                "interpretationExperience": this.ruleForm.meetingPair.exper,
                "interProvince": this.ruleForm.meetingPair.province,
                "interCity": this.ruleForm.meetingPair.city || '',
                "interCounty": this.ruleForm.meetingPair.area || '',
                "interLanguageAreaInfo": tempArr,
                "interpretationTypes": this.ruleForm.meetingPair.type
              });
              for(let key in meeting){
                if(meeting[key].length < 1){
                  this.$message.warning('请完善会展技能信息');
                  return null
                }
              }
            }
            //外派
            const send = {
              "expatriateExperience": "",
              "expatriateExpertise": [],
              "expatriatelanguageInfo": []
            };
            if(this.ruleForm.partTimeType.includes('外派')){
              const tempArr = [];
              this.ruleForm.sendPair.languagePair.forEach(item => {
                const fieldName = item.secondField.map(field => {
                  return field.split(',')[0]
                }) || [];
                const fieldCode = item.secondField.map(field => {
                  return field.split(',')[1]
                }) || [];
                const obj = {
                  "firstAreaName": item.firstField,
                  "firstAreaCode": this.$store.state.mapFirstDomain[item.firstField],
                  "langaugeName": item.language,
                  "languageCode": this.$store.state.mapLanguageListN_C[item.language],
                  "secondAreaCode": fieldCode.toString(),
                  "secondAreaName": fieldName.toString()
                };
                tempArr.push(obj)
              });
              Object.assign(send, {
                "expatriateExperience": this.ruleForm.sendPair.exper,
                "expatriateExpertise": this.ruleForm.sendPair.skill,
                "expatriatelanguageInfo": tempArr
              });
              for(let key in send){
                if(send[key].length < 1){
                  this.$message.warning('请完善外派技能信息');
                  return null
                }
              }
            }
            //培训
            const train = {
              "trainExperience": "",
              "trainLanguageInfo": [],
              "trainOverseasLearning": "",
              "trainOverseasWorking": "",
              "trainSoftSkills": [],
              "trainerTraining": []
            };
            if(this.ruleForm.partTimeType.includes('培训')){
              const tempArr = [];
              this.ruleForm.trainPair.languagePair.forEach(item => {
                const fieldName = item.secondField.map(field => {
                  return field.split(',')[0]
                }) || [];
                const fieldCode = item.secondField.map(field => {
                  return field.split(',')[1]
                }) || [];
                const obj = {
                  "firstAreaName": item.firstField,
                  "firstAreaCode": this.$store.state.mapFirstDomain[item.firstField],
                  "langaugeName": item.language,
                  "languageCode": this.$store.state.mapLanguageListN_C[item.language],
                  "secondAreaCode": fieldCode.toString(),
                  "secondAreaName": fieldName.toString()
                };
                tempArr.push(obj)
              });
              Object.assign(train, {
                "trainExperience": this.ruleForm.trainPair.exper,
                "trainLanguageInfo": tempArr,
                "trainOverseasLearning": this.ruleForm.trainPair.abroad,
                "trainOverseasWorking": this.ruleForm.trainPair.abroadWork,
                "trainSoftSkills": this.ruleForm.trainPair.skill,
                "trainerTraining": this.ruleForm.trainPair.train
              });
              for(let key in train){
                if(train[key].length < 1){
                  this.$message.warning('请完善培训技能信息');
                  return null
                }
              }
            }
            for(let key in this.ruleForm.baseInfo){
              const val = this.ruleForm.baseInfo[key];
              if(key !== 'area' && val.length < 1){
                this.$message.warning('请完善基本信息');
                return false
              }
            }
            for(let key in this.ruleForm.recordInfo){
              const val = this.ruleForm.recordInfo[key];
              if(val.length < 1){
                this.$message.warning('请完善学历信息');
                return false
              }
            }
            for(let key in this.ruleForm.identyInfo){
              const val = this.ruleForm.identyInfo[key];
              if(val.length < 1){
                this.$message.warning('请完善身份信息');
                return false
              }
            }
            this.btn.disabled = true;
            const greenChannelParam = {
              "skillType": this.ruleForm.partTimeType.toString(),
              "certificateNum": this.ruleForm.identyInfo.identyNo,
              "certificateType":  this.ruleForm.identyInfo.identyType,
              "degree": this.ruleForm.recordInfo.record,
              "graduatedDate": this.ruleForm.recordInfo.graduateTime,
              "graduatedSchoolName": this.ruleForm.recordInfo.school,
              "major": this.ruleForm.recordInfo.major,
              "motherTongue": this.ruleForm.baseInfo.nickName ? this.ruleForm.baseInfo.language.toString() : '',
              "nationality": this.ruleForm.baseInfo.nickName ? this.ruleForm.baseInfo.areaSandbar+' '+this.ruleForm.baseInfo.areaNationality : '',
              "nickName": this.ruleForm.baseInfo.nickName,
              "realName": this.ruleForm.realName,
              "remark": this.ruleForm.remark,
              "schoolType": this.ruleForm.recordInfo.school ? this.ruleForm.recordInfo.schoolType:'',
              "staffTel": this.ruleForm.phone,
              "currencyCode": this.ruleForm.baseInfo.currency,
              "currencyName": (this.formSelect.currencyOptions.find(item => {
                return item.value === this.ruleForm.baseInfo.currency
              }) || {label: ''}).label,
              "province": this.ruleForm.baseInfo.province || '',
              "city": this.ruleForm.baseInfo.city || '',
              "county": this.ruleForm.baseInfo.area || '',
              "translateYear": this.ruleForm.baseInfo.transYear
            };
            Object.assign(greenChannelParam, {
              languageInfoLst: languageInfoLst
            }, dtp, meeting, send, train);
            this.$http.post('/greenChannel/savePartTimeStaffByGreenChannel', greenChannelParam)
              .then(res => {
                if(res.data.message === 'success'){
                  this.$message({
                    type: 'success',
                    message: '创建成功'
                  });
                  setTimeout(() => {
                    this.$router.push('/parttimeUser/preResource')
                  }, 1000);
                }else{
                  this.$message({
                    type: 'error',
                    message: res.data.message
                  });
                }
                this.btn.disabled = false;
              });
          }else{
            this.$message.warning('请完善用户帐号信息')
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .green-form-p{
    .el-form-item.exact.field{
      margin-bottom: 15px!important;
    }
    .small-line{
      .el-form-item__label,
      .el-form-item__content{
        line-height: 24px;
      }
    }
    .el-checkbox{
      margin-right: 15px;
    }
    .el-checkbox__label{
      padding-left: 2px;
    }
  }
</style>
