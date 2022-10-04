import http from '@/utils/request'
export default{
    /**
     * 查询所有列表
     * @param  params 
     * @returns 
     */
    async getCommonMeallist(params){
        return await http.get("/api/commonMeal/list",params)
    },
        /**
     * 删除列表
     * @returns 
     */
         async deleteById(params) {
            return await http.delete("/api/commonMeal/delete", params);
            },
   
        /**
     * 新增普通套餐
     */
    async addcommon(params){
        return await http.post("/api/commonMeal/add",params)
    },
     /**
     * 编辑套餐
     */
    async updatecommon(params){
        return await http.put("/api/commonMeal/update",params)
    },
}