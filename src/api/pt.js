import http from '@/utils/request'
export default{
    /**
     * 查询所有列表
     * @param  params 
     * @returns 
     */
    async getptMeallist(params){
        return await http.get("/api/ptMeal/list",params)
    },
        /**
     * 删除列表
     * @returns 
     */
         async deleteById(params) {
            return await http.delete("/api/ptMeal/delete", params);
            },
   
        /**
     * 新增普通套餐
     */
    async addpt(params){
        return await http.post("/api/ptMeal/add",params)
    },
     /**
     * 编辑套餐
     */
    async updatept(params){
        return await http.put("/api/ptMeal/update",params)
    },

    /**
* 查询私教项目列表
* @param params
* @returns
*/
async getAssignPtList(params){
    return await http.get("/api/ptMeal/PtProjectList",params);
    },
    /**
    * 获取分配私教项目列表数据
    * @param params
    * @returns
    */
    async getPtpIdByPtId(params){
    return await http.getRestApi("/api/ptMeal/getPtProject",params);
    },
        /**
* 分配私教项目
*/
async assignPtProjectSave(params){
    return await http.post("/api/ptMeal/savePtMealPtProject",params)
    },
    /**
     * 统计私教人数
     */
     async countPtNum(){
        return await http.get("/api/ptMeal/countPtNum")
        },
}