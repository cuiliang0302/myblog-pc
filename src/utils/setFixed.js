// 自定义图标

function setFixed() {
	const elHeight = (className) => {
		const div = document.querySelector(className);
		console.log(div.offsetHeight)
		console.log(window.screen.height)
		if (div.offsetHeight <= window.screen.height) {
			console.log("添加底部固定")
		} else {
			console.log("不用添加了")
		}
	}
	return {
		elHeight
	}
}

export default setFixed
