import http from '@/utils/request'
export default{
    /**
     * 查询采购计划
     * @param  params 
     * @returns 
     */
    async getDetailsList(params){
        return await http.get("/api/details/list",params)
    },
    async addDetails(params){
        return await http.post("/api/details/add",params)
    },
    async updateDetails(params){
        return await http.put("/api/details/update",params)
    },
    async deleteDetails(params){
        return await http.delete("/api/details/delete",params)
    }
 
}