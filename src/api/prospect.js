import request from "@/utils/request";

export default {
  //查询潜在用户列表
  async findProspect(params) {
    return await request.get("api/prospect/findProspect", params);
  },
    //新增潜在用户
    async addProspect(params) {
        return await request.post("api/prospect/addProspect", params);
      },
        //删除潜在用户
  async deleteProspect(params) {
    return await request.delete("api/prospect/deleteProspect", params);
  },
    //修改潜在用户
    async updProspect(params) {
        return await request.put("api/prospect/updProspect", params);
      },

};
