<template>
  <div>
    <h2>{{ title }}</h2>
    <h3>{{ msg }}</h3>
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
      msg: '',
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
      var prepayid = localStorage.getItem('prepay_id')
      var orderid = localStorage.getItem('orderid')
      var url = 'http://pay.169youxi.com/pay/payquery'
      this.msg = '正在查询订单'
      this.$http.post(url, { prepay_id: prepayid, orderid: orderid }, { emulateJSON: true }).then(
        response => {
          var data = response.data
          if (data['data']) {
            this.msg = '支付成功'
          } else {
            this.msg = '支付失败'
          }
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
}
</style>
