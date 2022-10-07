import http from '@/utils/request'
export default{
    /**
     * 查询所有活动列表
     * @param  params 
     * @returns 
     */
    async getFlyerlist(params){
        return await http.get("/api/flyer/list",params)
    },
        /**
     * 删除列表
     * @returns 
     */
         async deleteById(params) {
            return await http.delete("/api/flyer/delete", params);
            },
   
        /**
     * 新增普通套餐
     */
    async addFlyer(params){
        return await http.post("/api/flyer/add",params)
    },
     /**
     * 编辑套餐
     */
    async updateFlyer(params){
        return await http.put("/api/flyer/update",params)
    },
}