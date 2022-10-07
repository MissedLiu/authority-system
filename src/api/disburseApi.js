import http from '@/utils/request'
export default{
    /**
     * 查询采购计划
     * @param  params 
     * @returns 
     */
    async getDisburseList(params){
        return await http.get("/api/disburse/list",params)
    },
    async deleteDisburse(params){
        return await http.delete("/api/disburse/delete",params)
    }
}