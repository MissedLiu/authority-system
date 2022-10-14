import http from "@/utils/request";
export default {
  /**
   * 动态分页查询所有
   */
  async findAllSales(params) {
    return await http.get("/api/sales/list", params);
  },
  /**
   * 查询所有列表
   * @param  params
   * @returns
   */
  async getCommonMeallist(params) {
    return await http.get("/api/commonMeal/listState", params);
  },
  /**
   * 添加
   * @param  params
   * @returns
   */
  async addSales(params) {
    return await http.post("/api/sales/addSales", params);
  },
  /**
   * 查询私教套餐
   * @param  params
   * @returns
   */
  async listState(params) {
    return await http.get("/api/ptMeal/listState", params);
  },
  /**
   * 查询私教项目
   * @param  params
   * @returns
   */
  async findPtpName(params) {
    return await http.getRestApi("/api/ptProject/findPtpName", params);
  },
  /**
   * 查询团操套餐
   * @param  params
   * @returns
   */
  async listTeamState(params) {
    return await http.get("/api/teamMeal/listState", params);
  },
  /**
   * 查询团操项目
   * @param  params
   * @returns
   */
  async findTeamName(params) {
    return await http.getRestApi("/api/tpProject/findTeamName", params);
  },
  /**
   * 删除该购买记录
   * @param  params
   * @returns
   */
  async delete(params) {
    return await http.delete("/api/sales/delete", params);
  },
  /**
   * 统计销售人的业绩
   * @param  params
   * @returns
   */
  async findSalesCount() {
    return await http.get("/api/sales/findSalesCount");
  },
};
