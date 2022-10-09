import http from "@/utils/request";
import { h } from "vue";
export default {
    /**
     * 新增访谈记录
     * @param {*} params 
     * @returns 
     */
  async addInterview(params) {
    return await http.post("/api/interview/addInterview", params);
  },
  /**
   * 查询所有访谈记录
   * @param {*} params 
   * @returns 
   */
  async listInterview(params) {
    return await http.get("/api/interview/listInterview", params);
  },
    /**
   * 查询所有访谈记录
   * @param {*} params 
   * @returns 
   */
     async delete(params) {
        return await http.getRestApi("/api/interview/delete", params);
      },
};
