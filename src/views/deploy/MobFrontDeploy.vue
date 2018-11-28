<template>
<div>
	<el-form :model="form" ref="deployForm">
        <el-input type="hidden" v-model="form.deployId"></el-input>
        <div class="info_div">
        <el-form-item>
        <div class="el-collapse-item__header">基础信息</div>
        </el-form-item>
		<el-form-item label="项目名称：" prop="project" :rules="[
            { required: true, message: '项目名称不能为空'},
        ]">
            <el-select 
              v-model="form.project"
              @change="handleProjChange"
              placeholder="选择项目">
            <el-option label="最佳阵容" value="zjzr"></el-option>
            <el-option label="中超荣耀" value="zc2017"></el-option>
            </el-select>
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
        <!-- 文件上传 -->
        <el-form-item label="上传更新文件：">
            <el-upload
			class="upload-demo"
			:action="uploadURL"
			ref="upload"
			:on-change="handleChange"
			:on-progress="handleProgress"
			:auto-upload="false"
			:show-file-list="false"
			:with-credentials="true"
			:on-success="handleSuccess"
			drag
			multiple
			>
			<i class="el-icon-upload"></i>
  			<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
		</el-upload>
		<!-- 上传按钮 -->
        <el-button style="margin-top: 5px;margin-left: 0px;" size="medium" type="success" @click="submitUpload">上传到服务器</el-button>
		<!-- 上传文件显示区域 -->
		<div>
			<ul class="el-upload-list el-upload-list--text">
				<li class="el-upload-list__item is-success" v-for="file in fileList">
				<a class="el-upload-list__item-name">
					<i class="el-icon-document"></i>{{ file.name }}&nbsp;&nbsp;&nbsp;&nbsp;{{ file.fileSize }}
    	  		</a>
				<label class="el-upload-list__item-status-label">
					<i class="el-icon-upload-success el-icon-circle-check" v-if="file.status=='success'"></i>
				</label>
				<i class="el-icon-close" @click="removeFile(file)"></i>
				<div class="el-progress el-progress--line">
					<div class="el-progress-bar">
						<div class="el-progress-bar__outer" style="height: 2px;">
							<div class="el-progress-bar__inner" v-bind:style="{ width: file.percentage + '%'}">
							</div>
						</div>
					</div>
					<div class="el-progress__text" style="font-size: 12.8px;right:30px">{{ file.percentage }}%</div>
				</div>
				</li>
			</ul>
		</div>
        </el-form-item>

        <el-row>
        <el-col :span="8">
        <el-form-item label="更新区域：" prop="updateRegion" :rules="[
            { required: true, message: '更新区域不能为空'},
        ]">
            <el-select v-model="form.updateRegion" placeholder="选择更新区域" @change="handleReignChange">
            <el-option 
              v-for="item in form.regionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
            </el-select>
		</el-form-item>
        </el-col>
        <el-col :span="16">
        <el-form-item label="更新频道：" prop="updateChannel" :rules="[
            { required: true, message: '更新频道不能为空'},
        ]">
           <el-select v-model="form.updateChannel" multiple placeholder="选择更新频道">
            <el-option 
              v-for="item in form.channelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
            </el-select>
		</el-form-item>
        </el-col>
        </el-row>

        <el-form-item label="更新说明：" prop="updateIntro" :rules="[
            { required: true, message: '更新说明不能为空'},
        ]">
           <el-input
            placeholder="请输入本次更新说明"
            v-model="form.updateIntro">
           </el-input>
		</el-form-item>

        <el-form-item label="隐藏频道：">
           <el-select v-model="form.hiddenChannel" multiple placeholder="请输入需要隐藏更新的频道" size="medium">
            <el-option 
              v-for="item in form.channelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
           </el-select>
		</el-form-item>
        </div>
        
        <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
	</el-form>
</div>
</template>

<script>
import { setTimeout } from 'timers';
import { startDeploy, deploy, uploadDeployFileURL, getDeployOptions } from '../../api/api';
import { vueContext } from '../../api/api';
import Vue from 'vue';
import Axios from 'axios';
import util from '../../common/js/util'

export default {
    data() {
      return {
        form: {
          project: '',
          deployId: '',
          updateRegion: '',
          updateChannel: [],
          channelOptions:[],
          regionOptions: [],
          hiddenChannel: '',
          updateIntro: '',
          packVersion: "unknow",
          resVersion: "unknow",
          uploadFileName: "unknow",

        },
        selectOptionsCache: {},
        fileList: [],
        center: true,
        closable: false,
        uploadURL: uploadDeployFileURL
      }
    },
    mounted() {
        let _this = this;
        startDeploy({deployType:'mobfrontend'}).then(function(resp){
			_this.form.deployId = resp.data.data.deployId
		}).catch(err=>{
			console.log(err);
		})
    },
    methods: {
        onSubmit() {
            this.$refs.deployForm.validate((valid) => {
                if (valid) {
                    // 提交
                    let formData = {
                        deployId: this.form.deployId,
                        project: this.form.project,
                        updateRegion: this.form.updateRegion,
                        updateChannel: this.form.updateChannel,
                        hiddenChannel: this.form.hiddenChannel,
                        updateIntro: this.form.updateIntro
                    }
                    let json = JSON.stringify(formData)
                    deploy({
                        data: json
                    }).then(function(resp){
                    })
                    console.log("submit" + json)
                } else {
                    this.$message.error('请检查必填项，表单不完整');
                    return false;
                }
            })
        },
        // 选择的项目发生变化
        handleProjChange(value) {
            if (this.selectOptionsCache[value] === undefined) {
                var _this = this
                getDeployOptions({projName: value, deployId: this.form.deployId}).then(function(resp){
                    _this.selectOptionsCache[value] = resp.data.data.regionOptions
                    _this.form.regionOptions = _this.selectOptionsCache[value]
                    _this.form.updateRegion = ''
                    _this.form.updateChannel = []
                })
            } else {
                this.form.regionOptions = this.selectOptionsCache[value]
                this.form.updateRegion = ''
                this.form.updateChannel = []
            }
        },
        // 选择更新区域变化
        handleReignChange(value) {
            for (var index in this.form.regionOptions) {
                var regionOption = this.form.regionOptions[index]
                if (regionOption.value == value) {
                    this.form.channelOptions = regionOption.channelOptions
                    this.form.updateChannel = []
                }
            }
        },
        // 正式上传文件
        submitUpload(){
            this.$refs.upload.submit();
        },
        // 移除文件
        removeFile(file){
            for (var index in this.fileList) {
                if (this.fileList[index] == file) {
                    this.fileList.splice(index, 1);
                    break;
                }
            }
            var uploadFiles = this.$refs.upload.uploadFiles;
            for (var index in uploadFiles) {
                if (uploadFiles[index].uid == file.uid) {
                    uploadFiles.splice(index, 1);
                }
            }
        },
        // 格式化文件大小
        formatFileSize(fileSize) {
            var size = fileSize / 1000
            if (size > 1000) {
                return Math.ceil(size * 100 / 1000) / 100 + "M"
            } else {
                return Math.ceil(size * 100) / 100 + "KB"
            }
        },
        // 上传进度显示
        handleProgress(event, file, fileList) {
            var localFile = null;
            for (var index in this.fileList) {
                if (this.fileList[index].uid == file.uid) {
                    localFile = this.fileList[index];
                    break;
                }
            }
            if (null != localFile) {
                localFile.percentage = Math.ceil(file.percentage);
            }
        },
        // 处理文件变化
        handleChange(file, fileList) {
            if (file.status == "ready") {
                    this.fileList.push({
                        uid: file.uid,
                        name: file.name,
                        fileSize: this.formatFileSize(file.size),
                        status: file.status,
                        percentage: file.percentage
                    });
            } else {
                var localFile = null;
                for (var index in this.fileList) {
                    if (this.fileList[index].uid == file.uid) {
                        localFile = this.fileList[index];
                        break;
                    }
                }
                if (null != localFile) {
                    localFile.status = file.status
                    if (localFile.status == "success") {
                        localFile.percentage = 100
                    }
                }
            }
        },
        // 文件上传有应答回调
        handleSuccess(resp, file, fileList) {
            if (resp.state == 0) {
                this.$message({
                    message: resp.data.msg,
                    type: 'error'
                });
                return;
            } else {
                this.form.resVersion = resp.data.resVersion
                this.form.packVersion = resp.data.packVersion
                this.form.uploadFileName = resp.data.uploadFileName
            }
        },
        // 格式化文件大小
        fileSizeFormatter(row, column) {
            return this.formatFileSize(row.fileSize);
        }
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