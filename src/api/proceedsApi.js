import http from "@/utils/request";


//消费记录Api

export default {
  /**
   * 查询消费记录
   * @returns
   */
  async selectList(params) {
    return await http.get("/api/proceeds/list", params);
  },
  async getSumPrice(params) {
    return await http.get("api/proceeds/sumPrice", params)
  },
  async delete(params) {
    return await http.delete("/api/proceeds/delete", params)
  },
  async getCountPrice() {
    return await http.get("/api/proceeds/CountPrice")
  },

  async getCountPriceYear() {
    return await http.get("/api/proceeds/CountPriceYear")
  },

};