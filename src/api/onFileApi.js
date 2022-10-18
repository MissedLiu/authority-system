import http from '@/utils/request'



export default {
    async toFile(params){
        return await http.post("/api/onFile/toFile",params)
    },
    async getOnFile(params){
        return await http.get("/api/onFile/getOnFile",params)
    }
}