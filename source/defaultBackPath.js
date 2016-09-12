// 各个页面后退时的默认路径

var defaultBackPath = {
	// demo
	'/demo/routeC': '/demo/routeB',
	'/demo/routeB': '/demo/routeA',
	'/demo/routeA': '/demo',

	// 注册登录
	'/login/retrievepwd2': '/login/retrievepwd',
	'/login/retrievepwd': '/login/signin',
	'/login/register2': '/login/register',
	'/login/register': '/login/signin',
	'/login/signin': '/home',

	// 首页
	'/home': '/home,/',
	'/': '/,/home',

	// 外部链接页面
	'/external': '/home',

	// 会员专区
	'/member/home': '/home',
	'/member/account': '/member/home',
	'/member/editavatar': '/member/account',
	'/member/editpwd': '/member/account',
	'/member/bindphone': '/member/account',
	'/member/activity': '/member/home',
	'/member/activitynormal': '/member/home',
	'/member/lvlexplain': '/member/home',
	'/member/rightsexplain': '/member/home',
	'/member/prizerecord': '/member/home',

	// 设备与服务
	'/device/devhome': '/home',
	'/device/repair': '/device/devhome',
	'/device/install': '/device/devhome',
	'/device/add': '/device/devhome',
	'/device/addnotwx': '/device/devhome',
	'/device/add2': '/device/add',
	'/device/detail': '/device/devhome',
	'/device/commentdevice': '/device/detail',
	'/device/commentserver': '/device/detail',
	'/device/examinecomment': '/device/devhome',

	//积分使用
	'/credit/activitydetail':'/credit/activity',
	'/credit/activity':'/credit/view',
	'/credit/classifyview':'/credit/view',
	'/credit/instruction':'/credit/view',
	'/credit/view':'/home',
	'/credit/mall':'/home',

	//话题管理
	'/subscription/newsdetail':'/subscription/news',
	'/subscription/news':'/home',
	'/subscription/submanage':'/subscription/mysub',
	'/subscription/subdetail':'/subscription/mysub',
	'/subscription/mysub':'/home',
	'/subscription/topic':'/home',
}

// 特殊路径，类似末尾带有参数类型的/member/activity/16
var specialPath = [];

export { defaultBackPath, specialPath };

export default defaultBackPath;