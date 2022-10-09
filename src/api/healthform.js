import http from '@/utils/request'
export default{
    async listByEmpId(params){
        return await http.get("/api/healthform/list" ,params);
    },
    async delete(params){
        return await http.delete("/api/XueYuan/delete" ,params);
    },

}