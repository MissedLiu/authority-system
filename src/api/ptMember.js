import request from "@/utils/request";

//私教会员Api

export default {
    /**
   * 会员列表
   * @returns
   */
  async getPtMemberList(params) {
    return await request.get("/api/ptMember/PtMemberList", params);
  },

     /**
   * 添加私教会员
   * @returns
   */
  async getAddPtMember(params) {
    return await request.post("api/ptMember/addPtMember", params);
  },

   /**
   * 删除私教会员
   * @returns
   */
    async getdelPtMealById(params) {
      return await request.delete("/api/ptMember/delPtMealById", params);
    },

       /**
   * 续费
   * @returns
   */
        async renewPtMember(params) {
          return await request.put("/api/ptMember/renew", params);
        },

  /*********************************/
    /**
   * 查询未禁用的私教套餐列表
   * @returns
   */
     async getPtMealList(params) {
      return await request.get("api/ptMember/selectPtMealByPtis", params);
    },
    
      /**
   * 通过选择的私教套餐id查询该套餐下的私教教练列表
   * @returns
   */
  async getPtCoachListByMealId(params) {
    return await request.get("api/ptMember/ptCoachListByPtId", params);
  },
  /**
   * 通过选择的私教套餐id查询该套餐下的私教项目列表
   * @returns
   */
  async getPtProjectByPtId(params) {
    return await request.get("api/ptMember/selectPtProjectByPtId", params);
  },

      /**
   * 通过私教套餐id查详情
   * @returns
   */
       async getselectPtMeal(params) {
        return await request.getRestApi("api/ptMember/selectPtMealByMealId",params);
      },

}