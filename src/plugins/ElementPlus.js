import {ElLoading, ElConfigProvider, ElMessage} from 'element-plus'


export default function (app) {
	app.use(ElLoading)
	app.use(ElConfigProvider)
	app.use(ElMessage)
}
