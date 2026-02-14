<script>
  import { scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { onMount } from "svelte";

  export let chat_direction;
  //export let transition_delay;

  let current_date;
  let date = new Date();
  function formatAMPM(data) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    current_date = strTime;
  }
  formatAMPM(date);
</script>

{#if chat_direction}
  <div
    id="bubble"
    on:introend
    in:scale={{
      delay: 0,
      duration: 600,
      easing: quintOut,
    }}
    out:scale={{
      delay: 0,
      duration: 0,
    }}
    class="mt-2 mb-4 w-80 flex flex-row bg-chat rounded-r-3xl rounded-b-3xl pt-2 pb-4 pl-3 pr-4 space-x-3 font-dodum"
  >
    <div class="w-12 flex pt-3 justify-end">
      <svg
        width="48"
        height="50"
        viewBox="0 0 48 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <rect
          width="47.4747"
          height="50"
          fill="url(#pattern0)"
          fill-opacity="0.6"
        />
        <defs>
          <pattern
            id="pattern0"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use
              xlink:href="#image0_163_1392"
              transform="scale(0.0106383 0.010101)"
            />
          </pattern>
          <image
            id="image0_163_1392"
            width="94"
            height="99"
            xlink:href="data:image/png;base64,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"
          />
        </defs>
      </svg>
    </div>
    <div class="flex flex-col">
      <div class="flex flex-row space-x-2">
        <div
          class="rounded-xl bg-teal-100 h-5 pb-4 text-teal-500 font-dongle text-xl font-thin px-5 leading-5"
        >
          학생
        </div>
        <div
          class="rounded-xl bg-purple-100 h-5 pb-4 text-purple-500 font-dongle text-xl font-thin px-5 leading-5"
        >
          게스트
        </div>
      </div>
      <div class="flex flex-row">
        <div class="text-lg">유헌수</div>
        <div class="text-xs pt-2 pl-2">{current_date}</div>
      </div>
      <div class="break-all text-sm">
        <slot />
      </div>
    </div>
  </div>
{:else}
  <div
    id="bubble"
    on:introend
    in:scale={{
      delay: 0,
      duration: 800,
      easing: quintOut,
    }}
    out:scale={{
      delay: 0,
      duration: 0,
    }}
    class="ml-auto mr-1 mt-2 mb-4 w-80 flex flex-row bg-chat rounded-r-3xl rounded-b-3xl pt-2 pb-4 pl-3 pr-4 space-x-3 font-dodum"
  >
    <div class="w-12 flex pt-3 justify-end">
      <svg
        width="52"
        height="62"
        viewBox="0 0 52 62"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.6">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M26.4794 10.885C27.1756 9.8906 27.6272 9.50948 28.5506 9.62948C29.2433 9.71837 29.6617 10.17 29.9433 10.8128C30.0856 11.1373 30.1656 11.4145 30.3244 12.0495L30.3306 12.0739C30.4522 12.5595 30.5122 12.77 30.5844 12.9428C42.2794 16.46 51 27.7012 51 40.6612C51 48.29 48.4322 53.5345 43.4889 56.6817C39.3106 59.3423 33.6144 60.4445 26 60.4445C18.3856 60.4445 12.6894 59.3423 8.51111 56.6817C3.56778 53.5345 1 48.29 1 40.6612C1 29.4045 8.40889 18.8095 19.01 12.9689C19.5067 12.695 19.9656 12.1656 20.9133 10.84L21.0244 10.6845C22.4717 8.66226 23.2467 7.8806 24.585 7.68226C25.595 7.53226 26.0972 8.19893 26.3017 9.11004C26.3906 9.50671 26.4217 9.85726 26.4683 10.6978L26.4733 10.7812L26.4794 10.885Z"
            stroke="#503932"
            stroke-width="2"
          />
          <mask
            id="mask0_1364_3648"
            style="mask-type:luminance"
            maskUnits="userSpaceOnUse"
            x="2"
            y="8"
            width="48"
            height="52"
          >
            <path
              d="M26.0002 59.3328C39.1935 59.3328 49.8891 55.9867 49.8891 40.6606C49.8891 27.455 40.7169 17.0489 30.0458 13.9411C29.1808 13.6894 29.303 10.8467 28.4085 10.73C27.5302 10.6167 26.9047 12.9094 26.0002 12.9094C24.9658 12.9094 25.7474 8.63278 24.748 8.78112C22.738 9.07889 21.4552 12.8894 19.5463 13.9411C10.293 19.04 2.11133 28.9511 2.11133 40.6606C2.11133 55.9867 12.8069 59.3328 26.0002 59.3328Z"
              fill="white"
            />
          </mask>
          <g mask="url(#mask0_1364_3648)">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M-6.95703 6.33887H54.7557V65.9855H-6.95703V6.33887Z"
              fill="white"
            />
          </g>
          <path
            d="M36.3962 37.1595C37.6177 37.1595 38.6079 36.1669 38.6079 34.9423C38.6079 33.7178 37.6177 32.7251 36.3962 32.7251C35.1748 32.7251 34.1846 33.7178 34.1846 34.9423C34.1846 36.1669 35.1748 37.1595 36.3962 37.1595Z"
            fill="#503932"
            stroke="#503932"
            stroke-width="0.5"
          />
          <path
            d="M36.3962 37.1595C37.6177 37.1595 38.6079 36.1669 38.6079 34.9423C38.6079 33.7178 37.6177 32.7251 36.3962 32.7251C35.1748 32.7251 34.1846 33.7178 34.1846 34.9423C34.1846 36.1669 35.1748 37.1595 36.3962 37.1595Z"
            fill="#503932"
            stroke="#503932"
            stroke-width="0.5"
          />
          <path
            d="M13.8337 37.1595C15.0552 37.1595 16.0454 36.1669 16.0454 34.9423C16.0454 33.7178 15.0552 32.7251 13.8337 32.7251C12.6123 32.7251 11.6221 33.7178 11.6221 34.9423C11.6221 36.1669 12.6123 37.1595 13.8337 37.1595Z"
            fill="#503932"
            stroke="#503932"
            stroke-width="0.5"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M21.028 43.4109L22.8791 45.1581C23.5758 45.8155 24.4962 46.1837 25.454 46.1883C26.4119 46.1928 27.3357 45.8333 28.0386 45.1825L29.9469 43.4159C30.0453 43.3248 30.114 43.2062 30.144 43.0755C30.174 42.9449 30.1639 42.8082 30.115 42.6833C30.0661 42.5585 29.9807 42.4513 29.8699 42.3757C29.7592 42.3001 29.6282 42.2597 29.4941 42.2598H21.4858C21.3524 42.2598 21.222 42.2999 21.1116 42.3748C21.0012 42.4498 20.9158 42.5561 20.8665 42.6801C20.8172 42.8041 20.8063 42.94 20.835 43.0703C20.8638 43.2006 20.931 43.3192 21.028 43.4109Z"
            fill="#FFFC27"
            stroke="#503932"
            stroke-width="2"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M18.8624 39.7295L23.8385 36.1873C24.1578 35.9601 24.5368 35.8317 24.9284 35.8181C25.32 35.8045 25.707 35.9062 26.0413 36.1106L31.8635 39.6695C32.1528 39.8463 32.3764 40.1129 32.5002 40.4285C32.6241 40.7442 32.6414 41.0916 32.5496 41.418C32.4577 41.7444 32.2618 42.0319 31.9915 42.2366C31.7212 42.4414 31.3915 42.5522 31.0524 42.5523H19.764C19.4343 42.5522 19.1131 42.4473 18.8469 42.2528C18.5806 42.0582 18.3831 41.7841 18.2827 41.47C18.1824 41.1559 18.1845 40.8181 18.2887 40.5052C18.3929 40.1924 18.5938 39.9207 18.8624 39.7295Z"
            fill="#FFFC27"
            stroke="#503932"
            stroke-width="2"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.2527 20.2756C9.36769 13.1789 2.41047 3.7089 8.23269 5.46001C12.1144 6.62723 15.2594 9.14167 17.6688 13.0028C12.4494 5.55001 11.3116 2.27223 14.256 3.17056C17.2005 4.06834 19.9449 6.35779 22.4877 10.0395C16.666 1.06001 16.866 -1.22944 23.0899 3.17056C29.3138 7.57056 30.8199 11.5661 27.6077 15.1578L25.901 28.2222C20.0588 27.6556 15.8421 25.0067 13.2527 20.2756Z"
            fill="#FF4327"
            stroke="#503932"
            stroke-width="2"
          />
        </g>
      </svg>
    </div>
    <div class="flex flex-col">
      <div class="flex flex-row space-x-2">
        <div
          class="rounded-xl bg-red-100 h-5 pb-4 text-rose-500 font-dongle text-xl font-thin px-5 leading-5"
        >
          선생님
        </div>
        <div
          class="rounded-xl bg-blue-100 h-5 pb-1 text-blue-500 font-dongle text-xl font-thin px-5 leading-5"
        >
          방장
        </div>
      </div>
      <div class="flex flex-row">
        <div class="text-lg">선생님</div>
        <div class="text-xs pt-2 pl-2">{current_date}</div>
      </div>
      <div class="break-all text-sm">
        <slot />
      </div>
    </div>
  </div>
{/if}

<!-- <style>
 #bubble {
  display: none
 }

</style> -->
