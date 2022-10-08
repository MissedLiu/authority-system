import request from "@/utils/request";

//黑名单会员Api

export default {
        /**
   * 根据会员id加入黑名单
   * @returns
   */
         async updMemberState(params) {
            return await request.put("/api/member/goUpdMemberState", params);
          },
    /*
    *
    *查询黑名单列表
    * 
    */
    async blackMemberList(params){
        return await request.get("/api/black/blackMemberList",params)
    },
        /*
    *
    *移出黑名单
    * 
    */
    async outUpdMemberState(params){
        return await request.put("/api/black/outUpdMemberState",params)
    }
   
}