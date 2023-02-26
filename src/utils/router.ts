import { RouteRecordRaw } from "vue-router";
import { isProxy, toRaw } from "vue";

/**
 * @description: 通过path获取父级路径
 * @param {string} path
 * @param {RouteRecordRaw} routes
 * @return {*}
 */
function getParentPaths(path: string, routes: RouteRecordRaw[]): string[] {
  // 深度遍历查找
  function dfs(routes: RouteRecordRaw[], path: string, parents: string[]) {
    for (let i = 0; i < routes.length; i++) {
      const item = routes[i];
      // 找到path则返回父级path
      if (item.path === path) return parents;
      // children不存在或为空则不递归
      if (!item.children || !item.children.length) continue;
      // 往下查找时将当前path入栈
      parents.push(item.path);

      if (dfs(item.children, path, parents).length) return parents;
      // 深度遍历查找未找到时当前path 出栈
      parents.pop();
    }
    // 未找到时返回空数组
    return [];
  }
  return dfs(routes, path, []);
}

/**
 * @description: 查找对应path的路由信息
 * @param {string} path
 * @param {RouteRecordRaw} routes
 * @return {*}
 */
function findRouteByPath(path: string, routes: RouteRecordRaw[]): any {
  let res = routes.find((item: { path: string }) => item.path == path);
  if (res) {
    return isProxy(res) ? toRaw(res) : res;
  } else {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].children instanceof Array && (routes[i].children as RouteRecordRaw[]).length > 0) {
        res = findRouteByPath(path, routes[i].children as RouteRecordRaw[]);
        if (res) {
          return isProxy(res) ? toRaw(res) : res;
        }
      }
    }
    return null;
  }
}

export { getParentPaths, findRouteByPath };