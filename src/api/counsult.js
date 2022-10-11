import request from "@/utils/request";

export default {
  //查询咨询记录列表
  async findMemberConsultList(params) {
    return await request.get("/api/memberConsult/findMemberConsultList", params);
  },
    //新增咨询记录
    async addMmeberConsult(params) {
      return await request.post("/api/memberConsult/addMmeberConsult", params);
    },
    //删除咨询记录
    async deletecounsult(params){
      return await request.delete("/api/memberConsult/deleteCounsult", params)
    }

}
