import http from '@/utils/request'
export default{
    /**
     * 查询采购计划
     * @param  params 
     * @returns 
     */
    async getEmList(params){
        return await http.get("/api/equipment/list",params)
    },
    async deleteEm(params){
        return await http.delete("/api/equipment/delete",params)
    }
 
}