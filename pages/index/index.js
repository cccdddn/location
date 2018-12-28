//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    location1:{
      latitude:0,
      longitude:0
    },
    location2: {
      latitude: 0,
      longitude: 0
    },
    flag1:false,
    flag2:false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  chooseLocation:function(e){
    let obj = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res);
        obj.setData({
          location1:{
            latitude:res.latitude.toFixed(4),
            longitude: res.longitude.toFixed(4),
          },
          flag1:true
        })
      },
    })
  },
  getLocation: function(e){
    let obj = this;
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: function(res) {
        console.log(res);
        obj.setData({
          location2: {
            latitude: res.latitude.toFixed(4),
            longitude: res.longitude.toFixed(4),
          },
          flag2: true
        })
      },
    })
  },
  calculate:function(e){
    //这个通过经纬度计算距离的公式是我从网上找的，精确度存疑
    var radLat1 = this.Rad(this.data['location2']['latitude']);
    var radLat2 = this.Rad(this.data['location1']['latitude']);
    var a = radLat1 - radLat2;
    var b = this.Rad(this.data['location2']['longitude']) - this.Rad(this.data['location2']['longitude']);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    // s = s * 6378.137; // 赤道半径;
    s = s * 6371.004; //平均半径
    s = Math.round(s * 10000) / 10000; //输出为公里
    s = s.toFixed(2)
    this.setData({
      motto: s + 'km'
    })
  },
  Rad: function (d) {
    return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
  },
})
