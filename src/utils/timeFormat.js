// 日期对象格式化转换
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn' // import locale
dayjs.extend(relativeTime)
dayjs.locale('zh-cn') // use locale

function timeFormat() {
    // 显示几天前
    const timeAgo = (valueTime) => {
        return dayjs(valueTime).fromNow()
    }
    // 只显示年月日
    const timeDate = (valueTime) => {
        return dayjs(valueTime).format('YYYY-MM-DD')
    }
    // 显示全部时间
    const timeFull = (valueTime) => {
        return dayjs(valueTime).format('YYYY-MM-DD HH:mm:ss')
    }
    // 时间_用于文件名
    const timeFile = (valueTime) => {
        return dayjs(valueTime).format('YYYY_MM_DD HH_mm_ss')
    }
    const timeNowDate = () => {
        let nowDate = new Date(1980, 0, 1)
        return {
            nowDate
        }
    }
    return {
        timeAgo,
        timeDate,
        timeNowDate,
        timeFull,
        timeFile
    }
}

export default timeFormat
