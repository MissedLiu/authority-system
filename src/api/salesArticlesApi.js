import http from '@/utils/request'
export default{
    /**
     * 查询所有并且分页
     * @param {*} params 
     * @returns 
     */
    async findAllList(params){
        return await http.get("/api/salesArticle/list",params);
    },
    /**
     * 添加购买商品信息
     */
    async addSalesArticles(params){
        return await http.post("/api/salesArticle/add",params);
    },
    /**
     * 删除
     * @param {*} params 
     */
    async delete(params){
        return await http.delete("/api/salesArticle/delete",params);
    },
        /**
     * 撤销购买
     * @param {*} params 
     */
         async delete2(params){
            return await http.delete("/api/salesArticle/delete2",params);
        },
    /**
     * 修改
     */
    async update(params){
        return await http.put("/api/salesArticle/update",params);

    }
}