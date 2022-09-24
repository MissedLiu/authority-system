import request from "@/utils/request";

export default {
  /**
   * 查询会员列表
   * @returns
   */
  async getMemberList(params) {
    return await request.get("/api/member/listAll", params);
  },
  /**
   * 通过电话查询会员
   * @returns
   */
  async getSelectMemberByPhone(params) {
    return await request.get("/api/member/selectMemberByPhone", params);
  },

  /**
   * 查询普通会员列表
   * @returns
   */
  async getPtMemberList(params) {
    return await request.get("/api/member/ptListAll", params);
  },

  /**
   * 通过电话和类型查会员
   * @returns
   */
  async getMemberByPhoneAndvMealtype(params) {
    return await request.get("/api/member/findMemberByPhone", params);
  },

  /**
   * 新增普通会员
   * @returns
   */
  async getAddPtMember(params) {
    return await request.post("/api/member/addPtMember", params);
  },
  /**
   * 删除普通会员办理套餐表数据
   * @returns
   */
  async delMemberMealById(params) {
    return await request.delete("/api/member/delMemberMealById", params);
  },
};
