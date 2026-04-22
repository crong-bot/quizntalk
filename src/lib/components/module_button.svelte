<script>
	import { page } from '$app/stores';
	import toast from 'svelte-french-toast';
	import { LessonManager } from '../stores/LessonManager.js';

	export let data;

	function CheckAnswer(data) {
		console.log(data);
		const [lesson_name, chapter] = $page.url.pathname.split('/').slice(-2);
		const answersList = Object.values(data);

		const correctAnswers = $LessonManager[lesson_name][chapter]['answer'];

		const isSame = answersList.every((element, index) => {
			return element === correctAnswers[index];
		});

		if (isSame) {
			LessonManager.update((state) => {
				state[lesson_name][chapter]['success'] = true;
				return state;
			});

			toast('정답입니다!!', {
				icon: '👏',
				style:
					'font-family: Dodum; font-size:20px; border-radius: 200px; background: #333; color: #fff;',
				position: 'top-center'
			});
		} else {
			toast('다시 생각해보세요.', {
				icon: '🤔',
				style:
					'font-family: Dodum; font-size:20px; border-radius: 200px; background: #333; color: #fff;',
				position: 'top-center'
			});
		}
	}
</script>

<button on:click={() => CheckAnswer(data)}> 확 인 </button>
