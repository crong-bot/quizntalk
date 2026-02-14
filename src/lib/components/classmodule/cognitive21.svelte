<script>
  //단순사진 모듈 사용하기 좋음!!
  import { scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  export let transition_delay;
</script>

<div
  id="bubble"
  on:introend
  in:scale={{
    delay: transition_delay,
    duration: 400,
    easing: quintOut,
  }}
  out:scale={{
    delay: 0,
    duration: 0,
  }}
  class="flex justify-center py-8"
>
  <img src="/heart.png" alt="heart" />
</div>
