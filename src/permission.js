import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import layout from "@/layout";
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

function myFilterAsyncRoutes(menus, isChild = false) {
  return menus.map(menu => {
    // 1. 组件处理
    if (menu.component === 'Layout') {
      menu.component = layout;
    } else {
      try {
        menu.component = require(`@/views/${menu.component}.vue`).default;
      } catch (e) {
        console.error(`❌ 组件加载失败: ${menu.component}`, e);
        menu.component = null;
      }
    }

    // 2. meta 转换
    menu.meta = {
      title: menu.title || menu.name,
      icon: menu.icon || 'el-icon-menu'
    };

    // 3. path 规范化
    if (!isChild && menu.path && !menu.path.startsWith('/')) {
      // 一级菜单加上 /
      menu.path = `/${menu.path}`;
    } else if (isChild && menu.path && menu.path.startsWith('/')) {
      // 子菜单去掉 /
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
