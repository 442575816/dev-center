import axios from 'axios';
import Qs from 'qs'

// url base
let base = 'http://127.0.0.1:8011/root';

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
    return newData
}]

// 收到响应后预处理数据
axios.defaults.transformResponse = [function (text) {
    let response = JSON.parse(text)
    if (response.state == 4 && vueContext.vue) {
        vueContext.vue.$message({
            message: response.data.msg,
            type: 'error'
        });
        setTimeout(function(){
            vueContext.vue.$router.push({ path: '/login' });
        }, 2000)
    }
    return response;
}]

// Login请求
export const requestLogin = params => { return axios.post(`${base}/login.action`, params).then(res => res.data); };

// 获取外传内文件列表
export const getFileInList = params => { return axios.post(`${base}/getFileInList.action`, params); };

// 下载文件
export const downloadFile = params => { return axios.get(`${base}/download.action`, { params: params, responseType:'blob' }); };
