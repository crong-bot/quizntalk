<script>
	export let status = 'editing';
	export let hasExecuted = false;
</script>

<div class="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
	<div class="text-base font-extrabold text-slate-900">실행 로그</div>

	<ul class="mt-2 space-y-1 text-xs font-semibold leading-relaxed text-slate-600">
		<li>• 민서는 전력 단서를 확인했어요.</li>

		{#if status === 'editing'}
			<li>• 다음 단계: priority 값 완성</li>
		{:else if status === 'checked'}
			<li>• 검사 성공! 실행하기를 눌러 보세요.</li>
		{:else if hasExecuted}
			<li>• 전력 시스템이 공용 월드에 반영되었어요.</li>
		{/if}

		<li>• 모든 팀원의 실행이 모이면 최종 장면이 열립니다.</li>
	</ul>
</div>
