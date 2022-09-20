import http from '@/utils/request'

export default{
    /**
     * 查询菜单列表
     */
    async getMenuList(params){
        return await http.get("/api/permission/list",params);
    },
    /**
     * 获取上级菜单列表
     */
    async getParentMenuList(params){
        return await http.get("/api/permission/parent/list",params);
    },
    /**
     * 添加菜单
     */
     async addMenu(params){
        return await http.post("/api/permission/add",params);
    },
    /**
     * 
     * 检查该下菜单是否有子菜单
     */
     async checkPermission(params){
        return await http.getRestApi("/api/permission/check",params);
    },
     /**
    * 删除菜单
    * @returns
    */
      async deleteById(params) {
        return await http.delete("/api/permission/delete", params);
    },
     /**
     * 修改菜单
     * @param  params 
     * @returns 
     */
      async updateMenu(params){
        return await http.put("/api/permission/update",params)
    },
}