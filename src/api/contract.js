import request from "@/utils/request";

export default {
  //分页查询合同列表
  async findCompactList(params) {
    return await request.get("/api/compact/findCompactList", params);
  },
  ////查询会员下办了套餐却没有签订合同的套餐
  async findMemberMeal(params){
    return await request.get("/api/compact/findMemberMeal", params);
  },
  //新增记录
  async addCompact(params){
    return await request.post("/api/compact/addCompact",params);
  }


}
