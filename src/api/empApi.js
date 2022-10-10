import http from "@/utils/request";
export default {
  /**
   * 查询员工信息列表
   */
  async getEmpList(params) {
    return await http.get("/api/emp/list", params);
  },
  /**
   * 查询员工信息列表2
   */
  async getEmpList2(params) {
    return await http.get("/api/emp/list2", params);
  },
  /**
   * 添加用户
   */
  async addEmp(params) {
    return await http.post("/api/emp/add", params);
  },
  /**
   * 修改用户
   */
  async update(params) {
    return await http.put("/api/emp/update", params);
  },
  /**
   * 删除用户
   */
  async deleteById(params) {
    return await http.delete("/api/emp/delete", params);
  },
  /**
   * 查询所有账户信息
   */
  async getUserAll(params) {
    return await http.get("/api/emp/UserAll", params);
  },
  /**
   * 根据账户id查询详情角色信息
   * @param {id} params
   * @returns
   */
  async getUserRoleAll(params) {
    return await http.getRestApi("/api/emp/UserAndRole", params);
  },
  /**
   * 选择事件 ,分配账号
   */
  async updateUserEmp(params) {
    return await http.getRestApi("/api/emp/updateUser", params);
  },
  /**
   * 解绑账号与员工关系
   */
  async deleteUserAndEmp(params) {
    return await http.getRestApi("/api/emp/updateUserAndemp", params);
  },
  /**
   * 分页查询账户信息
   */
  async getUserAllPage(params) {
    return await http.get("/api/emp/userPageAll", params);
  }
  /**
   * 统计每个部门的人数
   */,
  async CountEmpNum() {
    return await http.get("/api/emp/CountEmpNum");
  },
};
