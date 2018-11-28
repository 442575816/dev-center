import Home from '../../views/Home.vue'
import Main from '../../views/Main.vue'
import BackendDeploy from '../../views/deploy/BackendDeploy.vue'
import MobFrontDeploy from '../../views/deploy/MobFrontDeploy.vue'
import MobFrontRelease from '../../views/deploy/MobFrontRelease.vue'
import MobFrontPreReleaseList from '../../views/deploy/MobFrontPreReleaseList.vue'

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
    ],
    meta: {
        title: 'DeployPermission',
        icon: 'lock',
        roles: ['admin', 'qa', 'dev']
    }
}

export default deployRouter
