import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/public/admin_login.info',
    method: 'post',
    data
  })
}
export function getInfo() {
  return request({
    url: '/user/user_info.info',
    method: 'post'
  })
}
// 退出
export function logout() {
  return request({
    url: '/admin/logout.info',
    method: 'post'
  })
}
// 上下分订单列表
export function getcashlist(params) {
  return request({
    url: '/admin/cash_list.info',
    method: 'post',
    params
  })
}

// 同意/拒绝上下分
export function updatecash(params) {
  return request({
    url: '/admin/update_cash.info',
    method: 'post',
    params
  })
}

// 支付方式
export function getPayClass() {
  return request({
    url: '/admin/pay_class.info',
    method: 'post',
  })
}

// 投注列表
export function getbetlist(params) {
  return request({
    url: '/admin/bet_list.info',
    method: 'post',
    params
  })
}

// 账变记录
export function getamountlist(params) {
  return request({
    url: '/admin/amount_list.info',
    method: 'post',
    params
  })
}

// 活动列表
export function getactivelist() {
  return request({
    url: '/admin/active_list.info',
    method: 'post',
  })
}

// 新增活动
export function addactive(params) {
  return request({
    url: '/admin/add_active.info',
    method: 'post',
    params
  })
}

// 公告通知列表
export function getnoticelist(params) {
  return request({
    url: '/admin/list_show.info',
    method: 'post',
    params
  })
}

// 新增公告通知
export function addnotice(params) {
  return request({
    url: '/admin/add_show.info',
    method: 'post',
    params
  })
}

// 期号列表
export function getissuelist(params) {
  return request({
    url: '/admin/issue_list.info',
    method: 'post',
    params
  })
}

// 修改开奖结果
export function updateresult(params) {
  return request({
    url: '/admin/update_result.info',
    method: 'post',
    params
  })
}

// 用户信息
export function getuserlist(params) {
  return request({
    url: '/admin/user_list.info',
    method: 'post',
    params
  })
}

// 修改用户信息
export function updateuser(params) {
  return request({
    url: '/admin/update_user.info',
    method: 'post',
    params
  })
}

// 调整用户额度
export function changeamount(params) {
  return request({
    url: '/admin/cash_order.info',
    method: 'post',
    params
  })
}

// 用户等级列表
export function getlevellist() {
  return request({
    url: '/admin/level_list.info',
    method: 'post',
  })
}

// 修改用户等级列表
export function editlevel(params) {
  return request({
    url: '/admin/edit_level.info',
    method: 'post',
    params
  })
}

// 新增用户等级列表
export function addlevel(params) {
  return request({
    url: '/admin/add_level.info',
    method: 'post',
    params
  })
}

// 现金报表
export function getcashreport(params) {
  return request({
    url: '/admin/cash_report.info',
    method: 'post',
    params
  })
}

// 支付配置列表
export function getpayconf(params) {
  return request({
    url: '/admin/pay_conf.info',
    method: 'post',
    params
  })
}

// 修改支付配置列表
export function editpayconf(params) {
  return request({
    url: '/admin/update_pay.info',
    method: 'post',
    params
  })
}

// 新增支付配置列表
export function addpayconf(params) {
  return request({
    url: '/admin/add_pay.info',
    method: 'post',
    params
  })
}

// 用户投注报表
export function betreport(params) {
  return request({
    url: '/admin/bet_report.info',
    method: 'post',
    params
  })
}

// 游戏大厅投注配置
export function betconf(params) {
  return request({
    url: '/admin/bet_conf.info',
    method: 'post',
    params
  })
}

// 修改赔率
export function updaterate(params) {
  return request({
    url: '/admin/update_bet.info',
    method: 'post',
    params
  })
}

// 删除用户缓存
export function delcache() {
  return request({
    url: '/admin/del_cache.info',
    method: 'post',
  })
}

// 首页所有数据  
export function getalldata() {
  return request({
    url: '/admin/home.info',
    method: 'post',
  })
}

// 下载账变记录
export function downloadamount(params){
  return request({
    url:'/admin/download_amount.info',
    method:'post',
    params
  })
} 

// 下载投注记录
export function downloadbet(params){
  return request({
    url:'/admin/download_bet.info',
    method:'post',
    params
  })
} 

// 下载存出款记录
export function downloadcash(params){
  return request({
    url:'/admin/download_cash.info',
    method:'post',
    params
  })
} 

// 添加用户
export function adduser(params){
  return request({
    url:'/admin/add_user.info',
    method:'post',
    params
  })
}

// 用户等级列表
export function levellist(){
  return request({
    url:'/admin/level_list.info',
    method:'post'
  })
}

// 获取游戏编码
export function lobbylist(){
  return request({
    url:'/public/game_list.info',
    method:'post'
  })
}

// 用户曲线图
export function getUserGraphs(params){
  return request({
    url:"/admin/user_graphs.info",
    method:"post",
    params
  })
}

//修改活动
export function editActive(params){
  return request({
    url:"/admin/active_edit.info",
    method:"post",
    params
  })
}

// 修改公告
export function editNotice(params){
  return request({
    url:"/admin/edit_show.info",
    method:"post",
    params
  })
}

// 获取游戏大厅列表
export function getGameLobby(params){
  return request({
    url:"/admin/game_lobby.info",
    method:"post",
    params
  })
}
// 修改游戏大厅配置
export function updateLobby(params){
  return request({
    url:"/admin/update_lobby.info",
    method:"post",
    params
  })
}

// 获取代理列表
export function getAgentList(params){
  return request({
    url:"/admin/agent_low_list.info",
    method:"post",
    params
  })
}

// 手工存款配置列表
export function getHandConf(params){
  return request({
    url:"/admin/hand_conf.info",
    method:"post",
    params
  })
}

// 银行列表
export function getBankList(){
  return request({
    url:"/admin/bank_list.info",
    method:"post"
  })
}

//修改银行
export function editBankList(params){
  return request({
    url:"/admin/hand_update.info",
    method:"post",
    params
  })
}

// 新增支付 
export function addBankList(params){
  return request({
    url:"/admin/hand_add.info",
    method:"post",
    params
  })
}