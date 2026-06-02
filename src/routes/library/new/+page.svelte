<!-- C:\quizntalk\src\routes\library\new\+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import Nav from '../../../lib/components/nav.svelte';

	const missionTypes = [
		{
			id: 'team',
			label: 'TEAM MISSION',
			title: '팀 협동미션',
			description: '학생들이 역할을 나누어 JSON을 작성하거나 해석하고, 함께 미션을 해결합니다.',
			icon: '🤝',
			tone: 'blue',
			href: '/library/team',
			features: ['모둠별 방 코드', '역할 분담', '공용 화면', '협동 해결']
		},
		{
			id: 'indi',
			label: 'INDIVIDUAL MISSION',
			title: '개인 작성미션',
			description: '학생이 상황 설명을 읽고 혼자 JSON 데이터를 작성한 뒤 선생님에게 제출합니다.',
			icon: '✍️',
			tone: 'emerald',
			href: '/library/indi',
			features: ['개별 작성', '교사 승인/반려', '피드백', '클리어 확인']
		}
	];

	function getCardClass(tone) {
		if (tone === 'emerald') {
			return {
				border: 'border-emerald-100 hover:border-emerald-200',
				shadow: 'hover:shadow-[0_20px_50px_rgba(16,185,129,0.14)]',
				iconBg: 'bg-emerald-50',
				label: 'text-emerald-500',
				button: 'bg-emerald-600 hover:bg-emerald-700',
				badge: 'bg-emerald-50 text-emerald-700 ring-emerald-100'
			};
		}

		return {
			border: 'border-blue-100 hover:border-blue-200',
			shadow: 'hover:shadow-[0_20px_50px_rgba(37,99,235,0.14)]',
			iconBg: 'bg-blue-50',
			label: 'text-blue-500',
			button: 'bg-blue-600 hover:bg-blue-700',
			badge: 'bg-blue-50 text-blue-700 ring-blue-100'
		};
	}
</script>

<Nav />
<div class="min-h-screen bg-[#f4f7fb] px-4 py-8 font-nanum text-slate-800">
	<div class="mx-auto flex w-full max-w-[1080px] flex-col gap-6">
		<header class="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
			<div class="flex flex-col justify-between gap-5 md:flex-row md:items-start">
				<div>
					

					<div class="mt-5 font-gmarket text-[11px] font-bold tracking-[0.18em] text-blue-500">
						CREATE NEW LESSON
					</div>

					<h1 class="mt-2 font-gmarket text-[36px] font-bold tracking-[-0.07em] text-slate-950">
						미션 생성
					</h1>

					<p class="mt-2 max-w-[720px] text-[15px] font-bold leading-7 text-slate-500">
						수업 방식에 맞게 팀 협동미션 또는 개인 작성미션을 선택하세요.
					</p>
				</div>

				<div class="rounded-[24px] bg-slate-950 px-5 py-4 text-white">
					<div class="text-[11px] font-black tracking-[0.14em] text-slate-400">JCLASS</div>
					<div class="mt-1 font-gmarket text-[22px] font-bold tracking-[-0.05em]">
						JSON 데이터 미션
					</div>
				</div>
			</div>
		</header>

		<section class="grid grid-cols-1 gap-5 md:grid-cols-2">
			{#each missionTypes as mission}
				{@const tone = getCardClass(mission.tone)}

				<button
					type="button"
					on:click={() => goto(mission.href)}
					class={`group relative overflow-hidden rounded-[34px] border bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 ${tone.border} ${tone.shadow}`}
				>
					<div
						class="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-white/70 blur-3xl"
					></div>

					<div class="relative z-10">
						<div class="flex items-start justify-between gap-4">
							<div
								class={`flex h-16 w-16 items-center justify-center rounded-[24px] ${tone.iconBg} text-[34px]`}
							>
								{mission.icon}
							</div>

							<div class={`font-gmarket text-[11px] font-bold tracking-[0.16em] ${tone.label}`}>
								{mission.label}
							</div>
						</div>

						<h2 class="mt-6 font-gmarket text-[30px] font-bold tracking-[-0.07em] text-slate-950">
							{mission.title}
						</h2>

						<p class="mt-3 min-h-[56px] text-[15px] font-bold leading-7 text-slate-500">
							{mission.description}
						</p>

						<div class="mt-6 flex flex-wrap gap-2">
							{#each mission.features as feature}
								<span
									class={`rounded-full px-3 py-1.5 text-[12px] font-black ring-1 ${tone.badge}`}
								>
									{feature}
								</span>
							{/each}
						</div>

						<div
							class={`mt-8 inline-flex rounded-2xl px-5 py-3 text-[14px] font-extrabold text-white shadow-sm transition group-hover:translate-x-1 ${tone.button}`}
						>
							{mission.title} 만들기 →
						</div>
					</div>
				</button>
			{/each}
		</section>

		<section class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
			<div class="flex items-start gap-3">
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-xl"
				>
					💡
				</div>

				<div>
					<div class="text-[15px] font-black text-slate-900">어떤 미션을 선택하면 좋을까요?</div>

					<p class="mt-2 text-[14px] font-bold leading-7 text-slate-500">
						학생들이 친구들과 역할을 나누어 문제를 해결하게 하려면 팀 협동미션을 선택하세요. 학생 한
						명씩 JSON 작성 결과를 확인하고 피드백하려면 개인 작성미션을 선택하면 됩니다.
					</p>
				</div>
			</div>
		</section>
	</div>
</div>
