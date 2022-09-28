import http from '@/utils/request'
export default{
    /**
     * 查询采购计划
     * @param  params 
     * @returns 
     */
    async getInStockList(params){
        return await http.get("/api/stockIn/list",params)
    },
    async deleteInStock(params){
        return await http.delete("/api/stockIn/delete",params)
    }
}