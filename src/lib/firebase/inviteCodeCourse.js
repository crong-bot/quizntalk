import { db } from '$lib/firebase/client';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';

// 4자리: 대문자 + 숫자 (헷갈리는 O/0, I/1 제외)
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function randomCode(len = 4) {
	let out = '';
	for (let i = 0; i < len; i++) out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
	return out;
}

/**
 * 코스 초대코드 발급(중복 방지)
 * - invites/{code} → courseId 저장
 * - courses/{courseId}.inviteCode 기록
 */
export async function mintInviteCode4ForCourse({ courseId, ownerUid }) {
	const MAX_TRY = 30;

	for (let i = 0; i < MAX_TRY; i++) {
		const code = randomCode(4);

		const inviteRef = doc(db, 'invites', code);
		const courseRef = doc(db, 'courses', courseId);

		try {
			await runTransaction(db, async (tx) => {
				const snap = await tx.get(inviteRef);
				if (snap.exists()) throw new Error('DUPLICATE');

				tx.set(inviteRef, {
					code,
					courseId,
					ownerUid,
					active: true,
					createdAt: serverTimestamp()
				});

				tx.set(
					courseRef,
					{
						inviteCode: code,
						updatedAt: serverTimestamp()
					},
					{ merge: true }
				);
			});

			return code;
		} catch (e) {
			if (e?.message === 'DUPLICATE') continue;
			throw e;
		}
	}

	throw new Error('초대코드 생성 실패(다시 시도)');
}
