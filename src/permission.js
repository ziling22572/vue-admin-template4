import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import layout from "@/layout";
NProgress.configure({ showSpinner: false }) // NProgress Configuration
// 在 permission.js 顶部添加

const whiteList = ['/login'] // no redirect whitelist

// 注意这里改成相对路径
const viewModules = require.context('./views', true, /\.vue$/);

function loadView(viewPath) {
  const directFile = `./${viewPath}.vue`;
  if (viewModules.keys().includes(directFile)) {
    return viewModules(directFile).default;
  }

  const indexFile = `./${viewPath}/index.vue`;
  if (viewModules.keys().includes(indexFile)) {
    return viewModules(indexFile).default;
  }

  console.error(`❌ 未找到组件文件: ${directFile} 或 ${indexFile}`);
  return null;
}





function myFilterAsyncRoutes(menus, isChild = false) {
  return menus.map(menu => {
    // 1. 组件处理
    if (menu.component === 'Layout') {
      menu.component = layout;
    } else {
      menu.component = loadView(menu.component);
    }

    // 2. meta 转换
    menu.meta = {
      title: menu.title || menu.name,
      icon: menu.icon || 'el-icon-menu'
    };

    // 3. path 规范化
    if (!isChild && menu.path && !menu.path.startsWith('/')) {
      menu.path = `/${menu.path}`;
    } else if (isChild && menu.path && menu.path.startsWith('/')) {
      menu.path = menu.path.replace(/^\/+/, '');
    }

    // 4. 递归处理子菜单
    if (menu.children && menu.children.length) {
      menu.children = myFilterAsyncRoutes(menu.children, true);
    }

    return menu;
  });
}



router.beforeEach(async(to, from, next) => {
  NProgress.start();
  document.title = getPageTitle(to.meta.title);
  const hasToken = getToken();

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      const hasGetUserInfo = store.getters.name;
      if (hasGetUserInfo) {
        next();
      } else {
        try {
          await store.dispatch('user/getInfo');

          let myRoutes = myFilterAsyncRoutes(store.getters.menus);

          myRoutes.push({
            path: '*',
            redirect: '/404',
            hidden: true
          });

          router.addRoutes(myRoutes);
          global.myRoutes = myRoutes;

          // 调试输出
          console.log('✅ 动态路由已添加:', myRoutes);

          next({ ...to, replace: true });
        } catch (error) {
          await store.dispatch('user/resetToken');
          Message.error(error || 'Has Error');
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});
