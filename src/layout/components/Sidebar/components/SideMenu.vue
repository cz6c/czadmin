<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      router
      unique-opened
      mode="vertical"
      :default-active="getActiveRoutePath"
      :collapse-transition="false"
      :class="{ on: layoutStore.getIsCollapse }"
      :collapse="layoutStore.getIsCollapse"
      @select="handleSelect"
    >
      <template v-for="item in authStore.getDynamicMenu" :key="item.path">
        <template v-if="isSubmenu(item)">
          <el-sub-menu :index="item.path">
            <template #title>
              <SvgIcon v-if="item.meta?.icon" :name="item.meta?.icon" size="18" />
              <span class="menu-text">{{ item.meta?.title }}</span>
            </template>
            <template v-for="childItem in item.children" :key="childItem.path">
              <template v-if="isSubmenu(childItem)">
                <el-sub-menu :index="childItem.path">
                  <template #title>
                    <span class="menu-text">{{ childItem.meta?.title }}</span>
                  </template>
                  <el-menu-item v-for="it in childItem.children" :key="it.path" :index="it.path">
                    <span class="menu-text">{{ it.meta?.title }}</span>
                  </el-menu-item>
                </el-sub-menu>
              </template>
              <template v-else>
                <el-menu-item :index="childItem.path">
                  <span class="menu-text">{{ childItem.meta?.title }}</span>
                </el-menu-item>
              </template>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.path">
            <SvgIcon v-if="item.meta?.icon" :name="item.meta?.icon" size="18" />
            <span class="menu-text">{{ item.meta?.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts" name="SideMenu">
import { useRoute, RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/store/modules/auth";
import { computed } from "vue";
import { useLayoutStore } from "@/store/modules/layout";

const layoutStore = useLayoutStore();
const authStore = useAuthStore();
const route = useRoute();

const getActiveRoutePath = computed((): string => {
  let path = route.path;
  if (route.meta && route.meta.activeMenu) {
    path = route.meta.activeMenu as string;
  }
  return path;
});

/**
 * @description: ?????????????????????????????????????????????
 * @param {*} item ??????
 * @return {*} boolean
 */
function isSubmenu(item: RouteRecordRaw): boolean {
  const childItem = item.children || [];
  const showItemList = childItem.filter(({ meta }) => !meta?.hidden);
  return showItemList.length > 0;
}
/**
 * @description: ???????????????
 * @param {*} path ??????????????????
 */
function handleSelect(path: string) {
  console.log(path);
}
</script>

<style lang="scss" scoped>
:deep(.scrollbar-wrapper) {
  .on {
    .el-sub-menu__title {
      padding-right: 0;
    }
  }

  .menu-text {
    margin-left: 8px;
  }
}
</style>
