import request from "@/utils/request";

//消费记录Api

export default {
  /**
   * 查询消费记录
   * @returns
   */
  async selectComsuneList(params) {
    return await request.get("/api/Comsune/selectComsuneList", params);
  },
};
