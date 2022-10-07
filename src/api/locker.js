import request from "@/utils/request";

//储物柜Api

export default {
    /**
   * 查询储物柜
   * @returns
   */
         async getlockerList(params) {
            return await request.get("/api/locker/lockerList", params);
          },
    /*
    *
    *新增储物柜
    * 
    */
    async addLocker(params){
        return await request.post("/api/locker/addLocker",params)
    },
        /*
    *
    *删除储物柜
    * 
    */
    async deleteLocker(params){
        return await request.delete("/api/locker/deleteLocker",params)
    },
            /*
    *
    *修改储物柜
    * 
    */
    async updateLocker(params){
        return await request.put("/api/locker/updateLocker",params)
    },
            /*
    *
    *储物柜添加会员
    * 
    */
    async addLockerByMemberId(params){
        return await request.post("/api/locker/addLockerByMemberId",params)
    },
            /*
    *
    *储物柜移除会员
    * 
    */
    async deleteLockerByMemberId(params){
        return await request.delete("/api/locker/deleteLockerByMemberId",params)
    }
   
}