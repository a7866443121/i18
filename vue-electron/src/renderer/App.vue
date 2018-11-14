<template>
  <div id="dictionaries">
    <h1 class="title">woneX国际化前端字典集</h1>
    <div class="scroll-x">
      <div class="navbar">
        <div class="item"
          v-for="(item, index) in types"
          :key="index"
          :class="{active: navbarIndex == index}"
          @click="navbarChange(index)">
          <span>{{item}}</span>  
        </div>
        <div class="item" @click="addType">
          <span>新增分类</span>
        </div>
      </div>  
    </div> 
    <div class="data" v-if="this.types.length !== 0">
      <table class="code-table">
        <thead>
          <tr>
            <th>code</th>
            <th>code备注</th>
            <th>中文(zh)</th>
            <th>英文(en)</th>
            <th>编辑</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in codeDatas" :key="index">
            <td>
              <input type="text" v-model="item.code" :readonly="!item.isEdit" placeholder="请输入code码">
            </td>
            <td>
              <input type="text" v-model="item.desc" :readonly="!item.isEdit" placeholder="请输入code码备注信息">
            </td>
            <td>
              <input type="text" v-model="item.zh" :readonly="!item.isEdit" placeholder="请输入中文意思">
            </td>
            <td>            
              <input type="text" v-model="item.en" :readonly="!item.isEdit" placeholder="请输入英文意思">
            </td>
            <td>
              <button @click="item.isCreate ? add(item) : update(item)">{{item.isEdit ? '确定' : '修改'}}</button>
              <button @click="clear(item, item.isCreate)" v-show="item.isCreate || item.isEdit">取消</button>
              <button @click="remove(item)" v-show="!item.isCreate && !item.isEdit">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="create">新增</button>
    </div>
    <div class="no-page" v-else>点击上方‘新增分类按’钮，添加数据哦~</div>   
		<div class="prompts" v-show="promptsController">
			<input 
				class="prompts-input" 
				v-model="promptsText" 
				type="text" 
				placeholder="请输入类别名"
			/>
			<div class="prompts-btn">
				<button @click="btnSure">确认</button>
				<button>取消</button>
			</div>
		</div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      codeDatas: [],
      types: [],
      type: '',
      navbarIndex: 0,
      progressbar: 0,
      promptsController:false,
      promptsText:'',
    }
  },
  methods: {
    /** 获取字典集 */
    get () {
      this.progressbar = 0;
      this.$axios.get('api',{
        type: this.type
      }).then(res => {
        this.types = res.data.types;
        !this.type && (this.type = this.types[0]);
        this.codeDatas = res.data.list.map(item => {
          return Object.assign(item,{isEdit: false, oldCode: item.code});
        });
      });
    },
    /** 新增字典 */
    add (item) {
      this.$axios.put('api',{
        type: this.type,
        code: item.code,
        data: JSON.stringify({
          code: item.code,
          zh: item.zh,
          en: item.en,
          desc: item.desc
        })
      }).then(res => {
        if (res.code != 200){
          alert(res.msg);
        } else {
          item.isCreate = false;
          this.get();        
        }
      })
    },
    /** 修改字典 */
    update (item) {
      if (item.isEdit) {
        item.isEdit = false;
        this.$axios.post('api',{
          type: this.type,
          code: item.code,
          oldCode: item.oldCode,
          data: JSON.stringify({
            code: item.code,
            zh: item.zh,
            en: item.en,
            desc: item.desc
          })
        }).then(res => {
          if (res.code != 200) {
            alert(res.msg);
            item.code = item.oldCode;
          } else {
             this.get();
          }
        })
      } else {
        item.isEdit = true;
      }
    },
    /** 删除字典 */
    remove (item) {
      if (!confirm('确认删除吗？')) return;
      this.$axios.delete('api',{
        code: item.code,
        type: this.type
      }).then(res => {
        if (res.code === 200){
          alert('删除成功!');
          this.get();
        } else {
          alert(res.msg);
        }
      })
    },
    /** 新增字典输入框 */
    create () {
      this.codeDatas.push({
        code: '',
        zh: '',
        en: '',
        desc: '',
        isCreate: true,
        isEdit: true
      });
    },
    /** 取消 */
    clear (item, flag) {
      if (flag) {
        this.codeDatas.pop();
      } else {
        item.isEdit = false;
      }
    },
    /** 切换分类 */
    navbarChange (index) {
      this.navbarIndex = index;
      this.type = this.types[index];
      this.get();
    },
    /** 新增分类 */
    addType () {
    	this.promptsController = true;  
    },
    btnSure(){
      if (!this.promptsText) return;
    	this.$axios.put('api/addType',{
        type: this.promptsText
      }).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.get();
          this.promptsController = false;
        } else {
          alert(res.msg)
        }
        
      })
    }
  },
  watch: {
    codeDatas () {
      this.progressbar = 100;
    }
  },
  created() {
    this.get();
  },
  components: {

  }
}
</script>

<style lang="scss">
  html,body{
    margin: 0;
    padding: 0;
  }
  $color-primary: #5991FF;
  $color-white: #fff;
  .title{
    text-align: center;
  }
  .scroll-x {
    width: 100%;
    overflow: hidden;
    overflow-x: auto;
  }
  .navbar{
    margin: 20px 0;  
    border-bottom: 1px solid #ccc;
    padding: 0 10px;  
    box-sizing: border-box;
    width: 100%;
    white-space: nowrap;
    // overflow: hidden;
    // overflow-x: auto;
    &::after{
      content: '';
      display: block;
      clear: both;
    }
    &::-webkit-scrollbar{
      width: 4px;
      height: 4px;
    }
    &::-webkit-scrollbar-thumb{
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      background: #535353;
    }
    &::-webkit-scrollbar-track{
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      background: #EDEDED;
    }
    .item{
      position: relative;
      bottom: -1px;
      float: left;
      box-sizing: border-box;
      height: 35px;
      padding: 7px 9px;
      text-align: center;
      color: #333;
      cursor: pointer;
      user-select: none;
      &::after{
        content: '';
        position: absolute;
        left: 0;
        top: -4px;
        width: 100%;
        height: 100%;
        z-index: 2;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-bottom: 0;
        border-radius: 6px 6px 0 0;
        background: #dedede;
        transform: perspective(0.5em) rotateX(5deg);
        transition: all .3s ease-in-out;
      }
      &.active{
        &::after{
          background-color: $color-white;
          z-index: 3;
        }
      }
      &:not(.active):hover{
        &::after{
          background-color: #ededed;
        }
      }
      span{
        position: relative;
        z-index: 10;
      }
    }
  }
  .data{
    padding: 0 30px;
  }
  .code-table{
    border-collapse: collapse;
    width: 100%;
    th,td{
      padding: 9px 0;
      border: 1px solid #333;
      text-align: center;
    }
    input{      
      border: 1px solid #aaa;
      border-radius: 4px;
      padding: 6px 5px;
      box-shadow: none;
      outline: none;
    }
    input[readonly = 'readonly']{
      border: none;
    }
  }
  .no-page{
    text-align: center;
    color: #333;
  }
  $light-gray: #e0e0e0;
  $magenta: #ec0071;
  $white: #f5f5f5;
  @mixin build-skin($color, $name) {
    &.#{$name} {
      .floor{
        box-shadow:
            0 -.2em 1em rgba(0, 0, 0, .15),
            0 .2em .1em -5px rgba(0, 0, 0, .3),
            0 -.75em 1.75em rgba($white, .15),
      }
      .left{
        background-color: rgba($color, .5);
      }
      .percentage::before{
        background-color: rgba($color, .5);
        box-shadow: 0 1.6em 3em rgba($color, .25);
      }
    }
  }
  /*prompts*/
 .prompts{
 	position: absolute;
 	top: 10%;
 	left: 50%;
 	transform: translate(-50%, -50%);
 	display: inline-block;
 	padding: 40px;
 	background-color: #fff;
  box-shadow: 0 6px 20px 5px rgba(40, 120, 255, 0.1), 0 16px 24px 2px rgba(0, 0, 0, 0.05);
  .prompts-input{
  	padding: 4px;
  }
  .prompts-btn{
  	margin-top: 20px;
  }
}
</style>
