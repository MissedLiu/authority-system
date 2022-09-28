import http from '@/utils/request'
export default {
  /**
   * 获取角色列表信息
   * @param {*} params
   * @returns
   */
  async getRoles(params) {
    return await http.get("/api/role/list", params);
  },
  /**
   * 添加角色信息
   */
  async add(params) {
    return await http.post("/api/role/add", params);
  },
  /**
   * 修改角色信息
   */
  async update(params) {
    return await http.put("/api/role/update", params);
  },
  /**
   * 删除角色信息
   */
  async delete(params) {
    return await http.delete("/api/role/delete", params);
  },
  /**
   * 检查该角色是否分配账号信息
   */
  async check(params) {
    return await http.getRestApi("/api/role/check", params);
  },
  /**
   * 查询权限菜单列表
   */
   async getRolePermisson(params) {
    return await http.get("/api/role/getRolePermisson", params);
  },
    /**
   * 查询权限菜单列表
   */
     async saveRoleAssign(params) {
        return await http.post("/api/role/saveRoleAssign", params);
      },
};