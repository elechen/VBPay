<template>
  <div>
    <h2>{{ title }}</h2>
    <form>
      <div>
        <ol>
          <li>
            <div class="leftpart">
              <label for="game">游戏</label>
            </div>
            <div class="rightpart">
                <select v-model="game" id="inputGame" class="form-control">
                  <option v-for="game in games" :key="game.id" :value="game.id">{{game.name}}</option>
                </select>
            </div>
          </li>
          <li>
              <div class="leftpart">
                <label for="account">账号</label>
              </div>
              <div class="rightpart">
                <input v-model.lazy="account" type="text" placeholder="点击输入账号">
              </div>
          </li>
          <li>
            <div class="leftpart">
              <label for="server">服务器</label>
            </div>
            <div class="rightpart">
              <select v-model="serverIdx" id="inputServer" class="form-control">
                <option v-for="(srv, idx) in servers" :key="idx" :value="idx">{{srv.name}}</option>
              </select>
            </div>
          </li>
          <li>
            <div class="leftpart">
              <label for="role">角色</label>
            </div>
            <div class="rightpart">
              <select v-model="role" id="inputRole" class="form-control">
                <option v-for="role in roles" :key="role.id" :value="role.id">{{role.name}}</option>
              </select>
            </div>
          </li>
          <li>
            <div class="leftpart">
              <label for="price">金额</label>
            </div>
            <div class="rightpart">
              <select v-model="good" id="inputPrice" class="form-control">
                <option v-for="good in goods" :key="good.id" :value="good.id">{{good.name}}</option>
              </select>
            </div>
          </li>
        </ol>
      </div>
    </form>
    <div class="bottom-center">
      <button type="button" class="btn btn-primary btn-block" @click="submit">立刻支付</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UnifiedPay',
  data() {
    return {
      title: '微信支付',
      serverJsonUrl:
        'http://clientversion.169youxi.cn:8002/?action=getupdate&passport=3cb6558ed8b99ad5bd74f5ef29ec4b51&product=$gameflag&path=public/serverlist/server.json',
      enableInput: true,
      games: [{ id: 'dtry2', name: '神之路' }, { id: 'dhbt', name: '思仙' }],
      game: 'dtry2',
      account: '',
      servers: [{ id: '0', name: '选择服务器' }],
      game2servers: {},
      serverIdx: 0,
      roles: [{ id: '0', name: '选择角色' }],
      role: '0',
      goods: [{ id: '1', name: '¥6' }, { id: '2', name: '¥30' }, { id: '3', name: '¥98' }],
      good: '1'
    }
  },

  methods: {
    submit: function(event) {
      var server = this.servers[this.serverIdx].id
      console.log('---------submit', this.game, this.account, server, this.role, this.good)
    },

    getserverlist: function(game) {
      if (this.game2servers[game]) {
        this.servers = this.game2servers[game]
        console.log('读取服务器列表成功')
        return
      }
      var url = this.serverJsonUrl.replace('$gameflag', game)
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

    getrolelist: function(game, account, serverid)
    {
      console.log("getroles", game, account, serverid)
      var roles = [{id:16102, name:"Test16102"}, {id:16103, name:"Test16103"}]
      this.roles = roles
    }
  },

  mounted: function() {
    this.getserverlist(this.game)
  },

  watch: {
    game: function(val) {
      this.getserverlist(val)
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

/* input {
  border: 0;
  padding: 0.5rem 0;
  text-indent: 0.5rem;
  flex-grow: 4;
  font-size: 0.9rem;
} */

a {
  color: #42b983;
}
</style>
