<template>
	<div>
		<el-alert
			title="文件上传最多保存3天，请及时下载"
			type="warning"
			:center="true"
			:closable="false"
			>
		</el-alert>
		<br/>
		<el-upload
			class="upload-demo"
			:action="uploadURL"
			ref="upload"
			:on-change="handleChange"
			:on-progress="handleProgress"
			:on-success="handleSuccess"
			:auto-upload="false"
			:show-file-list="false"
			:with-credentials="true"
			drag
			multiple
			>
			<i class="el-icon-upload"></i>
  			<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			<div slot="tip" class="el-upload__tip">上传文件单个不能超过1G</div>
		</el-upload>
		<!-- 上传按钮 -->
		<div>
			<el-button style="margin-top: 5px;margin-left: 0px;" size="medium" type="success" @click="submitUpload" :disabled="networkType!=1">上传到服务器</el-button>
		</div>
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
		<!-- 文件历史显示区域 -->
		<br/>
		<div>
			<el-table
				:data="uploadHistory.slice((currentPage-1)*pagesize, currentPage*pagesize)"
				style="width: 100%"
				:default-sort = "{prop: 'date', order: 'descending'}"
				>
			<el-table-column
				prop="name"
				label="文件名"
				sortable
				width="200">
				<template slot-scope="scope">
					<el-tag type="success">内</el-tag>
					{{scope.row.name}}
				</template>
			</el-table-column>
			<el-table-column
				prop="fileSize"
				label="文件大小"
				sortable
				:formatter="fileSizeFormatter"
				width="180">
			</el-table-column>
			<el-table-column
				prop="uploadTime"
				label="上传时间"
				sortable
				:formatter="dateTimeFormatter">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
				<el-button
					size="mini"
					@click="handleDownload(scope.$index, scope.row)">下载</el-button>
				</template>
			</el-table-column>
			</el-table>
			<el-pagination
				background
				layout="prev, pager, next"
				:page-size="pagesize"
				@current-change="handleCurrentPageChange"
				@size-change="handlePageSizeChange"
				:total="uploadHistory.length">
			</el-pagination>
		</div>
	</div>
</template>

<script>
import { setTimeout } from 'timers';
import { getFileOutList, downloadFile, fileOutURL } from '../../api/api';
import { vueContext } from '../../api/api';
import Vue from 'vue';

export default {
    data() {
			return {
				  fileList: [],
				  center: true,
				  closable: false,
				  uploadHistory:[],
				  pagesize: 10,
				  currentPage: 1,
				  networkType: 0,
				  uploadURL: fileOutURL
			}
				
		},
	created: function() {
		// 请求文件历史
		var _this = this;
		vueContext.vue = this
		getFileOutList().then(function(resp){
			_this.uploadHistory = resp.data.data.files
		}).catch(err=>{
			console.log(err);
		})
	},
    methods: {
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
			// 请求文件下载历史
			refreshTransferFileHisotry() {
				// 请求文件历史
				var _this = this;
				getFileOutList().then(function(resp){
					_this.uploadHistory = resp.data.data.files
				}).catch(err=>{
					console.log(err);
				})
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
							var _this = this
							setTimeout(function(){
								_this.refreshTransferFileHisotry()
							}, 1000)
						}
					}
				}
			},
			// 下载历史文件
			handleDownload(index, row) {
				var _this = this;  
				downloadFile({
					file: row.fileId
				}).then((resp)=>{
					if (!resp) {
						_this.$notify.error({
							title: '提示',
							message: '文件错误，无法下载',
							duration: 0
						});
						return;
					} else if (resp.data.type == 'application/json') {
						_this.$message({
							message: '文件已过期或者被删除',
							type: 'error'
						});
						return;
					}
					if ('download' in document.createElement('a')) { // 非IE下载
						let aTag = document.createElement('a')
						aTag.download = row.name
						aTag.href = URL.createObjectURL(resp.data)
						aTag.click()
						URL.revokeObjectURL(aTag.href)
					} else {// IE10+下载
						navigator.msSaveBlob(resp.data, row.name)
					}
				}).catch(err=>{
					console.log(err);
				})
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
			// 分页组件当前页发生变化
			handleCurrentPageChange(val) {
				this.currentPage = val
			},
			// 分页组件每页显示大小发生变化
			handlePageSizeChange(val) {
				this.pagesize = val
			},
			// 格式化时间数据
			dateTimeFormatter(row, column) {
				return new Date(row.uploadTime).toLocaleString();
			},
			// 格式化文件大小
			fileSizeFormatter(row, column) {
				return this.formatFileSize(row.fileSize);
			}
	},
	mounted() {
		var user = sessionStorage.getItem('user');
		if (user) {
			user = JSON.parse(user);
			this.networkType = user.networkType
		}
	}
}

</script>

<style scoped>

</style>