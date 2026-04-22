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

	function go(path) {
		closeMenu();
		goto(path);
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
	<div class="w-1280 m-auto px-10">
		<div class="flex justify-between pt-3 pb-4 border-b-2 border-slate-100 items-center">
			<!-- ✅ 로고 (그대로) -->
			<a href="/" class="flex flex-row items-center">
				<img class="object-cover w-30 h-20" src="/logo.png" alt="logo" />
			</a>

			<!-- ✅ 가운데 메뉴 (그대로) -->
			<!-- <nav
			class="md:ml-auto md:mr-auto font-nanum font-extrabold text-base text-gray-600 flex flex-wrap space-x-20 items-end justify-center"
		>
			<a href="/" class="hover:text-gray-900 transition"> Home </a>
			<a href="/study" class="hover:text-gray-900 transition"> Study </a>
			<a href="/qa" class="hover:text-gray-900 transition"> Q&A </a>
			<a href="/about" class="hover:text-gray-900 transition"> About </a>
			<a href="/" class="inline-flex items-center border-0 py-1 px-3 mt-4 md:mt-0">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
					<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
				</svg>
			</a>
		</nav> -->

			<!-- ✅ 오른쪽: 스샷 느낌 영역 -->
			<div class=" flex items-center gap-3 relative" id="nav-user-root">
				{#if !$authUser}
					<!-- 로그인 전: Log in(링크) + Sign up(라운드 버튼) -->
					<button
						class="text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
						on:click={() => goto('/login')}
					>
						Log in
					</button>

					<button
						class="px-4 py-2 rounded-xl text-sm font-semibold
						bg-emerald-600 text-white shadow-sm
						hover:bg-emerald-700 transition"
						on:click={() => goto('/signup')}
					>
						Sign up
					</button>
				{:else}
					<!-- 로그인 후: Dashboard(버튼) + 아바타(캡슐/이니셜) -->
					<button
						class="px-4 py-2 rounded-xl text-sm font-semibold
						bg-emerald-600 text-white shadow-sm
						hover:bg-emerald-700 transition"
						on:click={() => goto('/study')}
					>
						강의실
					</button>

					<!-- ✅ 새 아바타: 캡슐(pill) + 원형 이니셜 -->
					<button
						type="button"
						class="flex items-center gap-2 pl-2 pr-3 py-2 rounded-full
						border border-slate-200 bg-white shadow-sm
						hover:shadow transition"
						on:click={toggleMenu}
						aria-haspopup="menu"
						aria-expanded={open}
					>
						<div
							class="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold"
						>
							{#if $authUser?.photoURL}
								<img
									src={$authUser.photoURL}
									alt="avatar"
									class="w-full h-full object-cover rounded-full"
								/>
							{:else}
								{initial}
							{/if}
						</div>

						<div class="max-w-[120px] text-left leading-tight">
							<div class="text-xs text-slate-400">Account</div>
							<div class="text-sm font-semibold text-slate-800 truncate">{displayId}</div>
						</div>

						<svg
							class="w-4 h-4 text-slate-400 ml-1"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>

					{#if open}
						<!-- 드롭다운 -->
						<div
							class="absolute right-0 top-[78px] w-60 bg-white rounded-2xl shadow-lg border border-slate-100 p-2 z-50"
							role="menu"
						>
							<div class="px-3 py-2">
								<div class="text-xs text-slate-400">Signed in</div>
								<div class="text-sm font-semibold text-slate-900 truncate">{email}</div>
							</div>

							<div class="h-px bg-slate-100 my-1" />

							<button
								class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-sm text-slate-700"
								role="menuitem"
								on:click={() => go('/profile')}
							>
								프로필
							</button>
							<button
								class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-sm text-slate-700"
								role="menuitem"
								on:click={() => go('/study')}
							>
								AI 학습
							</button>

							<button
								class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-sm text-slate-700"
								role="menuitem"
								on:click={() => go('/library')}
							>
								내 수업실
							</button>

							<button
								class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-sm text-slate-700"
								role="menuitem"
								on:click={() => go('/player')}
							>
								강의실
							</button>

							<div class="h-px bg-slate-100 my-1" />

							<button
								class="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-sm text-red-600"
								role="menuitem"
								on:click={doLogout}
							>
								로그아웃
							</button>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</header>
