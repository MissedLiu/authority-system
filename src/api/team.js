import http from '@/utils/request'
export default {
    /**
     * 获取团操信息列表
     * @param  params 
     * @returns 
     */
    async getTeamlist(params) {
        return await http.get("/api/teamMeal/list", params);
    },
    /**
   * 通过id删除套餐
   * @returns 
   */
    async deleteById(params) {
        return await http.delete("/api/teamMeal/delete", params);
    },
    /**
   * 编辑套餐
   */
    async updateTeam(params) {
        return await http.put("/api/teamMeal/update", params);
    },
    /**
     * 新增团操套餐
    */
    async addteam(params) {
        return await http.post("/api/teamMeal/add", params)
    },
     /**
* 查询团操项目列表
* @param params
* @returns
*/
async getAssigntpList(params){
    return await http.get("/api/teamMeal/listTeamProList",params);
    },
    /**
    * 获取分配团操项目列表数据
    * @param params
    * @returns
    */
    async gettpIdByTeamId(params){
    return await http.getRestApi("/api/teamMeal/getTeamProIdByPtId",params);
    },
            /**
* 分配团操项目
*/
async assigntpProjectSave(params){
    return await http.post("/api/teamMeal/saveTeamProject",params)
    },

}