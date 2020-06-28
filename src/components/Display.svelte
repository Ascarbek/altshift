<script>
  import states from './displayStates';

  export let state = '';

</script>

<!--

        font-size: 26px;
        color: #9e9e9e;

        <i class="fas fa-cloud-upload-alt"></i>
        <i class="fas fa-microphone-alt"></i>
-->

<div class="display-outer">
  <div class="display">

  </div>
</div>

<style>
  .display-outer {
    position: absolute;
    top: 10px;
    left: 45px;
    right: 90px;
    height: calc(100% - 20px);
    background: #f0f0f0;
    border: #e0e0e0 1px solid;
    border-radius: 4px;
  }

  .display {
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    height: calc(100% - 6px);
    background: #beceb2;
    border-radius: 4px;
    color: #464c4b;
    font-family: 'Roboto Mono', monospace;
    display: flex;
    align-items: center;
    font-size: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: clip;
  }
</style>
