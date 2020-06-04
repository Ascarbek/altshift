<script>
  import { elasticOut } from 'svelte/easing';

  export let available = false;

  function bouncing(node, {delay = 500, duration = 1000}) {
    return {
      delay,
      duration,
      css: t => `transform: scale(${elasticOut(t)});`,
    };
  }
</script>

<div class="app-overlay" class:available={available} in:bouncing={{delay: 500}} out:bouncing={{delay: 0}} on:click>
  <i class="icomoon-headset"></i>
</div>

<style>
  .app-overlay {
    position: fixed;
    right: 30px;
    top: 70px;
    z-index: 10000;
    color: #333333;
    font-size: 24px;
    width: 40px;
    height: 40px;
    background: #ffffff;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 5px 0 #000000;
  }

  .available {
    color: #248dc1;
  }

  i {
    display: block;
  }
</style>
