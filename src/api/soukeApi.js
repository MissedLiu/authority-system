import http from '@/utils/request'
export default{

        /**
     * 根据教练id查询私教套餐
     * @param  params 
     * @returns 
     */
         async findTeamIdByCoachId(params){
            return await http.get("/api/souke/findTeamIdByCoachId",params)
        },
}