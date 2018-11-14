<template>
    <transition name="fade-dialog" appear @after-enter="afterEnter">
        <div class="prompt" class="prompt">
            <div class="prompt-content">
            	<input type="text"/>
            	<div class="btn-list">
            		<button>取消</button>
            		<button>确认</button>
            	</div>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    
  },
  data() {
    return {
      alertShow: false
    };
  },
  mounted() {
    this.alertShow = true;
  },
  methods: {
    
  },
  created() {
    
  }
};
</script>

<style scoped lang="scss">


.fade-dialog-enter-active,
.fade-dialog-leave-active {
  .prompt {
    transform: translate(-50%, -60%);
    transition: all 0.3s linear;
  }
}
.fade-dialog-enter,
.fade-dialog-leave-active {
  .prompt {
    transform: scale(-50%, -50%);
    transition: all 0.3s linear;
  }
}
</style>
