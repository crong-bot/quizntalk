<script>
  import { scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import Module_button from "$lib/module_button.svelte";
  import { LessonManager } from "../../../stores/LessonManager.js";

  export let transition_delay;
  let answer_one;
  let answer_two;
  let answer_three;

  /* { o: '', t: '', th: '' }; */

  function solution() {
    let is_same = [answer_one, answer_two, answer_three].every(
      (element, index) => {
        return element == $LessonManager["lesson_rgb"][1]["answer"][index];
      },
    );
    console.log($LessonManager["lesson_rgb"][1]["success"]);
    $LessonManager["lesson_rgb"][1]["success"] = is_same;
    console.log($LessonManager["lesson_rgb"][1]["success"]);
  }
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
    <div>
      <span class="ml-8">|---------2-----------| </span>
      <div class="flex flex-row justify-items-end">
        <span style="writing-mode: vertical-rl; text-orientation: mixed;"
          >|-----------2-------------|
        </span>
        <div class="grid grid-cols-2 w-32 h-40 ml-2 text-2xl">
          <div class="bg-gray-300 text-black px-4 py-4">회색</div>
          <div class="bg-amber-900 text-white px-4 py-4">갈색</div>
          <div class="bg-red-500 text-white px-4 py-4">빨강</div>
          <div class="bg-black text-white px-4 py-4">검정</div>
        </div>
      </div>
    </div>
  </div>
  <!-- ----------------------------------------------------------------------------------------- -->
  <div class="flex flex-row py-4">
    <div class="mt-3 w-full border-t border-gray-200 border-dashed" />
  </div>
</div>
