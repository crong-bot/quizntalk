<script>
	export let show = false;
	export let isLeaving = false;
	export let roomNumber = null;
	export let roomCode = '';
	export let onCancel = () => {};
	export let onConfirm = () => {};
</script>

{#if show}
	<div
		class="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
	>
		<div
			class="w-[420px] overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]"
		>
			<div class="bg-gradient-to-br from-rose-500 to-orange-400 px-6 py-6 text-white">
				<div class="text-[11px] font-black tracking-[0.18em] text-white/80">LEAVE ROOM</div>

				<div class="mt-2 text-[24px] font-black tracking-[-0.04em]">방에서 나갈까요?</div>

				<div class="mt-2 text-sm font-bold leading-6 text-white/85">
					나가면 현재 방에서 빠지고, 다시 참여하면 빈 역할부터 배정됩니다.
				</div>
			</div>

			<div class="px-6 py-5">
				<div class="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
					{#if roomNumber || roomCode}
						현재 방:
						{#if roomNumber}
							<span class="font-black text-slate-950">{roomNumber}번 방</span>
						{/if}

						{#if roomCode}
							<span class="ml-1 font-black text-blue-600">코드 {roomCode}</span>
						{/if}
					{:else}
						현재 참여 중인 방에서 나갑니다.
					{/if}
				</div>

				<div class="mt-5 flex justify-end gap-2">
					<button
						type="button"
						on:click={onCancel}
						disabled={isLeaving}
						class="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"
					>
						취소
					</button>

					<button
						type="button"
						on:click={onConfirm}
						disabled={isLeaving}
						class="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-black text-white transition hover:bg-rose-700 disabled:bg-slate-300"
					>
						{isLeaving ? '나가는 중...' : '방 나가기'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
