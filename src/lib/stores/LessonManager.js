import { writable } from 'svelte/store';

export const LessonManager = writable({
	/**
	 * ✅ progress = “유저 상태”
	 * - 서버/클라이언트 어디서 온 레슨이든 공통으로 여기만 봄
	 * - key는 lessonKey(너가 넘기는 data.post.slug 또는 lessonname)로 통일
	 */
	progress: {
		'ai/cognitive/1': {
			1: { success: false, lock: false, answers: {} }
		}
	},

	/**
	 * ✅ meta = “레슨 기본 설정/초기값”
	 * - (옵션) 너가 기존처럼 lesson_rgb: {1:{},2:{}} 같은 걸 유지하고 싶으면 여기로 넣어
	 * - 이건 "정답"이 아니라 페이지 수/초기 lock 같은 초기값용
	 */
	meta: {
		lesson_rgb: {
			1: { success: false, lock: false },
			2: { success: false, lock: false }
		}
	}
});
