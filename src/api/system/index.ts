import { createGet } from "@/utils/request";
import { ParamsLoginLogList, ResponseLoginLogList } from "./index.d";

// 获取用户管理列表
export const getUserList = createGet<ParamsLoginLogList, ResponseLoginLogList>("/adminapi/system/getUserList");
// 获取角色管理列表
export const getRoleList = createGet<ParamsLoginLogList, ResponseLoginLogList>("/adminapi/system/getRoleList");
// 获取部门管理列表
export const getDeptList = createGet<ParamsLoginLogList, ResponseLoginLogList>("/adminapi/system/getDeptList");
