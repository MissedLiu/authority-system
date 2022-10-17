import request from "@/utils/request";

export default {
  /**
   * 查询会员列表（分页）
   * @returns
   */
  async getMemberList(params) {
    return await request.get("/api/member/listMemberAll", params);
  },

  
  /**
   * 查询会员列表无分页
   * @returns
   */
  async getlistAllNoPage(params) {
    return await request.get("/api/member/listMemberAllNoPage", params);
  },
  /**
   * 新增会员ok
   * @returns
   */
  async getAddMember(params) {
    return await request.post("/api/member/addMember", params);
  },
  /**
   * 通过会员id删除会员ok
   * @returns
   */
  async delMemberByMemberId(params) {
    return await request.delete("/api/member/delMemberByMemberId", params);
  },
  /**
   * 根据电话修改会员ok
   * @returns
   */
  async updataMemberByMemberPhone(params) {
    return await request.put("/api/member/updMemberByMemberPhone", params);
  },
  /**
   * 统计每个套餐办理的次数
   */
  async findNum() {
    return await request.get("/api/Comsune/findNum");
  },
   /**
   * 查询会员办理的所有套餐
   */
    async listMealByMemberId(params) {
      return await request.get("/api/member/listMealByMemberId",params);
    },
};
