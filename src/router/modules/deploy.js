import Home from '../../views/Home.vue'
import Main from '../../views/Main.vue'
import BackendDeploy from '../../views/deploy/BackendDeploy.vue'
import MobFrontDeploy from '../../views/deploy/MobFrontDeploy.vue'
import MobFrontRelease from '../../views/deploy/MobFrontRelease.vue'
import MobFrontPreReleaseList from '../../views/deploy/MobFrontPreReleaseList.vue'
import FtpUpload from '../../views/deploy/FtpUpload.vue'
import WebFrontDeploy from '../../views/deploy/WebFrontDeploy.vue'

const deployRouter = {
    path: '/',
    component: Home,
    name: '线上发布',
    iconCls: 'el-icon-upload2',//图标样式class
    children: [
        { 
            path: '/main', 
            component: Main, 
            name: '主页', 
            hidden: true,
            meta: {
                title: 'DeployPermission',
                icon: 'lock',
                roles: ['admin', 'qa', 'dev']
            }
        },
        { 
            path: '/backend', 
            component: BackendDeploy, 
            name: '后端上线',
            meta: {
                title: 'DeployPermission',
                icon: 'lock',
                roles: ['admin', 'qa', 'dev']
            }
        },
        { 
            path: '/ftpupload', 
            component: FtpUpload, 
            name: 'FTP文件上传',
            meta: {
                title: 'DeployPermission',
                icon: 'lock',
                roles: ['admin', 'qa', 'dev']
            }
        },
        { 
            path: '/mobfront', 
            component: MobFrontDeploy, 
            name: '移动前端测试上线',
            meta: {
                title: 'DeployPermission',
                icon: 'lock',
                roles: ['admin', 'qa', 'dev']
            }
        },
        { 
            path: '/mobfrontrelease/:deployId', 
            component: MobFrontRelease, 
            name: '移动前端正式上线', 
            hidden: true,
            meta: {
                title: 'DeployPermission',
                icon: 'lock',
                roles: ['admin', 'qa', 'dev']
            }
        },
        { 
            path: '/mobfrontprereleaselist', 
            component: MobFrontPreReleaseList, 
            name: '移动前端正式上线',
            meta: {
                title: 'DeployPermission',
                icon: 'lock',
                roles: ['admin', 'qa', 'dev']
            }
        },
        { 
            path: '/webfrontdeploy', 
            component: WebFrontDeploy, 
            name: '页游前端更新',
            meta: {
                title: 'DeployPermission',
                icon: 'lock',
                roles: ['admin', 'qa', 'dev']
            }
        },
    ],
    meta: {
        title: 'DeployPermission',
        icon: 'lock',
        roles: ['admin', 'qa', 'dev']
    }
}

export default deployRouter
