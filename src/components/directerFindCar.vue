<template>
 <div class="container">
   <div class="top">
     <div class="start">
       <flexbox :gutter="0">
         <flexbox-item :span="2/8">
           <div class="flex-demo">开始时间 :</div>
         </flexbox-item>
         <flexbox-item :span="1/2">
           <div class="flex-demo time" @click="choseDate">
             {{ startTime | dataformat }}
             <span  class="mui-icon mui-icon-extra mui-icon-extra-calendar"></span>
           </div>
         </flexbox-item>
       </flexbox>
     </div>
     <div class="end">
       <flexbox :gutter="0">
         <flexbox-item :span="2/8">
           <div class="flex-demo">结束时间 :</div>
         </flexbox-item>
         <flexbox-item :span="1/2">
           <div class="flex-demo time" @click="choseEndDate">
             {{ endTime | dataformat }}
             <span  class="mui-icon mui-icon-extra mui-icon-extra-calendar"></span>
           </div>
         </flexbox-item>
         <flexbox-item :span="2/8">
           <div class="flex-demo">
             <mt-button type="primary" size="small" @click="query">查询</mt-button>
           </div>
         </flexbox-item>
       </flexbox>
     </div>

   </div>
   <div class="bottom">
     <transition-group  appear tag="div">
       <div class="show-container" v-for="(item,index) in noPlateList" :key="index" @click.prevent="locatinHref(item)">
       <flexbox class="flex">
         <flexbox-item class="flex-item"  :span="7/12">
           <!---->
             <img class="previewer-demo-img" v-lazy="item.imgUrl"   @click.stop="showImg(index)">
           <!--<div>-->
             <div v-transfer-dom>
               <previewer :list="list" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
             </div>
           <!--</div>-->
           <!---->
         </flexbox-item>
         <flexbox-item class="flex-item" :span="5/12">
           <span>楼层:&nbsp;&nbsp;<p>{{ item.floorName }}</p></span>
           <span>车位:&nbsp;&nbsp;<p>{{ item.carpos }}</p></span>
           <span>类型:&nbsp;&nbsp;<p>{{ item.carTypeMsg }}</p></span>
         </flexbox-item>
       </flexbox>
     </div>
     <!--<show-car v-for="(item,index) in noPlateList" :key="index" :plateList="item" :allPlateList="noPlateList" :plateListIndex="index">hhh</show-car>-->
     </transition-group>
   </div>
   <!---->
   <mt-datetime-picker
     style="position: fixed;bottom: 0px;"
     ref="picker"
     v-model="pickerValue"
     type="datetime"
     @confirm="handleConfirm"
     :startDate="startDate"
     :endDate="startEndDate"
   >
   </mt-datetime-picker>
   <!--endTime-->
   <mt-datetime-picker
     style="position: fixed;bottom: 0px;"
     ref="end"
     v-model="pickerEndValue"
     type="datetime"
     @confirm="handleEndConfirm"
     :startDate="startEndTime"
     :endDate="endDate"
   >
   </mt-datetime-picker>
   <div>
     <div v-show="loadingDiv">
       <loading :show="show1" :text="text"></loading>
     </div>
   </div>

 </div>
</template>

<script>
import { Toast, TransferDom } from 'mint-ui'
export default {
  name: 'directerFindCar',
  directives: {
    TransferDom
  },
  data () {
    return {
      msg: 'jdwnodw',
      dateTime: '',
      startDate: new Date('2010/01/01 00:00:00'), // 日期控件的初始时间
      endDate: new Date('2100/01/01 00:00:00'), // 日期控件的结束时间
      startEndDate: new Date(), // 开始时间的日期控件的结束时间
      minuteListValue: '2017-06-12 09:00',
      pickerValue: new Date(new Date().getTime() - 86400000), // 与开始日期绑定的(默认)值
      pickerEndValue: new Date(), // 与结束日期绑定的(默认)值
      startTime: new Date(new Date().getTime() - 86400000), // 显示的开始(默认当前)时间
      endTime: new Date(), // 显示的结束(默认当前)时间
      startEndTime: new Date('2010/01/01 00:00:00'), // 结束时间控件的起始时间
      queryClick: true, // 是否可以点击
      show1: true, // loading默认隐藏
      loadingDiv: false, //
      text: 'Loading', //
      buildId: 'B0009', // 获取的项目ID
      client_id: '', // 挺简单ID
      list: [{
        msrc: '',
        src: '',
        w: 640,
        h: 576
      }],
      options: {
        getThumbBoundsFn (index) {
          // find thumbnail element
          let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
          // get window scroll Y
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          // optionally get horizontal scroll
          // get position of element relative to viewport
          let rect = thumbnail.getBoundingClientRect()
          // w = width
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
          // Good guide on how to get element coordinates:
          // http://javascript.info/tutorial/coordinates
        }
      },
      noPlateList: [] // 无牌车列表
    }
  },
  created () {
    this.buildId = this.$route.query.park_id
    this.client_id = this.$route.query.client_id
    this.getNoPlateList()
    console.log(new Date(new Date().getTime() - 86400000))
  },
  mounted () {
    this.filterList()
  },
  methods: {
    logIndexChange (arg) {
    },
    filterList () {
      // 过滤无牌车列表数据，形成查看图片的数据
      this.list = []
      this.noPlateList.forEach((val) => {
        let obj = {}
        obj.msrc = val.imgUrl
        obj.src = val.imgUrl
        obj.w = 640
        obj.h = 576
        this.list.push(obj)
      })
      // console.log(this.noPlateList)
    },
    filterListMsg () {
      // 过滤无牌车列表数据，形成新(车位类型信息)的数据
      // console.log(this.noPlateList)
      this.noPlateList.map((val) => {
        if (val.carType === 1) {
          val.carTypeMsg = '无牌车'
        } else {
          val.carTypeMsg = '侧方车'
        }
      })
      // console.log(this.noPlateList)
    },
    showImg (index) {
      // console.log(index)
      // console.log(this.list)
      this.$refs.previewer[index].show(index)
    },
    openPicker () {
      this.$refs.picker.open()
    },
    choseDate () {
      this.openPicker()
      this.startEndDate = new Date()
      // console.log(this.pickerValue)
    },
    openEndPicker () {
      this.$refs.end.open()
    },
    choseEndDate () {
      this.openEndPicker()
      this.endDate = new Date()
    },
    toast (date) {
      Toast({
        message: date,
        position: 'bottom',
        duration: 2000
      })
    },
    handleConfirm () {
      // console.log(this.pickerValue)
      this.startTime = this.pickerValue
      this.startEndTime = this.startTime
      // 做一下判断 开始时间>结束时间?结束时间=开始时间:不操作
      if (parseInt(this.startTime.getTime()) >= parseInt(this.endTime.getTime())) {
        this.endTime = this.startTime || new Date()
      }
    },
    handleEndConfirm () {
      /*
      * 将所选的时间作为开始时间控件的结束时间
      * */
      this.endTime = this.pickerEndValue
      this.startEndDate = this.endTime
      // 判断 ?
      if (parseInt(this.endTime.getTime()) <= parseInt(this.startTime.getTime())) {
        this.startTime = this.endTime
      }
    },
    getNoPlateList () {
      /*
      * 不要用服务器返回的项目ID，格式有问题;
      * */
      var params = new URLSearchParams()
      let getDate = {
        'build_id': this.buildId,
        'start_time': parseInt(this.startTime.getTime().toString().substring(0, 10)),
        'end_time': parseInt(this.endTime.getTime().toString().substring(0, 10))
      }
      // 传formData是不能转字符串!
      for (let i in getDate) {
        params.append(i, getDate[i])
      }
      let url = this.url + '/soeasy/noPlateList'
      this.$http.post(
        url,
        params,
        {
          timeout: 2000,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
      ).then((res) => {
        /*
        * 逻辑
        * 1.0 取出数据
        * */
        this.loadingDiv = false
        if (parseInt(res.data.result) === 1) {
          if (res.data.param.length === 0) {
            this.toast('无牌车列表为空!')
          } else {
            this.toast('获取数据成功!')
          }
          this.build_id = res.data.build_id
          // 先清空之前的数据
          // 使用懒加载的时候，如何更新数据，请使用延时执行;
          /*
          * 执行逻辑有问题
          * */
          // console.log(this.noPlateList)
          //
          this.noPlateList = []
          if (res.data.param.length === 0) {
            this.toast('无牌车列表为空!')
          } else {
            setTimeout(() => {
              this.noPlateList = res.data.param
              this.filterList()
              this.filterListMsg()
            }, 250)
          }
        } else {
          this.loadingDiv = false
          this.toast('获取数据失败!')
        };
      }).catch((err) => {
        this.loadingDiv = false
        if (err.toString() === 'Error: Network Error') {
          this.toast('网络出错!')
        } else {
          this.toast('server error!')
        }
      })
      //
    },
    query () {
      // 查询无牌车接口
      /*
      * 逻辑点击之后两秒后才可以点击
      * */
      if (this.queryClick) {
        this.queryClick = false
        this.loadingDiv = true
        this.getNoPlateList()
        setTimeout(() => {
          this.queryClick = true
        }, 2000)
      } else {
        this.toast('点击过于频繁!')
      }
    },
    locatinHref (date) {
      let carInfo = date
      // console.log(carInfo)
      /*
      *  1.0 跳转页面;
      *  2.0 传参数;
      * */
      // 跳转页面 'de5f134fc1a8b3840a248d593e0461e5',
      /*
      *    platform:'weixin',
                 payment_id:'a25c9351d1f64fda9c5053a3c5a621c9',
                 client_id:'de5f134fc1a8b3840a248d593e0461e5',
                 park_id:'B0005',
                 floor_id:'-1',
                 carPortCode:'"LX012B069',
                 carPortName:'B069',
                 lat:'95099.9999973824',
                 lon:'-73875.0000461635'
                 lon:'0',
      * */
      var dataUrl = {
        platform: 'weixin',
        payment_id: 'a25c9351d1f64fda9c5053a3c5a621c7',
        client_id: this.client_id,
        park_id: this.buildId,
        floor_id: carInfo.floorNum,
        carPortCode: carInfo.carPortCode,
        carPortName: carInfo.carpos,
        lon: carInfo.carposPoint[1],
        lat: carInfo.carposPoint[0]
      }
      // alert(dataUrl);
      dataUrl = JSON.stringify(dataUrl)
      window.location.href = 'https://www.beefindtech.com/location/BeefindMapCenter.html?data=' + dataUrl
    }
  }
}
</script>

<style scoped lang="scss">
.container{
  /*border: 1px solid #ff0000;*/
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  /*padding: 10px;*/
  display: flex;
  flex-direction: column;
  .top{
    width: 100%;
    height: 80px;
    /*line-height: 70px;*/
    position: relative;
    /*border: 1px solid #00FF00;*/
    >div{
      width: 100%;
      height: 30px;
      margin-top: 5px;
      /*border: 1px solid #0000ff;*/
      .flex-demo {
        text-align: center;
        color: #333333;
        height: 30px;
        line-height: 30px;
        /*border: 1px solid #ff0000;*/
        .mui-icon {
          font-family: Muiicons;
          font-size: 24px;
          font-weight: 400;
          font-style: normal;
          line-height: 1;
          display: inline-block;
          text-decoration: none;
          -webkit-font-smoothing: antialiased;
          /*border:1px solid #ff5053;*/
        }
        .mui-icon-extra {
          font-family: MuiiconSpread;
          font-size: 24px;
          font-weight: normal;
          font-style: normal;
          line-height: 1;
          display: inline-block;
          text-decoration: none;
          -webkit-font-smoothing: antialiased;
        }
      }
      .time{
        color: #cccccc;
        font-size: 14px;
        border:1px solid #cccccc;
      }
      .group{
        border:1px solid #ff0000;
        height: 30px;
      }
    }
  }
  .bottom{
    width: 100%;
    min-height: 440px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    /*border: 1px solid #00FF00;*/
    .v-enter{
      opacity: 0;
      transform: translateX(100%);
    }
    .v-leave-to{
      opacity: 0;
      transform: translateX(-100%);
    }
    .v-enter-active,
    .v-leave-active{
      transition: all 0.6s ease;
    }
    .v-move{
      transition: all 0.6s ease;
    }
    .v-leave-active{
    }
    .show-container:hover{
      box-shadow: 0px 0px 5px #8a6de9;
      -webkit-transition: all 0.5s ease;
      -moz-transition: all 0.5s ease;
      -ms-transition: all 0.5s ease;
      -o-transition: all 0.5s ease;
      transition: all 0.5s ease;
    }
    .show-container{
      // border:1px solid #ff5053;
      height: 140px;
      background: #f2f2f2;
      padding: 5px;
      margin: 10px 5px;
      box-shadow: 0px 0px 5px #6d6d72;
      border-radius: 3px;
      .flex{
        /*border:1px solid #ff5053;*/
        width: 100%;
        height: 100%;
        .flex-item{
          /*border:1px solid #ff5053;*/
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .previewer-demo-img{
            width: 90%;
            height: 100%;
            /*border: 1px solid #ff0000;*/
          }
          .previewer-demo-img[lazy=loading]{
            width: 30px;
            height: 30px;
            margin: auto;
          }
          span{
            display: inline-block;
            /*border:1px solid #ff00ff;*/
            >p{
              display: inline;
            }
          }
        }
      }
    }
  }
}
</style>
