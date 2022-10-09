import http from '@/utils/request'
export default{
    //查询学员
    async findAll(params){
        return await http.get("/api/XueYuan/xueyuanlist",params);
    },
       //添加体检记录单
       async addTiJian(params){
        return await http.post("/api/XueYuan/addTiJian",params);
    },
         //检查是否添加体检记录单
         async checkMemberId(params){
            return await http.getRestApi("/api/XueYuan/checkMemberId",params);
        }
    
}