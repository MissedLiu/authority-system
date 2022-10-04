import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
//定义token过期时间的key
const timeKey= "expireTime";


// 获取token
export function getToken() {
  return Cookies.get(TokenKey)
}
//设置token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
//删除token
export function removeToken() {
  return Cookies.remove(TokenKey)
}
/**
* 清空sessionStorage
*/
export function clearStorage(){
  return sessionStorage.clear();
  }

  /**
   * 设置token过期时间
   */
  export function setTokenTime(time){
    return sessionStorage.setItem(timeKey,time)
  }
    /**
   * 获取token过期时间
   */
     export function getTokenTime(time){
      return sessionStorage.getItem(timeKey)
    }
   /**
   * 清空token过期时间
   */
    export function removeTokenTime(time){
      return sessionStorage.setItem(timeKey,0)
    }
  