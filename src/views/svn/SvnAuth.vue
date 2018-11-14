<template>
    <div id="body" >
        <iframe id="workflowIf" :src="iframeURL" frameborder="0" scrolling="no"></iframe>
    </div>
</template>

<script>
export default {
    data() {
      return {
        iframeURL: "http://127.0.0.1:8011/root/createFlow.action?flowId=SvnAuth_1"
      }
    },
    mounted() {
        this.iframeURL =  "http://127.0.0.1:8011/root/createFlow.action?flowId=SvnAuth_1";
        let iframe = document.querySelector('#workflowIf');
        const deviceWidth = document.documentElement.clientWidth;
        const deviceHeight = document.documentElement.clientHeight;
        iframe.style.width = (Number(deviceWidth) - 270) + 'px'; //数字是页面布局宽度差值
        iframe.style.height = (Number(deviceHeight) + 70) + 'px'; //数字是页面布局高度差
    }
}
</script>

<style>

</style>

