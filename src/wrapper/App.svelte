<script lang="ts">
  import AltShift from './../components/AltShift.svelte';

  let showPlayer: boolean = true;
  // let videoId = 'uYGj04Iti3E';
  // let videoId = '-aQ2E0mlRQI';
  let videoId: string = '22H8M8h6Hdo';
  let videoType: string = 'YOUTUBE_VIDEO_PAGE';
</script>

<input type="checkbox" bind:checked={showPlayer}>
<input type="text" bind:value={videoId}>
<input type="text" bind:value={videoType}>

<AltShift showPlayer={showPlayer} videoId={videoId} videoType={videoType}>

</AltShift>


<video controls muted=true>

  <source src="https://r3---sn-cxxapox31-5a5s.googlevideo.com/videoplayback?expire=1605491774&ei=3YexX--pNcbdyAX0lI3ABg&ip=67.209.131.149&id=o-AGIal305ns__Z55ENf_H6n3ULe82glmgI2prO77Z5prZ&itag=248&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278%2C394%2C395%2C396%2C397%2C398&source=youtube&requiressl=yes&mh=OF&mm=31%2C29&mn=sn-cxxapox31-5a5s%2Csn-n8v7znze&ms=au%2Crdu&mv=m&mvi=3&pl=24&initcwndbps=1238750&vprv=1&mime=video%2Fwebm&ns=3HPliqgIOdzvWDmgrDRcITsF&gir=yes&clen=116854012&dur=604.971&lmt=1546041971001110&mt=1605470082&fvip=3&keepalive=yes&c=WEB&txp=3535332&n=p2JR0sq-Kkt78Q&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AOq0QJ8wRQIhANHnUVLKPB_QGhOk4kN0rEzjfymFQhiWnveN7Vjv0HqBAiAC2M2w7_njGIj7NZ03oBhyxSWRDwBn6AYp7xGfJYWsWQ%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhANzXRRkIvphYbC2ndqbfclfKd6RnRlq8UrkQ-3vqt0eUAiEA2UcDyiYiLXycSXU66cE5ljVLwCTKCGjGXCS4ouIsDfo%3D&alr=yes&cpn=WbRs_EZlMtgGhnnD&cver=2.20201112.04.01">
<!--  <source src="https://r3-&#45;&#45;sn-f5f7lne6.c.youtube.com/videoplayback?expire=1599255215&ei=T15SX8D0J7X57QTCirSABw&ip=37.99.87.210&id=o-ANEgxawzPTj-DIFWvhAZR_Oq_OnkPYf52CREnX3wAXvt&itag=18&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&gir=yes&clen=17348206&ratebypass=yes&dur=384.592&lmt=1575281811498605&fvip=15&c=WEB&txp=5531432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRAIgG0F0T8G2TmHEcbVJItM4nyuKZeQ4qOT7YwhkRQTOLosCIC3iOjUXTPqmO5mdr7nzuWYidLpA8sneX0AgQ5Gcr9QW&redirect_counter=1&cm2rm=sn-cxxapox31-5a5e7r&req_id=48ac7bcc58caa3ee&cms_redirect=yes&mh=Zn&mm=32&mn=sn-f5f7lne6&ms=su&mt=1599233728&mv=m&mvi=3&pl=24&lsparams=mh,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRQIhANREkLs8PCndByZOmH5wEzi8NhUxPLyVfm4feTsomyoEAiAw6Xk7F8wJZMAoxopQHeaxnlsqy5FgjAUo_vMosC4FBw%3D%3D">-->
</video>

<style>
  video {
    position: absolute;
    top: 200px;
    left: 20px;
    width: 800px;
  }
</style>
