import request from "@/utils/request";

export default {
  //查询潜在用户回访列表
  async findProspectByEmpId(params) {
    return await request.get("/api/allotProspect/findProspectByEmpId", params);
  },
  //新增潜在用户回访记录
  async addCallbackProspect(params) {
    return await request.post("/api/allotProspect/addCallbackProspect", params);
  },
 
};
