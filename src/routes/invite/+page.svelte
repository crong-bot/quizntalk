<!-- C:\quizntalk\src\routes\invite\+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import { joinRoomByCode } from '$lib/firebase/missionRoom/missionRoomService.js';

	let code = '';
	let studentName = '';
	let errorMessage = '';
	let isJoining = false;

	const avatars = [1, 2, 3, 4, 5, 6];
	let selectedAvatarNumber = 1;

	async function joinMission() {
		if (isJoining) return;

		isJoining = true;
		errorMessage = '';

		try {
			const result = await joinRoomByCode({
				code,
				name: studentName,
				avatarNumber: selectedAvatarNumber
			});

			if (result.missionType === 'individual-write') {
				goto(`/indiplay/${result.code}`);
				return;
			}

			goto(`/invite/${result.code}`);
		} catch (error) {
			errorMessage = error?.message ?? '방에 참여하지 못했습니다.';
		} finally {
			isJoining = false;
		}
	}
</script>

<div class="min-h-screen bg-[#f4f7fb] px-4 py-8 font-nanum">
	<div class="mx-auto flex max-w-[520px] flex-col gap-5">
		<div class="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
			<div class="font-gmarket text-[11px] font-bold tracking-[0.16em] text-blue-500">
				JOIN MISSION
			</div>

			<h1 class="mt-2 font-gmarket text-[30px] font-bold tracking-[-0.06em] text-slate-950">
				미션 참여하기
			</h1>

			<p class="mt-2 text-[14px] font-bold leading-6 text-slate-500">
				선생님이 알려준 게임 코드와 이름을 입력하세요.
			</p>

			<div class="mt-6">
				<label for="game-code" class="text-sm font-extrabold text-slate-700"> 게임 코드 </label>

				<input
					id="game-code"
					bind:value={code}
					on:keydown={(event) => {
						if (event.key === 'Enter') joinMission();
					}}
					placeholder="예: BC12"
					class="mt-2 h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-center font-gmarket text-[24px] font-bold uppercase tracking-[0.18em] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
				/>
			</div>

			<div class="mt-4">
				<label for="student-name" class="text-sm font-extrabold text-slate-700"> 이름 </label>

				<input
					id="student-name"
					bind:value={studentName}
					on:keydown={(event) => {
						if (event.key === 'Enter') joinMission();
					}}
					placeholder="이름을 입력하세요"
					class="mt-2 h-20 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[26px] font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
				/>
			</div>
			<div class="mt-5">
				<div class="text-sm font-extrabold text-slate-700">아바타 선택</div>

				<div class="mt-3 grid grid-cols-6 gap-2">
					{#each avatars as avatarNumber}
						<button
							type="button"
							on:click={() => {
								selectedAvatarNumber = avatarNumber;
							}}
							aria-label={`아바타 ${avatarNumber} 선택`}
							class={`aspect-square overflow-hidden rounded-2xl border-4 bg-slate-100 p-1 transition ${
								selectedAvatarNumber === avatarNumber
									? 'border-blue-500 ring-4 ring-blue-100'
									: 'border-transparent hover:border-slate-300'
							}`}
						>
							<img
								src={`/images/avatars/${avatarNumber}.png`}
								alt={`아바타 ${avatarNumber}`}
								class="h-full w-full object-contain"
							/>
						</button>
					{/each}
				</div>

				<div class="mt-3 text-center text-sm font-bold text-blue-600">
					선택한 아바타 {selectedAvatarNumber}번
				</div>
			</div>

			{#if errorMessage}
				<div class="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
					{errorMessage}
				</div>
			{/if}

			<button
				type="button"
				on:click={joinMission}
				disabled={isJoining}
				class="mt-5 h-20 w-full rounded-2xl bg-blue-600 text-[15px] font-extrabold text-white shadow-[0_16px_34px_rgba(37,99,235,0.25)] transition hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
			>
				{isJoining ? '입장 중...' : '미션 참여하기'}
			</button>
		</div>
	</div>
</div>
