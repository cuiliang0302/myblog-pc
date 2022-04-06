import index from './index'

// 获取七牛图片上传token
export function getQiNiuToken() {
    return index.get('/public/qiniuToken/')
}

// 图片防盗链代理
export function getImgProxy(url) {
    return 'https://api.cuiliangblog.cn/v1/public/imgProxy/?url=' + url
}

// 获取背景图片地址
export function getBgiUrl() {
    return index.get('/public/backgroundImage/')
}
// 获取省市代码
export function getAreaData() {
    return index.get('/public/areaData/')
}
