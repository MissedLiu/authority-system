import http from '@/utils/request'
export default{
    /**
     * 查询所有列表
     * @param  params 
     * @returns 
     */
    async getptProlist(params){
        return await http.get("/api/ptProject/list",params)
    },
        /**
     * 删除列表
     * @returns 
     */
         async deleteById(params) {
            return await http.delete("/api/ptProject/delete", params);
            },
   
        /**
     * 新增私教项目
     */
    async addptPro(params){
        return await http.post("/api/ptProject/add",params)
    },
     /**
     * 编辑套餐
     */
    async updateptPro(params){
        return await http.put("/api/ptProject/update",params)
    },
}