import {ElLoading, ElConfigProvider, ElMessage,  ElInfiniteScroll} from 'element-plus'


export default function (app) {
	app.use(ElLoading)
	app.use(ElConfigProvider)
	app.use(ElMessage)
	app.use(ElInfiniteScroll)
}
