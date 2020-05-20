<script>

  export let audioFiles = [];
  export let currentFile = '';
</script>

<ul>
  {#each audioFiles as file}
    <li on:click={() => currentFile = file}>
      {file.audioName}
    </li>
  {/each}
</ul>

<style>
  ul {
    position: fixed;
    top: 50px;
    z-index: 10000;
    color: #ffffff;
  }
</style>
