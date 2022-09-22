import http from '@/utils/request'
export default{
    /**
     * 查询部门列表
     * @param  params 
     * @returns 
     */
    async getStoreList(){
        return await http.get("/api/store/list")
    }
}