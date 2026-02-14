<script>
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
  class="relative w-full my-1 py-3"
>
  <div class="flex flex-row py-4">
    <div class="mt-3 w-2/4 border-t border-gray-200 border-dashed" />
    <div class=" font-dongle text-xl text-gray-300 mx-4">module</div>
    <div class="mt-3 w-2/4 border-t border-gray-200 border-dashed" />
  </div>
  <!-- ----------------------------------------------------------------------------------------- -->
  <div
    class="flex flex-row justify-center items-center space-x-4 m-4 font-dongle text-xl text-pink-500"
  >
    <img class="object-scale-down" src="/wave.png" alt="ear" />
  </div>
  <!-- ----------------------------------------------------------------------------------------- -->
  <div class="flex flex-row py-4">
    <div class="mt-3 w-full border-t border-gray-200 border-dashed" />
  </div>
</div>
