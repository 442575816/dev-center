import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import FileOut from './views/filetransfer/FileOut.vue'
import FileIn from './views/filetransfer/FileIn.vue'
import SvnAuth from './views/svn/SvnAuth.vue'
import MySvnAuth from './views/svn/MySvnAuth.vue'
import MySvnApprove from './views/svn/MySvnApprove.vue'
import BackendDeploy from './views/deploy/BackendDeploy.vue'
import MobFrontDeploy from './views/deploy/MobFrontDeploy.vue'
import MobFrontRelease from './views/deploy/MobFrontRelease.vue'
import MobFrontPreReleaseList from './views/deploy/MobFrontPreReleaseList.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '文件转移',
        iconCls: 'el-icon-upload',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/fileout', component: FileOut, name: '内转外' },
            { path: '/filein', component: FileIn, name: '外转内' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'SVN管理',
        iconCls: 'el-icon-menu',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/svnauth', component: SvnAuth, name: 'SVN权限申请' },
            { path: '/mysvnauth', component: MySvnAuth, name: '我的申请' },
            { path: '/mysvnapprove', component: MySvnApprove, name: '我的审批' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '线上发布',
        iconCls: 'el-icon-upload2',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/backend', component: BackendDeploy, name: '后端上线' },
            { path: '/mobfront', component: MobFrontDeploy, name: '移动前端测试上线' },
            { path: '/mobfrontrelease/:deployId', component: MobFrontRelease, name: '移动前端正式上线', hidden: true},
            { path: '/mobfrontprereleaselist', component: MobFrontPreReleaseList, name: '移动前端正式上线'},
        ]
    },

    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;