import axios from 'axios';
import Qs from 'qs'
import { getCookie } from '../utils/cookie';
import { Message } from 'element-ui'
import router from '@/router'

// url base
let base = "";
if (process.env.NODE_ENV == "development") {
    // 测试URL
    base = 'http://127.0.0.1:8011/root';
} else {
    // 正式URL
    base = 'http://127.0.0.1:8010/root';
}

// vue基础上下文
let vueContext = {}

export { vueContext }

// 默认携带cookies信息
axios.defaults.withCredentials = true

// 发送请求前处理request的数据
axios.defaults.transformRequest = [function (data) {
    let newData = ''
    for (let k in data) {
      newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
    }
    newData += "csrftoken=" + getCookie("csrftoken")
    return newData
}]

// 收到响应后预处理数据
axios.defaults.transformResponse = [function (text) {
    if (typeof(text) != "string") {
        return text
    }
    let response = JSON.parse(text)
    if (response.state == 4) {
        Message.error(response.data.msg)
        setTimeout(function(){
            router.push({ path: '/login' });
        }, 2000)
    } else if (response.state == 0) {
        Message.error(response.data.msg)
    }
    return response;
}]

// Login请求
export const requestLogin = params => { return axios.post(`${base}/login.action`, params).then(res => res.data); };

// LoginByToken请求
export const requestLoginByToken = params => { return axios.post(`${base}/loginByToken.action`, params).then(res => res.data); };

// 获取外传内文件列表
export const getFileInList = params => { return axios.post(`${base}/getFileInList.action`, params); };

// 获取内传外文件列表
export const getFileOutList = params => { return axios.post(`${base}/getFileOutList.action`, params); };

// 下载文件
export const downloadFile = params => { return axios.get(`${base}/download.action`, { params: params, responseType:'blob' }); };

// 开始部署流程
export const startDeploy = params => { return axios.post(`${base}/startDeploy.action`, params); };

// 进行流程
export const deploy = params => { return axios.post(`${base}/deploy.action`, params); };

// 进行流程
export const cancelDeploy = params => { return axios.post(`${base}/cancelDeploy.action`, params); };

// 获取下拉列表
export const getDeployOptions = params => { return axios.post(`${base}/getDeployOptions.action`, params); };

// 获取待发布列表
export const getMobFrontPreReleaseDeploy = params => { return axios.post(`${base}/getMobFrontPreReleaseDeploy.action`, params); };

// 获取待发布列表
export const getMobFrontPreReleaseInfo = params => { return axios.post(`${base}/getMobFrontPreReleaseInfo.action`, params); };

// 外传内上传地址定义
export const fileInURL = `${base}/fileIn.action`;

// 内传外上传地址定义
export const fileOutURL = `${base}/fileOut.action`;

// 获取我的审批地址定义
export const getMyApproveFlowURL = `${base}/getMyApproveFlow.action?flowId=SvnAuth_1`;

// 获取我的申请地址定义
export const getMyFlowURL = `${base}/getMyFlow.action?flowId=SvnAuth_1`;

// 创建申请地址
export const createFlowURL = `${base}/createFlow.action?flowId=SvnAuth_1`;

// 上传部署发布的文件
export const uploadDeployFileURL = `${base}/uploadDeployFile.action`;