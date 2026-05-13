<script>
	export let state = {
		visible: false,
		phase: 'idle',
		roleName: '',
		message: '',
		progress: 0
	};

	$: isError = state.phase === 'error';
	$: isSuccess = state.phase === 'success';
	$: isActive = state.visible && state.phase !== 'idle';

	$: phaseLabel =
		state.phase === 'idle'
			? 'READY'
			: state.phase === 'sending'
			  ? 'SEND'
			  : state.phase === 'validating'
			    ? 'CHECK'
			    : state.phase === 'mapping'
			      ? 'MAP'
			      : state.phase === 'applying'
			        ? 'APPLY'
			        : state.phase === 'success'
			          ? 'DONE'
			          : 'ERROR';
</script>

<div
	class={`relative h-[46px] shrink-0 overflow-hidden rounded-2xl border px-3 py-2 shadow-sm transition-all duration-300 ${
		isActive
			? isError
				? 'border-rose-200 bg-rose-50'
				: isSuccess
				  ? 'border-emerald-200 bg-emerald-50'
				  : 'border-blue-100 bg-white'
			: 'border-slate-200 bg-white'
	}`}
>
	<div class="flex h-full items-center gap-3">
		<div
			class={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[15px] ${
				isError
					? 'bg-rose-100 text-rose-600'
					: isSuccess
					  ? 'bg-emerald-100 text-emerald-700'
					  : 'bg-blue-50 text-blue-600'
			}`}
		>
			{#if isError}
				⚠️
			{:else if isSuccess}
				✅
			{:else if state.phase === 'idle'}
				📡
			{:else}
				🛰️
			{/if}
		</div>

		<div class="min-w-0 flex-1">
			<div class="flex items-center justify-between gap-2">
				<div class="min-w-0 truncate text-[12px] font-black text-slate-900">
					{#if state.phase === 'idle'}
						공용 시스템 명령 대기
					{:else}
						{state.roleName} 요원 · {state.message}
					{/if}
				</div>

				<div
					class={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black tracking-[0.12em] ${
						isError
							? 'bg-rose-100 text-rose-600'
							: isSuccess
							  ? 'bg-emerald-100 text-emerald-700'
							  : 'bg-blue-50 text-blue-600'
					}`}
				>
					{phaseLabel}
				</div>
			</div>

			<div class="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-200">
				<div
					class={`h-full rounded-full transition-all duration-500 ${
						isError ? 'bg-rose-500' : isSuccess ? 'bg-emerald-500' : 'bg-blue-600'
					}`}
					style={`width: ${Math.max(0, Math.min(state.progress, 100))}%`}
				></div>
			</div>
		</div>
	</div>

	{#if isActive && !isError && !isSuccess}
		<div
			class="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-blue-100/45 to-transparent"
		></div>
	{/if}
</div>
