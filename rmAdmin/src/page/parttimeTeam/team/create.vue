<template>
  <div class="page">
    <div class="default-style">
      <div class="detail form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm green-form">
          <el-form-item label="团队名称：" required style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item :prop="'teamName'"
                            :rules="{ required: true, message: '请输入团队名称', trigger: 'blur' }">
                <el-input v-model="ruleForm.teamName" clearable placeholder="请输入团队名称"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="专职人数：" required style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item :prop="'memberNum'"
                            :rules="{ required: true, message: '请输入专职人数', trigger: 'blur' }">
                <el-input v-model="ruleForm.memberNum" type="number" placeholder="请输入专职人数"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="统一社会信用代码：" required style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item :prop="'socialCode'"
                            :rules="{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }">
                <el-input v-model="ruleForm.socialCode" clearable placeholder="请输入统一社会信用代码"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="发票类型：" class="small-item" style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item>
                <el-select style="width: 100%"
                  v-model="ruleForm.paperType" placeholder="请选择">
                  <el-option
                    v-for="item in formSelect.paperTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="纳税类型：" class="small-item" style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item>
                <el-select style="width: 100%"
                           v-model="ruleForm.taxType" placeholder="请选择">
                  <el-option
                    v-for="item in formSelect.taxTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="所在地：" class="small-item" style="margin-bottom: 0px">
            <el-col :span="24">
              <el-form-item>
                <div class="areaPicker">
                  <select v-model="ruleForm.province"
                          style="width: 143px"
                          @change="resetProvince(ruleForm)"
                          name="deliverprovince" id="deliverprovince"></select>
                  <select v-model="ruleForm.city"
                          style="width: 143px"
                          name="delivercity" id="delivercity"></select>
                  <select v-model="ruleForm.area"
                          style="width: 148px"
                          name="deliverarea" id="deliverarea"></select>
                </div>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="备注：" class="small-item" style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item>
                <el-input v-model="ruleForm.teamRemark"
                          clearable
                          type="textarea" placeholder="请输入备注"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="兼职类型" required style="margin-bottom: 0px">
            <el-col :span="20">
              <el-form-item prop="partTimeType"
                            :rules="{ type: 'array',required: true, message: '请选择兼职类型', trigger: 'change' }">
                <el-checkbox-group v-model="ruleForm.partTimeType">
                  <el-checkbox label="笔译">笔译</el-checkbox>
                  <el-checkbox label="DTP">DTP</el-checkbox>
                  <el-checkbox label="会展">会展</el-checkbox>
                  <el-checkbox label="设备">设备</el-checkbox>
                  <el-checkbox label="搭建">搭建</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-form-item>
          <!--笔译-->
          <template v-if="ruleForm.partTimeType.includes('笔译')">
            <el-form-item label="语言信息（必填）" style="margin-bottom: 0px">
              <el-button type="success" icon="el-icon-circle-plus-outline" @click="addLanPair">添加语言对</el-button>
            </el-form-item>
            <div class="lan-item" v-for="(item, index) in ruleForm.language" :key="index">
              <el-form-item label="语言对：" required style="margin-bottom: 5px">
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
              <el-form-item label="行业领域：" required style="margin-bottom: 5px">
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
            <div class="lan-item dtp" style="padding-right: 0px">
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
                            style="width: 118px"
                            @change="resetProvince(ruleForm.meetingPair)"
                            name="serviceprovince" id="serviceprovince"></select>
                    <select v-model="ruleForm.meetingPair.city"
                            style="width: 118px;margin-left: 0"
                            name="servicecity" id="servicecity"></select>
                    <select v-model="ruleForm.meetingPair.area"
                            style="width: 118px;margin-left: 0"
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
          <!-- 设备 -->
          <div v-show="ruleForm.partTimeType.includes('设备')">
            <div style="line-height: 40px;font-weight: 700">设备技能信息（必填）</div>
            <div class="lan-item">
              <el-form-item label="服务地区：" required style="margin-bottom: 0px">
                <el-col :span="24">
                  <div class="areaPicker">
                    <select v-model="ruleForm.devicePair.province"
                            style="width: 116px"
                            @change="resetProvince(ruleForm.devicePair)"
                            name="deviceprovince" id="deviceprovince"></select>
                    <select v-model="ruleForm.devicePair.city"
                            style="width: 116px"
                            name="devicecity" id="devicecity"></select>
                    <select v-model="ruleForm.devicePair.area"
                            style="width: 116px"
                            name="devicearea" id="devicearea"></select>
                  </div>
                </el-col>
              </el-form-item>
              <el-form-item label="设备信息：" required>
                <el-col :span="5">
                  <el-select class="exact" v-model="ruleForm.devicePair.device" placeholder="选择设备">
                    <el-option value="同传套件" label="同传套件"></el-option>
                    <el-option value="同传主机" label="同传主机"></el-option>
                    <el-option value="辐射板" label="辐射板"></el-option>
                    <el-option value="接收机" label="接收机"></el-option>
                    <el-option value="译员机" label="译员机"></el-option>
                    <el-option value="翻译间" label="翻译间"></el-option>
                    <el-option value="手拉手设备" label="手拉手设备"></el-option>
                    <el-option value="无限导览" label="无限导览"></el-option>
                    <el-option value="无限导览接收机" label="无限导览接收机"></el-option>
                    <el-option value="音箱" label="音箱"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-input class="exact" v-model="ruleForm.devicePair.number" placeholder="设备数量"></el-input>
                </el-col>
                <el-col :span="5">
                  <el-input class="exact" v-model="ruleForm.devicePair.price" placeholder="设备单价"></el-input>
                </el-col>
                <el-col :span="5">
                  <el-select class="exact" v-model="ruleForm.devicePair.unit">
                    <el-option value="/天/套" label="/天/套"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-button type="success" icon="el-icon-circle-plus-outline"
                             @click="addDeviceBasePair(ruleForm.devicePair, ruleForm.devicePair.languagePair)">添加设备</el-button>
                </el-col>
              </el-form-item>
              <el-form-item label="备注：" required style="margin-bottom: 5px">
                <el-col :span="12">
                  <el-input type="textarea" v-model="ruleForm.devicePair.remark" placeholder="备注信息"></el-input>
                </el-col>
              </el-form-item>
              <el-row v-if="ruleForm.devicePair.languagePair.length > 0">
                <el-col :span="1">&nbsp;</el-col>
                <el-col :span="22">
                  <el-table
                    border
                    stripe
                    max-height="220"
                    class="exact-table"
                    :data="ruleForm.devicePair.languagePair">
                    <el-table-column
                      min-width="100"
                      prop="equipName"
                      label="设备">
                    </el-table-column>
                    <el-table-column
                      prop="equipNum"
                      min-width="80"
                      label="数量">
                    </el-table-column>
                    <el-table-column
                      min-width="80"
                      prop="equipUnitPrice"
                      label="单价">
                    </el-table-column>
                    <el-table-column
                      prop="equipUnit"
                      min-width="80"
                      label="单位">
                    </el-table-column>
                    <el-table-column
                      fixed="right"
                      label="操作"
                      width="80">
                      <template slot-scope="scope">
                        <el-button type="text" class="del"
                                   @click="deleteLan(ruleForm.devicePair.languagePair, scope.row.$index)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </div>
          </div>
          <!-- 搭建 -->
          <div v-show="ruleForm.partTimeType.includes('搭建')">
            <div style="line-height: 40px;font-weight: 700">搭建技能信息（必填）</div>
            <div class="lan-item">
              <el-form-item label="服务地区：" required style="margin-bottom: 0px">
                <el-col :span="24">
                  <div class="areaPicker green">
                    <select v-model="ruleForm.buildPair.province"
                            style="width: 116px"
                            @change="resetProvince(ruleForm.buildPair)"
                            name="buildprovince" id="buildprovince"></select>
                    <select v-model="ruleForm.buildPair.city"
                            style="width: 116px"
                            name="buildcity" id="buildcity"></select>
                    <select v-model="ruleForm.buildPair.area"
                            style="width: 116px"
                            name="buildarea" id="buildarea"></select>
                  </div>
                </el-col>
              </el-form-item>
              <el-form-item label="搭建信息：" required>
                <el-col :span="5">
                  <el-select class="exact" v-model="ruleForm.buildPair.device" placeholder="选择搭建">
                    <el-option label="投影机" value="投影机"></el-option>
                    <el-option label="投影幕" value="投影幕"></el-option>
                    <el-option label="电视机" value="电视机"></el-option>
                    <el-option label="LED设备" value="LED设备"></el-option>
                    <el-option label="灯光设备" value="灯光设备"></el-option>
                    <el-option label="会场搭建" value="会场搭建"></el-option>
                    <el-option label="签到系统" value="签到系统"></el-option>
                    <el-option label="印刷产品" value="印刷产品"></el-option>
                    <el-option label="礼品" value="礼品"></el-option>
                    <el-option label="摄影摄像" value="摄影摄像"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-input class="exact" v-model="ruleForm.buildPair.number" placeholder="设备数量"></el-input>
                </el-col>
                <el-col :span="5">
                  <el-input class="exact" v-model="ruleForm.buildPair.price" placeholder="设备单价"></el-input>
                </el-col>
                <el-col :span="5">
                  <el-select class="exact" v-model="ruleForm.buildPair.unit">
                    <el-option value="/天/套" label="/天/套"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-button type="success" icon="el-icon-circle-plus-outline"
                             @click="addDeviceBasePair(ruleForm.buildPair, ruleForm.buildPair.languagePair)">添加搭建</el-button>
                </el-col>
              </el-form-item>
              <el-form-item label="备注：" required style="margin-bottom: 5px">
                <el-col :span="12">
                  <el-input type="textarea" v-model="ruleForm.buildPair.remark" placeholder="备注信息"></el-input>
                </el-col>
              </el-form-item>
              <el-row v-if="ruleForm.buildPair.languagePair.length > 0">
                <el-col :span="1">&nbsp;</el-col>
                <el-col :span="22">
                  <el-table
                    border
                    stripe
                    max-height="220"
                    class="exact-table"
                    :data="ruleForm.buildPair.languagePair">
                    <el-table-column
                      min-width="100"
                      prop="equipName"
                      label="搭建">
                    </el-table-column>
                    <el-table-column
                      prop="equipNum"
                      min-width="80"
                      label="数量">
                    </el-table-column>
                    <el-table-column
                      min-width="80"
                      prop="equipUnitPrice"
                      label="单价">
                    </el-table-column>
                    <el-table-column
                      prop="equipUnit"
                      min-width="80"
                      label="单位">
                    </el-table-column>
                    <el-table-column
                      fixed="right"
                      label="操作"
                      width="80">
                      <template slot-scope="scope">
                        <el-button type="text" class="del"
                                   @click="deleteLan(ruleForm.buildPair.languagePair, scope.row.$index)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </div>
          </div>
          <el-form-item label="联系方式（必填）" style="margin-bottom: 5px"></el-form-item>
          <div class="in-item">
            <el-form-item label="主要联系人姓名：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-form-item  :prop="'primaryPeople'"
                               :rules="{ required: true, message: '请输入联系人姓名', trigger: 'blur' }">
                  <el-input v-model="ruleForm.primaryPeople" clearable placeholder="请输入联系人姓名"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="手机号码：" required style="margin-bottom: 0px">
              <el-col :span="12">
                <el-form-item prop="primaryPhone">
                  <el-input v-model="ruleForm.primaryPhone" clearable placeholder="请输入手机号码"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="邮箱：" required style="margin-bottom: -10px">
              <el-col :span="12">
                <el-form-item prop="primaryEmail">
                  <el-input v-model="ruleForm.primaryEmail" clearable placeholder="请输入邮箱"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </div>
          <el-form-item label="身份认证（选填）" style="margin: 5px 0"></el-form-item>
          <div class="sf-item">
            <el-form-item label="真实姓名：" required style="margin-bottom: 8px">
              <el-col :span="12">
                <el-input v-model="ruleForm.primaryPeople" disabled></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="证件类型：" required style="margin-bottom: 8px">
              <el-col :span="12">
                <el-select class="exact" v-model="ruleForm.identyType" clearable placeholder="请选择证件类型">
                  <el-option
                    v-for="item in formSelect.identyTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="证件号码：" required style="margin-bottom: 8px">
              <el-col :span="12">
                <el-input v-model="ruleForm.identyNo" clearable placeholder="请输入证件号码"></el-input>
              </el-col>
            </el-form-item>
          </div>
          <el-form-item style="margin-top: 1rem">
            <el-button type="success"
                       @click="submitForm('ruleForm')"
                       :disabled="btn.disabled">提 交</el-button>
            <el-button @click="$router.push('/parttimeTeam/preTeam')">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import '@/common/area'
  import utils from '@/utils';
  import { mapState, mapGetters } from 'vuex';
  export default {
    data() {
      let isPhone = (rule, value, callback) => {
        if(!value){
          return callback(new Error('请输入手机号'));
        }else if(!this.regPhone.test(value)){
          return callback(new Error('请输入正确的手机号'));
        }
        callback();
      };
      let isEmail = (rule, value, callback) => {
        if(!value){
          return callback(new Error('请输入邮箱'));
        }else if(!this.regEmail.test(value)){
          return callback(new Error('请输入正确的邮箱'));
        }
        callback();
      };
      return {
        ruleForm: {
          teamName: '',
          memberNum: '',
          socialCode: '',
          paperType: '增值税专用发票',
          taxType: '一般纳税人',
          partTimeType: [],
          province: '',
          city: '',
          area: '',
          teamRemark: '',
          primaryPeople: '',
          primaryPhone: '',
          primaryEmail: '',
          identyType: '',
          identyNo: '',
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
          //设备
          devicePair: {
            province: '',
            city: '',
            area: '',
            remark: '',
            device: '',
            price: '',
            number: '',
            unit: '/天/套',
            languagePair: []
          },
          //搭建
          buildPair: {
            province: '',
            city: '',
            area: '',
            remark: '',
            device: '',
            price: '',
            number: '',
            unit: '/天/套',
            languagePair: []
          }
        },
        formSelect: {
          paperTypeOptions: ['增值税专用发票','普通发票','不开发票'],
          taxTypeOptions: ['一般纳税人','小规模纳税人','其他'],
          identyTypeOptions: ['身份证','港澳通行证','往来台湾通行证','护照'],
          dtpTaskOptions: []
        },
        rules: {
          primaryPhone: [{ validator: isPhone, trigger: ['blur', 'change'] }],
          primaryEmail: [{ validator: isEmail, trigger: ['blur', 'change'] }]
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
      ...mapState(['regPhone','regEmail','regCard'])
    },
    created (){
      this.$nextTick(() => {
        new window._PCAS("deliverprovince", "delivercity", "deliverarea");
        new window._PCAS("serviceprovince", "servicecity", "servicearea");
        new window._PCAS("deviceprovince", "devicecity", "devicearea");
        new window._PCAS("buildprovince", "buildcity", "buildarea");
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
        if(!target.language || !target.firstField || target.secondField.length < 1){
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
      //添加设备（通用）
      addDeviceBasePair (target, devicePair){
        if(!target.device || !target.number || !target.price){
          this.$message.warning('请先填写设备信息');
          return false
        }
        devicePair.push({
          "equipName": target.device,
          "equipNum": target.number,
          "equipUnit": target.unit,
          "equipUnitPrice": target.price
        });
        target.device = '';
        target.number = '';
        target.price = '';
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
      //删除语言
      deleteLan (target, index){
        target.splice(index, 1);
      },
      //获取二级领域
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
      //提交
      submitForm (formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //兼职类型，选择笔译时，需要填写语言信息
            const languageInfoLst = [];
            if(this.ruleForm.partTimeType.includes('笔译')){
              const uniqueArr = [];
              const lan = this.ruleForm.language;
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
                  "secondAreaName": fieldName.toString(),
                  "secondAreaCode": fieldCode.toString()
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
            //设备
            const device = {
              "equipCity": "",
              "equipCounty": "",
              "equipEquipmentInfo": [],
              "equipProvince": "",
              "equipRemark": ""
            };
            if(this.ruleForm.partTimeType.includes('设备')){
              Object.assign(device, {
                "equipProvince": this.ruleForm.devicePair.province,
                "equipCity": this.ruleForm.devicePair.city || '',
                "equipCounty": this.ruleForm.devicePair.area || '',
                "equipEquipmentInfo": this.ruleForm.devicePair.languagePair,
                "equipRemark": this.ruleForm.devicePair.remark
              });
              for(let key in device){
                if(device[key].length < 1){
                  this.$message.warning('请完善设备技能信息');
                  return null
                }
              }
            }
            //搭建
            const build = {
              "buildCity": "",
              "buildCounty": "",
              "buildEquipInfo": [],
              "buildProvince": "",
              "buildRemark": ""
            };
            if(this.ruleForm.partTimeType.includes('搭建')){
              Object.assign(build, {
                "buildProvince": this.ruleForm.buildPair.province,
                "buildCity": this.ruleForm.buildPair.city,
                "buildCounty": this.ruleForm.buildPair.area,
                "buildEquipInfo": this.ruleForm.buildPair.languagePair,
                "buildRemark": this.ruleForm.buildPair.remark
              });
              for(let key in build){
                if(build[key].length < 1){
                  this.$message.warning('请完善搭建技能信息');
                  return null
                }
              }
            }
            if((this.ruleForm.identyType === '' && this.ruleForm.identyNo !== '') ||
              this.ruleForm.identyType !== '' && this.ruleForm.identyNo === ''){
              this.$message({
                type: 'warning',
                message: '请完善身份信息'
              });
              return false;
            }
            const teamGreenChannelParam = {
              "certificateType": this.ruleForm.identyType,
              "fullTimeNumber": this.ruleForm.memberNum,
              "idNo": this.ruleForm.identyNo,
              "invoiceType": this.ruleForm.paperType,
              "location": this.ruleForm.province+' '+this.ruleForm.city+' '+this.ruleForm.area,
              "partTimeType": this.ruleForm.partTimeType.toString(),
              "primaryContactEmail": this.ruleForm.primaryEmail,
              "primaryContactMobile": this.ruleForm.primaryPhone,
              "primaryContactName": this.ruleForm.primaryPeople,
              "remarks": this.ruleForm.teamRemark,
              "teamName": this.ruleForm.teamName,
              "typesOfTaxPayment": this.ruleForm.taxType,
              "unifiedSocialCreditCode": this.ruleForm.socialCode
            };
            Object.assign(teamGreenChannelParam, {
              languageInfoLst: languageInfoLst
            }, dtp, meeting, device, build);
            this.btn.disabled = true;
            this.$http.post('/team/addTeamBackground',teamGreenChannelParam)
              .then(res => {
                if(res.data.message === 'success'){
                  this.$message({
                    type: 'success',
                    message: '创建成功'
                  });
                  setTimeout(() => {
                    this.$router.push('/parttimeTeam/preTeam')
                  }, 1000);
                }else{
                  this.$message({
                    type: 'error',
                    message: res.data.message
                  });
                }
                this.btn.disabled = false
              })
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .green-form{
    .small-line .el-form-item__label,
    .small-line .el-form-item__content,
    .el-form-item__label,
    .el-form-item__content{
      line-height: 30px;
    }
    .lan-item{
      .el-form-item__label,
      .el-form-item__content{
        line-height: 40px!important;
      }
      .el-textarea__inner{
        height: 80px;
      }
    }
    .el-button.del{
      padding: 6px 0px;
    }
    .small-item{
      .el-form-item{
        margin-bottom: 8px;
      }
    }
    .areaPicker{
      margin-bottom: -4px;
    }
  }
</style>
