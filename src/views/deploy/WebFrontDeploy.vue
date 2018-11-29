<template>
<div v-if="form.submitSucc == false">
	<el-form :model="form" ref="deployForm">
        <el-input type="hidden" v-model="form.deployId"></el-input>
        <div class="info_div">
        <el-form-item>
        <div class="el-collapse-item__header">基础信息</div>
        </el-form-item>
        <el-row>
        <el-col :span="8">
		<el-form-item label="项目名称：" prop="project" :rules="[
            { required: true, message: '项目名称不能为空'},
        ]">
            <el-select 
              v-model="form.project"
              placeholder="选择项目">
            <el-option label="最佳阵容" value="zjweb"></el-option>
            </el-select>
		</el-form-item>
        </el-col>
        <el-col :span="16">
        <el-form-item label="语言类型：" prop="lang" :rules="[
            { required: true, message: '语言类型不能为空'},
        ]">
        <el-select 
            v-model="form.lang"
            placeholder="选择语言类型">
        <el-option label="cn" value="cn"></el-option>
        <el-option label="tc" value="tc"></el-option>
        </el-select>
		</el-form-item>
        </el-col>
        </el-row>

        <el-form-item>
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

        <el-form-item label="更新范围：" prop="updateRange" :rules="[
            { required: true, message: '更新范围：不能为空'},
        ]">
           <el-input
            placeholder="请输入更新的服务范围"
            v-model="form.updateRange">
           </el-input>
		</el-form-item>
        </div>
        
        <el-form-item>
            <el-button type="primary" @click="onSubmit" :loading="submiting">提交</el-button>
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
import { startDeploy, deploy, uploadDeployFileURL } from '../../api/api';
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
          lang: '',
          updateRange: '',
          uploadFileName: "unknow",
          submitSucc: false,
        },
        selectOptionsCache: {},
        fileList: [],
        center: true,
        closable: false,
        uploadURL: uploadDeployFileURL,
        submiting: false
      }
    },
    mounted() {
        let _this = this;
        startDeploy({deployType:'webfrontend'}).then(function(resp){
			_this.form.deployId = resp.data.data.deployId
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
                        deployId: this.form.deployId,
                        project: this.form.project,
                        lang: this.form.lang,
                        updateRange: this.form.updateRange,
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