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
              <select v-model="server" id="inputServer" class="form-control">
                <option v-for="srv in servers" :key="srv.id" :value="srv.id">{{srv.name}}</option>
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
  data () {
    return {
      title: '微信支付',
      enable_input: true,
      games: [{ id: 'dtry2', name: '神之路' }, { id: 'dhbt', name: '思仙' }],
      game: 'dtry2',
      account: '',
      servers: [
        { id: '1001', name: '天下无双' },
        { id: '1002', name: '三生三世' }
      ],
      server: '',
      roles: [
        { id: '10001', name: '角色1号' },
        { id: '10002', name: '角色2号' }
      ],
      role: '',
      goods: [
        { id: '1', name: '¥6' },
        { id: '2', name: '¥30' },
        { id: '3', name: '¥98' }
      ],
      good: ''
    }
  },
  methods: {
    submit: function (event) {
      console.log('---------submit', this.game, this.account, this.server, this.role, this.good)
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
