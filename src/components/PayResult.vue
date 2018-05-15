<template>
  <div>
    <h2>{{ title }}</h2>
    <ul class="list-group">
      <li v-for='info in infos' :key='info.name' class="list-group-item" style="display:flex">
        <div class='leftpart'>
          <label style="float:left">{{info.name}}</label>
        </div>
        <div class='rightpart'>
            <label style="float:right" >{{info.desc}}</label>
        </div>
      </li>
    </ul>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">提示</h5>
            <!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button> -->
          </div>
          <div class="modal-body">
            请确认是否支付成功？
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="repay" >重新支付</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="checkpay" >支付成功</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'PayResult',
  data() {
    return {
      title: '支付结果',
      infos: [{ name: '当前状态', desc: '等待查询' }],
      modal: null
    }
  },
  methods: {
    repay: function() {
      console.log('返回上一页')
      this.$router.back(-1)
    },
    checkpay: function() {
      console.log('检查订单是否完成')
      var orderid = this.$route.query.orderid
      var url = 'http://pay.169youxi.com/pay/payquery'
      this.infos = [{ name: '当前状态', desc: '正在查询订单' }]
      var propName = []
      this.$http.post(url, { orderid: orderid }, { emulateJSON: true }).then(
        response => {
          var data = response.data
          var result = JSON.parse(data.data)
          console.log(result)
          if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
            if (result.trade_state === 'SUCCESS') {
              propName = [
                { name: '付款金额', prop: 'cash_fee' },
                { name: '当前状态', prop: 'trade_state_desc' },
                { name: '支付时间', prop: 'time_end' },
                { name: '交易单号', prop: 'transaction_id' },
                { name: '商户单号', prop: 'out_trade_no' }
              ]
            } else {
              propName = [
                { name: '交易状态', prop: 'trade_state' },
                { name: '当前状态', prop: 'trade_state_desc' },
                { name: '商户单号', prop: 'out_trade_no' }
              ]
            }
          } else {
            propName = [{ name: '错误代码', prop: 'err_code' }, { name: '代码描述', prop: 'err_code_des' }]
          }
          var infos = []
          for (var idx = 0; idx < propName.length; idx++) {
            var oneProp = propName[idx]
            var info
            if (oneProp.prop === 'cash_fee') {
              var desc = '¥' + result[oneProp.prop] / 100
              info = { name: oneProp.name, desc: desc }
            } else if (oneProp.prop === 'time_end') {
              var time = result[oneProp.prop]
              time = time.substr(0, 4) + '-' + time.substr(4, 2) + '-' + time.substr(6, 2) + ' ' + time.substr(8, 2) + ':' + time.substr(10, 2) + ':' + time.substr(12, 2)
              info = { name: oneProp.name, desc: time }
            } else {
              info = { name: oneProp.name, desc: result[oneProp.prop] }
            }
            infos.push(info)
          }
          this.infos = infos
        },
        response => {
          alert(response)
        }
      )
    }
  },
  mounted: function() {
    this.modal = $('#exampleModal').modal({
      keyboard: false,
      backdrop: 'static'
    })
  },
  beforeDestroy: function() {
    if (this.modal) {
      this.modal.modal('hide')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
  font-weight: normal;
  padding-top: 10%;
  margin-bottom: 10%;
}

.leftpart {
  align-items: flex-start;
  width: 30%;
}

.rightpart {
  align-items: flex-start;
  width: 70%;
}

label {
  margin-bottom: 0%;
}
</style>
