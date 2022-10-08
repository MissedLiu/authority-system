import request from "@/utils/request";

export default {
  /**
   * 查询教练列表
   * @returns
   */
  async findCoachList(params) {
    return await request.get("/api/coach/findCoachList", params);
  },
  /**
   * 修改教练
   * @returns
   */
  async updateEmp(params) {
    return await request.put("/api/coach/updateEmp", params);
  },

      /**
   * 查询私教套餐教练关系表数据
   * @returns
   */
       async findPtAndEmp(params) {
        return await request.get("/api/coach/findPtAndEmp", params);
      },

    /**
   * 新增私教套餐教练关系表数据
   * @returns
   */
  async addEmpAndPtMeal(params) {
    return await request.post("/api/coach/addEmpAndPtMeal", params);
  },

   /**
   * 查询团操套餐教练关系表数据
   * @returns
   */
    async findTeamAndEmp(params) {
      return await request.get("/api/coach/findTeamAndEmp", params);
    },

  /**
 * 新增团操套餐教练关系表数据
 * @returns
 */
async addEmpAndTeamMeal(params) {
  return await request.post("/api/coach/addEmpAndTeamMeal", params);
},


};
