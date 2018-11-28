
import Home from '../../views/Home.vue'
import Main from '../../views/Main.vue'
import FileOut from '../../views/filetransfer/FileOut.vue'
import FileIn from '../../views/filetransfer/FileIn.vue'

const fileTransferRouter = {
    path: '/',
    component: Home,
    name: '文件转移',
    iconCls: 'el-icon-upload',//图标样式class
    children: [
        { path: '/main', component: Main, name: '主页', hidden: true },
        { path: '/fileout', component: FileOut, name: '内转外' },
        { path: '/filein', component: FileIn, name: '外转内' },
    ]
}

export default fileTransferRouter