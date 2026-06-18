<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import Nav from '$lib/components/nav.svelte';
	import { loginWithId, signupWithId } from '$lib/firebase/auth';

	let mode = 'login'; // login | signup
	let userId = '';
	let password = '';
	let password2 = '';
	let error = '';
	let loading = false;

	$: mode = $page.url.searchParams.get('mode') === 'signup' ? 'signup' : 'login';

	function resetForm() {
		error = '';
		password = '';
		password2 = '';
	}

	function goSignup() {
		resetForm();
		goto('/login?mode=signup');
	}

	function goLogin() {
		resetForm();
		goto('/login');
	}

	async function submit() {
	error = '';
	loading = true;

	const cleanUserId = userId.trim();
	const cleanPassword = password.trim();
	const cleanPassword2 = password2.trim();

	try {
		if (!cleanUserId || !cleanPassword) {
			throw new Error('아이디와 비밀번호를 입력하세요.');
		}

		if (mode === 'signup') {
			if (!cleanPassword2) {
				throw new Error('비밀번호 확인을 입력하세요.');
			}

			if (cleanPassword !== cleanPassword2) {
				throw new Error('비밀번호가 일치하지 않습니다.');
			}

			await signupWithId(cleanUserId, cleanPassword);
		} else {
			await loginWithId(cleanUserId, cleanPassword);
		}

		window.location.href = '/';
	} catch (e) {
		error = e.message;
	} finally {
		loading = false;
	}
}
</script>

<Nav />

<div class="flex min-h-screen items-center justify-center bg-slate-50 px-5">
	<div class="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
		<div class="mb-6 rounded-2xl bg-slate-100 p-1">
			<div class="grid grid-cols-2 gap-1">
				<button
					type="button"
					class={`rounded-xl py-3 text-sm font-extrabold transition ${
						mode === 'login'
							? 'bg-slate-950 text-white shadow'
							: 'text-slate-500 hover:text-slate-900'
					}`}
					on:click={goLogin}
				>
					로그인
				</button>

				<button
					type="button"
					class={`rounded-xl py-3 text-sm font-extrabold transition ${
						mode === 'signup'
							? 'bg-emerald-600 text-white shadow'
							: 'text-slate-500 hover:text-slate-900'
					}`}
					on:click={goSignup}
				>
					회원가입
				</button>
			</div>
		</div>

		<div class="mb-6">
			<p
				class={`mb-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
					mode === 'login'
						? 'bg-slate-100 text-slate-600'
						: 'bg-emerald-50 text-emerald-700'
				}`}
			>
				{mode === 'login' ? '기존 계정' : '새 계정 만들기'}
			</p>

			<h1 class="text-3xl font-black text-slate-950">
				{mode === 'login' ? '다시 만나서 반가워요' : '처음 오셨나요?'}
			</h1>

			<p class="mt-2 text-sm font-medium text-slate-500">
				{mode === 'login'
					? '아이디와 비밀번호를 입력해 로그인하세요.'
					: '사용할 아이디와 비밀번호를 정해 회원가입하세요.'}
			</p>
		</div>

		{#if error}
			<p class="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
				{error}
			</p>
		{/if}

		<label class="mb-2 block text-sm font-bold text-slate-700">아이디</label>
		<input
			class="mb-4 w-full rounded-2xl border border-slate-200 bg-white p-4 font-bold outline-none transition focus:border-slate-950"
			placeholder="아이디 입력"
			bind:value={userId}
			disabled={loading}
		/>

		<label class="mb-2 block text-sm font-bold text-slate-700">비밀번호</label>
		<input
			type="password"
			class="mb-4 w-full rounded-2xl border border-slate-200 bg-white p-4 font-bold outline-none transition focus:border-slate-950"
			placeholder="비밀번호 입력"
			bind:value={password}
			disabled={loading}
		/>

		{#if mode === 'signup'}
			<label class="mb-2 block text-sm font-bold text-emerald-700">비밀번호 확인</label>
			<input
				type="password"
				class="mb-4 w-full rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 font-bold outline-none transition focus:border-emerald-600"
				placeholder="비밀번호 한 번 더 입력"
				bind:value={password2}
				disabled={loading}
			/>
		{/if}

		<button
			class={`mt-2 w-full rounded-2xl py-4 font-black text-white shadow-md transition hover:-translate-y-0.5 disabled:opacity-60 ${
				mode === 'login'
					? 'bg-slate-950 hover:bg-slate-800'
					: 'bg-emerald-600 hover:bg-emerald-700'
			}`}
			on:click={submit}
			disabled={loading}
		>
			{loading ? '처리 중...' : mode === 'login' ? '로그인하기' : '회원가입하기'}
		</button>

		<div class="mt-5 text-center text-sm font-bold text-slate-500">
			{#if mode === 'login'}
				계정이 없다면
				<button type="button" class="text-emerald-600 hover:underline" on:click={goSignup}>
					회원가입
				</button>
			{:else}
				이미 계정이 있다면
				<button type="button" class="text-slate-950 hover:underline" on:click={goLogin}>
					로그인
				</button>
			{/if}
		</div>
	</div>
</div>