import {ElInfiniteScroll, ElLoading, ElConfigProvider} from 'element-plus'


export default function (app) {
	app.use(ElInfiniteScroll)
	app.use(ElLoading)
	app.use(ElConfigProvider)
}
