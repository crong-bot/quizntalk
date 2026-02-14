<script>
  import { scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { LessonManager } from "../../stores/LessonManager";
  import { page } from "$app/stores";
  import toast, { Toaster } from "svelte-french-toast";
  import { element } from "svelte/internal";

  export let question;
  export let type;
  export let example;
  export let photos;
  //export let transition_delay;
  export let parentState;
  export let questionNum;

  let lesson_name;
  let chapter;
  // 라디오버튼 그룹변수
  let b = "1";
  let loading = true;
  

  function CheckAnswer(data) {
    let answersList = [];
    [lesson_name, chapter] = [...$page.url.pathname.split("/").slice(-2)];

    for (let i in data) {
      answersList.push(data[i]);
    }
    //
    //console.log(data + "CheckAnswer");
    //questionNum 있는 것과 없는 것 대응하기 위해
    let is_same = answersList.every((element, index) => {
      if (questionNum) {
        return (
          element ==
          $LessonManager[lesson_name][chapter][questionNum]["answer"][index]
        );
      } else {
        return element == $LessonManager[lesson_name][chapter]["answer"][index];
      }
    });

    if (is_same == true) {
      if (questionNum) {
        $LessonManager[lesson_name][chapter][questionNum]["success"] = is_same;
        //모든 문제가 성공이면 parentState를 바꿔주는 로직
        let a = Object.keys($LessonManager[lesson_name][chapter]);
        console.log($LessonManager[lesson_name][chapter][1]["success"]);
        console.log($LessonManager[lesson_name][chapter][2]["success"]);
        //두 개이상의 문제의 답이 모두 맞았는지 확인하는 코드
        let result = a.every((element, index) => {
          return (
            $LessonManager[lesson_name][chapter][element]["success"] == true
          );
        });
        if (result == true) parentState = true;
        console.log($LessonManager[lesson_name][chapter][1]["success"]);
        console.log($LessonManager[lesson_name][chapter][2]["success"]);
      } else {
        $LessonManager[lesson_name][chapter]["success"] = is_same;
        //문제가 하나인거니까 바로 true로 바꾸어줘도 됨
        parentState = true;
      }

      toast("정답입니다!!", {
        icon: "👏",
        style:
          "font-family: Dodum; font-size:20px; border-radius: 200px; background: #333; color: #fff;",
        position: "top-center",
      });
      // 부모의 변수 바꿔주기 위해!!
    } else {
      toast("다시 생각해보세요.", {
        icon: "🤔",
        style:
          "font-family: Dodum; font-size:20px; border-radius: 200px; background: #333; color: #fff;",
        position: "top-center",
      });
    }
  }
</script>

<div
  {questionNum}
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
    class="max-w-xl mx-auto px-8 py-8 flex-row justify-center border rounded-xl"
  >
    <div class="font-gmarket font-bold text-2xl text-navytext">QUIZ</div>
    <div id="question" class="font-dodum text-xl my-3">{question}</div>
    <div class="mt-12 mb-8 w-full border-t border-gray-200 border-solid" />

    {#if type === "multiple"}
      <div id="answers" class="text-white font-gmarket font-medium text-lg">
        <div
          class="w-11/12 p-4 mb-4 rounded-md bg-answer1 border-b-4 border-answer1s flex"
        >
          <label for="rad1" class="checkBox">
            <input id="ch1" bind:group={b} value="1" type="radio" name="rads" />
            <div class="transition" />
          </label>
          <span class="self-center ml-4 pt-1"> {example.one}</span>
        </div>

        <div
          class="w-11/12 p-4 mb-4 rounded-md bg-answer2 border-b-4 border-answer2s flex"
        >
          <label for="rad2" class="checkBox">
            <input id="ch2" bind:group={b} value="2" type="radio" name="rads" />
            <div class="transition" />
          </label>
          <span class="self-center ml-4 pt-1"> {example.two}</span>
        </div>
        <div
          class="w-11/12 p-4 mb-4 rounded-md bg-answer3 border-b-4 border-answer3s flex"
        >
          <label for="rad3" class="checkBox">
            <input id="ch3" bind:group={b} value="3" type="radio" name="rads" />
            <div class="transition" />
          </label>
          <span class="self-center ml-4 pt-1"> {example.three}</span>
        </div>
        <div
          class="w-11/12 p-4 mb-4 rounded-md bg-answer4 border-b-4 border-answer4s flex"
        >
          <label for="rad3" class="checkBox">
            <input id="ch3" bind:group={b} value="4" type="radio" name="rads" />
            <div class="transition" />
          </label>
          <span class="self-center ml-4 pt-1"> {example.four}</span>
        </div>
      </div>
    {:else if type === "ox"}
      <div
        id="answers"
        class="text-white font-gmarket font-medium text-2xl flex space-x-6"
      >
        <div
          class="w-11/12 p-4 mb-4 rounded-md bg-answer1 border-b-4 border-answer1s flex"
        >
          <label class="checkBox">
            <input bind:group={b} value="o" type="radio" />
            <div class="transition" />
          </label>
          <span class="self-center ml-4 pt-1"> O</span>
        </div>

        <div
          class="w-11/12 p-4 mb-4 rounded-md bg-answer2 border-b-4 border-answer2s flex"
        >
          <label class="checkBox">
            <input bind:group={b} value="x" type="radio" />
            <div class="transition" />
          </label>
          <span class="self-center ml-4 pt-1">X</span>
        </div>
      </div>
    {:else if type === "short"}
      <div id="answers" class="text-navytext font-gmarket font-medium text-lg">
        <input
          type="text"
          class="w-11/12 p-4 mb-4 rounded-md border"
          bind:value={b}
        />
      </div>
    {:else if type === "photo"}
      <div
        id="answers"
        class="text-white font-gmarket font-medium text-2xl flex space-x-6"
      >
        {#each photos as photo, i}
          <div
            class="w-1/2 p-4 mb-4 rounded-md bg-gray-300 flex flex-col space-y-10 items-center justify-center"
          >
            <img class="object-contain" src={photo} alt="wave" />

            <label class="checkBox">
              <input bind:group={b} value={i + 1} type="radio" />
              <div class="transition" />
            </label>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <button
    on:click={CheckAnswer(b)}
    class="font-dongle font-thin text-2xl text-white rounded-lg h-12 w-40 bg-checkbtn flex items-center justify-center m-auto mt-4"
    >확 인</button
  >

  <!-- ----------------------------------------------------------------------------------------- -->
  <div class="flex flex-row py-4">
    <div class="mt-3 w-full border-t border-gray-200 border-dashed" />
  </div>
</div>

<style>
  .checkBox {
    display: block;
    cursor: pointer;
    width: 30px;
    height: 30px;
    border: 3px solid rgba(255, 255, 255, 0);
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    box-shadow: 0px 0px 0px 2px #fff;
  }

  .checkBox div {
    width: 60px;
    height: 60px;
    background-color: #fff;
    top: -52px;
    left: -52px;
    position: absolute;
    transform: rotateZ(45deg);
    z-index: 100;
  }

  .checkBox input[type="radio"]:checked + div {
    left: -30px;
    top: -10px;
  }
  [type="radio"] {
    vertical-align: middle;
    appearance: none;
    width: 30px;
    height: 30px;
    border: 3px solid rgba(255, 255, 255, 0);
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    box-shadow: 0px 0px 0px 2px #fff;
  }

  .transition {
    transition: 300ms ease;
  }
</style>
