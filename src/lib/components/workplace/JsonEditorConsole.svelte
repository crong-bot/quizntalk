<script>
	export let logs = [];
	export let canExecute = false;
	export let status = 'editing';

	function getStatusText() {
		if (status === 'executed') return 'EXECUTED';
		if (canExecute) return 'READY';
		return 'WAITING';
	}

	function getCommandText() {
		if (status === 'executed') return 'execute --sync-world';
		if (canExecute) return 'ready --execute';
		return 'check --json';
	}

	function getLinePrefix(type) {
		if (type === 'success') return 'OK';
		if (type === 'warning') return 'WARN';
		if (type === 'error') return 'ERROR';
		if (type === 'send') return 'SEND';
		if (type === 'info') return 'INFO';
		return 'LOG';
	}

	function getLineClass(type) {
		if (type === 'success') return 'text-emerald-300';
		if (type === 'warning') return 'text-amber-300';
		if (type === 'error') return 'text-rose-300';
		if (type === 'send') return 'text-violet-300';
		if (type === 'info') return 'text-sky-300';
		return 'text-slate-300';
	}

	function getBadgeClass() {
		if (status === 'executed') {
			return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300';
		}

		if (canExecute) {
			return 'border-violet-400/30 bg-violet-400/10 text-violet-300';
		}

		return 'border-slate-500/30 bg-slate-500/10 text-slate-400';
	}
</script>

<div
	class="overflow-hidden rounded-2xl border border-slate-800 bg-[#050b16] shadow-[0_18px_50px_rgba(2,6,23,0.28)] ring-1 ring-white/5"
>
	<div class="flex items-center justify-between border-b border-white/10 bg-slate-900 px-4 py-2.5">
		<div class="flex items-center gap-2">
			<div class="h-3 w-3 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.65)]"></div>
			<div class="h-3 w-3 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.55)]"></div>
			<div
				class="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.55)]"
			></div>

			<div class="ml-2 text-xs font-black tracking-[0.14em] text-slate-200">MOON-BASE SHELL</div>

			<div
				class="hidden rounded-full bg-sky-400/10 px-2 py-0.5 text-[10px] font-black text-sky-300 sm:block"
			>
				JSON LINK
			</div>
		</div>

		<div
			class={`rounded-full border px-2.5 py-1 text-[10px] font-black tracking-[0.12em] ${getBadgeClass()}`}
		>
			{getStatusText()}
		</div>
	</div>

	<div
		class="terminal-body max-h-[126px] min-h-[108px] overflow-y-auto px-4 py-3 font-mono text-xs leading-6"
	>
		<div class="relative">
			<div class="text-slate-500">
				<span class="text-emerald-300">mission@moon-base</span>
				<span class="text-slate-400">:</span>
				<span class="text-sky-300">~</span>
				<span class="text-slate-400">$</span>
				<span class="ml-2 text-slate-200">{getCommandText()}</span>
				<span class="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-sky-300/80"></span>
			</div>

			{#if logs.length === 0}
				<div class="mt-2 text-slate-500">
					<span class="text-slate-600">&gt;</span>
					복구 명령 JSON을 작성한 뒤 검사하기를 누르세요.
				</div>
			{:else}
				<div class="mt-2 space-y-0.5">
					{#each logs as log}
						<div class={`flex gap-2 ${getLineClass(log.type)}`}>
							<span class="w-[58px] shrink-0 font-black">
								[{getLinePrefix(log.type)}]
							</span>

							<span class="min-w-0 break-words">
								{log.text}
							</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.terminal-body {
		background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.08), transparent 34%),
			linear-gradient(180deg, rgba(15, 23, 42, 0.72), rgba(2, 6, 23, 0.94));
		position: relative;
	}

	.terminal-body::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0.08;
		background-image: linear-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px);
		background-size: 100% 14px;
	}
</style>
