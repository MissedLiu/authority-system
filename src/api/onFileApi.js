import http from '@/utils/request'

//黑名单会员Api

export default {

    async toFile(params){
        return await http.post("/api/onFile/toFile",params)
    }
}