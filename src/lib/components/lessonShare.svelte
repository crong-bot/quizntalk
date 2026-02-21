<script>
	import { db } from '$lib/firebase/client';
	import { mintInviteCode4ForCourse } from '$lib/firebase/inviteCodeCourse.js';
	import { doc, getDoc } from 'firebase/firestore';
	import QRCode from 'qrcode';

	// ✅ prop 이름은 기존 호환을 위해 lesson 유지 (실제로는 course를 넣어도 됨)
	// 기대 형태: { id(courseId) OR courseId, ownerUid, inviteCode, title ... }
	export let lesson;
	export let authUid = '';

	let open = false;
	let qrDataUrl = '';
	let busy = false;

	// ✅ 코스ID 추출 (library에서 id에 courseId 넣어줬음)
	$: courseId = lesson?.courseId ?? lesson?.id ?? '';
	$: inviteCode = lesson?.inviteCode ?? '';

	$: shareUrl =
		typeof window !== 'undefined' && inviteCode
			? `${window.location.origin}/invite/${encodeURIComponent(inviteCode)}`
			: '';

	async function ensureQr() {
		if (!open) return;
		if (!inviteCode || !shareUrl) {
			qrDataUrl = '';
			return;
		}
		qrDataUrl = await QRCode.toDataURL(shareUrl, {
			errorCorrectionLevel: 'M',
			margin: 1,
			scale: 8
		});
	}

	function copyLink() {
		if (!shareUrl) return;
		navigator.clipboard.writeText(shareUrl);
		alert('링크 복사됨!');
	}

	function copyCode() {
		if (!inviteCode) return;
		navigator.clipboard.writeText(inviteCode);
		alert('코드 복사됨!');
	}

	async function createCodeIfMissing() {
		if (!authUid) return alert('로그인이 필요합니다.');
		if (!courseId) return alert('courseId 없음');

		// ✅ 내 코스만 생성 가능
		const owner = lesson?.ownerUid;
		if (owner && owner !== authUid) {
			return alert('내 강의가 아니라 코드 생성이 불가합니다.');
		}

		try {
			busy = true;

			// ✅ 혹시 이미 생겼는지 courses에서 확인
			const snap = await getDoc(doc(db, 'courses', courseId));
			const data = snap.data();

			if (data?.inviteCode) {
				lesson = { ...lesson, inviteCode: data.inviteCode };
				return;
			}

			// ✅ 코스 기준 초대코드 발급
			const code = await mintInviteCode4ForCourse({ courseId, ownerUid: authUid });

			lesson = { ...lesson, inviteCode: code };
			alert(`초대코드 생성: ${code}`);
		} catch (e) {
			console.error(e);
			alert('코드 생성 실패: ' + (e?.message ?? 'unknown'));
		} finally {
			busy = false;
		}
	}

	$: if (open) ensureQr();
</script>

<div class="flex items-center gap-2">
	{#if inviteCode}
		<span class="text-xs px-2 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono">
			{inviteCode}
		</span>

		<button
			class="px-2 py-1 rounded-lg text-xs border border-slate-200 hover:bg-slate-50"
			on:click={copyCode}
		>
			코드복사
		</button>

		<button
			class="px-2 py-1 rounded-lg text-xs border border-slate-200 hover:bg-slate-50"
			on:click={copyLink}
		>
			링크복사
		</button>

		<button
			class="px-2 py-1 rounded-lg text-xs border border-slate-200 hover:bg-slate-50"
			on:click={() => (open = true)}
		>
			QR
		</button>
	{:else}
		<button
			class="px-3 py-1.5 rounded-lg text-xs bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
			on:click={createCodeIfMissing}
			disabled={busy}
		>
			{busy ? '생성중...' : '초대코드 생성'}
		</button>
	{/if}
</div>

{#if open}
	<!-- 간단 모달 -->
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<div class="absolute inset-0 bg-black/40" on:click={() => (open = false)}></div>

		<div class="relative bg-white rounded-2xl p-6 w-[420px] shadow-xl">
			<div class="flex items-start justify-between">
				<div>
					<div class="text-sm text-slate-500">공유</div>
					<div class="text-lg font-bold mt-1">{lesson?.title ?? '강의'}</div>
				</div>
				<button
					class="px-2 py-1 rounded-lg text-sm border border-slate-200 hover:bg-slate-50"
					on:click={() => (open = false)}
				>
					닫기
				</button>
			</div>

			{#if inviteCode}
				<div class="mt-4 text-sm text-slate-600">
					초대코드: <span class="font-mono font-semibold">{inviteCode}</span>
				</div>

				<div class="mt-2 text-xs text-slate-500 break-all">{shareUrl}</div>

				{#if qrDataUrl}
					<img class="mt-4 w-60 h-60 mx-auto" src={qrDataUrl} alt="qr" />
				{:else}
					<div class="mt-4 w-60 h-60 mx-auto bg-slate-100 rounded-xl"></div>
				{/if}

				<div class="mt-5 flex justify-center gap-2">
					<button
						class="px-3 py-2 rounded-xl text-sm border border-slate-200 hover:bg-slate-50"
						on:click={copyLink}
					>
						링크 복사
					</button>
					<button
						class="px-3 py-2 rounded-xl text-sm border border-slate-200 hover:bg-slate-50"
						on:click={copyCode}
					>
						코드 복사
					</button>
				</div>
			{:else}
				<div class="mt-4 text-slate-600 text-sm">초대코드가 없습니다.</div>
			{/if}
		</div>
	</div>
{/if}
