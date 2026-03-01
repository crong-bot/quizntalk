<script>
  import { LessonManager } from "../stores/LessonManager.js";
  import { page } from "$app/stores";
  import toast, { Toaster } from "svelte-french-toast";

  export let data;
  let lesson_name;
  let chapter;

  function CheckAnswer(data) {
    let answersList = [];
    [lesson_name, chapter] = [...$page.url.pathname.split("/").slice(-2)];

    for (let i in data) {
      answersList.push(data[i]);
    }
    //
    console.log(data);
    let is_same = answersList.every((element, index) => {
      return element == $LessonManager[lesson_name][chapter]["answer"][index];
    });

    if (is_same == true) {
      $LessonManager[lesson_name][chapter]["success"] = is_same;
      toast("정답입니다!!", {
        icon: "👏",
        style:
          "font-family: Dodum; font-size:20px; border-radius: 200px; background: #333; color: #fff;",
        position: "top-center",
      });
    } else {
      toast("다시 생각해보세요.", {
        icon: "🤔",
        style:
          "font-family: Dodum; font-size:20px; border-radius: 200px; background: #333; color: #fff;",
        position: "top-center",
      });
    }
  }
  //모듈에서 정답폼을 받아서 Props로 받아온다. 객체형태의 Props를 리스트로 변환-> 정답과 모두 같은지 every로 확인
  // ->모두 같아야 true가 나온다. is_same이 true 라면 Store의 레슨정보에서 Success를 true로 바꾼다. 그 뒤 넘기기 가능
</script>

<button
  on:click={CheckAnswer(data)}
  class="font-dongle font-thin text-xl text-white rounded-lg h-8 w-14 bg-orange-400 flex items-center justify-center absolute right-10 bottom-24"
  >확 인</button
>
