import http from '@/utils/request'
export default{
    async getPoList(params){
        return await http.get("/api/po/list",params)
    },
    async toStock(params){
        return await http.post("/api/po/toStock",params)
    },
    async deletePo(params){
        return await http.delete("/api/po/delete",params)
    },
    async getChangeNum(){
        return await http.get("/api/changeNum/list")
    },
    //获取入库的物品
    async getNotExecuted(params){
        return await http.get("/api/po/getNotExecuted",params)
    }
}