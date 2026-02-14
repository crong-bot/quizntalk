<script>
  import { beforeUpdate, onMount } from "svelte";
  import { afterUpdate } from "svelte";
  import { scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  export let transition_delay;

  let canvas;
  let strokeColor = "#575757";
  const canvasSize = {
    width: 600,
    height: 440,
  };

  afterUpdate(() => {
    deleteOldCurve();
    drawCurve();
  });

  let frequency = 30;
  let amplitude = 50;

  function drawCurve() {
    let context = canvas.getContext("2d");
    const width = canvasSize.width - 20; //Offset to not go into border
    const height = canvasSize.height;
    //Stroke properties
    context.beginPath();
    context.lineWidth = 11;
    context.strokeStyle = strokeColor;
    context.lineCap = "round";
    context.lineJoin = "round";
    var x = 6;
    var y = 0;
    var xx = 6;
    var yy = 0;

    while (x < width) {
      y = height / 2 + amplitude * Math.sin(x / frequency);
      context.lineTo(x, y);
      x = x + 1;
    }
    context.stroke();

    while (xx < width) {
      yy = height / 2 + amplitude * Math.sin(xx / frequency);
      if (xx % 30 == 0) {
        // context.beginPath();
        // // 4. 원 모양 설정
        // context.arc(xx, yy, 3, 0, 2 * Math.PI);
        // // 5. 그리기
        // context.stroke();
        // // 6. 원 내부 색 채우기
        // context.fillStyle = '#575757';
        // context.fill();
        // vertical line
        context.setLineDash([5, 3]);
        context.beginPath();
        context.moveTo(xx, yy);
        context.lineTo(xx, 360);
        context.lineWidth = 1;

        context.strokeStyle = "#575757";
        context.stroke();
        //text
        context.fillStyle = "#575757";
        context.font = "bold 15px gmarket";
        context.textAlign = "center";
        context.fillText(Math.floor(yy), xx, 380);
      }
      xx = xx + 1;
    }
  }

  $: progressBarWidth = (amplitude * 80) / 100;
  $: progressBarWidth2 = (frequency * 130) / 100;

  //Clear the canvas
  function deleteOldCurve() {
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvasSize.width, canvasSize.height);
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
  class=""
>
  <div id="container" class="bg-bg_coursecard rounded-2xl px-8 mt-14 mb-6">
    <canvas
      id="canvas"
      bind:this={canvas}
      width={canvasSize.width}
      height={canvasSize.height}
    />
  </div>
  <div class="flex flex-row justify-center items-center space-x-16 mb-6">
    <div class="flex flex-row justify-center items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-switch-vertical"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        stroke-width="3"
        stroke="#5d5d5d"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <polyline points="3 8 7 4 11 8" />
        <line x1="7" y1="4" x2="7" y2="13" />
        <polyline points="13 16 17 20 21 16" />
        <line x1="17" y1="10" x2="17" y2="20" />
      </svg>

      <div class="mainContainerCursor">
        <input
          type="range"
          bind:value={amplitude}
          min="0"
          max="100"
          id="cursor"
        />
        <div class="progressBar" style="width:{progressBarWidth}px" />
      </div>
    </div>

    <div class="flex flex-row justify-center items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-switch-horizontal"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        stroke-width="3"
        stroke="#5d5d5d"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <polyline points="16 3 20 7 16 11" />
        <line x1="10" y1="7" x2="20" y2="7" />
        <polyline points="8 13 4 17 8 21" />
        <line x1="4" y1="17" x2="13" y2="17" />
      </svg>

      <div class="mainContainerCursor">
        <input
          type="range"
          bind:value={frequency}
          min="1"
          max="50"
          id="cursor"
        />
        <div class="progressBar" style="width:{progressBarWidth2}px" />
      </div>
    </div>
  </div>
</div>

<style>
  #container {
    box-shadow:
      0px 18px 80px rgba(0, 0, 0, 0.03),
      0px 7.51997px 33.4221px rgba(0, 0, 0, 0.0215656),
      0px 4.02054px 17.869px rgba(0, 0, 0, 0.0178832),
      0px 2.25388px 10.0172px rgba(0, 0, 0, 0.015),
      0px 1.19702px 5.32008px rgba(0, 0, 0, 0.0121168),
      0px 0.498106px 2.21381px rgba(0, 0, 0, 0.00843437);
    border-radius: 48px;
    box-sizing: border-box;
    background-color: white;
  }

  .mainContainerCursor {
    display: flex;
    flex-direction: row;
    position: relative;
    align-items: center;
  }
  input[type="range"] {
    padding-top: 16px;
    padding-bottom: 16px;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    width: 80px;
    margin: 0px;
  }
  .progressBar {
    height: 4px;
    border-radius: 50px;
    position: absolute;
    background-color: #5863f8;
    top: 16px;
    left: 0px;
    z-index: 0;
  }
  /***** Track Styles *****/
  /***** Chrome, Safari, Opera, and Edge Chromium *****/
  input[type="range"]::-webkit-slider-runnable-track {
    background: rgba(0, 0, 0, 0.1);
    height: 4px;
    border-radius: 50px;
    z-index: 2;
  }
  /******** Firefox ********/
  input[type="range"]::-moz-range-track {
    background: rgba(0, 0, 0, 0.1);
    height: 4px;
    border-radius: 50px;
  }
  input[type="range"]::-moz-range-progress {
    background-color: #5863f8;
    height: 4px;
  }
  /***** Thumb Styles *****/
  /***** Chrome, Safari, Opera, and Edge Chromium *****/
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    margin-top: -6px; /* Centers thumb on the track */
    background-color: white;
    height: 16px;
    width: 16px;
    border-radius: 100px;
    box-shadow:
      0px 26px 80px rgba(0, 0, 0, 0.15),
      0px 10.8622px 33.4221px rgba(0, 0, 0, 0.107828),
      0px 5.80744px 17.869px rgba(0, 0, 0, 0.0894161),
      0px 3.2556px 10.0172px rgba(0, 0, 0, 0.075),
      0px 1.72903px 5.32008px rgba(0, 0, 0, 0.0605839),
      0px 0.719487px 2.21381px rgba(0, 0, 0, 0.0421718);
    transition: all 150ms linear;
  }
  /***** Thumb Styles *****/
  /***** Firefox *****/
  input[type="range"]::-moz-range-thumb {
    border: none; /*Removes extra border that FF applies*/
    border-radius: 100px; /*Removes default border-radius that FF applies*/
    background-color: white;
    height: 16px;
    width: 16px;
    transition: all 150ms linear;
  }
  .mainContainerCursor:hover input[type="range"]::-webkit-slider-thumb {
    transform: scale(1.2);
  }
  .mainContainerCursor:hover input[type="range"]::-moz-range-thumb {
    transform: scale(1.2);
  }
</style>
