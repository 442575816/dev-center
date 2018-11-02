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
			action="https://jsonplaceholder.typicode.com/posts/"
			ref="upload"
			:on-change="handleChange"
			:on-progress="handleProgress"
			:auto-upload="false"
			:show-file-list="false"
			drag
			multiple
			>
			<i class="el-icon-upload"></i>
  			<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			<div slot="tip" class="el-upload__tip">上传文件单个不能超过1G</div>
		</el-upload>
		<!-- 上传按钮 -->
		<div>
			<el-button style="margin-top: 5px;margin-left: 0px;" size="medium" type="success" @click="submitUpload">上传到服务器</el-button>
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
					<div class="el-progress__text" style="font-size: 12.8px;">{{ file.percentage }}%</div>
				</div>
				</li>
			</ul>
		</div>
		<!-- 文件历史显示区域 -->
		<br/>
		<div>
			<el-table
				:data="uploadHistory"
				style="width: 100%"
				:default-sort = "{prop: 'date', order: 'descending'}"
				>
			<el-table-column
				prop="name"
				label="文件名"
				sortable
				width="200">
			</el-table-column>
			<el-table-column
				prop="fileSize"
				label="文件大小"
				sortable
				width="180">
			</el-table-column>
			<el-table-column
				prop="uploadTime"
				label="上传时间"
				:formatter="formatter">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
				<el-button
					size="mini"
					@click="handleDownload(scope.$index, scope.row)">下载</el-button>
				<el-button
					size="mini"
					type="danger"
					@click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
			</el-table>
			<el-pagination
				background
				layout="prev, pager, next"
				:page-size="10"
				:total="100">
			</el-pagination>
		</div>
	</div>
</template>

<script>
export default {
    data() {
			return {
				  fileList: [],
				  center: true,
				  closable: false,
				  uploadHistory:[
					  {
						  name: "傲世堂UnityConnect第九期.pptx",
						  fileSize: 231565018,
						  uploadTime: 1541070294
					  }
				  ]
			}
				
		},
    methods: {
			// 正式上传文件
			submitUpload(){
				console.log("upload file")
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
				}
			},
			// 下载历史文件
			handleDownload(index, row) {
				console.log("index:" + index + ", row:" + row)
			},
			// 删除历史文件
			handleDelete(index, row) {
				console.log("index:" + index + ", row:" + row)
			},
			// 格式化数据
			formatter(row, column) {
				return new Date(row.uploadTime * 1000).toLocaleString();
			}
    }
  }

</script>

<style scoped>

</style>