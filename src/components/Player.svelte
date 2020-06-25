<script>

</script>

<div class="player">
  <div class="content">
    <div class="display-outer">
      <div class="display">
        Кураж бамбей, первый выпуск
      </div>
    </div>

    <div class="up-down-buttons">
      <div class="up">
        <i class="fas fa-angle-up"></i>
      </div>
      <div class="down">
        <i class="fas fa-angle-down"></i>
      </div>
    </div>

    <div class="rate-buttons">
      <div class="up-vote">
        <i class="far fa-thumbs-up"></i>
      </div>
    </div>

    <div class="power-button">
      <i class="fas fa-power-off"></i>
    </div>
  </div>

</div>

<style>
  .fas, .far {
    color: #9e9e9e;
  }

  .player {
    position: fixed;
    z-index: 10000;

    right: 80px;
    top: 80px;

    background: #ffffff;
    width: 270px;
    height: 58px;

    border-radius: 4px;
    box-shadow: 0 0 5px 0 #000000;
  }

  .content {
    position: relative;
    height: 100%;
  }

  .display-outer {
    position: absolute;
    top: 10px;
    left: 40px;
    right: 70px;
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
    font-family: monospace;
    display: flex;
    align-items: center;
    font-size: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: clip;
  }

  .up-down-buttons {
    position: absolute;
    right: 49px;
    top: 7px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .rate-buttons {
    position: absolute;
    left: 13px;
    top: 17px;
  }

  .power-button {
    position: absolute;
    right: 13px;
    top: 17px;
  }

  .power-button  i {
    color: #248dc1;
  }
</style>
