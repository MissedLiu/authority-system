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
    },

    //获取未执行的计划
    async getNotExecuted(params){
        return await http.get("/api/plan/getNotExecuted",params)
    },
    //查询所属部门为财务部的所有员工
    async findcaiwuEmp(){
        return await http.get("/api/plan/findCaiWuEmp")
    },
    /**
     * 保存审核分配
     */
    async addCaiGouSh(params){
        return await http.post("/api/plan/addCaiGouShenHe",params)
    },
    /**
     * 检查该计划是否发起审核了
     */
     async checkCaiGou(params){
        return await http.getRestApi("/api/plan/checkShenqing",params)
    },
    /**
     * 
     * 判断编辑按钮是否可用
     */
     async checkJihua(params){
        return await http.getRestApi("/api/plan/checkJihua",params)
    },
     /**
     * 
     * 撤销申请
     */
      async chexiao(params){
        return await http.getRestApi("/api/plan/chexiao",params)
    },
}
