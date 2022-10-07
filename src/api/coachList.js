import request from "@/utils/request";

//黑名单会员Api

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
  
  
}