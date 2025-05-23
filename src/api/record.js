import index from './index'
import {getArticleDetail} from "@/api/blog";

// 获取搜索热词
export function getSearchHot() {
  return index.get('/record/searchHot/')
}

// 获取搜索记录
export function getSearchHistory() {
  return index.get('/record/searchHistory/')
}

// 搜索文章
export function getSearch(params) {
  const url = '/record/search/'
  return index.get(url, params)
}

// 获取全部留言数据
export function getLeaveMessage(params) {
  const url = '/record/leaveMessage/'
  return index.get(url, params)
}

// 获取单个留言数据
export function getLeaveMessageDetail(id) {
  return index.get('/record/leaveMessage/' + id + '/')
}

// 发表留言
export function postLeaveMessage(params) {
  return index.post('/record/leaveMessage/', params)
}

// 点赞留言
export function patchLeaveMessage(id, params) {
  const url = '/record/leaveMessage/' + id + '/'
  return index.patch(url, params)
}

// 删除留言
export function deleteLeaveMessage(messageId) {
  return index.delete('/record/leaveMessage/' + messageId + '/')
}

// 回复留言
export function postReplyLeaveMessage(params) {
  return index.post('/record/leaveMessage/', params)
}

// 获取文章评论数据
export function getArticleComment(articleId) {
  return index.get('/record/articleComment/?article=' + articleId)
}

// 文章评论
export function postArticleComment(params) {
  return index.post('/record/articleComment/', params)
}

// 删除文章评论
export function deleteArticleComment(messageId) {
  return index.delete('/record/articleComment/' + messageId + '/')
}

// 点赞文章评论
export function patchArticleComment(id, params) {
  const url = '/record/articleComment/' + id + '/'
  return index.patch(url, params)
}

// 回复文章评论
export function postReplyArticleComment(params) {
  return index.post('/record/articleComment/', params)
}

// 获取笔记评论数据
export function getSectionComment(sectionId) {
  return index.get('/record/sectionComment/?section=' + sectionId)
}

// 笔记评论
export function postSectionComment(params) {
  return index.post('/record/sectionComment/', params)
}

// 删除笔记评论
export function deleteSectionComment(messageId) {
  return index.delete('/record/sectionComment/' + messageId + '/')
}

// 点赞笔记评论
export function patchSectionComment(id, params) {
  const url = '/record/sectionComment/' + id + '/'
  return index.patch(url, params)
}

// 回复笔记评论
export function postReplySectionComment(params) {
  return index.post('/record/sectionComment/', params)
}

// 获取文章浏览记录
export function getArticleHistory(article) {
  if (article) {
    return index.get('/record/articleHistory/?article=' + article )
  } else {
    return index.get('/record/articleHistory/')
  }
}

// 添加文章浏览记录
export function postArticleHistory(params) {
  return index.post('/record/articleHistory/', params)
}

// 修改文章收藏
export function putArticleHistory(params) {
  const url = '/record/articleHistory/'
  return index.put(url, params)
}

// 获取笔记浏览记录
export function getSectionHistory(section) {
  if (section) {
    return index.get('/record/sectionHistory/?section=' + section )
  } else {
    return index.get('/record/sectionHistory/')
  }

}

// 添加笔记浏览记录
export function postSectionHistory(params) {
  return index.post('/record/sectionHistory/', params)
}

// 修改笔记收藏
export function putSectionHistory(params) {
  const url = '/record/sectionHistory/'
  return index.put(url, params)
}

// 获取用户文章评论数据
export function getUserArticleComment() {
  return index.get('/record/articleComment/')
}

// 获取用户笔记评论数据
export function getUserSectionComment(userId) {
  return index.get('/record/sectionComment/')
}

// 获取用户统计数据
export function getStatistics() {
  return index.get('/record/statistics/')
}

// 查询指定用户echarts数据统计
export function getUserEcharts(params) {
  const url = '/record/userEcharts/'
  return index.get(url, params)
}
