import http from "@/utils/request";
export default {
  //查询学员
  async findAll(params) {
    return await http.get("/api/XueYuan/xueyuanlist", params);
  },
  //添加体检记录单
  async addTiJian(params) {
    return await http.post("/api/XueYuan/addTiJian", params);
  },
  //检查是否添加体检记录单
  async checkMemberId(params) {
    return await http.getRestApi("/api/XueYuan/checkMemberId", params);
  },
  /**
   * 统计教练下的人数
   */
  async findNumJiaoLian() {
    return await http.getRestApi("/api/XueYuan/findNumJiaoLian");
  },
  /**
   * 统计各个教练个个套餐的人数
   */
  async CountTongJi() {
    return await http.getRestApi("/api/XueYuan/CountTongJi");
  },
  /**
   * 统计各个教练下的总人数
   */
   async findJiaoXueCount() {
    return await http.getRestApi("/api/XueYuan/findJiaoXueCount");
  },
    /**
   *查询私教套餐信息
   */
     async findMealPt(params) {
      return await http.get("/api/XueYuan/findMealPt",params);
    },
      /**
   *查询团操套餐信息
   */
   async findMealTm(params) {
    return await http.get("/api/XueYuan/findMealTm",params);
  },
};
