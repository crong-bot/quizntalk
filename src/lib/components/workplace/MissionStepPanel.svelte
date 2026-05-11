<script>
	export let status = 'editing';

	$: jsonDone = status !== 'editing';
	$: checkedDone = status === 'checked' || status === 'executed';
	$: executedDone = status === 'executed';
</script>

<div class="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
	<div class="text-base font-extrabold text-slate-900">내 진행 단계</div>

	<div class="mt-3 space-y-2 text-sm font-bold">
		<div class="flex justify-between text-emerald-600">
			<span>1 단서 확인</span>
			<span>완료</span>
		</div>

		<div class={`flex justify-between ${jsonDone ? 'text-emerald-600' : 'text-blue-600'}`}>
			<span>2 JSON 입력</span>
			<span>{jsonDone ? '완료' : '진행중'}</span>
		</div>

		<div class={`flex justify-between ${checkedDone ? 'text-emerald-600' : 'text-slate-400'}`}>
			<span>3 검사 성공</span>
			<span>{checkedDone ? '완료' : '대기'}</span>
		</div>

		<div class={`flex justify-between ${executedDone ? 'text-emerald-600' : 'text-slate-400'}`}>
			<span>4 실행</span>
			<span>{executedDone ? '완료' : '잠김'}</span>
		</div>
	</div>
</div>
