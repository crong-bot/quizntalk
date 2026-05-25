<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import { logout } from '$lib/firebase/auth';
	import { authUser } from '$lib/stores/authUser';

	let open = false;

	$: email = $authUser?.email ?? '';
	$: displayId = email ? email.split('@')[0] : '';
	$: initial = displayId ? displayId.slice(0, 1).toUpperCase() : 'U';

	function toggleMenu() {
		open = !open;
	}

	function closeMenu() {
		open = false;
	}

	async function doLogout() {
		closeMenu();
		await logout();
		goto('/');
	}

	function onDocClick(e) {
		const root = document.getElementById('nav-user-root');
		if (!root) return;
		if (!root.contains(e.target)) open = false;
	}

	function onKeydown(e) {
		if (e.key === 'Escape') open = false;
	}

	onMount(() => {
		document.addEventListener('click', onDocClick);
		document.addEventListener('keydown', onKeydown);

		return () => {
			document.removeEventListener('click', onDocClick);
			document.removeEventListener('keydown', onKeydown);
		};
	});
</script>

<header class="w-full">
	<div class="mx-auto w-full max-w-[1280px] px-5 sm:px-6 lg:px-10">
		<div class="flex items-center justify-between border-b-2 border-slate-100 pt-3 pb-4">
			<!-- 로고 -->
			<a href="/" class="flex min-w-0 shrink-0 flex-row items-center">
				<img class="h-16 w-30 object-cover" src="/logo.png" alt="logo" />
			</a>

			<!-- 오른쪽 영역 -->
			<div class="flex min-w-0 items-center gap-4 lg:gap-8">
				{#if !$authUser}
					<button
						type="button"
						class="font-gmarket text-[13px] font-bold tracking-[-0.03em] text-slate-500 transition hover:text-slate-950"
						on:click={() => goto('/login')}
					>
						Log in
					</button>

					<button
						type="button"
						class="font-gmarket rounded-full bg-slate-950 px-5 py-2.5 text-[13px] font-bold tracking-[-0.03em] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-md"
						on:click={() => goto('/signup')}
					>
						Sign up
					</button>
				{:else}
					<!-- 로그인 후 메뉴 -->
					<nav class="flex min-w-0 items-center gap-4 lg:gap-8">
						<button
							type="button"
							class="group relative whitespace-nowrap font-gmarket text-[14px] font-bold tracking-[-0.06em] text-slate-500 transition hover:text-slate-950 lg:text-[15px]"
							on:click={() => goto('/lesson')}
						>
							학습하기
							<span
								class="absolute -bottom-2 left-0 h-[2px] w-0 rounded-full bg-slate-950 transition-all duration-300 group-hover:w-full"
							/>
						</button>

						<button
							type="button"
							class="group relative whitespace-nowrap font-gmarket text-[14px] font-bold tracking-[-0.06em] text-slate-500 transition hover:text-slate-950 lg:text-[15px]"
							on:click={() => goto('/library')}
						>
							내 수업실
							<span
								class="absolute -bottom-2 left-0 h-[2px] w-0 rounded-full bg-slate-950 transition-all duration-300 group-hover:w-full"
							/>
						</button>

						<button
							type="button"
							class="group relative whitespace-nowrap font-gmarket text-[14px] font-bold tracking-[-0.06em] text-slate-500 transition hover:text-slate-950 lg:text-[15px]"
							on:click={() => goto('/player')}
						>
							로컬테스트
							<span
								class="absolute -bottom-2 left-0 h-[2px] w-0 rounded-full bg-slate-950 transition-all duration-300 group-hover:w-full"
							/>
						</button>
					</nav>

					<!-- 아바타 클릭 시 이메일 + 로그아웃 -->
					<div class="relative shrink-0" id="nav-user-root">
						<button
							type="button"
							class="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
							on:click={toggleMenu}
							aria-haspopup="menu"
							aria-expanded={open}
							aria-label="계정 메뉴 열기"
						>
							<div
								class="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-950 font-gmarket text-[14px] font-bold text-white"
							>
								{#if $authUser?.photoURL}
									<img
										src={$authUser.photoURL}
										alt="avatar"
										class="h-full w-full rounded-full object-cover"
									/>
								{:else}
									{initial}
								{/if}
							</div>
						</button>

						{#if open}
							<div
								class="absolute right-0 top-[58px] z-50 w-72 rounded-[22px] border border-slate-100 bg-white p-3 shadow-[0_22px_60px_rgba(15,23,42,0.16)]"
								role="menu"
							>
								<div class="rounded-2xl bg-slate-50 px-4 py-3">
									<div class="font-gmarket text-[10px] font-bold tracking-[0.18em] text-slate-400">
										SIGNED IN
									</div>
									<div class="mt-1 truncate text-sm font-extrabold text-slate-900">
										{email}
									</div>
								</div>

								<button
									type="button"
									class="mt-2 w-full rounded-2xl px-4 py-3 text-left font-gmarket text-[13px] font-bold text-red-500 transition hover:bg-red-50 hover:text-red-600"
									role="menuitem"
									on:click={doLogout}
								>
									로그아웃
								</button>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
</header>
