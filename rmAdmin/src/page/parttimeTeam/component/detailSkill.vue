<template>
  <div class="detail">
    <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">笔译技能
      <template v-if="biyi.show">
        <el-button type="success" icon="el-icon-edit"
                   style="float: right"
                   @click="biyi.show = false">修改</el-button>
      </template>
      <template v-else>
        <el-button type="success"
                   @click="addLanPair"
                   style="float: right;margin-left: 10px">添加语言对</el-button>
        <el-button type="success"
                   @click="modifyBiyi"
                   :disabled="biyiBtn.disabled"
                   style="float: right;margin-left: 10px">保存</el-button>
        <el-button @click="cancelBiyi" style="float: right;">取消</el-button>
      </template>
    </p>
    <table class="parttime-table">
      <tr>
        <td class="name">成为笔译时间</td><td colspan="2">{{skillDetail.transDate}}</td>
        <td class="name">笔译经验</td><td colspan="2" style="padding: 0">
          <span v-if="biyi.show">{{skillDetail.transYear ? skillDetail.transYear:'--'}}</span>
          <input v-else v-model="biyi.transYear" type="text" style="width: 130px">
        </td>
        <td class="name">翻译字数</td><td colspan="6">{{detail.wordCount}}</td>
      </tr>
      <template v-if="biyi.lanPair.length>0">
        <tr v-for="(item, index) of biyi.lanPair" :key="item.id">
          <td class="name">语言对</td><td colspan="2" style="padding: 0">
            <span v-if="biyi.show">{{item.origin.split(',')[1] +' -> '+ item.target.split(',')[1]}}</span>
            <template v-else>
              <el-select v-model="biyi.lanPair[index].origin"
                         placeholder="源语言" style="width: 130px">
                <el-option
                  v-for="item in $store.state.languageList"
                  :key="item.id"
                  :label="item.chineseName"
                  :value="item.englishName+','+item.chineseName">
                </el-option>
              </el-select>
              <el-select v-model="biyi.lanPair[index].target"
                         placeholder="目标语言" style="width: 150px">
                <el-option
                  v-for="item in $store.state.languageList"
                  :key="item.id"
                  :label="item.chineseName"
                  :value="item.englishName+','+item.chineseName">
                </el-option>
              </el-select>
            </template>
          </td>
          <td class="name">擅长领域</td><td colspan="2" style="padding: 0">
            <span v-if="biyi.show">{{item.secondAreaName.toString()}}</span>
            <template v-else>
              <el-select @change="getSecondFieldToID(biyi.lanPair[index].firstAreaName,biyi.lanPair[index])"
                         v-model="biyi.lanPair[index].firstAreaName"
                         placeholder="一级领域" style="width:130px">
                <el-option v-for="item of $store.state.fieldOptions"
                           :key="item.id"
                           :label="item.fullSpecialtyName"
                           :value="item.id+','+item.fullSpecialtyName"></el-option>
              </el-select>
              <el-select multiple :collapse-tags="true"
                         v-model="biyi.lanPair[index].secondAreaName"
                         placeholder="二级领域" style="width:240px">
                <el-option v-for="item of biyi.lanPair[index].secondAreaOptions"
                           :key="item.id"
                           :label="item.fullSpecialtyName"
                           :value="item.fullSpecialtyName"></el-option>
              </el-select>
            </template>
          </td>
          <td class="name">等级</td><td style="padding: 0;width: 100px">
            <span v-if="biyi.show">{{item.levelName}}</span>
            <el-select v-else v-model="biyi.lanPair[index].levelName">
              <el-option v-for="item of memberLevel"
                         :key="item"
                         :label="item"
                         :value="item"></el-option>
            </el-select>
          </td>
          <td class="name">合作单价</td><td style="padding: 0;min-width: 270px">
          <span v-if="biyi.show">{{item.unitPrice}}-{{item.unit}}-{{item.currencyCode | formatMoneyType}}</span>
            <template v-else>
              <input v-model="biyi.lanPair[index].unitPrice" type="number" style="width: 30%">
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
          <td style="padding: 0">
            <el-button v-show="!biyi.show"
                       @click="delBiyiPair(item.id, biyi.lanPair, index)"
                       type="text" class="del">删除</el-button>
          </td>
        </tr>
      </template>
    </table>
    <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">DTP技能
      <template v-if="dtp.show">
        <el-button type="success" icon="el-icon-edit"
                   style="float: right"
                   @click="dtp.show = false">修改</el-button>
      </template>
      <template v-else>
        <el-button type="success"
                   @click="modifyDtp"
                   :disabled="dtpBtn.disabled"
                   style="float: right;margin-left: 10px">保存</el-button>
        <el-button @click="dtp.show = true" style="float: right;">取消</el-button>
      </template></p>
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
      </template></p>
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
          <select v-model="huizhan.province" name="kyprovince" id="kyprovince" style="width: 150px"></select>
          <select v-model="huizhan.city" name="kycity" id="kycity" style="width: 150px"></select>
          <select v-model="huizhan.area" name="kyarea" id="kyarea" style="width: 150px"></select>
        </div>
      </td>
      </tr>
      <template v-if="huizhanDetail.languageInfo && huizhanDetail.languageInfo !== '[]'">
        <tr>
          <td class="name" :rowspan="JSON.parse(huizhanDetail.languageInfo).length+1" style="font-size: 14px">擅长语种</td>
        </tr>
        <tr v-for="(item,index) of JSON.parse(huizhanDetail.languageInfo)">
          <td class="name">擅长语种</td><td style="padding: 0">
          <span v-if="huizhan.show">{{item.langaugeName}}</span>
          <el-select v-else v-model="huizhan.languageInfo[index].langaugeName">
            <el-option
              v-for="item in $store.state.languageList"
              :key="item.id"
              :label="item.chineseName"
              :value="item.englishName+','+item.chineseName">
            </el-option>
          </el-select>
        </td>
          <td class="name">擅长领域</td><td colspan="5" style="padding: 0">
          <span v-if="huizhan.show">{{item.firstAreaName}}</span>
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
          <td style="padding: 0;width: 80px"><el-button v-if="!huizhan.show"
                                                        @click="delArrayItem(huizhan.unitPrice,index)"
                                                        type="text" class="del">删除</el-button></td>
        </tr>
      </template>
    </table>
    <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">设备
      <template v-if="shebei.show">
        <el-button type="success" icon="el-icon-edit"
                   style="float: right"
                   @click="shebei.show = false">修改</el-button>
      </template>
      <template v-else>
        <el-button type="success"
                   @click="addDevice(shebei.equipmentInfo)"
                   style="float: right;margin-left: 10px">添加设备</el-button>
        <el-button type="success"
                   @click="modifyShebei"
                   :disabled="shebeiBtn.disabled"
                   style="float: right;margin-left: 10px">保存</el-button>
        <el-button @click="cancelDevice" style="float: right;">取消</el-button>
      </template></p>
    <table class="parttime-table">
      <tr>
        <td class="name">{{shebeiDetail.auditTime?'成为设备时间':'申请技能时间'}}</td>
        <td>{{shebeiDetail.auditTime?shebeiDetail.auditTime:shebeiDetail.gmtCreate}}</td>
        <td class="name">备注</td><td colspan="2" style="padding: 0">
        <span v-if="shebei.show">{{shebeiDetail.remark}}</span>
        <el-input v-else v-model="shebei.remark" type="textarea"></el-input>
      </td>
        <td class="name">服务地区</td><td colspan="2" style="padding: 0">
        <span v-if="shebei.show">{{shebeiDetail.province+' '+shebeiDetail.city+' '+shebeiDetail.area}}</span>
        <div class="areaPicker" v-show="!shebei.show">
          <select v-model="shebei.province" class="province" name="shebeiProvince" id="shebeiProvince"></select>
          <select v-model="shebei.city" class="city" name="shebeiCity" id="shebeiCity"></select>
          <select v-model="shebei.area" class="area" name="shebeiArea" id="shebeiArea"></select>
        </div>
      </td>
      </tr>
      <template v-if="shebei.equipmentInfo.length>0">
        <tr v-for="(item, index) of shebei.equipmentInfo">
          <td class="name">设备名称</td><td style="padding: 0">
          <span v-if="shebei.show">{{item.equipName}}</span>
          <el-select v-else v-model="shebei.equipmentInfo[index].equipName" placeholder="选择设备">
            <el-option value="同传套件">同传套件</el-option>
            <el-option value="同传主机">同传主机</el-option>
            <el-option value="辐射板">辐射板</el-option>
            <el-option value="接收机">接收机</el-option>
            <el-option value="译员机">译员机</el-option>
            <el-option value="翻译间">翻译间</el-option>
            <el-option value="手拉手设备">手拉手设备</el-option>
            <el-option value="无限导览">无限导览</el-option>
            <el-option value="无限导览接收机">无限导览接收机</el-option>
            <el-option value="音箱">音箱</el-option>
          </el-select>
        </td>
          <td class="name">单价</td><td style="padding: 0">
          <span v-if="shebei.show">{{item.equipUnitPrice}}</span>
          <input v-else v-model="shebei.equipmentInfo[index].equipUnitPrice" type="number">
        </td>
          <td style="padding: 0">
            <span v-if="shebei.show">{{item.equipUnit}}</span>
            <el-select v-else v-model="shebei.equipmentInfo[index].equipUnit">
              <el-option value="/天/套">/天/套</el-option>
            </el-select>
          </td>
          <td class="name">设备数量</td><td style="padding: 0">
          <span v-if="shebei.show">{{item.equipNum}}</span>
          <input v-else v-model="shebei.equipmentInfo[index].equipNum" type="number">
        </td>
          <td style="padding: 0;width: 80px"><el-button v-if="!shebei.show"
                                                        @click="delArrayItem(shebei.equipmentInfo,index)"
                                                        type="text" class="del">删除</el-button></td>
        </tr>
      </template>
    </table>
    <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">搭建
      <template v-if="dajian.show">
        <el-button type="success" icon="el-icon-edit"
                   style="float: right"
                   @click="dajian.show = false">修改</el-button>
      </template>
      <template v-else>
        <el-button type="success"
                   @click="addDevice(dajian.buildInfo)"
                   style="float: right;margin-left: 10px">添加搭建</el-button>
        <el-button type="success"
                   @click="modifyDajian"
                   :disabled="dajianBtn.disabled"
                   style="float: right;margin-left: 10px">保存</el-button>
        <el-button @click="cancelDajian" style="float: right;">取消</el-button>
      </template></p>
    <table class="parttime-table">
      <tr>
        <td class="name">{{dajianDetail.auditTime?'成为搭建时间':'申请技能时间'}}</td>
        <td>{{dajianDetail.auditTime?dajianDetail.auditTime:dajianDetail.gmtCreate}}</td>
        <td class="name">备注</td><td colspan="2" style="padding: 0">
        <span v-if="dajian.show">{{dajianDetail.remark}}</span>
        <el-input v-else v-model="dajian.remark" type="textarea"></el-input>
      </td>
        <td class="name">服务地区</td><td colspan="2" style="padding: 0">
        <span v-if="dajian.show">{{dajianDetail.province+' '+dajianDetail.city+' '+dajianDetail.area}}</span>
        <div class="areaPicker" v-show="!dajian.show">
          <select v-model="dajian.province" class="province" name="dajianProvince" id="dajianProvince"></select>
          <select v-model="dajian.city" class="city" name="dajianCity" id="dajianCity"></select>
          <select v-model="dajian.area" class="area" name="dajianArea" id="dajianArea"></select>
        </div>
      </td>
      </tr>
      <template v-if="dajian.buildInfo.length>0">
        <tr v-for="(item, index) of dajian.buildInfo">
          <td class="name">搭建项</td><td style="padding: 0">
          <span v-if="dajian.show">{{item.equipName}}</span>
          <el-select v-else v-model="dajian.buildInfo[index].equipName" placeholder="选择设备">
            <el-option value="投影机">投影机</el-option>
            <el-option value="投影幕">投影幕</el-option>
            <el-option value="电视机">电视机</el-option>
            <el-option value="LED设备">LED设备</el-option>
            <el-option value="灯光设备">灯光设备</el-option>
            <el-option value="会场搭建">会场搭建</el-option>
            <el-option value="签到系统">签到系统</el-option>
            <el-option value="印刷产品">印刷产品</el-option>
            <el-option value="礼品">礼品</el-option>
            <el-option value="摄影摄像">摄影摄像</el-option>
          </el-select>
        </td>
          <td class="name">单价</td><td style="padding: 0">
          <span v-if="dajian.show">{{item.equipUnitPrice}}</span>
          <input v-else v-model="dajian.buildInfo[index].equipUnitPrice" type="number">
        </td>
          <td style="padding: 0">
            <span v-if="dajian.show">{{item.equipUnit}}</span>
            <el-select v-else v-model="dajian.buildInfo[index].equipUnit">
              <el-option value="/天/套">/天/套</el-option>
            </el-select>
          </td>
          <td class="name">设备数量</td><td style="padding: 0">
          <span v-if="dajian.show">{{item.equipNum}}</span>
          <input v-else v-model="dajian.buildInfo[index].equipNum" type="number">
        </td>
          <td style="padding: 0;width: 80px"><el-button v-if="!dajian.show"
                                                        @click="delArrayItem(dajian.buildInfo,index)"
                                                        type="text" class="del">删除</el-button></td>
        </tr>
      </template>
    </table>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import '@/common/area';
  import {formatMoneyType} from '@/common/filter';
  export default {
    props: ['detail'],
    data (){
      return {
        skillDetail: {},
        biyiDetail: {},
        biyi: {//笔译
          show: true,
          transYear: '',
          lanPair: [],
          tempPair: []
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
        shebeiDetail: {},
        shebei: {//外派
          show: true,
          remark: '',
          province: '',
          city: '',
          area: '',
          equipmentInfo: []
        },
        dajianDetail: {},
        dajian: {//培训
          show: true,
          remark: '',
          province: '',
          city: '',
          area: '',
          buildInfo: []
        },
        biyiBtn: { disabled: false },
        dtpBtn: { disabled: false },
        huizhanBtn: { disabled: false },
        shebeiBtn: { disabled: false },
        dajianBtn: { disabled: false },
        formSelect: {
          dtpTaskOptions: []
        }
      }
    },
    computed: {
      ...mapState('select',{
        memberLevel: state => state.memberLevel
      })
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
        new window._PCAS("kyprovince", "kycity", "kyarea");
        new window._PCAS("shebeiProvince", "shebeiCity", "shebeiArea");
        new window._PCAS("dajianProvince", "dajianCity", "dajianArea");
      })
    },
    methods: {
      //获取简历信息
      showResumeDetail (){
        this.$http.get('/userExtension/findResumeByUserId', {
          params: {
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            const _data = res.data.data;
            if(_data.userExtension){
              this.skillDetail.userExtendList = _data.userExtendList || [];
              this.skillDetail.transYear = _data.userExtension.translateYear || '';
              this.skillDetail.transDate = _data.userExtension.transPassedDateTime || '';
              this.skillDetail.userSource = _data.userExtension.userSource;
              this.skillDetail = Object.assign({}, this.skillDetail);
              this.biyi.transYear =this.skillDetail.transYear;
              this.biyi.lanPair = [];
              if(this.skillDetail.userExtendList.length > 0){
                this.skillDetail.userExtendList.forEach(item => {
                  const areaid = item.areaId && JSON.parse(item.areaId).toString() || '',
                    areaname = item.areaName && JSON.parse(item.areaName).toString() || '',
                    secondareaname = item.subAreaName && JSON.parse(item.subAreaName) || [];
                  let areacode = '';
                  for(let i = 0, len = this.$store.state.fieldOptions.length; i<len; i++){
                    const option = this.$store.state.fieldOptions[i];
                    if(areaid === option.id){
                      areacode = option.specialtyId;
                      break;
                    }
                  }
                  this.getSecondField(areacode).then(res => {
                    const obj =  {
                      id: item.id,
                      firstAreaName: areaid+','+areaname,
                      secondAreaName: secondareaname,
                      secondAreaOptions: res || [],
                      origin: item.sourceLangauge+','+item.sourceLanguageName,
                      target: item.targetLangauge+','+item.targetLanguageName,
                      levelName: item.levelName,
                      unitPrice: item.unitPrice,
                      unit: item.unit ? item.unit : '中文中朝',
                      currencyCode: item.currencyCode ? item.currencyCode : 'CNY'
                    };
                    this.biyi.lanPair.push(obj)
                  })
                })
              }
            }
          }
        })
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
      getSecondFieldToID (val, data){
        const id = val.split(',')[0];
        let code = '';
        for(let i = 0, len = this.$store.state.fieldOptions.length; i<len; i++){
          const option = this.$store.state.fieldOptions[i];
          if(id === option.id){
            code = option.specialtyId;
            break;
          }
        }
        this.getSecondField(code).then(res => {
          data.secondAreaName = [];
          data.secondAreaOptions = res;
        })
      },
      //切换tab时，获取总详情
      showDetail (){
        this.showResumeDetail();
        this.showDtpDetail();
        this.showHuizhanDetail();
        this.showShebeiDetail();
        this.showDajianDetail()
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
            if(document.querySelector('#kyprovince')){
              setTimeout(() => {
                const event = document.createEvent("HTMLEvents");
                event.initEvent("change", false, true);
                document.querySelector('#kyprovince').dispatchEvent(event);
                this.huizhan.city = this.huizhanDetail.city;
                this.huizhan.area = this.huizhanDetail.area;
              }, 1000);
            }
            this.huizhan.interpretationTypes = this.huizhanDetail.interpretationTypes && JSON.parse(this.huizhanDetail.interpretationTypes) || [];
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
            this.huizhan.unitPrice = this.huizhanDetail.unitPrice && JSON.parse(this.huizhanDetail.unitPrice) || [];
          }
        });
      },
      //获取设备详情
      showShebeiDetail (){
        this.$http.get('/newSkillController/listNewSkillEquipment',{
          params:{
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.shebeiDetail = res.data.data;
            this.shebei.province = this.shebeiDetail.province;
            if(document.querySelector('#shebeiProvince')){
              setTimeout(() => {
                const event = document.createEvent("HTMLEvents");
                event.initEvent("change", false, true);
                document.querySelector('#shebeiProvince').dispatchEvent(event);
                this.shebei.city = this.shebeiDetail.city;
                this.shebei.area = this.shebeiDetail.area;
              }, 1000);
            }
            this.shebei.remark = this.shebeiDetail.remark;
            this.shebei.equipmentInfo = this.shebeiDetail.equipmentInfo && JSON.parse(this.shebeiDetail.equipmentInfo) || [];
          }
        });
      },
      //获取搭建详情
      showDajianDetail (){
        this.$http.get('/newSkillController/listNewSkillBuild',{
          params:{
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.dajianDetail = res.data.data;
            this.dajian.province = this.dajianDetail.province;
            if(document.querySelector('#dajianProvince')){
              setTimeout(() => {
                const event = document.createEvent("HTMLEvents");
                event.initEvent("change", false, true);
                document.querySelector('#dajianProvince').dispatchEvent(event);
                this.dajian.city = this.dajianDetail.city;
                this.dajian.area = this.dajianDetail.area;
              }, 1000);
            }
            this.dajian.remark = this.dajianDetail.remark;
            this.dajian.buildInfo = this.dajianDetail.buildInfo && JSON.parse(this.dajianDetail.buildInfo) || [];
          }
        });
      },
      //修改笔译
      modifyBiyi (){
        for(let i = 0, len = this.biyi.lanPair.length; i<len; i++){
          const item = this.biyi.lanPair[i];
          for(let key in item){
            if(item[key].length < 1){
              this.$message({
                type: 'warning',
                message: '请完善语言对信息'
              });
              return false
            }
          }
        }
        this.biyiBtn.disabled = true;
        const lanArr = this.biyi.lanPair.map(item => {
          const findId = [];
          for(let i = 0, len = item.secondAreaName.length; i<len; i++){
            const itemName = item.secondAreaName[i];
            for(let j = 0, len1 = item.secondAreaOptions.length; j<len1; j++){
              const itemName1 = item.secondAreaOptions[j];
              if(itemName === itemName1.fullSpecialtyName){
                findId.push(itemName1.id);
                break;
              }
            }
          }
          return {
            "id": item.id || '',
            "areaId": [item.firstAreaName.split(',')[0]],
            "areaName": [item.firstAreaName.split(',')[1]],
            "levelId": item.levelName.slice(1),
            "sourceLangauge": item.origin.split(',')[0].toString(),
            "sourceLanguageName": item.origin.split(',')[1].toString(),
            "subAreaId": findId,
            "subAreaName": item.secondAreaName,
            "targetLangauge": item.target.split(',')[0].toString(),
            "targetLanguageName": item.target.split(',')[1].toString(),
            "unitPrice": item.unitPrice,
            "unit": item.unit,
            "currencyCode": item.currencyCode
          }
        });
        const partTimeStaffDetailParam = {
          "translatorYears": this.biyi.transYear,
          "userExtendList": lanArr,
          "userId": this.$route.params.id
        };
        this.$http.post('/newSkillController/updateTranslatorSkillBack',partTimeStaffDetailParam)
          .then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.showResumeDetail();
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
      //删除笔译
      delBiyiPair (id, data, index){
        if(!id){
          this.delArrayItem(data, index);
          return false;
        }
        this.$confirm('是否确认删除，删除后无法撤销', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/newSkillController/deleteTranslatorSkillBack',this.$qs.stringify({
            id: id
          })).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type:'success',
                message: '删除成功'
              });
              this.biyi.show = true;
              this.biyi.lanPair = [];
              this.showResumeDetail()
            }else{
              this.$message({
                type:'error',
                message: res.data.message
              });
            }
          })
        }).catch(() => {})
      },
      //修改Dtp
      modifyDtp (){
        if(this.dtp.software.length < 1 || this.dtp.taskLable.length < 1){
          this.$message({
            type: 'warning',
            message: '请完善基本信息'
          });
          return false;
        }
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
        if(!this.huizhan.province
          || this.huizhan.interpretationTypes.length < 1
          || this.huizhan.languageInfo.some(item => { return item.secondAreaName.length < 1 })
        ){
          this.$message({
            type: 'warning',
            message: '请完善基本信息'
          });
          return false
        }
        for(let i = 0, len = this.huizhan.unitPrice.length; i<len; i++){
          const item = this.huizhan.unitPrice[i];
          for(let key in item){
            if(item[key].length < 1){
              this.$message({
                type: 'warning',
                message: '请完善单价信息'
              });
              return false
            }
          }
        }
        this.huizhanBtn.disabled = true;
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
            langaugeCode: item.langaugeName.split(',')[0],
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
      //修改设备
      modifyShebei (){
        if(!this.shebei.province
          || !this.shebei.city
          || !this.shebei.area
          || !this.shebei.remark
        ){
          this.$message({
            type: 'warning',
            message: '请完善基本信息'
          });
          return false
        }
        for(let i = 0, len = this.shebei.equipmentInfo.length; i<len; i++){
          const item = this.shebei.equipmentInfo[i];
          for(let key in item){
            if(!item[key]){
              this.$message({
                type: 'warning',
                message: '请完善语种信息'
              });
              return false
            }
          }
        }
        this.shebeiBtn.disabled = true;
        const newSkillEquipmentParam = {
          "userId": this.$route.params.id,
          "area": this.shebei.area,
          "city": this.shebei.city,
          "province": this.shebei.province,
          "remark": this.shebei.remark,
          "equipmentInfo": this.shebei.equipmentInfo
        };
        this.$http.post('/newSkillController/updateNewSkillEquipBack', newSkillEquipmentParam)
          .then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.showShebeiDetail();
              this.shebei.show = true;
            }else{
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
            this.shebeiBtn.disabled = false;
          })
      },
      //修改搭建
      modifyDajian (){
        if(!this.dajian.province
          || !this.dajian.city
          || !this.dajian.area
          || !this.dajian.remark
        ){
          this.$message({
            type: 'warning',
            message: '请填写相关信息'
          });
          return false
        }
        for(let i = 0, len = this.dajian.buildInfo.length; i<len; i++){
          const item = this.dajian.buildInfo[i];
          for(let key in item){
            if(!item[key]){
              this.$message({
                type: 'warning',
                message: '请填写相关信息'
              });
              return false
            }
          }
        }
        this.dajianBtn.disabled = true;
        const newSkillBuildParam = {
          "userId": this.$route.params.id,
          "area": this.dajian.area,
          "city": this.dajian.city,
          "province": this.dajian.province,
          "remark": this.dajian.remark,
          "buildInfo": this.dajian.buildInfo
        };
        this.$http.post('/newSkillController/updateNewSkillBuildBack', newSkillBuildParam)
          .then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.showDajianDetail();
              this.dajian.show = true;
            }else{
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
            this.dajianBtn.disabled = false;
          })
      },
      //添加语言的
      addLanPair (){
        this.biyi.lanPair.push({
          firstAreaName: '',
          secondAreaName: [],
          secondAreaOptions: [],
          origin: '',
          target: '',
          levelName: '',
          unitPrice: '',
          unit: '',
          currencyCode: ''
        })
      },
      //删除某项(数组)
      delArrayItem (data, idx){
        data.splice(idx, 1)
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
      //添加设备
      addDevice (data){
        if(typeof(data) === 'object'){
          data.push({
            equipName: '',
            equipNum: '',
            equipUnit: '/天/套',
            equipUnitPrice: ''
          })
        }
      },
      //取消笔译
      cancelBiyi (){
        const tempArr = [];
        this.biyi.show = true;
        this.skillDetail.userExtendList.forEach(item => {
          const areaid = item.areaId && JSON.parse(item.areaId).toString() || '',
            areaname = item.areaName && JSON.parse(item.areaName).toString() || '',
            secondareaname = item.subAreaName && JSON.parse(item.subAreaName) || [];
          let areacode = '';
          for(let i = 0, len = this.$store.state.fieldOptions.length; i<len; i++){
            const option = this.$store.state.fieldOptions[i];
            if(areaid === option.id){
              areacode = option.specialtyId;
              break;
            }
          }
          this.getSecondField(areacode).then(res => {
            const obj =  {
              id: item.id,
              firstAreaName: areaid+','+areaname,
              secondAreaName: secondareaname,
              secondAreaOptions: res || [],
              origin: item.sourceLangauge+','+item.sourceLanguageName,
              target: item.targetLangauge+','+item.targetLanguageName,
              levelName: item.levelName,
              unitPrice: item.unitPrice,
              unit: item.unit,
              currencyCode: item.currencyCode
            };
            tempArr.push(obj)
          })
        });
        this.biyi.lanPair = tempArr;
      },
      //取消设备保存
      cancelDevice (){
        this.shebei.show = true;
        this.shebei.equipmentInfo = this.shebeiDetail.equipmentInfo && JSON.parse(this.shebeiDetail.equipmentInfo) || [];
      },
      //取消搭建保存
      cancelDajian (){
        this.dajian.show = true;
        this.dajian.buildInfo = this.dajianDetail.buildInfo && JSON.parse(this.dajianDetail.buildInfo) || [];
      }
    }
  }
</script>
