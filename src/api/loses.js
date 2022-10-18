import request from "@/utils/request";

export default {
  //查询数据
  async selectLose(params) {
    return await request.get("/api/lose/selectlose", params);
  },
  //新增数据
  async addLose(params) {
    return await request.post("/api/lose/addlose", params);
  },
  //领取
  async updateLoseState(params) {
    return await request.post("/api/lose/updateLoseState", params);
  },
  //删除
  async deleteLose(params) {
    return await request.delete("/api/lose/deleteLose", params);
  },
};
