import request from "@/utils/request";

export default {
  //查询客服列表
  async selectEmpList(params) {
    return await request.get("/api/message/empList", params);
  },
    //查询会员列表
    async findMemberByState() {
        return await request.get("/api/message/findMemberByState");
    },
        //分配会员
        async allocationMember(params) {
            return await request.post("/api/message/allocationMember",params);
        },
            //查询潜在用户列表
    async findProspectByProspectIs() {
      return await request.get("api/message/findProspectByProspectIs");
  },
          //分配潜在用户
          async allocationProspect(params) {
            return await request.post("/api/message/allocationProspect",params);
        },
 
};
