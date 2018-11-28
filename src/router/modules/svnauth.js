import Home from '../../views/Home.vue'
import Main from '../../views/Main.vue'
import SvnAuth from '../../views/svn/SvnAuth.vue'
import MySvnAuth from '../../views/svn/MySvnAuth.vue'
import MySvnApprove from '../../views/svn/MySvnApprove.vue'

const svnAuthRouter = {
    path: '/',
    component: Home,
    name: 'SVN管理',
    iconCls: 'el-icon-menu',//图标样式class
    children: [
        { path: '/main', component: Main, name: '主页', hidden: true },
        { path: '/svnauth', component: SvnAuth, name: 'SVN权限申请' },
        { path: '/mysvnauth', component: MySvnAuth, name: '我的申请' },
        { 
            path: '/mysvnapprove', 
            component: MySvnApprove, 
            name: '我的审批', 
            meta: {
                title: 'ApprovePermission',
                icon: 'lock',
                roles: ['admin', 'manager']
            }
        },
    ]
}

export default svnAuthRouter
