import http from '@/utils/request'
export default{
    /**
     * 查询所有列表
     * @param  params 
     * @returns 
     */
    async gettpProlist(params){
        if(params==null){
         return console.log("无参数")
        }
        return await http.get("/api/tpProject/list",params)
    },
        /**
     * 删除列表
     * @returns 
     */
         async deleteById(params) {
            return await http.delete("/api/tpProject/delete", params);
            },
   
        /**
     * 新增普通套餐
     */
    async addtpPro(params){
        return await http.post("/api/tpProject/add",params)
    },
     /**
     * 编辑套餐
     */
    async updatetpPro(params){
        return await http.put("/api/tpProject/update",params)
    },
}