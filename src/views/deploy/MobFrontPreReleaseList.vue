<template>
<div>
 <div>
    <el-form>
	<el-form-item label="项目名称：">
        <el-select 
            v-model="form.project"
            @change="handleProjChange"
            placeholder="选择项目">
        <el-option label="最佳阵容" value="zjzr"></el-option>
        <el-option label="中超荣耀" value="zc2017"></el-option>
        </el-select>
    </el-form-item>
    </el-form>
 </div>
 <div>
    <el-table
        :data="preReleaseDeploys.slice((currentPage-1)*pagesize, currentPage*pagesize)"
        style="width: 100%"
        :default-sort = "{prop: 'createTime', order: 'descending'}">
    <el-table-column
        prop="project"
        label="所属项目">
    </el-table-column>
    <el-table-column
        prop="createTime"
        label="创建时间"
        sortable
        :formatter="dateTimeFormatter">
    </el-table-column>
    <el-table-column
        prop="packVersion"
        label="打包版本号">
    </el-table-column>
    <el-table-column
        prop="resVersion"
        label="资源版本号">
    </el-table-column>
    <el-table-column
        prop="uploadFileName"
        label="上传文件名">
    </el-table-column>
    <el-table-column
        prop="deployUser"
        label="创建者"
        sortable>
    </el-table-column>
    <el-table-column label="操作">
        <template slot-scope="scope">
        <el-button
          type="primary"
          size="small"
          @click="handleRelease(scope.$index, scope.row)">发布</el-button>
        <el-button
          type="warning"
          size="small"
          @click="handleCancelRelease(scope.$index, scope.row)">取消</el-button>
        </template>
    </el-table-column>
    </el-table>
    <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pagesize"
        @current-change="handleCurrentPageChange"
        @size-change="handlePageSizeChange"
        :total="preReleaseDeploys.length">
    </el-pagination>
 </div>
</div>
</template>

<script>
import { setTimeout } from 'timers';
import { getMobFrontPreReleaseDeploy } from '../../api/api';
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
        },
        preReleaseDeploys:[],
        preReleaseDeploysCache: {},
        currentPage: 1,
        pagesize: 10
      }
    },
    methods: {
        // 选择的项目发生变化
        handleProjChange(value) {
            
            if (this.preReleaseDeploysCache[value] === undefined) {
                var _this = this
                getMobFrontPreReleaseDeploy({projName: value}).then(function(resp){
                    _this.preReleaseDeploysCache[value] = resp.data.data.preReleaseDeploys
                    _this.preReleaseDeploys = _this.preReleaseDeploysCache[value]
                    _this.currentPage = 1
                })
            } else {
                this.preReleaseDeploys = this.preReleaseDeploysCache[value]
                this.currentPage = 1
            }
        },
        // 取消发布
        handleCancelRelease(index, row) {
            this.$router.push({ path: '/mobfrontrelease/' + row.deployId });
        },
        // 发布
        handleRelease(index, row) {
            this.$router.push({ path: '/mobfrontrelease/' + row.deployId });
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
            return util.formatDate.format(new Date(row.createTime), "yyyy-MM-dd hh:mm:ss")
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