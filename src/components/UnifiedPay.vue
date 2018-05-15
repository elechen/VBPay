<template>
  <div>
    <h2>{{ title }}</h2>
    <div>
      <form action='' onsubmit='return false;'>
        <ol>
          <li>
            <div class='leftpart'>
              <label for='game'>游戏</label>
            </div>
            <div class='rightpart'>
                <select v-model='game' id='inputGame' class='form-control'>
                  <option v-for='game in games' :key='game.id' :value='game.id'>{{game.name}}</option>
                </select>
            </div>
          </li>
          <li>
              <div class='leftpart'>
                <label for='account'>账号</label>
              </div>
              <div class='rightpart'>
                <div class='input-group '>
                  <input v-model.lazy='account' @keyup.enter='onaccount' value='搜索' type='search' class='form-control' placeholder='点击输入账号' aria-label="Recipient's username" aria-describedby='basic-addon2'>
                  <div class='input-group-append'>
                    <span v-if='accountExist' class='input-group-text' id='basic-addon2'>存在</span>
                    <span v-else class='input-group-text' id='basic-addon3'>不存在</span>
                  </div>
                </div>
              </div>
          </li>
          <li>
            <div class='leftpart'>
              <label for='server'>服务器</label>
            </div>
            <div class='rightpart'>
              <select v-model='serverIdx' id='inputServer' class='form-control'>
                <option v-for='(srv, idx) in showServers' :key='idx' :value='idx'>{{srv.name}}</option>
              </select>
            </div>
          </li>
          <li>
            <div class='leftpart'>
              <label for='role'>角色</label>
            </div>
            <div class='rightpart'>
              <select v-model='role' id='inputRole' class='form-control'>
                <option v-for='role in roles' :key='role.id' :value='role.id'>{{role.name}}</option>
              </select>
            </div>
          </li>
          <li>
            <div class='leftpart'>
              <label for='price'>金额</label>
            </div>
            <div class='rightpart'>
              <select v-model='good' id='inputPrice' class='form-control'>
                <option v-for='good in goods' :key='good.id' :value='good.id'>{{good.name}}</option>
              </select>
            </div>
          </li>
        </ol>
      </form>
    </div>
    <div class='bottom-center'>
      <button type='button' class='btn btn-primary btn-block' @click='submit'>立刻支付</button>
    </div>
  </div>
</template>

<script>
import nativeToast from 'native-toast'

export default {
  name: 'UnifiedPay',
  data() {
    return {
      title: '微信支付',
      serverJsonUrl:
        'http://clientversion1.169youxi.cn:8002/?action=getupdate&passport=3cb6558ed8b99ad5bd74f5ef29ec4b51&product=$GAMEFLAG&path=public/serverlist/server.json',
      payUrl: 'http://pay.169youxi.com/pay/pay',
      payResultUrl: 'http://pay.169youxi.com/pay/payresult',
      accountQueryUrl: 'http://datatcenter.169youxi.cn:7006/?action=sfquery&gameflag=$GAMEFLAG&account=$ACCOUNT',
      enableInput: true,
      games: [{ id: 'dtry2', name: '神之路' }, { id: 'dhbt', name: '思仙' }],
      game: 'dtry2',
      account: '',
      accountExist: false,
      servers: [],
      showServers: [{ id: '0', name: '选择服务器' }],
      serverIdx: 0,
      game2servers: {},
      roles: [{ id: '0', name: '选择角色' }],
      account2roles: {},
      role: '0',
      goods: [
        { id: '0', name: '¥0.01', title: '充值¥0.01', price: 0.01 },
        { id: '1', name: '¥6', title: '充值¥6', price: 6 },
        { id: '2', name: '¥30', title: '充值¥30', price: 30 },
        { id: '3', name: '¥98', title: '充值¥98', price: 98 }
      ],
      good: '0'
    }
  },

  methods: {
    submit: function(event) {
      var server = this.showServers[this.serverIdx].id
      var message
      if (this.game === '') {
        message = '请选择游戏'
      } else if (this.account === '') {
        message = '请输入账号'
      } else if (server === '0') {
        message = '请选择服务器'
      } else if (this.role === '0') {
        message = '请选择角色'
      } else if (this.good === '') {
        message = '请选择商品'
      }
      if (message) {
        console.log(message)
        nativeToast({
          message: message,
          position: 'top',
          timeout: 3000,
          type: 'warning'
        })
        return
      }
      console.log('---------submit', this.game, this.account, server, this.role, this.good)
      if (this.game) {
        return
      }
      var goodData = this.goods[this.good]
      var args = {
        game: this.game,
        account: this.account,
        server: server,
        role: this.role,
        goods: this.good,
        body: goodData.name,
        subject: goodData.name,
        total_fee: goodData.price
      }
      // console.log(args)
      this.$http.post(this.payUrl, args, { emulateJSON: true }).then(
        response => {
          console.log('请求支付成功', response)
          var rt = response.data
          if (rt.code === 'SUCCESS') {
            var data = rt.data
            args.orderid = data.orderid
            var redirectUrl = encodeURI(this.payResultUrl + '?orderid=' + data.orderid)
            args.redirectUrl = redirectUrl
            localStorage.setItem('order', JSON.stringify(args))
            window.location.href = data.mweb_url + '&redirect_url=' + redirectUrl
          } else {
            alert(rt.message + '\n' + rt.data)
          }
        },

        response => {
          console.log('请求支付失败', response)
        }
      )
    },

    getServerList: function(game) {
      if (this.game2servers[game]) {
        this.servers = this.game2servers[game]
        console.log('读取服务器列表成功')
        return
      }
      var url = this.serverJsonUrl.replace('$GAMEFLAG', game)
      this.$http.get(url, { headers: { 'Content-Type': 'application/json' } }).then(
        response => {
          console.log(response)
          var servers = []
          for (var i = 0, len = response.data.serverlist.length; i < len; i++) {
            var one = response.data.serverlist[i]
            var srv = { id: one.serverid, name: one.showname ? one.showname : one.name }
            servers.push(srv)
          }
          this.game2servers[game] = servers
          this.servers = servers
          console.log('请求服务器列表成功')
        },

        response => {
          console.log('请求服务器列表失败', response)
        }
      )
    },

    // 考虑合服情况
    getServersByID: function(serverid) {
      var servers = []
      for (var i = 0; i < this.servers.length; i++) {
        var server = this.servers[i]
        if (server.id === serverid) {
          servers.push(server)
        }
      }
      return servers
    },

    resetShowServers: function() {
      this.showServers = [{ id: '0', name: '选择服务器' }]
      this.serverIdx = 0
      this.accountExist = false
      this.roles = [{ id: '0', name: '选择角色' }]
      this.role = '0'
    },

    getRoleList: function(game, account, serverid) {
      console.log('getroles', game, account, serverid)
      var roles = this.account2roles[account]
      var showRoles = []
      for (var i = 0; i < roles.length; i++) {
        var role = roles[i]
        if (role.server === serverid) {
          role.id = role.pid
          showRoles.push(role)
        }
      }
      this.roles = showRoles
      if (showRoles.length > 0) {
        this.role = showRoles[0].id
      }
    },

    onaccount: function() {
      if (this.account.length === 0) {
        nativeToast({
          message: '请先输入账号',
          position: 'top',
          timeout: 1000,
          type: 'warning'
        })
        return
      }
      var url = this.accountQueryUrl.replace('$GAMEFLAG', this.game)
      url = url.replace('$ACCOUNT', this.account)
      this.$http.get(url, { headers: { 'Content-Type': 'application/json' } }).then(
        response => {
          console.log(response)
          var data = response.data
          // SUCCESS{code:0,data=[{server:srvid,name:xxxx,pid:10003}]}  FAIL{code:1, msg:xxxx}
          if (data.code === 0) {
            var roles = data.data
            var showServers = {}
            for (var i = 0; i < roles.length; i++) {
              var role = roles[i]
              var servers = this.getServersByID(role.server)
              showServers.push.apply(showServers, servers)
            }
            this.showServers = showServers
            this.serverIdx = 0
            this.accountExist = true
            this.account2roles[this.account] = roles
            var server = this.showServers[this.serverIdx].id
            this.getRoleList(this.game, this.account, server)
          } else {
            this.resetShowServers()
            nativeToast({
              message: data.msg,
              position: 'top',
              timeout: 1000,
              type: 'warning'
            })
          }
          console.log('搜索账号成功')
        },

        response => {
          this.resetShowServers()
          nativeToast({
            message: '请稍后搜索',
            position: 'top',
            timeout: 1000,
            type: 'warning'
          })
          console.log('搜索账号失败', response)
        }
      )
    }
  },

  mounted: function() {
    this.getServerList(this.game)
  },

  watch: {
    game: function(val) {
      this.getServerList(val)
    },
    serverIdx: function(val) {
      var server = this.showServers[val].id
      this.getRoleList(this.game, this.account, server)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
  padding-top: 10%;
  margin-bottom: 10%;
}
ul {
  list-style-type: none;
  padding: 0;
}

.select-wrapper {
  flex-grow: 4;
  background: 0;
  border: solid 1px #c1c1c1;
  font-size: 0.9rem;
  margin-left: 6%;
  width: 94%;
}

.right-box {
  border: 0;
  padding: 0.5rem 0;
  flex-grow: 4;
}

ol {
  -webkit-padding-start: 0px;
}

li {
  border-bottom: solid 1px #c1c1c1;
  height: 3.5rem;
  padding: 0 4% 0 4%;
  display: flex;
  align-items: center;
}

.leftpart {
  align-items: flex-start;
  width: 30%;
}

.rightpart {
  align-items: flex-start;
  width: 70%;
}

.bottom-center {
  padding: 0 4% 0 4%;
}

label {
  flex-grow: 1;
  width: 5rem;
}

a {
  color: #42b983;
}
</style>
