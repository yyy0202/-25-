// index.js
Page({

  data:{
    src:'/image/IMG_8129.JPG',
    name:'Hello world'
  },
  getMyInfo: function(e){
   wx.getUserProfile({
     desc: '用于展示用户头像和昵称',
     success:(res)=>{
       console.log(res)
       this.setData({
        src:res.userInfo.avatarUrl,
        name:res.userInfo.nickName
      })
     }
   })
  },
})
