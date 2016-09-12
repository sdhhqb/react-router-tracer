import MyApp from '../components/MyApp';
import navUtils from '../utils/navUtils';
import defaultBackPath from '../constants/defaultBackPath';

import NotFound from '../components/common/notfound';
import Home from '../components/home';

// import DemoRoute from './demo';
import ExternalRoute from './external';
import AdsRoute from './ads';
import LoginRoute from './login';
import MemberRoute from './member';
import DeviceRoute from './device';
import creditRoute from './credit';
import SubscriptionRoute from './subscription';

// 开发环境下暴露到全局，方便查看路由变化记录
window.nav = navUtils;

// 关于在rootRoute上添加onEnter和onChange事件的说明。
// 在移动端页面上，用户可以点击手机的后退键，或者页面上的返回按钮(调用browserHistory.goBack方法)，
// 考虑以下情况：
// 
// 假设现在有分层级三个页面，分别为/home, /home的子页面/member/home, /member/home的子页面
// /member/activity。
// 
// 情况一：手机访问/home, 然后前进到/member/home, 再前进到/member/activity，页面跳转的顺序
// 为/home -> /member/home -> /member/activity。此时可以按两次后退键，回到/home页面，没有问题。
// 
// 情况二：手机直接访问/member/activity, 此时如果用户点手机的后退键或页面上的返回按钮，页面会直
// 接退出了。
// 
// 情况三：针对情况二，想到一种办法，点击页面的返回按钮时，调用browserHistory.replace方法，页面
// 就不会后退。比如在/member/activity页面点击返回按钮时，可以用replace将页面替换为/member/home，
// 在/member/home点击返回，用replace替换为/home，每个页面点返回按钮时replace的路径是预先指定的。
// 这样用户从/member/activity页面进入，可以点两次页面上的返回按钮，返回到/home页面。
// 
// 情况四：情况三导致一个新的问题。假如用户从/home进入，按/home -> /member/home -> /member/activity
// 顺序跳转页面，再按两次返回按钮回到/home。因为返回按钮调用的是replace方法，此时浏览器history中记录
// 的地址变化是/home -> /member/home -> /home。这时在/home页按返回按钮不会跳转页面，但是点手机的后退
// 键会返回到/member/home页面，效果看起来好像是页面反而前进了。
// 
// 综合以上情况，最后的解决办法是。如果用户直接进入/member/activity页面，点击手机后退键，直接退出。
// 点击返回按钮，返回上一层的页面，并且在返回时进行判断，如果之前有history跳转记录，就使用goBack，
// 否则使用replace。
// navUtils主要负责在enter,change时记录页面跳转记录，以及控制页面前进、后退的导航。enter事件会记录第
// 一次页面进入时的初始path, 页面跳转时change事件需要根据情况做一些处理:
// 1.如果历史记录是['/home', '/member/home']，将要goBack后退到'/home'，需要将最后一项'/member/home'
// 清除。
// 2.如果历史记录是['/home', '/member/home']，将要forward前进到'/member/activity'，需要push路径到数
// 组。
// 3.如果历史记录是['/member/home']，将要replace后退到'/home'，需要先清空数组，再push一项'/home'。


// 页面加载时，记录初始化的路由路径
function enter (next) {
	navUtils.record(next.location.pathname);
}

// 路由改变时，记录路由路径改变
function change (cur, next, c) {
	if (cur.location.pathname !== next.location.pathname) {
		// 获取上一次的页面跳转数据，navUtils的historyList数组长度大于1才会有数据。例如数组为
		// ['/home', '/member/home', '/member/activity']时，获取的lastTrans为'/member/home,/member/activity'。
		var lastTrans = navUtils.getLastTrans();

		var movement = '';
		if (lastTrans !== '') {
			// 如果将要跳转的情况和lastTrans相反，例如lastTrans为'/member/home,/member/activity',将要跳转的路径为
			// 从'/member/activity'到'/member/home'。说明是一次后退跳转，移除数组中最后一个路径。否则，是一次前进
			// 跳转，记录路径到数组中。
			if (next.location.pathname+','+cur.location.pathname == lastTrans) {
				navUtils.removeLast();
				movement = 'back';
			} else {
				navUtils.record(next.location.pathname);
				movement = 'back';
			}
			navUtils.recordMov(movement);

		// lastTrans为空，说明数组中只有一个path。这时，需要通过defaultBackPath中的map数据，来判断是前进还是后退。
		// 例如数组为['/member/home']，要跳转到'/home'，因为在defaultBackPath中查到'/home'是'/member/home'的默认后
		// 退路径，说明这时一次后退跳转，需要先将数组情况，在记录一个'/home'路径。
		} else {
			// 因为跳转时记录的路径包含了项目发布的路径，在defaultBackPath中查找之前需要先剔除项目发布路径。
			// 还有路径的尾部可能有'/'或没有'/'，统一移除尾部的'/'。
			var oriCurPath = cur.location.pathname;
			var oriNextPath = next.location.pathname;
			if (HYAPP.ContextPath !== '') {
				oriCurPath = oriCurPath.substring(HYAPP.ContextPath.length);
				oriNextPath = oriNextPath.substring(HYAPP.ContextPath.length);
			}
			// pathname和HYAPP.ContextPath相同，访问的是根目录，末尾没有带/号
			if (oriCurPath.length == 0) {
				oriCurPath = '/';
			}
			if (oriCurPath.length > 1) {
				oriCurPath = oriCurPath.replace(/\/$/, '');
			}
			if (oriNextPath.length > 1) {
				oriNextPath = oriNextPath.replace(/\/$/, '');
			}
			var curDefaultBack = defaultBackPath[oriCurPath];

			movement = 'forward';

			// 如果有默认返回路径，判断当前页面的默认返回path和将要跳转到的path是相同，相同就清除history。
			// 注意这里有个特殊处理，因为首页有两个路径, '/'和'/home'，所以'/home'和'/'的默认后退路径可以
			// 为'/,/home'，即首页后退还是在首页。这样做是避免'/'和'/home'互相跳转时，其实是同一个页面，但
			// 在数组中插入了新的记录。
			if (typeof curDefaultBack === 'string') {
				curDefaultBack = curDefaultBack.split(',');
				curDefaultBack.forEach(function (item) {
					if (item === oriNextPath) {
						movement = 'backward';
						navUtils.clear();
					}
				});
			}
			// 添加跳转到的path
			navUtils.record(next.location.pathname);
			navUtils.recordMov(movement);
		}
		// 测试环境，输出path变化
		console.log(navUtils.getLastTrans());
		console.log(navUtils.getList());
	}
}

var rootRoute = {
	path: HYAPP.ContextPath ? HYAPP.ContextPath : '/',
	onEnter: enter,
	onChange: change,
	component: MyApp,
	indexRoute: { component: Home },
	childRoutes: [
		creditRoute,
		LoginRoute,
		ExternalRoute,
		AdsRoute,
		MemberRoute,
		DeviceRoute,
		SubscriptionRoute,
		{path: 'home', component: Home},
		{
			path: '*',
			component: NotFound
		}
	]
};

export default rootRoute;