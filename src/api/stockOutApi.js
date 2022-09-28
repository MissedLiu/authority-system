import http from '@/utils/request'
export default{
    /**
     * 查询采购计划
     * @param  params 
     * @returns 
     */
    async getStockOutList(params){
        return await http.get("/api/stockOut/list",params)
    },
    async deleteStockOut(params){
        return await http.delete("/api/stockOut/delete",params)
    }
}