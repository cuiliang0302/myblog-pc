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
				title: '首页',
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
			path: '/about',
			name: 'About',
			component: () => import('@/views/About.vue'),
			meta: {
				title: '关于',
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
		{path: '/test', component: () => import('@/views/Test.vue')}
	]
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
	// to 访问的路径 from 从哪来 next 响应路径
	// if (to.meta.isAuth === true && JSON.stringify(store.state.userSession) === '{}') {
	// 	Toast.fail('还未登录，即将跳转至登录页')
	// 	return next('/login_register')
	// } else {
	// 	next()
	// }
	document.title = to.meta.title
	next()
})
export default router;
