<script>
	import { getPlayerContext } from '$lib/player/playerContext';

	const playerStore = getPlayerContext();

	$: $playerStore;
	$: grid = $playerStore.pixelGrid;

	function toggle(rowIndex, colIndex) {
		playerStore.actions.togglePixel(rowIndex, colIndex);
	}
</script>

<div
	class="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
>
	<h3 class="text-[30px] font-extrabold tracking-[-0.03em] text-slate-900">
		3. 픽셀(점)을 숫자로 표현해보기
	</h3>

	<div class="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_70px_1fr] xl:items-center">
		<div>
			<div class="mb-3 text-[20px] font-bold text-slate-700">(1) 도트 하트</div>
			<div
				class="inline-grid gap-[2px] rounded-[20px] border border-slate-200 bg-white p-4"
				style={`grid-template-columns: repeat(${grid[0].length}, minmax(0, 1fr));`}
			>
				{#each grid as row, rowIndex}
					{#each row as cell, colIndex}
						<button
							type="button"
							on:click={() => toggle(rowIndex, colIndex)}
							class={`h-6 w-6 rounded-[3px] border border-slate-100 ${
								cell === 255 ? 'bg-black' : 'bg-white'
							}`}
						></button>
					{/each}
				{/each}
			</div>
		</div>

		<div class="text-center text-5xl font-extrabold text-slate-300">→</div>

		<div>
			<div class="mb-3 text-[20px] font-bold text-blue-600">(2) 숫자로 변환된 모습</div>
			<div class="overflow-hidden rounded-[20px] border border-slate-200">
				<div class="overflow-auto bg-white p-3">
					<table class="border-collapse text-center text-xs font-bold text-slate-700">
						{#each grid as row}
							<tr>
								{#each row as cell}
									<td class="border border-slate-200 px-2 py-1">{cell}</td>
								{/each}
							</tr>
						{/each}
					</table>
				</div>
			</div>

			<div class="mt-4 flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600">
				<div class="flex items-center gap-2">
					<span class="h-4 w-4 rounded border border-slate-300 bg-white"></span>0 = 흰색
				</div>
				<div class="flex items-center gap-2">
					<span class="h-4 w-4 rounded bg-black"></span>255 = 검은색
				</div>
			</div>
		</div>
	</div>
</div>
