import { writable } from 'svelte/store';

export const LessonManager = writable({
	progress: {
		lesson_cognitive_1: {
			1: {
				success: true,
				completed: false, //
				lock: false,
				answers: {},
				reveal: -1,
				blockingIndex: null,
				stepIndex: null
			},
			2: {
				success: true,
				completed: false, //
				lock: false,
				answers: {},
				reveal: -1,
				blockingIndex: null,
				stepIndex: null
			}
		},
		lesson_rgb_1: {
			1: {
				success: true,
				completed: false, //
				lock: false,
				answers: {},
				reveal: -1,
				blockingIndex: null,
				stepIndex: null
			}
		}
	},
	meta: {
		lesson_rgb_1: {
			1: {
				answer: []
			}
		}
	}
});
