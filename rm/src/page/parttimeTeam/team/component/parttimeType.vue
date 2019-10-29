<template>
  <div ref="form" style="display: inline-block">
    <el-form-item label="兼职类型">
      <el-select v-model="form.type"
                 clearable
                 @change="selectType"
                 placeholder="请选择兼职类型">
        <el-option
          v-for="item in formSelect.typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <template v-if="form.type === '笔译'">
      <el-form-item label="测试领域" class="width620">
        <el-select v-model="form.firstField"
                   @change="getSecondFieldFn"
                   placeholder="请选择一级领域">
          <el-option
            v-for="item in $store.state.fieldOptions"
            :key="item.id"
            :label="item.fullSpecialtyName"
            :value="item.specialtyId+','+item.fullSpecialtyName">
          </el-option>
        </el-select>
        <label class="sep">-</label>
        <el-select multiple
                   :collapse-tags="true"
                   v-model="form.secondField"
                   placeholder="请选择二级领域">
          <el-option
            v-for="item in formSelect.secondFieldOptions"
            :key="item.id"
            :label="item.fullSpecialtyName"
            :value="item.fullSpecialtyName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="源语言">
        <el-select
          v-model="form.origin" placeholder="请选择源语言">
          <el-option
            v-for="item in languageList"
            :key="item.id"
            :label="item.chineseName"
            :value="item.chineseName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标语言">
        <el-select
          v-model="form.target" placeholder="请选择目标语言">
          <el-option
            v-for="item in languageList"
            :key="item.id"
            :label="item.chineseName"
            :value="item.chineseName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="等级">
        <el-select
          v-model="form.level"
          placeholder="请选择等级">
          <el-option
            v-for="item in memberLevel"
            :key="item"
            :value="item"></el-option>
        </el-select>
      </el-form-item>
    </template>
    <template v-else-if="form.type === 'DTP'">
      <el-form-item label="DTP经验">
        <el-select
          multiple
          :collapse-tags="true"
          v-model="form.dtpExp"
          placeholder="请选择DTP经验">
          <el-option
            v-for="item in formSelect.expeOptions"
            :key="item"
            :label="item"
            :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="擅长软件">
        <el-select
          multiple
          :collapse-tags="true"
          v-model="form.software"
          placeholder="请选择擅长软件">
          <el-option
            v-for="item in formSelect.softwareOptions"
            :key="item"
            :label="item"
            :value="item"></el-option>
        </el-select>
      </el-form-item>
    </template>
    <template v-else-if="form.type === '会展'">
      <el-form-item label="擅长领域" class="width620">
        <el-select
          v-model="form.firstField"
          @change="getSecondFieldFn"
          placeholder="请选择一级领域">
          <el-option
            v-for="item in $store.state.fieldOptions"
            :key="item.id"
            :label="item.fullSpecialtyName"
            :value="item.specialtyId+','+item.fullSpecialtyName"></el-option>
        </el-select>
        <label class="sep">-</label>
        <el-select
          multiple
          :collapse-tags="true"
          v-model="form.secondField"
          placeholder="请选择二级领域">
          <el-option
            v-for="item in formSelect.secondFieldOptions"
            :key="item.id"
            :label="item.fullSpecialtyName"
            :value="item.fullSpecialtyName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="语种">
        <el-select
          multiple
          :collapse-tags="true"
          v-model="form.lanPair" placeholder="请选择语种">
          <el-option
            v-for="item in languageList"
            :key="item.id"
            :label="item.chineseName"
            :value="item.chineseName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="口译类型">
        <el-select
          multiple
          :collapse-tags="true"
          v-model="form.speakExp"
          placeholder="请选择口译类型">
          <el-option
            v-for="item in formSelect.kyTypeOptions"
            :key="item"
            :value="item"></el-option>
        </el-select>
      </el-form-item>
    </template>
    <template v-else-if="form.type === '设备'">
      <el-form-item label="设备名称">
        <el-select
          multiple
          :collapse-tags="true"
          v-model="form.deviceType" placeholder="请选择设备名称">
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
      </el-form-item>
    </template>
    <template v-else-if="form.type === '搭建'">
      <el-form-item label="搭建项">
        <el-select
          multiple
          :collapse-tags="true"
          v-model="form.buildType" placeholder="请选择搭建项">
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
      </el-form-item>
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
          softwareOptions: ['Word','Excel','PowerPoint','Photoshop','FrameMaker','AutoCAD','PageMaker','Illustrator','QuarkXpress','Pm'],
          secondFieldOptions: [],
        }
      }
    },
    computed: {
      ...mapState([
        'languageList'
      ]),
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
