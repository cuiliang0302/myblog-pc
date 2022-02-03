import {createStore} from 'vuex'
import mutations from '@/store/mutations'
import state from "@/store/state";
import createVuexAlong from 'vuex-along'

export default createStore({
	state,
	mutations,
	plugins: [
		createVuexAlong({
			local: {
				list: ["userLocal", "keepLogin"],
			},
			session: {
				list: ["outline", "outlineShow", "userSession", "nextPath", "asideMenuFold","dark"],
			}
		})
	]
})
