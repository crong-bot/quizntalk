import { writable } from 'svelte/store';

export const LessonManager = writable({
  lesson_cognitive: {
    1: { answer: [], success: true, lock: false },
    2: { answer: ['255', '0'], success: false, lock: false },
  },
  lesson_rgb: {
    1: { answer: [''], success: false, lock: false },
    2: { answer: [''], success: false, lock: false },
    3: { answer: ['red', 'green', 'blue'], success: false, lock: false },
    4: { answer: [], success: false, lock: false },
    5: { answer: [], success: false, lock: false },
  },
  lesson_sound: {
    1: { answer: [3], success: false, lock: false },
    2: {
      1: { answer: [1], success: false, lock: false },
      2: { answer: [1], success: false, lock: false },
    },
    3: { answer: [1], success: false, lock: false },
    4: { answer: [], success: false, lock: false },
    5: { answer: [], success: false, lock: false },
  },
  lesson_text: {
    1: { answer: [''], success: false, lock: false },
    2: { answer: [''], success: false, lock: false },
    3: { answer: ['red', 'green', 'blue'], success: false, lock: false },
    4: { answer: [], success: false, lock: false },
    5: { answer: [], success: false, lock: false },
  },
});
