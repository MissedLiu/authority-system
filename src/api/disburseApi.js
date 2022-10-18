import http from '@/utils/request'
export default {
    
    async getDisburseList(params) {
        return await http.get("/api/disburse/list", params)
    },
    async deleteDisburse(params) {
        return await http.delete("/api/disburse/delete", params)
    },

    async getCountPrice() {
        return await http.get("/api/disburse/CountPrice")
    },

    async getCountPriceYear() {
        return await http.get("/api/disburse/CountPriceYear")
    },


}