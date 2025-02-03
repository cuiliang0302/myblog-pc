// 使用了数据持久化存储插件
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createPinia } from "pinia";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;