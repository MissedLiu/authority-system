import request from "@/utils/request";

export default {
  /***********************************会员接口***************************************************/
  /**
   * 查询会员列表ok
   * @returns
   */
  async getMemberList(params) {
    return await request.get("/api/member/listAll", params);
  },
  /**
   * 通过电话查询会员ok
   * @returns
   */
  async getFindMemberByPhone(params) {
    return await request.get("/api/member/findMemberByMemberPhone", params);
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
    return await request.put("/api/member/updataMemberByMemberPhone", params);
  },
    /**
   * 根据会员id加入黑名单
   * @returns
   */
     async updMemberState(params) {
      return await request.put("/api/member/updMemberState", params);
    },
};
