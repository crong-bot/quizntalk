<script>
  import { scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import Module_button from "$lib/module_button.svelte";
  import { LessonManager } from "../../../stores/LessonManager.js";

  export let transition_delay;
  let answer_one;
  let answer_two;
  let answer_three;
  //const answers = {};
  const data = [];

  // 제출한 정답을 answers에 가지고 오는 함수
  function onSubmit(e) {
    // const inputs = e.target.elements;
    // for (let field of inputs) {
    //   let { id, value } = field;
    //   if (id !== '') answers[id] = value;
    // }
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

  <div class="flex flex-col justify-center items-center m-10">
    <div class="flex flex-row space-x-20">
      <svg
        width="116"
        height="196"
        viewBox="0 0 116 196"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M115.66 136.395C115.66 169.197 89.7687 195.789 57.8301 195.789C25.8914 195.789 0 169.197 0 136.395C0 103.593 57.8301 0.32959 57.8301 0.32959C57.8301 5.72901 115.66 103.593 115.66 136.395Z"
          fill="#FF0000"
        />
      </svg>
      <svg
        width="116"
        height="196"
        viewBox="0 0 116 196"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M115.66 136.395C115.66 169.197 89.7687 195.789 57.8301 195.789C25.8914 195.789 0 169.197 0 136.395C0 103.593 57.8301 0.32959 57.8301 0.32959C57.8301 5.72901 115.66 103.593 115.66 136.395Z"
          fill="#40EA31"
        />
      </svg>
      <svg
        width="116"
        height="196"
        viewBox="0 0 116 196"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M115.66 136.395C115.66 169.197 89.7687 195.789 57.8301 195.789C25.8914 195.789 0 169.197 0 136.395C0 103.593 57.8301 0.32959 57.8301 0.32959C57.8301 5.72901 115.66 103.593 115.66 136.395Z"
          fill="#0019FF"
        />
      </svg>
    </div>
    <form on:submit|preventDefault={onSubmit} class="flex flex-row space-x-20">
      <input
        bind:value={data[0]}
        class="text-center text-slate-600 text-opacity-90 mt-4 font-dongle text-6xl font-bold h-16 w-28 block bg-white border border-slate-300 rounded-md pt-3 px-1 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
        type="text"
        id="1"
      />
      <input
        bind:value={data[1]}
        class="text-center text-slate-600 text-opacity-90 mt-4 font-dongle text-6xl font-bold h-16 w-28 block bg-white border border-slate-300 rounded-md pt-3 px-1 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
        type="text"
        id="2"
      />
      <input
        bind:value={data[2]}
        class="text-center text-slate-600 text-opacity-90 mt-4 font-dongle text-6xl font-bold h-16 w-28 block bg-white border border-slate-300 rounded-md pt-3 px-1 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
        type="text"
        id="3"
      />
      <!-- component need to mark to type submit -->
      <!-- 정답은 자동으로 answers props로 넘어감 몇개 든 상관 없고 id를 숫자로 순서대로 적어줘야 됨!!!!!!!!!!-->
      <Module_button type="submit" {data} />
    </form>
  </div>
  <div class="flex flex-row py-4">
    <div class="mt-3 w-full border-t border-gray-200 border-dashed" />
  </div>
</div>
