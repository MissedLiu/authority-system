import http from '@/utils/request'
export default{
    async listByEmpId(params){
        return await http.get("/api/healthform/list" ,params);
    },
    async listAllStation(params){
        return await http.get("/api/healthform/listAllStation" ,params);
    },
    async delete(params){
        return await http.delete("/api/XueYuan/delete" ,params);
    },
    //根据id查询数据
    async healthform(params){
        return await http.getRestApi("/api/healthform/healthform" ,params);
    },
}