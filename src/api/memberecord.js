import request from "@/utils/request";

export default {
  //查询回访会员记录列表
  async findMemberByEmpId(params) {
    return await request.get("/api/callBackMember/selectCallBackList", params);
  },

};
