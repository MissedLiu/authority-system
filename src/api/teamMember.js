import request from "@/utils/request";

//私教会员Api

export default {
  /**
   * 会员列表
   * @returns
   */
  async getTeamMemberList(params) {
    return await request.get("/api/teamMember/teamMemberList", params);
  },

  /**
   * 添加团操会员
   * @returns
   */
  async getAddTeamMember(params) {
    return await request.post("api/teamMember/addTeamMember", params);
  },

  /**
   * 删除团操会员
   * @returns
   */
  async getdelTeamMealById(params) {
    return await request.delete("/api/teamMember/delTeamMealById", params);
  },
     /**
   * 续费
   * @returns
   */
      async renewTeamMember(params) {
        return await request.put("/api/teamMember/renew", params);
      },

  /*********************************/
  /**
   * 查询未禁用的团操套餐列表
   * @returns
   */
  async getTeamMealList(params) {
    return await request.get("api/teamMember/selectTeamMealByTeamis", params);
  },

  /**
   * 通过选择的团操套餐id查询该套餐下的团操教练列表
   * @returns
   */
  async getTeamCoachListByMealId(params) {
    return await request.get("api/teamMember/teamCoachListByTeamId", params);
  },

  /**
   * 通过选择的私教套餐id查询该套餐下的私教项目列表
   * @returns
   */
  async getTeamProjectByPtId(params) {
    return await request.get("api/teamMember/selectTeamProjectByPtId", params);
  },

  /**
   * 通过团操套餐id查详情
   * @returns
   */
  async findTeamByMemberId(params) {
    return await request.getRestApi("api/teamMember/findTeamByMemberId",params);
  },
};
