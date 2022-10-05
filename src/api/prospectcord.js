import request from "@/utils/request";

export default {
  //查询回访潜在用户记录列表
  async findProspectByEmpId(params) {
    return await request.get("/api/callBackProspect/selectCallBackList", params);
  },

};
