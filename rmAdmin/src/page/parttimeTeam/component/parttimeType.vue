<template>
  <div ref="form" style="display: inline-block">
    <el-select v-model="form.type"
               clearable
               @change="selectType"
               placeholder="兼职类型">
      <el-option
        v-for="item in formSelect.typeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <template v-if="form.type === '笔译'">
      <div class="el-button-2">
        <el-select v-model="form.firstField" @change="getSecondFieldFn" placeholder="测试领域">
          <el-option
            v-for="item in $store.state.fieldOptions"
            :key="item.id"
            :label="item.fullSpecialtyName"
            :value="item.specialtyId+','+item.fullSpecialtyName">
          </el-option>
        </el-select> -
        <el-select multiple v-model="form.secondField" :collapse-tags="true" placeholder="二级领域">
          <el-option
            v-for="item in formSelect.secondFieldOptions"
            :key="item.id"
            :label="item.fullSpecialtyName"
            :value="item.fullSpecialtyName"></el-option>
        </el-select>
      </div>
      <div class="el-button-2">
        <el-select v-model="form.origin" placeholder="源语言">
          <el-option
            v-for="item in $store.state.languageList"
            :key="item.id"
            :label="item.chineseName"
            :value="item.chineseName">
          </el-option>
        </el-select> -
        <el-select v-model="form.target" placeholder="目标语言">
          <el-option
            v-for="item in $store.state.languageList"
            :key="item.id"
            :label="item.chineseName"
            :value="item.chineseName">
          </el-option>
        </el-select>
      </div>
      <el-select v-model="form.level" placeholder="等级" class="width80">
        <el-option
          v-for="item in memberLevel"
          :key="item"
          :value="item"></el-option>
      </el-select>
    </template>
    <template v-else-if="form.type === 'DTP'">
      <el-select v-model="form.dtpExp" multiple :collapse-tags="true" placeholder="DTP经验">
        <el-option
          v-for="item in formSelect.expeOptions"
          :key="item"
          :label="item"
          :value="item"></el-option>
      </el-select>
      <el-select v-model="form.software" multiple :collapse-tags="true" placeholder="擅长软件">
        <el-option
          v-for="item in formSelect.softwareOptions"
          :key="item"
          :label="item"
          :value="item"></el-option>
      </el-select>
    </template>
    <template v-else-if="form.type === '会展'">
      <div class="el-button-2">
        <el-select v-model="form.firstField" @change="getSecondFieldFn" placeholder="擅长领域">
          <el-option
            v-for="item in $store.state.fieldOptions"
            :key="item.id"
            :label="item.fullSpecialtyName"
            :value="item.specialtyId+','+item.fullSpecialtyName"></el-option>
        </el-select> -
        <el-select v-model="form.secondField" multiple :collapse-tags="true" placeholder="二级领域">
          <el-option
            v-for="item in formSelect.secondFieldOptions"
            :key="item.id"
            :label="item.fullSpecialtyName"
            :value="item.fullSpecialtyName"></el-option>
        </el-select>
      </div>
      <el-select v-model="form.lanPair" multiple :collapse-tags="true" placeholder="语种">
        <el-option
          v-for="item in $store.state.languageList"
          :key="item.id"
          :label="item.chineseName"
          :value="item.chineseName"></el-option>
      </el-select>
      <el-select v-model="form.speakExp" multiple :collapse-tags="true" placeholder="口译类型">
        <el-option
          v-for="item in formSelect.kyTypeOptions"
          :key="item"
          :value="item"></el-option>
      </el-select>
    </template>
    <template v-else-if="form.type === '设备'">
      <el-select v-model="form.deviceType" multiple :collapse-tags="true" placeholder="设备名称">
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
    </template>
    <template v-else-if="form.type === '搭建'">
      <el-select v-model="form.buildType" multiple :collapse-tags="true" placeholder="搭建项">
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
    </template>
  </div>
</template>
<script>
  import { mapState, mapGetters } from 'vuex';
  export default {
    name: 'parttimeType',
    data (){
      return {
        form: {
          type: '',
          origin: '',
          target: '',
          firstField: '',
          secondField: '',
          lanPair: '',
          level: '',
          dtpExp: '',
          software: '',
          speakExp: '',
          deviceType: '',
          buildType: ''
        },
        formSelect: {
          typeOptions: [
            {label:'笔译',value:'笔译'},
            {label:'DTP',value:'DTP'},
            {label:'会展',value:'会展'},
            {label:'设备',value:'设备'},
            {label:'搭建',value:'搭建'}],
          kyTypeOptions: ['同声传译','陪同传译','大型活动','交替传译'],
          expeOptions: ['1年以内','1~2年','2~3年','3年以上'],
          softwareOptions: ['Word','Excel','PowerPoint','Photoshop','FrameMaker','AutoCAD','PageMaker','Illustrator','QuarkXpress','PM'],
          secondFieldOptions: [],
        }
      }
    },
    computed: {
      ...mapState('select', {
        memberLevel: state => state.memberLevel
      }),
      emptyType (){
        if(!this.form.type){
          this.clearObject(this.form)
        }
      }
    },
    methods: {
      //清空对象
      clearObject (target){
        let myType = Object.prototype.toString;
        if(myType.call(target) === '[object Object]'){
          for(let prop in target){
            if(myType.call(target[prop]) === '[object Object]'){
              this.clearObject(target[prop]);
            }else if(prop !== 'type'){
              target[prop] = '';
            }
          }
        }else {
          target = '';
        }
      },
      //切换兼职类型，清空数据
      selectType (){
        this.clearObject(this.form)
      },
      //获取二级领域
      getSecondFieldFn (val){
        const id = val.split(',')[0];
        this.form.secondField = '';
        this.getSecondField(id).then(res => {
          this.formSelect.secondFieldOptions = res
        })
      }
    }
  }
</script>
