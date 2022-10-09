import request from "@/utils/request";

//普通会员Api

export default {
      /**
   * 会员列表
   * @returns
   */
  async getFindCommentMemberList(params) {
    return await request.get("/api/commonMember/commentListAll", params);
  },
 /**
   * 新增普通会员
   * @returns
   */
  async getAddCommonMember(params) {
    return await request.post("/api/commonMember/addCommonMember", params);
  },
      /**
   * 删除普通会员办理套餐表数据
   * @returns
   */
  async delCommonMemberById(params) {
    return await request.delete("/api/commonMember/delCommonMemberById", params);
  },
  
   /**
   * 续费
   * @returns
   */
    async renewCommonMember(params) {
      return await request.put("/api/commonMember/renew", params);
    },
/**************************/
  /**
   * 查询未禁用的普通套餐列表
   * @returns
   */
   async getCommenMealList(params) {
    return await request.get("api/commonMember/findCommonMealListByCmis", params);
  },
  /**
   * 通过普通套餐id查详情
   * @returns
   */
  async getFindCommenMeal(params) {
    return await request.getRestApi("api/commonMember/findCommenMealByCmId",params);
  },   
}