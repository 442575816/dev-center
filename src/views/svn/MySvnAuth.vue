<template>
    <div id="body">
        <iframe id="workflowIf" :src="iframeURL" frameborder="0" scrolling="auto"></iframe>
    </div>
</template>

<script>
import { getMyFlowURL } from '../../api/api';

export default {
    data() {
      return {
        iframeURL: ""
      }
    },
    mounted() {
        this.iframeURL =  getMyFlowURL
        let iframe = document.querySelector('#workflowIf');
        const deviceWidth = document.documentElement.clientWidth;
        const deviceHeight = document.documentElement.clientHeight;
        iframe.style.width = (Number(deviceWidth) - 270) + 'px'; //数字是页面布局宽度差值
        iframe.style.height = (Number(deviceHeight) - 165) + 'px'; //数字是页面布局高度差
    },
    watch: {
        "$route": function(from, to) {
            let iframe = document.querySelector('#workflowIf');
            iframe.src = getMyFlowURL
        }
    }
}
</script>

<style>

</style>

