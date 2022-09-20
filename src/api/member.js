import request from '@/utils/request';
export default {
    /**
    * 查询会员列表
    * @returns
    */
    async getMemberList() {
        return await request.get("/api/member/listAll");
    }
}
