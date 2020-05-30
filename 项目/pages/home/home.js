// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hg:0,
    position : 'back',
    src : '',
    token:'',
    faceinfo:'',
    map:{
      gender:{
        male:'男',
        female:'女'
      },
      expression:{
        none:'不笑',
        smile:'微笑',
        laugh:'大笑'
      },
      glasses:{
        none:'无眼镜',
        common:'普通眼镜',
        sun:'墨镜'
      },
      emotion:{
        angry:'愤怒',
        disgust:'厌恶',
        fear:'恐惧',
        happy:'高兴',
        sad:'伤心',
        surprise:'惊讶',
        neutral:'无表情',
        pouty: '撅嘴',
        grimace:'鬼脸'
      }
    },
    
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     const sysinfo = wx.getSystemInfoSync()
     this.setData({
       hg: sysinfo.screenHeight
     })

  },
  //切换摄像头
  reverse(){
    this.setData({
      position: this.data.position === 'back' ? 'front' : 'back' 
    })
  },

  //点击拍照
  takePhoto(){
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        
        this.setData({
          src: res.tempImagePath
        },()=>{
          this.getFaceInfo()
        })
      }
    })
  },
  //选择照片
  choosePhoto(){
    wx.chooseImage({
      count:1,
      sizeType: ['original'],
      sourceType:['album'],
      success:(res)=>{
        console.log(res)
        if(res.errMsg === 'chooseImage:ok' && res.tempFilePaths.length !==0){
          this.setData({
            src :res.tempFilePaths[0]
          },()=>{
            this.getFaceInfo()
          })
        }
      }
    })
  },

  //重新拍照
  reChoose(){
    this.setData({
      src: '',
      faceinfo:'',
      token:''
    })
  },

  //获取颜值数据
  getFaceInfo(){
    //拿token
    wx.request({
      method:'POST',
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=Bu6smkIt2NFdo5hNiHF13RRr&client_secret=RziMXOrGVmtLI26f5tH0CD7Zwt1yhgOf',
      success:(res) => {
        
        //为token赋值
        this.setData({
          token : res.data.access_token
        },() => {
          //处理需要的参数
          this.processParams()
        })
      }
    })
  },
  //处理参数
processParams(){
  const params = {
    image:'',
    image_type:'BASE64',
    face_field:'age,gender,beauty,expression,glasses,emotion'
  }
  //转换图片格式为base64
  const fileManager = wx.getFileSystemManager()
  fileManager.readFile({
    filePath: this.data.src,
    encoding:'base64',
    success:(res) =>{
      params.image = res.data
      console.log(params)
      
      
      this.testFace(params)
    }
  })
},  
//发送请求，检测颜值数据
testFace(params){
  wx.showLoading({
    title: '颜值检测中...',
  })
  wx.request({
    method:'POST',
    url: 'https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token='+this.data.token,
    Header: {
      'Content-Type' : 'application/json'
    },
    data :params,
    success : (res) => {
      
      if(res.errMsg === 'request:ok'&&res.data.result !== null &&
      res.data.result.face_num !==0){
        this.setData({
          faceinfo:res.data.result.face_list[0]
        })
      }
    },
    complete:() => {
      wx.hideLoading()
    } 
  })
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})