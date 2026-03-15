export const FEATURES = [
	{ key: 'ear', label: '귀', hint: '귀 길이 점수' },
	{ key: 'whisker', label: '수염', hint: '수염 길이 점수' },
	{ key: 'tail', label: '꼬리', hint: '꼬리 길이 점수' }
];

// 학습용 대표 데이터 (패턴 확실)
export const CAT_TRAIN = [
	{ ear: 8, whisker: 8, tail: 2 },
	{ ear: 7, whisker: 9, tail: 1 },
	{ ear: 9, whisker: 7, tail: 3 },
	{ ear: 8, whisker: 7, tail: 2 },
	{ ear: 7, whisker: 8, tail: 3 },
	{ ear: 9, whisker: 9, tail: 1 }
];

export const DOG_TRAIN = [
	{ ear: 2, whisker: 3, tail: 9 },
	{ ear: 1, whisker: 4, tail: 8 },
	{ ear: 3, whisker: 2, tail: 7 },
	{ ear: 2, whisker: 4, tail: 8 },
	{ ear: 1, whisker: 3, tail: 9 },
	{ ear: 3, whisker: 1, tail: 8 }
];

export const QUIZ_EASY = [
	{ x: { ear: 8, whisker: 7, tail: 2 }, y: 'cat' },
	{ x: { ear: 2, whisker: 4, tail: 8 }, y: 'dog' },
	{ x: { ear: 9, whisker: 8, tail: 1 }, y: 'cat' },
	{ x: { ear: 1, whisker: 2, tail: 9 }, y: 'dog' },
	{ x: { ear: 7, whisker: 9, tail: 3 }, y: 'cat' },
	{ x: { ear: 3, whisker: 1, tail: 8 }, y: 'dog' },
	{ x: { ear: 8, whisker: 8, tail: 2 }, y: 'cat' },
	{ x: { ear: 2, whisker: 3, tail: 7 }, y: 'dog' }
];

export const QUIZ_HARD = [
	{ x: { ear: 6, whisker: 7, tail: 6 }, y: 'cat', note: '귀/수염은 고양이쪽, 꼬리는 애매' },
	{ x: { ear: 4, whisker: 5, tail: 7 }, y: 'dog', note: '꼬리가 강아지쪽' },
	{ x: { ear: 7, whisker: 6, tail: 5 }, y: 'cat', note: '귀가 고양이쪽' },
	{ x: { ear: 3, whisker: 6, tail: 6 }, y: 'dog', note: '귀는 강아지쪽' },
	{ x: { ear: 6, whisker: 8, tail: 4 }, y: 'cat', note: '수염이 고양이쪽' },
	{ x: { ear: 4, whisker: 4, tail: 6 }, y: 'dog', note: '전체적으로 강아지쪽' },
	{ x: { ear: 6, whisker: 6, tail: 4 }, y: 'cat', note: '경계' },
	{ x: { ear: 4, whisker: 6, tail: 5 }, y: 'dog', note: '경계' }
];

// 가중치 스코어링(초등용 단순화)
export function scoreWithWeights(sample, w) {
	// catScore: 귀/수염 높을수록 유리, 꼬리는 낮을수록 유리(10 - tail)
	const catScore = sample.ear * w.ear + sample.whisker * w.whisker + (10 - sample.tail) * w.tail;
	// dogScore: 반대 방향
	const dogScore =
		(10 - sample.ear) * w.ear + (10 - sample.whisker) * w.whisker + sample.tail * w.tail;

	return { catScore, dogScore, pred: catScore >= dogScore ? 'cat' : 'dog' };
}
