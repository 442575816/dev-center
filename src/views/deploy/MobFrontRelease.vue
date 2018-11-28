<template>
<div v-if="form.submitSucc == false">
	<el-form :model="form" ref="deployForm">
        <el-input type="hidden" v-model="form.deployId"></el-input>
        <div class="info_div">
        <el-form-item>
        <div class="el-collapse-item__header">基础信息</div>
        </el-form-item>
		<el-form-item label="项目名称：">
            <span class="el-form-item__label">{{ form.project }}</span>
		</el-form-item>
        <el-form-item>
        <span class="el-form-item__label">
            打包版本号：<span class="version-text">{{ form.packVersion }}</span>
        </span>
        <span class="el-form-item__label">
            资源包版本号：<span class="version-text">{{ form.resVersion }}</span>
        </span>
        <span class="el-form-item__label">
            上传文件名：<span class="version-text">{{ form.uploadFileName }}</span>
        </span>
        </el-form-item>
        <br/>
        <el-row>
        <el-col :span="8">
        <el-form-item label="更新区域：">
            <span class="el-form-item__label">{{ form.updateRegion }}</span>
		</el-form-item>
        </el-col>
        <el-col :span="16">
        <el-form-item label="更新频道：">
           <span class="el-form-item__label">{{ form.updateChannel }}</span>
		</el-form-item>
        </el-col>
        </el-row>

        <el-form-item label="更新说明：">
           <span class="el-form-item__label">{{ form.updateIntro }}</span>
		</el-form-item>

        <el-form-item label="隐藏频道：">
           <span class="el-form-item__label">{{ form.hiddenChannel }}</span>
		</el-form-item>
        </div>
        
        <el-form-item>
            <el-button type="primary" @click="onSubmit" :loading="submiting">发布到正式环境</el-button>
        </el-form-item>
	</el-form>
</div>
<div v-else>
    <el-alert
    title="发布成功，请查看邮件"
    type="success"
    style="line-height:48px"
    :closable="false">
   </el-alert>
</div>
</template>

<script>
import { setTimeout } from 'timers';
import { getMobFrontPreReleaseInfo, deploy } from '../../api/api';
import { vueContext } from '../../api/api';
import Vue from 'vue';
import Axios from 'axios';
import util from '../../common/js/util'

export default {
    data() {
      return {
        form: {
          project: '',
          deployId: this.$route.params.deployId,
          updateRegion: '',
          updateChannel: '',
          hiddenChannel: '',
          updateIntro: '',
          packVersion: "unknow",
          resVersion: "unknow",
          uploadFileName: "unknow",
          submitSucc: false,
        },
        submiting: false,
      }
    },
    mounted() {
        let _this = this;
        getMobFrontPreReleaseInfo({deployId:this.form.deployId}).then(function(resp){
            _this.form.project = resp.data.data.project
            _this.form.packVersion = resp.data.data.packVersion
            _this.form.resVersion = resp.data.data.resVersion
            _this.form.updateRegion = resp.data.data.updateRegion
            _this.form.updateChannel = resp.data.data.updateChannel
            _this.form.hiddenChannel = resp.data.data.hiddenChannel
            _this.form.updateIntro = resp.data.data.updateIntro
            _this.form.uploadFileName = resp.data.data.uploadFileName
            _this.form.deployUser = resp.data.data.deployUser
		}).catch(err=>{
			console.log(err);
		})
    },
    methods: {
        onSubmit() {
            this.$refs.deployForm.validate((valid) => {
                if (valid) {
                    this.submiting = true
                    // 提交
                    let formData = {
                        deployId: this.form.deployId
                    }
                    let json = JSON.stringify(formData)
                    let _this = this
                    deploy({
                        data: json
                    }).then(function(resp){
                        _this.submiting = false
                        _this.form.submitSucc = resp.data.state == 1
                    })
                    console.log("submit" + json)
                } else {
                    this.$message.error('请检查必填项，表单不完整');
                    return false;
                }
            })
        },
    }
}

</script>

<style>
    .el-tag {
        margin-left: 10px;
        height: 35px;
        line-height: 35px;
    }
    .version-text {
        font-weight: bold;
        color: #F56C6C
    }
    .el-collapse-item__header {
        font-size: 15px;
        font-weight: bold;
    }
    .info_div{
        border: 1px solid #DCDFE6;
        border-radius: 20px;
        padding: 10px;
        margin-bottom: 10px;
    }
</style>