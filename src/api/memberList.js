import request from "@/utils/request";

export default {
  //查询会员回访列表
  async findMemberByEmpId(params) {
    return await request.get("/api/allotMember/findMemberByEmpId", params);
  },
  //新增会员回访记录
  async addCallbackMember(params) {
    return await request.post("/api/allotMember/addCallbackMember", params);
  },
 
};
