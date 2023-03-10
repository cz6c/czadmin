import { defineStore } from "pinia";
import store from "@/store";
import { setToken, removeToken } from "@/utils/auth";
import { login, getLoginUserInfo, getMenuList } from "@/api/public";
import { LoginParams, UserInfo } from "@/api/public/index.d";
import { isDynamicAddedRoute } from "@/config";
import router, { resetRouter } from "@/router";
import { menuToRoute } from "@/utils/router";
import type { RouteRecordRaw } from "vue-router";
import { useMultiTagsStore } from "./multiTags";
import { filter } from "@/utils/tree";

interface authStoreState {
  id: number;
  username: string;
  avatar: string;
  dynamicRoutes: RouteRecordRaw[];
}

export const authStore = defineStore("auth", {
  state: (): authStoreState => ({
    // 用户id
    id: 0,
    // 用户昵称
    username: "",
    // 用户头像
    avatar: "",
    // 动态路由
    dynamicRoutes: [],
  }),
  getters: {
    getDynamicMenu(): RouteRecordRaw[] {
      return filter(this.dynamicRoutes, route => {
        return !route.meta?.hideMenu;
      });
    },
  },
  actions: {
    /**
     * @description: 登录
     * @param {LoginParams} loginParams
     * @return {*}
     */
    async login(loginParams: LoginParams): Promise<string | unknown> {
      try {
        const { data } = await login(loginParams);
        setToken(data.token);
        await this.getLoginUserInfo();
        return data.token;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * @description: 获取用户信息
     * @return {*}
     */
    async getLoginUserInfo(): Promise<UserInfo | unknown> {
      try {
        const { data } = await getLoginUserInfo();
        const { userId, username, avatar } = data;
        this.id = userId;
        this.username = username;
        this.avatar = avatar;
        if (isDynamicAddedRoute) {
          await this.getMenuList();
        }
        return data;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * @description: 获取菜单
     * @return {*}
     */
    async getMenuList(): Promise<RouteRecordRaw[] | unknown> {
      try {
        const { data } = await getMenuList();
        // 重置动态路由
        resetRouter();
        const routeList = menuToRoute(data);
        // console.log("addRoute", router);
        routeList.forEach((route: any) => {
          router.addRoute(route as RouteRecordRaw);
        });
        this.dynamicRoutes = routeList;
        return routeList;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * @description: 前端登出
     */
    async webLogout() {
      this.$reset();
      removeToken();
      resetRouter();
      const { resetState } = useMultiTagsStore();
      resetState();
    },
  },
});

export function useAuthStore() {
  return authStore(store);
}
