import http from '@/utils/request'
export default{
    /**
     * 查询采购计划
     * @param  params 
     * @returns 
     */
    async getPlanList(params){
        return await http.get("/api/plan/list",params)
    },

     /**
     * 新增采购计划
     */
      async addPlan(params){
        return await http.post("/api/plan/add",params)
    },
     /**
     * 修改采购计划
     */
      async updatePlan(params){
        return await http.put("/api/plan/update",params)
    },

    //删除采购计划
    async deletePlan(params){
        return await http.delete("/api/plan/delete",params)
    },

    //采购完成，将数据插入已购物品表
    async toPo(params){
        return await http.post("/api/plan/toPo",params)
    }
}
