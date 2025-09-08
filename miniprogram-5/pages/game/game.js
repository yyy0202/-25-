// 引入公共地图数据
var data = require('../../utils/data.js')

// 全局变量：地图图层、箱子图层、方格宽度、主角位置（行/列）、画布上下文
var map = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
]
var box = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
]
var w = 40 // 每个方格宽度（px）
var row = 0 // 主角当前行
var col = 0 // 主角当前列
var ctx = null // 画布上下文

Page({
  /**
   * 页面的初始数据：当前关卡（显示用，1-4）
   */
  data: {
    level: 1
  },

  /**
   * 自定义函数：初始化地图数据
   * @param {Number} levelIndex - 关卡索引（0-3）
   */
  initMap: function (levelIndex) {
    // 获取对应关卡的原始地图数据
    let mapData = data.maps[levelIndex]
    // 遍历8*8地图，初始化地图、箱子、主角位置
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        box[i][j] = 0 // 重置箱子图层
        map[i][j] = mapData[i][j] // 初始化地图图层

        // 处理箱子（原始数据4）：分离到箱子图层，地图层改为地板（2）
        if (mapData[i][j] === 4) {
          box[i][j] = 4
          map[i][j] = 2
        }
        // 处理主角（原始数据5）：记录位置，地图层改为地板（2）
        else if (mapData[i][j] === 5) {
          map[i][j] = 2
          row = i
          col = j
        }
      }
    }
  },

  /**
   * 自定义函数：绘制画布（地图、箱子、主角）
   */
  drawCanvas: function () {
    ctx = this.ctx
    // 清空画布（320px*320px）
    ctx.clearRect(0, 0, 320, 320)

    // 遍历绘制地图图层
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        let imgName = 'ice' // 默认地板
        // 围墙（1）：stone.png
        if (map[i][j] === 1) {
          imgName = 'stone'
        }
        // 终点（3）：pig.png
        else if (map[i][j] === 3) {
          imgName = 'pig'
        }
        // 绘制地图方格（j=列→x轴，i=行→y轴）
        ctx.drawImage(`/images/icons/${imgName}.png`, j * w, i * w, w, w)

        // 绘制箱子（箱子图层4）：box.png
        if (box[i][j] === 4) {
          ctx.drawImage('/images/icons/box.png', j * w, i * w, w, w)
        }
      }
    }

    // 绘制主角（最后绘制，避免被覆盖）：bird.png
    ctx.drawImage('/images/icons/bird.png', col * w, row * w, w, w)

    // 渲染画布
    ctx.draw()
  },

  /**
   * 自定义函数：判断游戏是否成功（所有箱子在终点上）
   * @returns {Boolean} 成功返回true，否则false
   */
  isWin: function () {
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        // 存在箱子不在终点上 → 未成功
        if (box[i][j] === 4 && map[i][j] !== 3) {
          return false
        }
      }
    }
    // 所有箱子都在终点上 → 成功
    return true
  },

  /**
   * 自定义函数：游戏成功处理（弹出提示）
   */
  checkWin: function () {
    if (this.isWin()) {
      wx.showModal({
        title: '恭喜',
        content: '游戏成功！',
        showCancel: false,
        confirmText: '确定'
      })
    }
  },

  /**
   * 方向键：上移
   */
  up: function () {
    // 主角不在最顶端（行>0）
    if (row > 0) {
      // 上方不是围墙（1）且没有箱子（4）→ 直接移动
      if (map[row - 1][col] !== 1 && box[row - 1][col] !== 4) {
        row--
      }
      // 上方有箱子 → 检查箱子上方是否可推动
      else if (box[row - 1][col] === 4) {
        // 箱子不在最顶端，且箱子上方不是围墙和箱子
        if (row - 1 > 0 && map[row - 2][col] !== 1 && box[row - 2][col] !== 4) {
          box[row - 2][col] = 4 // 箱子上移
          box[row - 1][col] = 0 // 原箱子位置清空
          row-- // 主角上移
        }
      }
      // 重新绘制画布并检查是否成功
      this.drawCanvas()
      this.checkWin()
    }
  },

  /**
   * 方向键：下移
   */
  down: function () {
    // 主角不在最底端（行<7）
    if (row < 7) {
      // 下方不是围墙且没有箱子 → 直接移动
      if (map[row + 1][col] !== 1 && box[row + 1][col] !== 4) {
        row++
      }
      // 下方有箱子 → 检查箱子下方是否可推动
      else if (box[row + 1][col] === 4) {
        // 箱子不在最底端，且箱子下方不是围墙和箱子
        if (row + 1 < 7 && map[row + 2][col] !== 1 && box[row + 2][col] !== 4) {
          box[row + 2][col] = 4 // 箱子下移
          box[row + 1][col] = 0 // 原箱子位置清空
          row++ // 主角下移
        }
      }
      // 重新绘制画布并检查是否成功
      this.drawCanvas()
      this.checkWin()
    }
  },

  /**
   * 方向键：左移
   */
  left: function () {
    // 主角不在最左侧（列>0）
    if (col > 0) {
      // 左侧不是围墙且没有箱子 → 直接移动
      if (map[row][col - 1] !== 1 && box[row][col - 1] !== 4) {
        col--
      }
      // 左侧有箱子 → 检查箱子左侧是否可推动
      else if (box[row][col - 1] === 4) {
        // 箱子不在最左侧，且箱子左侧不是围墙和箱子
        if (col - 1 > 0 && map[row][col - 2] !== 1 && box[row][col - 2] !== 4) {
          box[row][col - 2] = 4 // 箱子左移
          box[row][col - 1] = 0 // 原箱子位置清空
          col-- // 主角左移
        }
      }
      // 重新绘制画布并检查是否成功
      this.drawCanvas()
      this.checkWin()
    }
  },

  /**
   * 方向键：右移
   */
  right: function () {
    // 主角不在最右侧（列<7）
    if (col < 7) {
      // 右侧不是围墙且没有箱子 → 直接移动
      if (map[row][col + 1] !== 1 && box[row][col + 1] !== 4) {
        col++
      }
      // 右侧有箱子 → 检查箱子右侧是否可推动
      else if (box[row][col + 1] === 4) {
        // 箱子不在最右侧，且箱子右侧不是围墙和箱子
        if (col + 1 < 7 && map[row][col + 2] !== 1 && box[row][col + 2] !== 4) {
          box[row][col + 2] = 4 // 箱子右移
          box[row][col + 1] = 0 // 原箱子位置清空
          col++ // 主角右移
        }
      }
      // 重新绘制画布并检查是否成功
      this.drawCanvas()
      this.checkWin()
    }
  },

  /**
   * 自定义函数：重新开始游戏
   */
  restartGame: function () {
    // 重新初始化当前关卡地图（level-1转为索引0-3）
    this.initMap(this.data.level - 1)
    // 重新绘制画布
    this.drawCanvas()
  },

  /**
   * 生命周期函数--监听页面加载：接收关卡参数并初始化游戏
   */
  onLoad: function (options) {
    // 获取首页传递的关卡索引（0-3），转为显示用关卡号（1-4）
    let levelIndex = parseInt(options.level)
    let showLevel = levelIndex + 1
    // 更新页面关卡标题
    this.setData({
      level: showLevel
    })

    // 创建画布上下文
    this.ctx = wx.createCanvasContext('myCanvas')
    // 初始化地图数据并绘制画布
    this.initMap(levelIndex)
    this.drawCanvas()
  },

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