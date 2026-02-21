<script>
	import Nav from '$lib/components/nav.svelte';
	import { loginWithId, signupWithId } from '$lib/firebase/auth';

	let mode = 'login'; // login | signup
	let userId = '';
	let password = '';
	let password2 = '';
	let error = '';
	let loading = false;

	async function submit() {
		error = '';
		loading = true;

		try {
			if (!userId || !password) {
				throw new Error('아이디와 비밀번호를 입력하세요.');
			}

			if (mode === 'signup') {
				if (password !== password2) {
					throw new Error('비밀번호가 일치하지 않습니다.');
				}
				await signupWithId(userId, password);
			} else {
				await loginWithId(userId, password);
			}

			window.location.href = '/study';
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}
</script>

<Nav />

<div class="min-h-screen flex items-center justify-center">
	<div class="w-full max-w-md bg-white rounded-2xl shadow p-8">
		<h1 class="text-3xl font-bold mb-6">
			{mode === 'login' ? '로그인' : '회원가입'}
		</h1>

		{#if error}
			<p class="text-red-500 mb-3">{error}</p>
		{/if}

		<input class="w-full border p-3 rounded mb-3" placeholder="아이디" bind:value={userId} />

		<input
			type="password"
			class="w-full border p-3 rounded mb-3"
			placeholder="비밀번호"
			bind:value={password}
		/>

		{#if mode === 'signup'}
			<input
				type="password"
				class="w-full border p-3 rounded mb-3"
				placeholder="비밀번호 확인"
				bind:value={password2}
			/>
		{/if}

		<button class="w-full bg-blue-500 text-white py-3 rounded" on:click={submit} disabled={loading}>
			{mode === 'login' ? '로그인' : '가입하기'}
		</button>

		<div class="text-center mt-4">
			{#if mode === 'login'}
				<button on:click={() => (mode = 'signup')}> 계정이 없나요? 회원가입 </button>
			{:else}
				<button on:click={() => (mode = 'login')}> 이미 계정이 있나요? 로그인 </button>
			{/if}
		</div>
	</div>
</div>
