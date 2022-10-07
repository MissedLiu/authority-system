import http from '@/utils/request'
export default{
    /**
     * 查询所有列表
     * @param  params 
     * @returns 
     */
    async getCommissionlist(params){
        return await http.get("/api/commission/list",params)
    },
    async getSales(params){
        return await http.get("/api/sales/getSales",params) 
    },
    async toCommisson(params){
        return await http.post("/api/commission/updateCommission",params)
    },
    async getSpList(params){
        return await http.get("/api/salesArticle/saList",params) 
    },
    async updateSpComm(params){
        return await http.post("/api/commission/updateSpComm",params)
    }
}