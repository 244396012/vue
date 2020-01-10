<template>
  <div class="detail">
    <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">笔译技能
      <template v-if="$store.state.secondPermission['/newSkillController/updateTranslatorSkill'] !== undefined">
        <template v-if="biyi.show">
          <el-button type="success" icon="el-icon-edit"
                     style="float: right"
                     @click="biyi.show = false">修改</el-button>
        </template>
        <template v-else>
          <el-button type="success"
                     @click="modifyBiyi"
                     :disabled="biyiBtn.disabled"
                     style="float: right;margin-left: 10px">保存</el-button>
          <el-button @click="biyi.show = true" style="float: right;">取消</el-button>
        </template>
      </template>
    </p>
    <table class="parttime-table">
      <tr>
        <td class="name">笔译经验</td><td style="padding: 0">
          <span v-if="biyi.show">{{skillDetail.transYear}}</span>
          <el-select v-else v-model="biyi.transYear">
            <el-option value="1年以内">1年以内</el-option>
            <el-option value="1-3年">1-3年</el-option>
            <el-option value="3-5年">3-5年</el-option>
            <el-option value="5年-10年">5年-10年</el-option>
            <el-option value="10年以上">10年以上</el-option>
          </el-select>
        </td>
        <td class="name">翻译字数</td><td>{{skillDetail.wordCount}}</td>
        <td class="name">成为笔译时间</td><td colspan="3">{{skillDetail.transDate}}</td>
      </tr>
      <tr v-for="(item, index) of skillDetail.userExtendList" :key="item.id">
        <td class="name">语言对</td><td>{{item.sourceLanguageName}} -> {{item.targetLanguageName}}</td>
        <td class="name">专业领域</td><td>{{item.subAreaName && JSON.parse(item.subAreaName).toString()}}</td>
        <td class="name">等级</td><td>{{item.levelName}}</td>
        <td class="name">合作单价</td><td style="padding: 0">
          <span v-if="biyi.show">{{item.unitPrice}}-{{item.unit}}-{{item.currencyCode | formatMoneyType}}</span>
          <template v-else>
            <input v-model="biyi.lanPair[index].unitPrice" type="number" style="width: 31%">
            <el-select v-model="biyi.lanPair[index].unit" style="width: 33%">
              <el-option label="中文中朝" value="中文中朝"></el-option>
              <el-option label="分钟" value="分钟"></el-option>
              <el-option label="源语字数" value="源语字数"></el-option>
              <el-option label="中文字数" value="中文字数"></el-option>
            </el-select>
            <el-select v-model="biyi.lanPair[index].currencyCode" style="width: 33%">
              <el-option label="人民币" value="CNY"></el-option>
              <el-option label="美元" value="USD"></el-option>
              <el-option label="欧元" value="EUR"></el-option>
              <el-option label="英镑" value="GBP"></el-option>
            </el-select>
          </template>
        </td>
      </tr>
    </table>
    <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">DTP技能
      <template v-if="$store.state.secondPermission['/newSkillController/updateSkillDtpBack'] !== undefined">
        <template v-if="dtp.show">
          <el-button type="success"
                     icon="el-icon-edit"
                     style="float: right"
                     @click="dtp.show = false">修改</el-button>
        </template>
        <template v-else>
          <el-button type="success"
                     @click="modifyDtp"
                     :disabled="dtpBtn.disabled"
                     style="float: right;margin-left: 10px">保存</el-button>
          <el-button @click="dtp.show = true" style="float: right;">取消</el-button>
        </template>
      </template>
    </p>
    <table class="parttime-table">
      <tr>
        <td class="name">DTP经验</td><td style="padding: 0">
          <span v-if="dtp.show">{{dtpDetail.experience}}</span>
          <el-select v-else v-model="dtp.experience">
            <el-option value="1年以下">1年以下</el-option>
            <el-option value="1~2年">1~2年</el-option>
            <el-option value="2~3年">2~3年</el-option>
            <el-option value="3年以上">3年以上</el-option>
          </el-select>
        </td>
        <td class="name">规模</td><td style="padding: 0">
          <span v-if="dtp.show">{{dtpDetail.scale}}</span>
          <el-select v-else v-model="dtp.scale">
            <el-option value="1~3人">1~3人</el-option>
            <el-option value="3~8人">3~8人</el-option>
            <el-option value="8人以上">8人以上</el-option>
          </el-select>
        </td>
        <td class="name">{{dtpDetail.auditTime?'成为DTP时间':'申请技能时间'}}</td>
        <td colspan="2">
          {{dtpDetail.auditTime?dtpDetail.auditTime:dtpDetail.gmtCreate}}
        </td>
      </tr>
      <tr>
        <td class="name">任务标签</td><td colspan="3" style="padding: 0">
          <span v-if="dtp.show">{{dtpDetail.taskLable | formatTaskLabel}}</span>
          <el-select v-else v-model="dtp.taskLable" multiple :collapse-tags="true" style="width: 230px">
            <el-option
              v-for="item of formSelect.dtpTaskOptions"
              :key="item.id"
              :label="item.handleType"
              :value="item.id +','+ item.handleType"></el-option>
          </el-select>
        </td>
        <td class="name">擅长软件</td><td colspan="2" style="padding: 0">
          <span v-if="dtp.show">{{dtpDetail.software && JSON.parse(dtpDetail.software).toString()}}</span>
          <el-select v-else v-model="dtp.software" multiple :collapse-tags="true" style="width: 230px">
            <el-option value="Word">Word</el-option>
            <el-option value="Excel">Excel</el-option>
            <el-option value="PowerPoint">PowerPoint</el-option>
            <el-option value="Photoshop">Photoshop</el-option>
            <el-option value="FrameMaker">FrameMaker</el-option>
            <el-option value="AutoCAD">AutoCAD</el-option>
            <el-option value="PageMaker">PageMaker</el-option>
            <el-option value="Illustrator">Illustrator</el-option>
            <el-option value="QuarkXpress">QuarkXpress</el-option>
            <el-option value="Pm">Pm</el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td class="name" rowspan="6" style="font-size: 14px">合作单价</td>
      </tr>
      <tr>
        <td class="name">译后-英语转写</td><td style="padding: 0">
          <span v-if="dtp.show">{{dtpDetail.unitPrice && JSON.parse(dtpDetail.unitPrice)._1}}/个</span>
          <input v-else v-model="dtp._1" type="number">
        </td>
        <td class="name">译前-打框</td><td style="padding: 0">
          <span v-if="dtp.show">{{dtpDetail.unitPrice && JSON.parse(dtpDetail.unitPrice)._2}}/个</span>
          <input v-else v-model="dtp._2" type="number">
        </td>
        <td class="name">意大利语转写</td><td style="padding: 0">
          <span v-if="dtp.show">{{dtpDetail.unitPrice && JSON.parse(dtpDetail.unitPrice)._3}}/个</span>
          <input v-else v-model="dtp._3" type="number">
        </td>
      </tr>
      <tr>
        <td class="name">CAD下传</td><td style="padding: 0">
          <span v-if="dtp.show">{{dtpDetail.unitPrice && JSON.parse(dtpDetail.unitPrice)._4}}/张</span>
          <input v-else v-model="dtp._4" type="number">
        </td>
        <td class="name">CAD上传</td><td style="padding: 0">
          <span v-if="dtp.show">{{dtpDetail.unitPrice && JSON.parse(dtpDetail.unitPrice)._5}}/张</span>
          <input v-else v-model="dtp._5" type="number">
        </td>
        <td class="name">CAD扫描件下传</td><td style="padding: 0">
          <span v-if="dtp.show">{{dtpDetail.unitPrice && JSON.parse(dtpDetail.unitPrice)._6}}/张</span>
          <input v-else v-model="dtp._6" type="number">
        </td>
      </tr>
      <tr>
        <td class="name">CAD扫描件上传</td><td style="padding: 0">
          <span v-if="dtp.show">{{dtpDetail.unitPrice && JSON.parse(dtpDetail.unitPrice)._7}}/张</span>
          <input v-else v-model="dtp._7" type="number">
        </td>
        <td class="name">出版级WORD排版</td><td style="padding: 0">
          <span v-if="dtp.show">{{dtpDetail.unitPrice && JSON.parse(dtpDetail.unitPrice)._8}}/页</span>
          <input v-else v-model="dtp._8" type="number">
        </td>
        <td class="name">可编辑PDF排版</td><td style="padding: 0">
          <span v-if="dtp.show">{{dtpDetail.unitPrice && JSON.parse(dtpDetail.unitPrice)._9}}/页</span>
          <input v-else v-model="dtp._9" type="number">
        </td>
      </tr>
      <tr>
        <td class="name">扫描件PDF排版</td><td style="padding: 0">
          <span v-if="dtp.show">{{dtpDetail.unitPrice && JSON.parse(dtpDetail.unitPrice)._10}}/页</span>
          <input v-else v-model="dtp._10" type="number">
        </td>
        <td class="name">WORD插图下传</td><td style="padding: 0">
          <span v-if="dtp.show">{{dtpDetail.unitPrice && JSON.parse(dtpDetail.unitPrice)._11}}/图</span>
          <input v-else v-model="dtp._11" type="number">
        </td>
        <td class="name">WORD插图上传</td><td style="padding: 0">
          <span v-if="dtp.show">{{dtpDetail.unitPrice && JSON.parse(dtpDetail.unitPrice)._12}}/图</span>
          <input v-else v-model="dtp._12" type="number">
        </td>
      </tr>
      <tr>
        <td class="name">其他（时间）</td><td colspan="5" style="padding: 0">
          <span v-if="dtp.show">{{dtpDetail.unitPrice && JSON.parse(dtpDetail.unitPrice)._13}}/张</span>
          <input v-else v-model="dtp._13" type="number" style="width: 230px">
        </td>
      </tr>
    </table>
    <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">会展技能
      <template v-if="$store.state.secondPermission['/newSkillController/updateSkillIntepretationBack'] !== undefined">
        <template v-if="huizhan.show">
          <el-button type="success" icon="el-icon-edit"
                     style="float: right"
                     @click="huizhan.show = false">修改</el-button>
        </template>
        <template v-else>
          <el-button type="success"
                     @click="addUnitPrice"
                     style="float: right;margin-left: 10px">添加单价</el-button>
          <el-button type="success"
                     @click="modifyHuizhan"
                     :disabled="huizhanBtn.disabled"
                     style="float: right;margin-left: 10px">保存</el-button>
          <el-button @click="cancelHuizhan" style="float: right;">取消</el-button>
        </template>
      </template>
    </p>
    <table class="parttime-table">
      <tr>
        <td class="name">{{huizhanDetail.auditTime?'成为会展时间':'申请技能时间'}}</td>
        <td colspan="3">{{huizhanDetail.auditTime?huizhanDetail.auditTime:huizhanDetail.gmtCreate}}</td>
        <td class="name">口译类型</td><td style="padding: 0">
        <span v-if="huizhan.show">{{huizhanDetail.interpretationTypes&&JSON.parse(huizhanDetail.interpretationTypes).toString()}}</span>
        <el-select v-else
                   v-model="huizhan.interpretationTypes"
                   multiple :collapse-tags="true"
                   style="width:230px">
          <el-option value="同声传译">同声传译</el-option>
          <el-option value="陪同传译">陪同传译</el-option>
          <el-option value="大型活动">大型活动</el-option>
          <el-option value="交替传译">交替传译</el-option>
        </el-select>
      </td>
        <td class="name">口译经验</td><td colspan="3" style="padding: 0">
        <span v-if="huizhan.show">{{huizhanDetail.experience}}</span>
        <el-select v-else v-model="huizhan.experience">
          <el-option value="1年以下">1年以下</el-option>
          <el-option value="1~3年">1~3年</el-option>
          <el-option value="3~5年">3~5年</el-option>
          <el-option value="5年以上">5年以上</el-option>
        </el-select>
      </td>
      </tr>
      <tr>
        <td class="name">服务地区</td><td colspan="9" style="padding: 0">
        <span v-if="huizhan.show">{{huizhanDetail.province+' '+huizhanDetail.city+' '+huizhanDetail.area}}</span>
        <div class="areaPicker" v-show="!huizhan.show">
          <select v-model="huizhan.province" name="deliverprovince" id="deliverprovince" style="width: 150px"></select>
          <select v-model="huizhan.city" name="delivercity" id="delivercity" style="width: 150px"></select>
          <select v-model="huizhan.area" name="deliverarea" id="deliverarea" style="width: 150px"></select>
        </div>
      </td>
      </tr>
      <template v-if="huizhanDetail.languageInfo && huizhanDetail.languageInfo !== '[]'">
        <tr>
          <td class="name" :rowspan="JSON.parse(huizhanDetail.languageInfo).length+1" style="font-size: 14px">擅长语种</td>
        </tr>
        <tr v-for="(item,index) of JSON.parse(huizhanDetail.languageInfo)">
          <td class="name">擅长语种</td><td colspan="2" style="padding: 0">
          <span v-if="huizhan.show">{{item.langaugeName}}</span>
          <el-select v-else v-model="huizhan.languageInfo[index].langaugeName" style="width: 140px">
            <el-option
              v-for="item in $store.state.languageList"
              :key="item.id"
              :label="item.chineseName"
              :value="item.englishName+','+item.chineseName">
            </el-option>
          </el-select>
        </td>
          <td class="name">擅长领域</td><td colspan="5" style="padding: 0">
          <span v-if="huizhan.show">{{item.secondAreaName}}</span>
          <template v-else>
            <el-select @change="getSecondFieldFn(huizhan.languageInfo[index].firstAreaName,huizhan.languageInfo[index])"
                       v-model="huizhan.languageInfo[index].firstAreaName"
                       placeholder="一级领域" style="width:150px">
              <el-option v-for="item of $store.state.fieldOptions"
                         :key="item.id"
                         :label="item.fullSpecialtyName"
                         :value="item.specialtyId+','+item.fullSpecialtyName"></el-option>
            </el-select>
            <el-select multiple :collapse-tags="true"
                       v-model="huizhan.languageInfo[index].secondAreaName"
                       placeholder="二级领域" style="width:230px">
              <el-option v-for="item of huizhan.languageInfo[index].secondAreaOptions"
                         :key="item.id"
                         :label="item.fullSpecialtyName"
                         :value="item.fullSpecialtyName"></el-option>
            </el-select>
          </template>
        </td>
        </tr>
      </template>
      <template v-if="huizhan.unitPrice.length > 0">
        <tr>
          <td class="name" :rowspan="huizhan.unitPrice.length+1" style="font-size: 14px">合作单价</td>
        </tr>
        <tr v-for="(item, index) of huizhan.unitPrice">
          <td class="name">语言对</td><td colspan="2" style="padding: 0">
          <span v-if="huizhan.show">{{item.origin.split(',')[1] +' -> '+ item.target.split(',')[1]}}</span>
          <template v-else>
            <el-select v-model="huizhan.unitPrice[index].origin"
                       placeholder="源语言" style="width: 140px">
              <el-option
                v-for="item in $store.state.languageList"
                :key="item.id"
                :label="item.chineseName"
                :value="item.englishName+','+item.chineseName">
              </el-option>
            </el-select>
            <el-select v-model="huizhan.unitPrice[index].target"
                       placeholder="目标语言" style="width: 140px">
              <el-option
                v-for="item in $store.state.languageList"
                :key="item.id"
                :label="item.chineseName"
                :value="item.englishName+','+item.chineseName">
              </el-option>
            </el-select>
          </template>
        </td>
          <td class="name">口译类型</td><td style="padding: 0">
          <span v-if="huizhan.show">{{item.kyType.toString()}}</span>
          <el-select v-else v-model="huizhan.unitPrice[index].kyType"
                     multiple :collapse-tags="true"
                     style="width: 230px">
            <el-option value="同声传译">同声传译</el-option>
            <el-option value="陪同传译">陪同传译</el-option>
            <el-option value="大型活动">大型活动</el-option>
            <el-option value="交替传译">交替传译</el-option>
          </el-select>
        </td>
          <td class="name">合作单价</td><td style="padding: 0;width: 80px">
          <span v-if="huizhan.show">{{item.price}}</span>
          <el-input v-else v-model="huizhan.unitPrice[index].price" type="number"></el-input>
        </td>
          <td style="padding: 0;width: 120px">
            <span v-if="huizhan.show">{{item.unit}}</span>
            <el-select v-else v-model="huizhan.unitPrice[index].unit">
              <el-option value="元/人/天">元/人/天</el-option>
              <el-option value="元/人/半天">元/人/半天</el-option>
            </el-select>
          </td>
          <td style="padding: 0;width: 100px"><el-button v-if="!huizhan.show"
                                                         @click="delArrayItem(huizhan.unitPrice,index)"
                                                         type="text" class="del">删除</el-button></td>
        </tr>
      </template>
    </table>
    <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">外派技能
      <template v-if="$store.state.secondPermission['/newSkillController/udateNewSkillExpatriate'] !== undefined">
        <template v-if="waipai.show">
          <el-button type="success" icon="el-icon-edit"
                     style="float: right"
                     @click="waipai.show = false">修改</el-button>
        </template>
        <template v-else>
          <el-button type="success"
                     @click="modifyWaipai"
                     :disabled="waipaiBtn.disabled"
                     style="float: right;margin-left: 10px">保存</el-button>
          <el-button @click="waipai.show = true" style="float: right;">取消</el-button>
        </template>
      </template>
    </p>
    <table class="parttime-table">
      <tr>
        <td class="name">{{waipaiDetail.auditTime?'成为外派时间':'申请技能时间'}}</td>
        <td colspan="2">{{waipaiDetail.auditTime?waipaiDetail.auditTime:waipaiDetail.gmtCreate}}</td>
        <td class="name">外派特长</td><td colspan="1" style="padding: 0">
        <span v-if="waipai.show">{{waipaiDetail.expertise&&JSON.parse(waipaiDetail.expertise).toString()}}</span>
        <el-select v-else
                   v-model="waipai.expertise"
                   multiple :collapse-tags="true"
                   style="width:300px">
          <el-option value="普通翻译（内勤、后勤、采购等）">普通翻译（内勤、后勤、采购等）</el-option>
          <el-option value="技术翻译（商务、文档等）">技术翻译（商务、文档等）</el-option>
          <el-option value="首席术翻译（项目经理助理、翻译管理）">首席术翻译（项目经理助理、翻译管理）</el-option>
        </el-select>
      </td>
        <td class="name">外派经验</td><td style="padding: 0">
        <span v-if="waipai.show">{{waipaiDetail.experience}}</span>
        <el-select v-else v-model="waipai.experience">
          <el-option value="1年以下">1年以下</el-option>
          <el-option value="1~2年">1~2年</el-option>
          <el-option value="2~3年">2~3年</el-option>
          <el-option value="3~4年">3~4年</el-option>
          <el-option value="4~5年">4~5年</el-option>
          <el-option value="5年以上">5年以上</el-option>
        </el-select>
      </td>
      </tr>
      <template v-if="waipaiDetail.languageInfo && waipaiDetail.languageInfo !== '[]'">
        <tr>
          <td class="name" :rowspan="JSON.parse(waipaiDetail.languageInfo).length+1" style="font-size: 14px">擅长语种</td>
        </tr>
        <tr v-for="(item, index) of JSON.parse(waipaiDetail.languageInfo)">
          <td class="name">擅长语种</td><td style="padding: 0">
          <span v-if="waipai.show">{{item.langaugeName}}</span>
          <el-select v-else
                     v-model="waipai.languageInfo[index].language"
                     placeholder="语言">
            <el-option
              v-for="item in $store.state.languageList"
              :key="item.id"
              :label="item.chineseName"
              :value="item.englishName+','+item.chineseName">
            </el-option>
          </el-select>
        </td>
          <td class="name">擅长领域</td><td colspan="3" style="padding: 0">
          <span v-if="waipai.show">{{item.secondAreaName}}</span>
          <template v-else>
            <el-select @change="getSecondFieldFn(waipai.languageInfo[index].firstAreaName,waipai.languageInfo[index])"
                       v-model="waipai.languageInfo[index].firstAreaName"
                       placeholder="一级领域" style="width:150px">
              <el-option v-for="item of $store.state.fieldOptions"
                         :key="item.id"
                         :label="item.fullSpecialtyName"
                         :value="item.specialtyId+','+item.fullSpecialtyName"></el-option>
            </el-select>
            <el-select multiple :collapse-tags="true"
                       v-model="waipai.languageInfo[index].secondAreaName"
                       placeholder="二级领域" style="width:230px">
              <el-option v-for="item of waipai.languageInfo[index].secondAreaOptions"
                         :key="item.id"
                         :label="item.fullSpecialtyName"
                         :value="item.fullSpecialtyName"></el-option>
            </el-select>
          </template>
        </td>
        </tr>
      </template>
    </table>
    <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">培训技能
      <template v-if="$store.state.secondPermission['/newSkillController/updateNewSkillTrainBack'] !== undefined">
        <template v-if="peixun.show">
          <el-button type="success" icon="el-icon-edit"
                     style="float: right"
                     @click="peixun.show = false">修改</el-button>
        </template>
        <template v-else>
          <el-button type="success"
                     @click="modifyPeixun"
                     :disabled="peixunBtn.disabled"
                     style="float: right;margin-left: 10px">保存</el-button>
          <el-button @click="peixun.show = true" style="float: right;">取消</el-button>
        </template>
      </template>
    </p>
    <table class="parttime-table">
      <tr>
        <td class="name">{{peixunDetail.auditTime?'成为培训时间':'申请技能时间'}}</td>
        <td colspan="2">{{peixunDetail.auditTime?peixunDetail.auditTime:peixunDetail.gmtCreate}}</td>
        <td class="name">培训经验</td><td style="padding: 0">
        <span v-if="peixun.show">{{peixunDetail.trainingExperience}}</span>
        <el-select v-else v-model="peixun.trainingExperience">
          <el-option value="1年以下">1年以下</el-option>
          <el-option value="1~5年">1~5年</el-option>
          <el-option value="5~10年">5~10年</el-option>
          <el-option value="10年以上">10年以上</el-option>
        </el-select>
      </td>
        <td class="name">培训师培训</td><td style="padding: 0">
        <span v-if="peixun.show">{{peixunDetail.trainerTraining && JSON.parse(peixunDetail.trainerTraining).toString()}}</span>
        <el-select v-else
                   v-model="peixun.trainerTraining"
                   multiple :collapse-tags="true"
                   style="width:230px">
          <el-option value="培训师培训">培训师培训</el-option>
        </el-select>
      </td>
      </tr>
      <tr>
        <td class="name">职场软技能</td><td colspan="2" style="padding: 0">
        <span v-if="peixun.show">{{peixunDetail.softSkills && JSON.parse(peixunDetail.softSkills).toString()}}</span>
        <el-select v-else
                   v-model="peixun.softSkills"
                   multiple :collapse-tags="true"
                   style="width:230px">
          <el-option value="面试求职">面试求职</el-option>
          <el-option value="职场沟通">职场沟通</el-option>
          <el-option value="呼叫中心">呼叫中心</el-option>
          <el-option value="职业规划">职业规划</el-option>
        </el-select>
      </td>
        <td class="name">海外学习经历</td><td style="padding: 0">
        <span v-if="peixun.show">{{peixunDetail.overseasLearning}}</span>
        <el-select v-else v-model="peixun.overseasLearning">
          <el-option value="有">有</el-option>
          <el-option value="无">无</el-option>
        </el-select>
      </td>
        <td class="name">海外工作经历</td><td style="padding: 0">
        <span v-if="peixun.show">{{peixunDetail.overseasWorking}}</span>
        <el-select v-else v-model="peixun.overseasWorking">
          <el-option value="有">有</el-option>
          <el-option value="无">无</el-option>
        </el-select>
      </td>
      </tr>
      <template v-if="peixunDetail.languageInfo && peixunDetail.languageInfo !== '[]'">
        <tr>
          <td class="name" :rowspan="JSON.parse(peixunDetail.languageInfo).length+1" style="font-size: 14px">擅长语种</td>
        </tr>
        <tr v-for="(item, index) of JSON.parse(peixunDetail.languageInfo)">
          <td class="name">擅长语种</td><td style="padding: 0">
          <span v-if="peixun.show">{{item.langaugeName}}</span>
          <el-select v-else
                     v-model="peixun.languageInfo[index].language"
                     placeholder="语言">
            <el-option
              v-for="item in $store.state.languageList"
              :key="item.id"
              :label="item.chineseName"
              :value="item.englishName+','+item.chineseName">
            </el-option>
          </el-select>
        </td>
          <td class="name">擅长领域</td><td colspan="3" style="padding: 0">
          <span v-if="peixun.show">{{item.secondAreaName}}</span>
          <template v-else>
            <el-select @change="getSecondFieldFn(peixun.languageInfo[index].firstAreaName,peixun.languageInfo[index])"
                       v-model="peixun.languageInfo[index].firstAreaName"
                       placeholder="一级领域" style="width:150px">
              <el-option v-for="item of $store.state.fieldOptions"
                         :key="item.id"
                         :label="item.fullSpecialtyName"
                         :value="item.specialtyId+','+item.fullSpecialtyName"></el-option>
            </el-select>
            <el-select multiple :collapse-tags="true"
                       v-model="peixun.languageInfo[index].secondAreaName"
                       placeholder="二级领域" style="width:230px">
              <el-option v-for="item of peixun.languageInfo[index].secondAreaOptions"
                         :key="item.id"
                         :label="item.fullSpecialtyName"
                         :value="item.fullSpecialtyName"></el-option>
            </el-select>
          </template>
        </td>
        </tr>
      </template>
    </table>
  </div>
</template>
<script>
  import '@/common/area';
  import { formatMoneyType } from '@/common/filter';
  export default {
    data (){
      return {
        skillDetail: {},
        biyi: {//笔译
          show: true,
          transYear: '',
          lanPair: []
        },
        dtpDetail: {},
        dtp: {//dtp
          show: true,
          experience: '',
          scale: '',
          taskLable: '',
          software: '',
          _1: '',
          _2: '',
          _3: '',
          _4: '',
          _5: '',
          _6: '',
          _7: '',
          _8: '',
          _9: '',
          _10: '',
          _11: '',
          _12: '',
          _13: ''
        },
        huizhanDetail: {},
        huizhan: {//会展
          show: true,
          province: '',
          city: '',
          area: '',
          experience: '',
          interpretationTypes: [],
          languageInfo: [],
          unitPrice: []
        },
        waipaiDetail: {},
        waipai: {//外派
          show: true,
          experience: '',
          expertise: [],
          languageInfo: []
        },
        peixunDetail: {},
        peixun: {//培训
          show: true,
          overseasLearning: '',
          overseasWorking: '',
          trainingExperience: '',
          trainerTraining: [],
          softSkills: [],
          languageInfo: []
        },
        biyiBtn: { disabled: false },
        dtpBtn: { disabled: false },
        huizhanBtn: { disabled: false },
        waipaiBtn: { disabled: false },
        peixunBtn: { disabled: false },
        formSelect: {
          dtpTaskOptions: []
        }
      }
    },
    filters: {
      formatMoneyType: formatMoneyType,
      //格式化任务标签
      formatTaskLabel (str){
        let resultStr = '';
        if(str && str.includes('[')){
          const arr = JSON.parse(str);
          const newArr = arr.map(item => {
            return item.dtpLableName;
          });
          resultStr = newArr.toString();
        }
        return resultStr;
      }
    },
    created (){
      this.$nextTick(() => {
        new window._PCAS("deliverprovince", "delivercity", "deliverarea")
      })
    },
    methods: {
      delArrayItem (data, idx){
        data.splice(idx, 1)
      },
      //获取加载下拉框
      getSelectOptions (){
        //获取dtp任务标签
        this.$http.get('/newSkillController/listUnitPriceDtp')
          .then(res => {
            if(res.data.success){
              this.formSelect.dtpTaskOptions = res.data.data;
            }
          });
      },
      //获取二级领域
      getSecondFieldFn (val, data){
        const id = val.split(',')[0];
        this.getSecondField(id).then(res => {
          data.secondAreaName = [];
          data.secondAreaOptions = res;
        })
      },
      //切换tab时，获取总详情
      showDetail (){
        this.showBiyiDetail();
        this.showDtpDetail();
        this.showHuizhanDetail();
        this.showWaipaiDetail();
        this.showPeixunDetail();
      },
      //获取笔译详情
      showBiyiDetail (){
        this.$http.get('/userExtension/getOrderWithDrawDetail', {
          params: {
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.skillDetail.wordCount = res.data.data.wordCount;
          }
        });
        this.$http.get('/userExtension/findResumeByUserId', {
          params: {
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            const _data = res.data.data;
            if(_data.userExtension) {
              this.skillDetail.userSource = _data.userExtension && _data.userExtension.userSource || '';
              this.skillDetail.userExtendList = _data.userExtendList;
              this.skillDetail.transYear = _data.userExtension.translateYear;
              this.skillDetail.transDate = _data.userExtension.translatorDate;
              if(typeof(this.skillDetail.userExtendList) === 'object'){
                this.biyi.lanPair = this.skillDetail.userExtendList.map(item => {
                  return {
                    id: item.id,
                    unitPrice: item.unitPrice,
                    unit: item.unit ? item.unit : '中文中朝',
                    currencyCode: item.currencyCode ? item.currencyCode : 'CNY'
                  }
                })
              }
              this.biyi.transYear = this.skillDetail.transYear;
              this.skillDetail = Object.assign({}, this.skillDetail);
            }
          }
        })
      },
      //获取dtp详情
      showDtpDetail (){
        this.$http.get('/newSkillController/listNewSkillDTP',{
          params:{
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.dtpDetail = res.data.data;
            this.dtp.experience = this.dtpDetail.experience;
            this.dtp.scale = this.dtpDetail.scale;
            this.dtp.software = this.dtpDetail.software && JSON.parse(this.dtpDetail.software) || [];
            if(this.dtpDetail.taskLable){
              const arr = JSON.parse(this.dtpDetail.taskLable) || [];
              this.dtp.taskLable = arr.map(item => {
                return item.dtpLableCode + ','+ item.dtpLableName
              });
            }
            if(this.dtpDetail.unitPrice){
              const unitObj = JSON.parse(this.dtpDetail.unitPrice);
              for(let key in unitObj){
                this.dtp[key] = unitObj[key];
              }
            }
          }
        })
      },
      //获取会展详情
      showHuizhanDetail (){
        this.$http.get('/newSkillController/listNewSkillInterpretation',{
          params:{
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.huizhanDetail = res.data.data;
            this.huizhan.experience = this.huizhanDetail.experience;
            this.huizhan.province = this.huizhanDetail.province;
            setTimeout(() => {
              const event = document.createEvent("HTMLEvents");
              event.initEvent("change", false, true);
              document.querySelector('#deliverprovince').dispatchEvent(event);
              this.huizhan.city = this.huizhanDetail.city;
              this.huizhan.area = this.huizhanDetail.area;
            }, 500);
            this.huizhan.interpretationTypes = this.huizhanDetail.interpretationTypes
                                            && JSON.parse(this.huizhanDetail.interpretationTypes) || [];
            if(this.huizhanDetail.languageInfo){
              this.huizhan.languageInfo = [];
              const lanArr = JSON.parse(this.huizhanDetail.languageInfo) || [];
              lanArr.forEach(item => {
                this.getSecondField(item.firstAreaCode).then(res => {
                  const obj = {
                    langaugeName: item.languageCode+','+item.langaugeName,
                    firstAreaName: item.firstAreaCode+','+item.firstAreaName,
                    secondAreaName: item.secondAreaName && item.secondAreaName.split(',') || [],
                    secondAreaOptions: res
                  };
                  this.huizhan.languageInfo.push(obj)
                })
              })
            }
            this.huizhan.unitPrice = this.huizhanDetail.unitPrice
                                  && JSON.parse(this.huizhanDetail.unitPrice) || [];
          }
        });
      },
      //获取外派详情
      showWaipaiDetail (){
        this.$http.get('/newSkillController/listNewSkillExpatriate',{
          params:{
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.waipaiDetail = res.data.data;
            this.waipai.experience = this.waipaiDetail.experience;
            this.waipai.expertise = this.waipaiDetail.expertise && JSON.parse(this.waipaiDetail.expertise) || [];
            if(this.waipaiDetail.languageInfo){
              this.waipai.languageInfo = [];
              const lanArr = JSON.parse(this.waipaiDetail.languageInfo) || [];
              lanArr.forEach(item => {
                this.getSecondField(item.firstAreaCode).then(res => {
                  const obj = {
                    language: item.languageCode+','+item.langaugeName,
                    firstAreaName: item.firstAreaCode+','+item.firstAreaName,
                    secondAreaName: item.secondAreaName && item.secondAreaName.split(',') || [],
                    secondAreaOptions: res
                  };
                  this.waipai.languageInfo.push(obj)
                })
              })
            }
          }
        });
      },
      //获取培训详情
      showPeixunDetail (){
        this.$http.get('/newSkillController/listNewSkillTrain',{
          params:{
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.peixunDetail = res.data.data;
            this.peixun.trainingExperience = this.peixunDetail.trainingExperience;
            this.peixun.overseasLearning = this.peixunDetail.overseasLearning;
            this.peixun.overseasWorking = this.peixunDetail.overseasWorking;
            this.peixun.softSkills = this.peixunDetail.softSkills && JSON.parse(this.peixunDetail.softSkills) || [];
            this.peixun.trainerTraining = this.peixunDetail.trainerTraining && JSON.parse(this.peixunDetail.trainerTraining) || [];
            if(this.peixunDetail.languageInfo){
              this.peixun.languageInfo = [];
              const lanArr = JSON.parse(this.peixunDetail.languageInfo) || [];
              lanArr.forEach(item => {
                this.getSecondField(item.firstAreaCode).then(res => {
                  const obj = {
                    language: item.languageCode+','+item.langaugeName,
                    firstAreaName: item.firstAreaCode+','+item.firstAreaName,
                    secondAreaName: item.secondAreaName && item.secondAreaName.split(',') || [],
                    secondAreaOptions: res
                  };
                  this.peixun.languageInfo.push(obj)
                })
              })
            }
          }
        });
      },
      //修改笔译
      modifyBiyi (){
        const partTimeStaffDetailParam = {
          "translatorYears": this.biyi.transYear,
          "unitPriceLst": this.biyi.lanPair,
          "userId": this.$route.params.id
        };
        this.biyiBtn.disabled = true;
        this.$http.post('/newSkillController/updateTranslatorSkill',partTimeStaffDetailParam)
          .then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.showBiyiDetail();
              this.biyi.show = true;
            }else{
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
            this.biyiBtn.disabled = false;
          })
      },
      //修改Dtp
      modifyDtp (){
        const unitPrice = {};
        for(let key in this.dtp){
          if(key !== 'experience' &&
            key !== 'scale' &&
            key !== 'show' &&
            key !== 'software' &&
            key !== 'taskLable'){
            unitPrice[key] = this.dtp[key];
          }
        }
        const newSkillDtpParam = {
          "userId": this.$route.params.id,
          "editionExperience": this.dtp.experience,
          "scale": this.dtp.scale,
          "software": this.dtp.software,
          "taskLable": this.dtp.taskLable.map(item => {return {dtpLableCode:item.split(',')[0],dtpLableName:item.split(',')[1]}}),
          "unitPrice": JSON.stringify(unitPrice)
        };
        this.dtpBtn.disabled = true;
        this.$http.post('/newSkillController/updateSkillDtpBack', newSkillDtpParam)
          .then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.showDtpDetail();
              this.dtp.show = true;
            }else{
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
            this.dtpBtn.disabled = false;
          })
      },
      //修改会展
      modifyHuizhan (){
        const lanArr = this.huizhan.languageInfo.map(item => {
          const findCode = [];
          for(let i = 0, len = item.secondAreaName.length; i<len; i++){
            const itemName = item.secondAreaName[i];
            for(let j = 0, len1 = item.secondAreaOptions.length; j<len1; j++){
              const itemName1 = item.secondAreaOptions[j];
              if(itemName === itemName1.fullSpecialtyName){
                findCode.push(itemName1.specialtyId);
                break;
              }
            }
          }
          return {
            languageCode: item.langaugeName.split(',')[0],
            langaugeName: item.langaugeName.split(',')[1],
            firstAreaCode: item.firstAreaName.split(',')[0],
            firstAreaName: item.firstAreaName.split(',')[1],
            secondAreaCode: findCode.toString(),
            secondAreaName: item.secondAreaName.toString(),
          }
        });
        const newSkillIntepretationParam = {
          "area": this.huizhan.area,
          "city": this.huizhan.city,
          "interpretationExperience": this.huizhan.experience,
          "interpretationTypes": this.huizhan.interpretationTypes,
          "province": this.huizhan.province,
          "languageAreaInfo": lanArr,
          "unitPrice": JSON.stringify(this.huizhan.unitPrice),
          "userId": this.$route.params.id
        };
        this.huizhanBtn.disabled = true;
        this.$http.post('/newSkillController/updateSkillIntepretationBack', newSkillIntepretationParam)
          .then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.showHuizhanDetail();
              this.huizhan.show = true;
            }else{
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
            this.huizhanBtn.disabled = false;
          })
      },
      //取消(会展)
      cancelHuizhan (){
        this.huizhan.show = true;
        this.huizhan.unitPrice = this.huizhanDetail.unitPrice && JSON.parse(this.huizhanDetail.unitPrice) || [];
      },
      //添加单价(会展)
      addUnitPrice (){
        this.huizhan.unitPrice.push({
          origin: '',
          target: '',
          unit: '元/人/天',
          price: '',
          kyType: []
        });
      },
      //修改外派
      modifyWaipai (){
        const lanArr = this.waipai.languageInfo.map(item => {
          const findCode = [];
          for(let i = 0, len = item.secondAreaName.length; i<len; i++){
            const itemName = item.secondAreaName[i];
            for(let j = 0, len1 = item.secondAreaOptions.length; j<len1; j++){
              const itemName1 = item.secondAreaOptions[j];
              if(itemName === itemName1.fullSpecialtyName){
                findCode.push(itemName1.specialtyId);
                break;
              }
            }
          }
          return {
            languageCode: item.language.split(',')[0],
            langaugeName: item.language.split(',')[1],
            firstAreaCode: item.firstAreaName.split(',')[0],
            firstAreaName: item.firstAreaName.split(',')[1],
            secondAreaCode: findCode.toString(),
            secondAreaName: item.secondAreaName.toString(),
          }
        });
        const newSkillExpatriateParam = {
          "userId": this.$route.params.id,
          "expatriateExperience": this.waipai.experience,
          "expatriateExpertise": this.waipai.expertise,
          "languageInfo": lanArr
        };
        this.waipaiBtn.disabled = true;
        this.$http.post('/newSkillController/udateNewSkillExpatriate', newSkillExpatriateParam)
          .then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.showWaipaiDetail();
              this.waipai.show = true;
            }else{
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
            this.waipaiBtn.disabled = false;
          })
      },
      //修改培训
      modifyPeixun (){
        const lanArr = this.peixun.languageInfo.map(item => {
          const findCode = [];
          for(let i = 0, len = item.secondAreaName.length; i<len; i++){
            const itemName = item.secondAreaName[i];
            for(let j = 0, len1 = item.secondAreaOptions.length; j<len1; j++){
              const itemName1 = item.secondAreaOptions[j];
              if(itemName === itemName1.fullSpecialtyName){
                findCode.push(itemName1.specialtyId);
                break;
              }
            }
          }
          return {
            languageCode: item.language.split(',')[0],
            langaugeName: item.language.split(',')[1],
            firstAreaCode: item.firstAreaName.split(',')[0],
            firstAreaName: item.firstAreaName.split(',')[1],
            secondAreaCode: findCode.toString(),
            secondAreaName: item.secondAreaName.toString(),
          }
        });
        const newSkillTrainParam = {
          "userId": this.$route.params.id,
          "trainingExperience": this.peixun.trainingExperience,
          "overseasLearning": this.peixun.overseasLearning,
          "overseasWorking": this.peixun.overseasWorking,
          "softSkills": this.peixun.softSkills,
          "trainerTraining": this.peixun.trainerTraining,
          "languageInfo": lanArr
        };
        this.peixunBtn.disabled = true;
        this.$http.post('/newSkillController/updateNewSkillTrainBack', newSkillTrainParam)
          .then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.showPeixunDetail();
              this.peixun.show = true;
            }else{
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
            this.peixunBtn.disabled = false;
          })
      }
    }
  }
</script>
