import { browserHistory } from 'react-router';
import defaultBackPath from '../constants/defaultBackPath';

// 路由变化记录
var historyList = [];
// 路由变化类型，前进 后退
var lastMoveType = '';

// 路由导航
var navUtils = {
	clear: function () {
		historyList = [];
	},
	// url改变时记录路由信息
	record: function (path) {
		historyList.push(path)
	},
	// 记录是前进或者后退事件
	recordMov: function (movement) {
		lastMoveType = movement;
	},
	// 页面导航前进
	forward: function (nextPath) {
		browserHistory.push(nextPath);
	},
	// 重定向当前页面，一般用于下面两种情况；
	// １.将要跳转到一个页面如果条件不满足需要先跳转到另一个页面的情况。例如，从首页跳转到会员中心，如果没有登录先跳转到登录
	// 页面，登录成功后在replace为先前要跳转的页面。路径变化为[/home]->[/home,/login/signin]->[/home,/member/home]。
	// 2.
	// 
	replace: function (path) {
		historyList.pop();
		browserHistory.replace(path);
	},
	// 页面导航后退
	goBack: function (defaultPath) {
		if (historyList.length > 1) {
			console.log('goBack: goback');
			browserHistory.goBack();
		} else {
			console.log('goBack: replace');
			browserHistory.replace(defaultPath);
		}
	},
	// 取到最后一次的路径
	getLastPath: function () {
		return historyList.length > 0 ? historyList[historyList.length - 1] : '';
	},
	// 取到最后一次跳转的变化
	getLastTrans: function () {
		if (historyList.length > 1) {
			return historyList.slice(historyList.length - 2).join(',');
		} else {
			return '';
		}
	},
	removeLast: function () {
		return historyList.pop();
	},
	getLength: function () {
		return historyList.length;
	},
	// 返回路由记录
	getList: function () {
		return historyList.slice();
	},
	// 获取路由变化类型
	getMovement: function () {
		return lastMoveType;
	}
};

export default navUtils;