import http from "@/utils/request";
export default {
  /**
   * 查询需要审批的采购计划
   * @param  params
   * @returns
   */
  async findCaiGouShenHe(params) {
    return await http.get("/api/caiGouShenHe/list", params);
  },
  /**
   * 查询已经审批的采购计划
   * @param  params
   * @returns
   */
  async findCaiGouShenHetrue(params) {
    return await http.get("/api/caiGouShenHe/truelist", params);
  },
  /**
   * 同意事件
   * @param  params
   * @returns
   */
  async agress(params) {
    return await http.post("/api/caiGouShenHe/agree", params);
  },
  /**
   * 驳回事件
   * @param  params
   * @returns
   */
  async refuse(params) {
    return await http.post("/api/caiGouShenHe/refuse", params);
  },
  /**
   * 删除事件
   * @param  params
   * @returns
   */
  async delete(params) {
    return await http.post("/api/caiGouShenHe/delete5", params);
  },
   /**
   * 根据采购id获取采购信息审核进度
   * @param  params
   * @returns
   */
    async fingShengheJiHua(params) {
        return await http.getRestApi("/api/caiGouShenHe/fingShengheJiHua", params);
      },
};
