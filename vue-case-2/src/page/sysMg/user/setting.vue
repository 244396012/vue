<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>{{breads.originalName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breads.parName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breads.curName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="pd-bg mg-top" style="text-align: left;padding-left: 20px;padding-right: 20px">
      <el-button class="default-btn" @click="goBack">返 回</el-button>
      <el-button class="float-right" type="primary">确 定</el-button>
    </div>
    <!--列表内容-->
    <div class="table mg-top" style="padding: 20px">
      <h3 class="border-bt" style="padding-bottom: 20px;">当前角色：运营</h3>
      <el-form ref="form" :model="form" style="padding-bottom: 50px">
        <el-checkbox label="语料术语管理" class="check-title" v-model="allForm.dataChecked" @click.native="allCheck('data')"></el-checkbox>
        <el-form-item class="border-bt">
          <el-checkbox-group v-model="form.data" @click.native="isAllCheck('data')">
            <el-checkbox label="术语文件管理" name="data"></el-checkbox>
            <el-checkbox label="语料文件管理" name="data"></el-checkbox>
            <el-checkbox label="专业词典管理" name="data"></el-checkbox>
            <el-checkbox label="机器抓取库" name="data"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-checkbox label="标准管理" class="check-title" v-model="allForm.standardChecked" @click.native="allCheck('standard')"></el-checkbox>
        <el-form-item class="border-bt">
          <el-checkbox-group v-model="form.standard" @click.native="isAllCheck('standard')">
            <el-checkbox label="标准列表" name="standard"></el-checkbox>
            <el-checkbox label="标准专题管理" name="standard"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-checkbox label="订单管理" class="check-title" v-model="allForm.orderChecked" @click.native="allCheck('order')"></el-checkbox>
        <el-form-item class="border-bt">
          <el-checkbox-group v-model="form.order" @click.native="isAllCheck('order')">
            <el-checkbox label="新建订单" name="order"></el-checkbox>
            <el-checkbox label="待财务审核" name="order"></el-checkbox>
            <el-checkbox label="财务审核未通过" name="order"></el-checkbox>
            <el-checkbox label="待付款" name="order"></el-checkbox>
            <el-checkbox label="已完成" name="order"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-checkbox label="用户管理" class="check-title" v-model="allForm.userChecked" @click.native="allCheck('user')"></el-checkbox>
        <el-form-item class="border-bt">
          <el-checkbox-group v-model="form.user" @click.native="isAllCheck('user')">
            <el-checkbox label="用户列表" name="user"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import { getBread } from '@/utils'
  export default {
    data (){
      return {
        breads: {
          curName: '',
          parName: '',
          parPath: '',
          originalName: ''
        },
        form: {
          data: [],
          standard: [],
          order: [],
          user: []
        },
        allForm: {
          dataChecked: false,
          standardChecked: false,
          orderChecked: false,
          userChecked: false,
          data: ['术语文件管理','语料文件管理','专业词典管理','机器抓取库'],
          standard: ['标准列表','标准专题管理'],
          order: ['新建订单','待财务审核','财务审核未通过','待付款','已完成'],
          user: ['用户列表']
        }
      }
    },
    mounted (){
      this.breads = getBread({
        router: this.$router,
        routes: this.$route
      })
      this.breads.parPath = this.$route.matched[1].path
      this.breads.parName = this.$route.matched[1].name
    },
    methods: {
      goBack (){
        this.$router.push(this.breads.parPath)
      },
      isAllCheck (target){
        this.allForm[target+'Checked'] = false
      },
      allCheck (target){
        const isCheck = this.allForm[target + 'Checked']
        if(!isCheck){
          const lists = this.allForm[target]
          this.form[target] = []
          this.form[target] = lists
        }else{
          this.form[target] = []
        }
      }
    }
  }
</script>

