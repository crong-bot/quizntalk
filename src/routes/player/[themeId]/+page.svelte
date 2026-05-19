<!-- C:\quizntalk\src\routes\player\[themeId]\+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import JsonMissionWorkspace from '$lib/components/workplace/JsonMissionWorkspace.svelte';
	import { getCourseByThemeId } from '$lib/components/workplace/theme/courseRegistry';

	export let data;

	$: selectedCourse = getCourseByThemeId(data.themeId);

	function goBackToThemeSelect() {
		goto('/player');
	}
</script>

{#if !selectedCourse}
	<div class="flex min-h-screen items-center justify-center bg-[#eef3fb] px-4 font-nanum">
		<div class="w-full max-w-[520px] rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
			<div class="font-gmarket text-[11px] font-bold tracking-[0.16em] text-rose-500">
				MOCK ERROR
			</div>

			<h1 class="mt-2 font-gmarket text-[26px] font-bold tracking-[-0.06em] text-slate-950">
				테마를 찾을 수 없습니다
			</h1>

			<p class="mt-2 text-[14px] font-bold leading-6 text-slate-500">
				등록되지 않은 목업 테마입니다. 테마 선택 화면으로 돌아가 주세요.
			</p>

			<button
				type="button"
				on:click={goBackToThemeSelect}
				class="mt-5 h-13 w-full rounded-2xl bg-blue-600 text-[15px] font-extrabold text-white shadow-[0_16px_34px_rgba(37,99,235,0.25)] transition hover:bg-blue-700"
			>
				테마 선택으로 돌아가기
			</button>
		</div>
	</div>
{:else}
	<div class="relative min-h-screen bg-[#eef3fb]">
		<div class="absolute left-4 top-4 z-[60]">
			<button
				type="button"
				on:click={goBackToThemeSelect}
				class="rounded-2xl border border-slate-200 bg-white/95 px-4 py-2 text-[13px] font-black text-slate-700 shadow-sm backdrop-blur transition hover:bg-slate-50"
			>
				← 테마 선택
			</button>
		</div>

		<JsonMissionWorkspace useMockPlayers={true} course={selectedCourse} />
	</div>
{/if}
