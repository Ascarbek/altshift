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
  <div class="icons">
    <i class="fas fa-headphones-alt"></i>
  </div>
</div>

<style>
  .app-overlay {
    position: fixed;
    right: 30px;
    top: 70px;
    z-index: 10000;
    color: #333333;
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

  .app-overlay.available {
    background: #248dc1;
  }

  .icons {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fa-headphones-alt {
    color: #9e9e9e;
    font-size: 24px;
  }

  .available .fa-headphones-alt {
    color: #ffffff;
    position: absolute;
  }

  i {
    display: block;
  }
</style>
