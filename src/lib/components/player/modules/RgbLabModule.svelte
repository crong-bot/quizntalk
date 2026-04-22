<script>
	import { getPlayerContext } from '$lib/player/playerContext';

	const playerStore = getPlayerContext();
	const currentStageStore = playerStore.currentStage;
	const currentStageDataStore = playerStore.currentStageData;

	const presetColors = [
		[255, 77, 79],
		[255, 165, 0],
		[250, 219, 20],
		[82, 196, 26],
		[54, 207, 201],
		[64, 169, 255],
		[114, 46, 209],
		[235, 47, 150],
		[255, 255, 255],
		[188, 188, 188],
		[0, 0, 0]
	];

	$: stage = $currentStageStore;
	$: stageData = $currentStageDataStore;
	$: rgb = stageData?.rgb || { r: 255, g: 165, b: 0 };
	$: colorStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

	function updateRgb(partial) {
		playerStore.actions.setStageData(stage.id, {
			...stageData,
			rgb: {
				...rgb,
				...partial
			},
			touched: true
		});
	}

	function onRChange(e) {
		updateRgb({ r: Number(e.currentTarget.value) });
	}

	function onGChange(e) {
		updateRgb({ g: Number(e.currentTarget.value) });
	}

	function onBChange(e) {
		updateRgb({ b: Number(e.currentTarget.value) });
	}

	function applyPreset(color) {
		updateRgb({
			r: color[0],
			g: color[1],
			b: color[2]
		});
	}
</script>

<div class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_430px]">
	<div
		class="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
	>
		<h3 class="text-[30px] font-extrabold tracking-[-0.03em] text-slate-900">
			1. 색상을 바꿔보며 RGB 값 확인하기
		</h3>

		<div class="mt-5 grid grid-cols-[minmax(0,1fr)_140px] gap-5">
			<div>
				<div class="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
					<div
						class="h-[330px] rounded-[20px] border border-slate-200"
						style={`background:
							linear-gradient(to top, black, transparent),
							linear-gradient(to right, white, transparent),
							${colorStyle};`}
					></div>
				</div>

				<div class="mt-5 flex flex-wrap gap-3">
					{#each presetColors as c}
						<button
							type="button"
							class={`h-12 w-12 rounded-xl border-2 transition ${
								rgb.r === c[0] && rgb.g === c[1] && rgb.b === c[2]
									? 'border-blue-500 ring-2 ring-blue-200'
									: 'border-slate-200'
							}`}
							style={`background-color: rgb(${c[0]}, ${c[1]}, ${c[2]})`}
							on:click={() => applyPreset(c)}
						></button>
					{/each}
				</div>
			</div>

			<div class="space-y-4">
				<div class="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
					<div class="text-sm font-bold text-slate-500">선택한 색</div>
					<div
						class="mt-3 h-24 rounded-2xl border border-slate-200"
						style={`background-color:${colorStyle}`}
					></div>
				</div>
			</div>
		</div>
	</div>

	<div
		class="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
	>
		<h3 class="text-[30px] font-extrabold tracking-[-0.03em] text-slate-900">
			2. RGB 값의 변화를 확인해요
		</h3>

		<div class="mt-6 space-y-7">
			<div>
				<div class="mb-3 flex items-center justify-between text-[20px] font-extrabold text-red-500">
					<span>R (빨강)</span><span>{rgb.r}</span>
				</div>
				<input
					type="range"
					min="0"
					max="255"
					value={rgb.r}
					on:input={onRChange}
					class="w-full accent-red-500"
				/>
			</div>

			<div>
				<div
					class="mb-3 flex items-center justify-between text-[20px] font-extrabold text-green-600"
				>
					<span>G (초록)</span><span>{rgb.g}</span>
				</div>
				<input
					type="range"
					min="0"
					max="255"
					value={rgb.g}
					on:input={onGChange}
					class="w-full accent-green-500"
				/>
			</div>

			<div>
				<div
					class="mb-3 flex items-center justify-between text-[20px] font-extrabold text-blue-600"
				>
					<span>B (파랑)</span><span>{rgb.b}</span>
				</div>
				<input
					type="range"
					min="0"
					max="255"
					value={rgb.b}
					on:input={onBChange}
					class="w-full accent-blue-500"
				/>
			</div>
		</div>
	</div>
</div>
