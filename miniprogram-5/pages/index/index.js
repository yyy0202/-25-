Page({
  /**
   * 页面的初始数据：关卡预览图列表
   */
  data: {
    levels: ['level01.png', 'level02.png', 'level03.png', 'level04.png']
  },

  /**
   * 选关点击事件：跳转至游戏页并携带关卡索引
   */
  chooseLevel: function (e) {
    // 获取点击的关卡索引（0-3对应第1-4关）
    let level = e.currentTarget.dataset.level
    // 跳转到游戏页
    wx.navigateTo({
      url: '../game/game?level=' + level
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})