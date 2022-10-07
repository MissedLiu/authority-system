import http from '@/utils/request'
export default{
    async getRepairList(params){
        return await http.get("/api/repair/list",params)
    },
    async toEm(params){
        return await http.post("/api/repair/toEm",params)
    },
    async deleteRepair(params){
        return await http.delete("/api/repair/delete",params)
    },
    async addRepair(params){
        return await http.post("/api/repair/add",params)
    }
}