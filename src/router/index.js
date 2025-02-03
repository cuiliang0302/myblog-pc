// 导入Nprogress加载效果插件
import Nprogress from 'nprogress'
import {createRouter, createWebHistory} from 'vue-router';
import {ElMessage} from "element-plus";
import useStore from "@/store";


const router = createRouter({
    // history: createWebHashHistory(),  // hash模式，
    history: createWebHistory(),  //h5模式createWebHistory
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('@/views/home/Home.vue'),
            meta: {
                title: '崔亮的博客-专注运维开发技术，传播更多原创运维与开发技术文章',
                keepAlive: true,
                isAuth: false
            }
        },
        {
            path: '/search',
            name: 'Search',
            component: () => import('@/views/public/Search.vue'),
            meta: {
                title: '搜索',
                keepAlive: false,
                isAuth: false
            }
        },
        {
            path: '/link',
            name: 'Link',
            component: () => import('@/views/public/Link.vue'),
            meta: {
                title: '友情链接',
                keepAlive: true,
                isAuth: false
            }
        },
        {
            path: '/applyLink',
            name: 'ApplyLink',
            component: () => import('@/views/public/ApplyLink.vue'),
            meta: {
                title: '申请友链',
                keepAlive: true,
                isAuth: false
            },
        },
        {
            path: '/category/:id(\\d*)',
            name: 'Category',
            component: () => import('@/views/article/Category.vue'),
            meta: {
                title: '文章分类',
                keepAlive: false,
                isAuth: false
            }
        },
        {
            path: '/tag/:id(\\d*)',
            name: 'Tag',
            component: () => import('@/views/article/Tag.vue'),
            meta: {
                title: '标签',
                keepAlive: true,
                isAuth: false
            }
        },
        {
            path: '/detail/article/:id(\\d*)',
            name: 'ArticleDetail',
            component: () => import('@/views/article/ArticleDetail.vue'),
            meta: {
                title: '文章正文',
                keepAlive: false,
                isAuth: false
            }
        },
        {
            path: '/catalog/:id(\\d*)',
            name: 'Catalog',
            component: () => import('@/views/note/Catalog.vue'),
            meta: {
                title: '笔记目录',
                keepAlive: false,
                isAuth: false
            }
        },
        {
            path: '/detail/section/:id(\\d*)',
            name: 'SectionDetail',
            component: () => import('@/views/note/SectionDetail.vue'),
            meta: {
                title: '笔记正文',
                keepAlive: false,
                isAuth: false
            }
        },
        {
            path: '/classify',
            name: 'Classify',
            component: () => import('@/views/public/Classify.vue'),
            meta: {
                title: '归档',
                keepAlive: true,
                isAuth: false
            }
        },
        {
            path: '/message',
            name: 'Message',
            component: () => import('@/views/public/Message.vue'),
            meta: {
                title: '留言板',
                keepAlive: false,
                isAuth: false
            }
        },
        {
            path: '/about',
            name: 'About',
            component: () => import('@/views/public/About.vue'),
            meta: {
                title: '关于',
                keepAlive: true,
                isAuth: false
            }
        },
        {
            path: '/loginRegister',
            name: 'LoginRegister',
            component: () => import('@/views/personal/LoginRegister.vue'),
            meta: {
                title: '登录&注册',
                keepAlive: false,
                isAuth: false
            }
        },
        {
            path: '/OAuth/:platform',
            name: 'OAuth',
            component: () => import('@/views/personal/OAuth.vue'),
            meta: {
                title: '第三方登录授权页',
                keepAlive: false,
                isAuth: false
            }
        },
        {
            path: '/setPassword',
            name: 'SetPassword',
            component: () => import('@/views/personal/SetPassword.vue'),
            meta: {
                title: '重置密码',
                keepAlive: false,
                isAuth: false
            }
        },
        {
            path: '/personal',
            name: 'Personal',
            component: () => import('@/views/personal/Personal.vue'),
            children: [
                {
                    path: "",
                    name: "PersonalDefault",
                    redirect: "/personal/myIndex",
                    isAuth: true,
                    keepAlive: false,
                },
                {
                    path: "statistics",
                    name: "PersonalStatistics",
                    redirect: "/personal/myIndex",
                    isAuth: true,
                    keepAlive: false,
                },
                {
                    path: 'myIndex',
                    name: 'MyIndex',
                    component: () => import('@/views/personal/MyIndex.vue'),
                    meta: {
                        title: '个人中心',
                        keepAlive: false,
                        isAuth: true,
                    },
                },
                {
                    path: 'myInfo',
                    name: 'MyInfo',
                    component: () => import('@/views/personal/MyInfo.vue'),
                    meta: {
                        title: '修改信息',
                        keepAlive: false,
                        isAuth: true
                    },
                },
                {
                    path: 'changePassword',
                    name: 'ChangePassword',
                    component: () => import('@/views/personal/ChangePassword.vue'),
                    meta: {
                        title: '修改密码',
                        keepAlive: false,
                        isAuth: true
                    },
                },
                {
                    path: 'changeEmail',
                    name: 'ChangeEmail',
                    component: () => import('@/views/personal/ChangeEmail.vue'),
                    meta: {
                        title: '更换邮箱',
                        keepAlive: false,
                        isAuth: true
                    },
                },
                {
                    path: 'changePhone',
                    name: 'ChangePhone',
                    component: () => import('@/views/personal/ChangePhone.vue'),
                    meta: {
                        title: '更换手机',
                        keepAlive: false,
                        isAuth: true
                    }
                },
                {
                    path: 'myHistory',
                    name: 'MyHistory',
                    component: () => import('@/views/personal/MyHistory.vue'),
                    meta: {
                        title: '浏览记录',
                        keepAlive: false,
                        isAuth: true
                    }
                },
                {
                    path: 'myCollect',
                    name: 'MyCollect',
                    component: () => import('@/views/personal/MyCollect.vue'),
                    meta: {
                        title: '我的收藏',
                        keepAlive: false,
                        isAuth: true
                    }
                },
                {
                    path: 'myComments',
                    name: 'MyComments',
                    component: () => import('@/views/personal/MyComments.vue'),
                    meta: {
                        title: '我的评论',
                        keepAlive: false,
                        isAuth: true
                    }
                }
            ]
        },
        {
            path: '/test',
            name: 'Test',
            component: () => import('@/views/Test.vue'),
            meta: {
                title: '测试页',
                keepAlive: false,
                isAuth: false
            }
        }
    ]
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
    Nprogress.start()
    // to 访问的路径 from 从哪来 next 响应路径
    const {user} = useStore();
    console.log(user.isLoggedIn)
    console.log(to.meta.isAuth)
    if (to.meta.isAuth === true && !user.isLoggedIn) {
        ElMessage({
            message: '您还未登录，即将跳转至登录页',
            type: 'warning',
        })
        return next('/loginRegister')
        // next()
    } else {
        // this.$script().then(() => {
        //     // 文件加载完成后的操作
        //     console.log(window)
        // })
        // window.umami.trackView(to.path, null, '9447ca81-4839-4b2d-a0e3-f795515a2f3b')
        next()
    }
    document.title = to.meta.title
})
router.afterEach(() => {
    Nprogress.done()
})
export default router;
