import http from '@/utils/request'
export default{
    /**
     * 分页查询账户信息
     */
    async getUserAllPage(params){
        return await http.get("/api/user/userPageAll",params);
    },
     /**
     * 根据账户名查询账户信息是否存在
     */
    async getUserNameAll(params){
        return await http.get("/api/user/checkUser",params)
    },
     /**
    * 添加账户信息
    */
   async add(params){
       return await http.post("/api/user/addUser",params)
   },
    /**
    * 修改账户信息
    */
     async update(params){
        return await http.put("/api/user/update",params)
    },
     /**
    * 检查该账户下是否存在员工
    */
      async checkempByUserId(params){
        return await http.getRestApi("/api/user/checkEmp",params)
    },
     /**
    * 删除账号
    */
      async delete(params){
        return await http.delete("/api/user/delete",params)
    },
     
    /**
    * 查询用户角色列表
    */
    async getAssignRoleList(params){
    return await http.get("/api/user/getRoleListForAssign",params);
    },
    /**
  * 获取分配角色列表数据
  */
  async getRoleIdByUserId(params){
    return await http.getRestApi("/api/user/getRoleByUserId",params);
    },
    /**
* 分配角色
*/
async assignRoleSave(params){
    return await http.post("/api/user/saveUserRole",params)
    },
    /**
     * 判断该账户是否已分配给员工
     */
     async checkEmpName(params){
        return await http.getRestApi("/api/user/checkEmpName",params)
    },
      /**
     * 根据账号id查询员工信息
     */
       async empByUserId(params){
        return await http.getRestApi("/api/user/empByUserId",params)
    },
}
  /**
* 刷新token
* @returns
*/
export async function refreshTokenApi(params){
    return await http.post("/api/sysUser/refreshToken",params);
    }