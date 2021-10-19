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
			component: () => import('@/views/Home.vue'),
			meta: {
				title: '崔亮的博客-专注devops自动化运维，传播优秀it运维技术文章',
			}
		},
		{
			path: '/category/:id',
			name: 'Category',
			component: () => import('@/views/article/Category.vue'),
			meta: {
				title: '文章分类',
			}
		},
		{
			path: '/detail/article/:id',
			name: 'ArticleDetail',
			component: () => import('@/views/article/ArticleDetail.vue'),
			meta: {
				title: '文章正文',
			}
		},
		{
			path: '/catalog/:id',
			name: 'Catalog',
			component: () => import('@/views/note/Catalog.vue'),
			meta: {
				title: '笔记目录',
			}
		},
		{
			path: '/detail/section/:id',
			name: 'SectionDetail',
			component: () => import('@/views/note/SectionDetail.vue'),
			meta: {
				title: '笔记正文',
			}
		},
		{
			path: '/classify',
			name: 'Classify',
			component: () => import('@/views/Classify.vue'),
			meta: {
				title: '归档',
			}
		},
		{
			path: '/message',
			name: 'Message',
			component: () => import('@/views/Message.vue'),
			meta: {
				title: '留言板',
			}
		},
		{
			path: '/about',
			name: 'About',
			component: () => import('@/views/About.vue'),
			meta: {
				title: '关于',
			}
		},
		{
			path: '/login_register',
			name: 'LoginRegister',
			component: () => import('@/views/LoginRegister.vue'),
			meta: {
				title: '登录&注册',
			}
		},
		{path: '/test', component: () => import('@/views/Test.vue')},
		{
			path: '/404',
			name: '404',
			component: () => import('@/views/404.vue'),
			meta: {
				title: '404-页面找不到',
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
	// 	return next('/login_register')
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
