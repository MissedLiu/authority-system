import http from '@/utils/request'
export default {
    /**
     * 查询所有列表
     * @param  params 
     * @returns 
     */
    async getInvoicelist(params) {
        return await http.get("/api/invoice/list", params)
    },
    async toSumPrice(params) {
        return await http.getRestApi("/api/invoice/toSumPrice", params)
    },
    async deleteInvoice(params) {
        return await http.delete("/api/invoice/delete", params)
    },

    async getCountPrice() {
        return await http.get("/api/invoice/CountPrice")
    },

    async getCountPriceYear() {
        return await http.get("/api/invoice/CountPriceYear")
    },
}