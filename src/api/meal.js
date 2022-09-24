import request from "@/utils/request";

export default {
  /**
   * 查询未禁用的普通套餐列表
   * @returns
   */
  async getCommenMealList(params) {
    return await request.get("api/CommonMeal/selectCommonMealByCmis", params);
  },
  /**
   * 通过套餐id查详情
   * @returns
   */
  async getselectCommenMeal(params) {
    return await request.getRestApi("api/CommonMeal/selectCommonMealByMealId",params);
  },
};
