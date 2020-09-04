<script>
  import AltShift from './../components/AltShift.svelte';

  let showPlayer = true;
  // let videoId = 'uYGj04Iti3E';
  let videoId = '-aQ2E0mlRQI';
  let videoType = 'YOUTUBE_VIDEO_PAGE';
</script>

<input type="checkbox" bind:checked={showPlayer}>
<input type="text" bind:value={videoId}>
<input type="text" bind:value={videoType}>

<AltShift showPlayer={showPlayer} videoId={videoId} videoType={videoType}>

</AltShift>


<video controls muted=true>
  <source src="https://r3---sn-f5f7lne6.c.youtube.com/videoplayback?expire=1599255215&ei=T15SX8D0J7X57QTCirSABw&ip=37.99.87.210&id=o-ANEgxawzPTj-DIFWvhAZR_Oq_OnkPYf52CREnX3wAXvt&itag=18&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&gir=yes&clen=17348206&ratebypass=yes&dur=384.592&lmt=1575281811498605&fvip=15&c=WEB&txp=5531432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRAIgG0F0T8G2TmHEcbVJItM4nyuKZeQ4qOT7YwhkRQTOLosCIC3iOjUXTPqmO5mdr7nzuWYidLpA8sneX0AgQ5Gcr9QW&redirect_counter=1&cm2rm=sn-cxxapox31-5a5e7r&req_id=48ac7bcc58caa3ee&cms_redirect=yes&mh=Zn&mm=32&mn=sn-f5f7lne6&ms=su&mt=1599233728&mv=m&mvi=3&pl=24&lsparams=mh,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRQIhANREkLs8PCndByZOmH5wEzi8NhUxPLyVfm4feTsomyoEAiAw6Xk7F8wJZMAoxopQHeaxnlsqy5FgjAUo_vMosC4FBw%3D%3D">
</video>

<style>
  video {
    position: absolute;
    top: 200px;
    left: 20px;
    width: 800px;
  }
</style>
