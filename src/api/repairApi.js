import http from '@/utils/request'
export default{
    async getRepairList(params){
        return await http.get("/api/repair/list",params)
    },
    async getRepairListByEmpId(params){
        return await http.get("/api/repair/listByEmpId",params)
    },
    //修理成功
    async toEm(params){
        return await http.post("/api/repair/toEm",params)
    },
    //修理失败
    async shibai(params){
        return await http.post("/api/repair/shibai",params)
    },
    async deleteRepair(params){
        return await http.delete("/api/repair/delete",params)
    },
    async addRepair(params){
        return await http.post("/api/repair/add",params)
    },
    /**
     * 查找所有的维修工
     * @param {*} params 
     * @returns 
     */
    async findWeiXiu(){
        return await http.get("/api/repair/weixiug")
    },
    /**
     * 保存分配的维修工
     */
     async saveWeiXiuName(params){
        return await http.post("/api/repair/saveWeiXiuName",params)
    },
}