import http from '@/utils/request'
export default {
  /**
   * 获取角色列表信息
   * @param {*} params
   * @returns
   */
  async getStoreList(params) {
    return await http.get("/api/store/list",params);
  },
  async deleteStore(params) {
    return await http.delete("/api/store/delete",params);
  },
  async toOutStock(params){
    return await http.post("/api/store/toOutStock",params)
  }
}