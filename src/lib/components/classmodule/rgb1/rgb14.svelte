<script>
  import { scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import Module_button from "$lib/module_button.svelte";
  import { LessonManager } from "../../../stores/LessonManager.js";

  export let transition_delay;
  let red = 100;
  let green = 255;
  let blue = 255;
  $: redhegiht = (255 - red) * (150 / 255); // svg높이 나누기 255
  $: greenhegiht = 255 - green;
  $: bluehegiht = 255 - blue;
  $: wavecolor = `rgb(${red}, ${green}, ${blue})`;
</script>

<div
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
  class="relative mx-auto py-3 w-128"
>
  <div class="flex flex-row py-4">
    <div class="mt-3 w-1/4 border-t border-gray-200 border-dashed" />
    <div class=" font-dongle text-xl text-gray-300 mx-4">module</div>
    <div class="mt-3 w-1/4 border-t border-gray-200 border-dashed" />
  </div>
  <!-- -------------------------------------------------------------------- -->
  <div class="flex flex-row justify-center items-center">
    <div class="flex flex-row pl-14">
      <div class="flex flex-col justify-center items-center space-y-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="96"
          height="150"
          viewBox="0 0 96 150"
          fill="none"
        >
          <path
            d="M96 104.42C96 129.593 74.5097 150 48 150C21.4903 150 0 129.593 0 104.42C0 79.2467 48 0 48 0C48 4.14365 96 79.2467 96 104.42Z"
            fill="#FF0000"
          />
        </svg>
        <div class="font-dongle font-bold text-6xl text-slate-600">{red}</div>
      </div>

      <div
        style="height:{redhegiht}px;width:100px;background-color:white;"
        class="absolute"
      />
      <input
        bind:value={red}
        type="range"
        class="origin-center -rotate-90"
        min="0"
        max="255"
        step="1"
      />
    </div>
    <div class="flex flex-row">
      <div class="flex flex-col justify-center items-center space-y-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="96"
          height="150"
          viewBox="0 0 96 150"
          fill="none"
        >
          <path
            d="M96 104.42C96 129.593 74.5097 150 48 150C21.4903 150 0 129.593 0 104.42C0 79.2467 48 0 48 0C48 4.14365 96 79.2467 96 104.42Z"
            fill="#40EA31"
          />
        </svg>
        <div class="font-dongle font-bold text-6xl text-slate-600">{green}</div>
      </div>
      <div
        style="height:{greenhegiht}px;width:151px;background-color:white;"
        class="absolute"
      />
      <input
        bind:value={green}
        type="range"
        class="origin-center -rotate-90 h-60"
        min="0"
        max="255"
        step="1"
      />
    </div>

    <div class="flex flex-row">
      <div class="flex flex-col justify-center items-center space-y-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="97"
          height="151"
          viewBox="0 0 97 151"
          fill="none"
        >
          <path
            d="M96.4844 104.749C96.4844 129.923 74.994 150.33 48.4844 150.33C21.9747 150.33 0.484375 129.923 0.484375 104.749C0.484375 79.5763 48.4844 0.32959 48.4844 0.32959C48.4844 4.47324 96.4844 79.5763 96.4844 104.749Z"
            fill="#0019FF"
          />
        </svg>
        <div class="font-dongle font-bold text-6xl text-slate-600">{blue}</div>
      </div>
      <div
        style="height:{bluehegiht}px;width:151px;background-color:white;"
        class="absolute"
      />
      <input
        bind:value={blue}
        type="range"
        class="origin-center -rotate-90 h-60"
        min="0"
        max="255"
        step="1"
      />
    </div>
  </div>

  <div class="flex">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      id="Calque_1"
      x="0px"
      y="0px"
      viewBox="0 0 1300 550"
      style="enable-background:new 0 0 1300 550;"
      xml:space="preserve"
    >
      <path
        style="fill:{wavecolor};enable-background:new;opacity:0.6;"
        type="text/css"
        d="M 0 250 C 600 450 650 100 1300 250 L 1300 550 L 0 550 L 0 250"
      >
        <animate
          attributeName="d"
          dur="5s"
          begin="1s"
          values="M 0 250 C 600 450 650 100 1300 250 L 1300 550 L 0 550 L 0 250;
                   M 0 250 C 600 100 650 450 1300 250 L 1300 550 L 0 550 L 0 250;
                   M 0 250 C 600 450 650 100 1300 250 L 1300 550 L 0 550 L 0 250"
          repeatCount="indefinite"
        />
      </path>

      <path
        style="fill:{wavecolor};enable-background:new;opacity:0.6;"
        type="text/css"
        d="M 0 250 C 600 100 650 450 1300 250 L 1300 550 L 0 550 L 0 250"
      >
        <animate
          attributeName="d"
          dur="5s"
          values="M 0 250 C 600 100 650 450 1300 250 L 1300 550 L 0 550 L 0 250;
                   M 0 250 C 600 450 650 100 1300 250 L 1300 550 L 0 550 L 0 250;
                   M 0 250 C 600 100 650 450 1300 250 L 1300 550 L 0 550 L 0 250"
          repeatCount="indefinite"
        />
      </path>

      <path
        style="fill:{wavecolor};enable-background:new;opacity:0.6;"
        type="text/css"
        d="M 0 250 C 950 350 950 150 1300 250 L 1300 550 L 0 550 L 0 250"
      >
        <animate
          attributeName="d"
          dur="5s"
          begin="2s"
          values="M 0 250 C 950 350 950 150 1300 250 L 1300 550 L 0 550 L 0 250;
                   M 0 250 C 350 150 350 350 1300 250 L 1300 550 L 0 550 L 0 250;
                   M 0 250 C 950 350 950 150 1300 250 L 1300 550 L 0 550 L 0 250"
          repeatCount="indefinite"
        />
      </path>

      <path
        style="fill:{wavecolor};enable-background:new;opacity:0.6;"
        type="text/css"
        d="M 0 250 C 350 150 350 350 1300 250 L 1300 550 L 0 550 L 0 250"
      >
        <animate
          attributeName="d"
          dur="5s"
          values="M 0 250 C 350 150 350 350 1300 250 L 1300 550 L 0 550 L 0 250;
                   M 0 250 C 950 350 950 150 1300 250 L 1300 550 L 0 550 L 0 250;
                   M 0 250 C 350 150 350 350 1300 250 L 1300 550 L 0 550 L 0 250"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  </div>
  <!-- -------------------------------------------------------------------- -->
  <div class="flex flex-row py-4">
    <!-- <div class="m-auto border-t  border-gray-200 border-dashed" /> -->
  </div>
</div>

<!-- <script>
  import { scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import Module_button from '$lib/module_button.svelte';
  import { LessonManager } from '../../../stores/LessonManager.js';

  export let transition_delay;
  let red = 255;
  let green = 255;
  let blue = 255;
  $: redhegiht = 255 - red;
  $: greenhegiht = 255 - green;
  $: bluehegiht = 255 - blue;
  $: wavecolor = `rgb(${red}, ${green}, ${blue})`;
</script>

<div
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
    <div class="mt-3  w-2/4 border-t  border-gray-200 border-dashed" />
    <div class=" font-dongle text-xl text-gray-300 mx-4">module</div>
    <div class="mt-3 w-2/4 border-t  border-gray-200 border-dashed" />
  </div>

  <div class="flex flex-row justify-center items-center  m-10">
    <div class="flex flex-row ">
      <svg
        width="151"
        height="255"
        viewBox="0 0 151 255"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M150.893 177.843C150.893 220.638 117.114 255.33 75.4464 255.33C33.7785 255.33 0 220.638 0 177.843C0 135.049 75.4464 0.32959 75.4464 0.32959C75.4464 7.37379 150.893 135.049 150.893 177.843Z"
          fill="#FF0000"
        />
      </svg>

      <div
        style="height:{redhegiht}px;width:151px;background-color:white;"
        class="absolute "
      />
      <input
        bind:value={red}
        type="range"
        class="origin-center -rotate-90"
        min="0"
        max="255"
        step="1"
      />
    </div>
    <div class="flex flex-row ">
      <svg
        width="151"
        height="255"
        viewBox="0 0 151 255"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M150.893 177.843C150.893 220.638 117.114 255.33 75.4464 255.33C33.7785 255.33 0 220.638 0 177.843C0 135.049 75.4464 0.32959 75.4464 0.32959C75.4464 7.37379 150.893 135.049 150.893 177.843Z"
          fill="#40ea31"
        />
      </svg>
      <div
        style="height:{greenhegiht}px;width:151px;background-color:white;"
        class="absolute "
      />
      <input
        bind:value={green}
        type="range"
        class="origin-center -rotate-90"
        min="0"
        max="255"
        step="1"
      />
    </div>

    <div class="flex flex-row ">
      <svg
        width="151"
        height="255"
        viewBox="0 0 151 255"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M150.893 177.843C150.893 220.638 117.114 255.33 75.4464 255.33C33.7785 255.33 0 220.638 0 177.843C0 135.049 75.4464 0.32959 75.4464 0.32959C75.4464 7.37379 150.893 135.049 150.893 177.843Z"
          fill="#0019ff"
        />
      </svg>
      <div
        style="height:{bluehegiht}px;width:151px;background-color:white;"
        class="absolute "
      />
      <input
        bind:value={blue}
        type="range"
        class="origin-center -rotate-90"
        min="0"
        max="255"
        step="1"
      />
    </div>
  </div>

  <div class="flex h-30 w-full mt-4 mx-auto px-20">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      id="Calque_1"
      x="0px"
      y="0px"
      viewBox="0 0 1300 550"
      style="enable-background:new 0 0 1300 550;"
      xml:space="preserve"
    >
      <path
        style="fill:{wavecolor};enable-background:new;opacity:0.6;"
        type="text/css"
        d="M 0 250 C 600 450 650 100 1300 250 L 1300 550 L 0 550 L 0 250"
      >
        <animate
          attributeName="d"
          dur="5s"
          begin="1s"
          values="M 0 250 C 600 450 650 100 1300 250 L 1300 550 L 0 550 L 0 250;
                   M 0 250 C 600 100 650 450 1300 250 L 1300 550 L 0 550 L 0 250;
                   M 0 250 C 600 450 650 100 1300 250 L 1300 550 L 0 550 L 0 250"
          repeatCount="indefinite"
        />
      </path>

      <path
        style="fill:{wavecolor};enable-background:new;opacity:0.6;"
        type="text/css"
        d="M 0 250 C 600 100 650 450 1300 250 L 1300 550 L 0 550 L 0 250"
      >
        <animate
          attributeName="d"
          dur="5s"
          values="M 0 250 C 600 100 650 450 1300 250 L 1300 550 L 0 550 L 0 250;
                   M 0 250 C 600 450 650 100 1300 250 L 1300 550 L 0 550 L 0 250;
                   M 0 250 C 600 100 650 450 1300 250 L 1300 550 L 0 550 L 0 250"
          repeatCount="indefinite"
        />
      </path>

      <path
        style="fill:{wavecolor};enable-background:new;opacity:0.6;"
        type="text/css"
        d="M 0 250 C 950 350 950 150 1300 250 L 1300 550 L 0 550 L 0 250"
      >
        <animate
          attributeName="d"
          dur="5s"
          begin="2s"
          values="M 0 250 C 950 350 950 150 1300 250 L 1300 550 L 0 550 L 0 250;
                   M 0 250 C 350 150 350 350 1300 250 L 1300 550 L 0 550 L 0 250;
                   M 0 250 C 950 350 950 150 1300 250 L 1300 550 L 0 550 L 0 250"
          repeatCount="indefinite"
        />
      </path>

      <path
        style="fill:{wavecolor};enable-background:new;opacity:0.6;"
        type="text/css"
        d="M 0 250 C 350 150 350 350 1300 250 L 1300 550 L 0 550 L 0 250"
      >
        <animate
          attributeName="d"
          dur="5s"
          values="M 0 250 C 350 150 350 350 1300 250 L 1300 550 L 0 550 L 0 250;
                   M 0 250 C 950 350 950 150 1300 250 L 1300 550 L 0 550 L 0 250;
                   M 0 250 C 350 150 350 350 1300 250 L 1300 550 L 0 550 L 0 250"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  </div>

  <div class="flex flex-row py-4">
    <div class="mt-3  w-full border-t  border-gray-200 border-dashed" />
  </div>
</div> -->
