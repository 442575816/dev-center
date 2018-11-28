<template>
<div v-if="form.submitSucc == false">
	<el-form :model="form" ref="deployForm">
        <div class="info_div">
        <el-form-item>
        <div class="el-collapse-item__header">基础信息</div>
        </el-form-item>
		<el-form-item label="项目名称：" prop="project" :rules="[
            { required: true, message: '项目名称不能为空'},
        ]">
            <el-select v-model="form.project" placeholder="选择项目">
            <el-option label="最佳阵容" value="zjzr"></el-option>
            <el-option label="中超荣耀" value="zc2017"></el-option>
            </el-select>
		</el-form-item>
        <el-form-item label="目录类型：" prop="folderType" :rules="[
            { required: true, message: '目录类型不能为空'},
        ]">
            <el-select v-model="form.folderType" placeholder="选择目录类型">
            <el-option label="backend" value="backend"></el-option>
            <el-option label="frontend" value="frontend"></el-option>
            <el-option label="hotswap" value="hotswap"></el-option>
            <el-option label="kf" value="kf"></el-option>
            <el-option label="sql" value="sql"></el-option>
            <el-option label="update" value="update"></el-option>
            </el-select>
		</el-form-item>
        <el-form-item>

        </el-form-item>
        <br/>
        <!-- 文件上传 -->
        <el-form-item label="上传文件到OSS：">
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

        <el-form-item label="远程目录：" prop="remoteFolder" :rules="[
            { required: true, message: '远程目录不能为空'},
        ]">
           <el-input
            placeholder="请填写远程目录，如果目录已经存在，将不会上传文件"
            v-model="form.remoteFolder">
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
    title="上传成功，请前往oss查看"
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
          folderType: '',
          remoteFolder: '',
          submitSucc: false,
        },
        fileList: [],
        center: true,
        closable: false,
        uploadURL: uploadDeployFileURL,
        submiting: false
      }
    },
    mounted() {
        let _this = this;
        startDeploy({deployType:'ftpupload'}).then(function(resp){
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
                        folderType: this.form.folderType,
                        remoteFolder: this.form.remoteFolder,
                    }
                    let json = JSON.stringify(formData)
                    var _this = this
                    deploy({
                        data: json
                    }).then(function(resp) {
                        _this.submiting = false
                        _this.form.submitSucc = (resp.data.state == 1)
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