// 导入Nprogress加载效果插件
import Nprogress from 'nprogress'
import {createRouter, createWebHistory} from 'vue-router';

const router = createRouter({
	// history: createWebHashHistory(),  // hash模式，
	history: createWebHistory(),  //h5模式createWebHistory
	routes: [
		{
			path: '/',
			name: 'Home',
			component: () => import('@/views/home/Home.vue'),
			meta: {
				title: '崔亮的博客-专注devops自动化运维，传播优秀it运维技术文章',
				keepAlive: true
			}
		},
		{
			path: '/search',
			name: 'Search',
			component: () => import('@/views/public/Search.vue'),
			meta: {
				title: '搜索',
				keepAlive: true
			}
		},
		{
			path: '/link',
			name: 'Link',
			component: () => import('@/views/public/Link.vue'),
			meta: {
				title: '友情链接',
				keepAlive: true,
			}
		},
		{
			path: '/applyLink',
			name: 'ApplyLink',
			component: () => import('@/views/public/ApplyLink.vue'),
			meta: {
				title: '申请友链',
				keepAlive: true,
			},
		},
		{
			path: '/category/:id',
			name: 'Category',
			component: () => import('@/views/article/Category.vue'),
			meta: {
				title: '文章分类',
				keepAlive: true
			}
		},
		{
			path: '/tag/:id',
			name: 'Tag',
			component: () => import('@/views/article/Tag.vue'),
			meta: {
				title: '标签',
				keepAlive: true,
			}
		},
		{
			path: '/detail/article/:id',
			name: 'ArticleDetail',
			component: () => import('@/views/article/ArticleDetail.vue'),
			meta: {
				title: '文章正文',
				keepAlive: false
			}
		},
		{
			path: '/catalog/:id',
			name: 'Catalog',
			component: () => import('@/views/note/Catalog.vue'),
			meta: {
				title: '笔记目录',
				keepAlive: true
			}
		},
		{
			path: '/detail/section/:id',
			name: 'SectionDetail',
			component: () => import('@/views/note/SectionDetail.vue'),
			meta: {
				title: '笔记正文',
				keepAlive: false
			}
		},
		{
			path: '/classify',
			name: 'Classify',
			component: () => import('@/views/public/Classify.vue'),
			meta: {
				title: '归档',
				keepAlive: true
			}
		},
		{
			path: '/message',
			name: 'Message',
			component: () => import('@/views/public/Message.vue'),
			meta: {
				title: '留言板',
				keepAlive: false
			}
		},
		{
			path: '/about',
			name: 'About',
			component: () => import('@/views/public/About.vue'),
			meta: {
				title: '关于',
				keepAlive: true
			}
		},
		{
			path: '/loginRegister',
			name: 'LoginRegister',
			component: () => import('@/views/personal/LoginRegister.vue'),
			meta: {
				title: '登录&注册',
				keepAlive: false
			}
		},
		{
			path: '/OAuth/:platform',
			name: 'OAuth',
			component: () => import('@/views/personal/OAuth.vue'),
			meta: {
				title: '第三方登录授权页',
				keepAlive: true,
			}
		},
		{
			path: '/setPassword',
			name: 'SetPassword',
			component: () => import('@/views/personal/SetPassword.vue'),
			meta: {
				title: '重置密码',
				keepAlive: false
			}
		},
		{
			path: '/personal',
			name: 'Personal',
			component: () => import('@/views/personal/Personal.vue'),
			children:[
				{
					path:"",
					redirect:"/personal/myIndex"
				},
				{
					path:"statistics",
					redirect:"/personal/myIndex"
				},
				{
					path: 'myIndex',
					name: 'MyIndex',
					component: () => import('@/views/personal/MyIndex.vue'),
					meta: {
						title: '个人中心',
						keepAlive: true,
					},
				},
				{
					path: 'myInfo',
					name: 'MyInfo',
					component: () => import('@/views/personal/MyInfo.vue'),
					meta: {
						title: '修改信息',
						keepAlive: true,
					},
				},
				{
					path: 'changePassword',
					name: 'ChangePassword',
					component: () => import('@/views/personal/ChangePassword.vue'),
					meta: {
						title: '修改密码',
						keepAlive: true,
					},
				},
				{
					path: 'changeEmail',
					name: 'ChangeEmail',
					component: () => import('@/views/personal/ChangeEmail.vue'),
					meta: {
						title: '更换邮箱',
						keepAlive: true,
					},
				},
				{
					path: 'changePhone',
					name: 'ChangePhone',
					component: () => import('@/views/personal/ChangePhone.vue'),
					meta: {
						title: '更换手机',
						keepAlive: true,
					}
				},
				{
					path: 'myHistory',
					name: 'MyHistory',
					component: () => import('@/views/personal/MyHistory.vue'),
					meta: {
						title: '浏览记录',
						keepAlive: true,
					}
				},
				{
					path: 'myCollect',
					name: 'MyCollect',
					component: () => import('@/views/personal/MyCollect.vue'),
					meta: {
						title: '我的收藏',
						keepAlive: true,
					}
				},
				{
					path: 'myComments',
					name: 'MyComments',
					component: () => import('@/views/personal/MyComments.vue'),
					meta: {
						title: '我的评论',
						keepAlive: true,
					}
				},
				{
					path: 'test',
					name: 'Test',
					component: () => import('@/views/Test.vue'),
					meta: {
						title: '测试页',
						keepAlive: true,
					}
				}
			]
		},
		{path: '/test', component: () => import('@/views/Test.vue')},
		{path: '/test1', component: () => import('@/views/Test1.vue')},
		{path: '/test2', component: () => import('@/views/Test2.vue')},
		{
			path: '/404',
			name: '404',
			component: () => import('@/views/404.vue'),
			meta: {
				title: '404-页面找不到',
				keepAlive: true
			}
		},
		{
			path: '/:pathMatch(.*)',
			redirect: '/404'
		},
	]
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
	Nprogress.start()
	// to 访问的路径 from 从哪来 next 响应路径
	// 百度统计API跳转
	if (to.path) {
		if (window._hmt) {
			window._hmt.push(['_trackPageview', '/#' + to.fullPath])
		}
	}
	// if (to.meta.isAuth === true && JSON.stringify(store.state.userSession) === '{}') {
	// 	Toast.fail('还未登录，即将跳转至登录页')
	// 	return next('/loginRegister')
	// } else {
	// 	next()
	// }
	document.title = to.meta.title
	next()
})
router.afterEach(() => {
	Nprogress.done()
})
export default router;
