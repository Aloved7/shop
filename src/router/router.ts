import NotFound from '@/view/404/NotFound.vue'



//将路由表暴露出去
export const constantRoute = [
    //登录路由
    {
        path: '/login',
        component: () => import('@/view/login/Login.vue'),
        name: 'login',//命名路由
        meta: {
            title: '登录',//菜单标题
            hidden: true,//代表标题是否在菜单中隐藏
            icon: 'Plus'
        }
    },
    //首页路由  
    {
        //登录成功以后展示数据的路由
        path: '/',
        component: () => import('@/layout/Layout.vue'),
        name: 'layout',
        meta: {
            title: '',
            hidden: false,
            icon: ''
        },
        redirect: '/home',
        children: [
            {
                path: '/home',
                component: () => import('@/view/home/Home.vue'),
                meta: {
                    title: '首页',
                    hidden: false,
                    icon: 'HomeFilled'
                }
            }
        ]
    },
    {
        path: '/404',
        component: NotFound,
        name: '404',//命名路由
        meta: {
            title: '404',//菜单标题
            hidden: true,
            icon: 'DocumentDelete'
        },
    },
    //大屏路由
    {
        path: "/screen",
        component: () => import('@/view/screen/Index.vue'),
        name: 'screen',
        meta: {
            hidden: false,
            title: '数据大屏',
            icon: 'Platform'
        }
    },

]

//异步路由 权限路由
export const asyncRoute = [
    //权限路由
    {
        path: "/acl",
        component: () => import('@/layout/Layout.vue'),
        name: 'Acl',
        meta: {
            title: '权限路由',
            hidden: false,
            icon: 'Lock'
        },
        redirect: '/acl/user',
        children: [
            {
                path: '/acl/user',
                component: () => import('@/view/acl/User/Index.vue'),
                name: 'User',
                meta: {
                    title: '用户管理',
                    hidden: false,
                    icon: 'User'
                }
            },
            {
                path: '/acl/role',
                component: () => import('@/view/acl/Role/Index.vue'),
                name: 'Role',
                meta: {
                    title: '角色管理',
                    hidden: false,
                    icon: 'UserFilled'
                }
            },
            {
                path: '/acl/permission',
                component: () => import('@/view/acl/Permission/Index.vue'),
                name: 'Permission',
                meta: {
                    title: '菜单管理',
                    hidden: false,
                    icon: 'Expand'
                }
            },
        ]
    },
    //商品路由
    {
        path: '/product',
        component: () => import('@/layout/Layout.vue'),
        name: 'Product',
        meta: {
            title: '商品管理',
            icon: 'Goods',
            hidden: false
        },
        redirect: '/product/trademark',
        children: [
            {
                path: '/product/trademark',
                component: () => import('@/view/product/trademark/Index.vue'),
                name: 'Trademark',
                meta: {
                    title: '品牌管理',
                    icon: 'ShoppingCartFull',
                    hidden: false//不写是undefined 会被当作false
                }
            },
            {
                path: '/product/attr',
                component: () => import('@/view/product/attr/Index.vue'),
                name: 'Attr',
                meta: {
                    title: '属性管理',
                    icon: 'ChromeFilled',
                }
            },
            {
                path: '/product/spu',
                component: () => import('@/view/product/spu/Index.vue'),
                name: 'Spu',
                meta: {
                    title: 'SPU管理',
                    icon: 'Calendar',
                }
            },
            {
                path: '/product/sku',
                component: () => import('@/view/product/sku/Index.vue'),
                name: 'Sku',
                meta: {
                    title: 'Sku管理',
                    icon: 'Film',
                }
            },
        ]
    },
]


//任意路由
export const anyRoute = {
    //任意路由
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
        title: '任意路由',
        hidden: true,
        icon: 'DataLine'
    }
}
