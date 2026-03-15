// src/lib/components/ai/_mlTiny.js
export function flatten01(pixels) {
	const h = pixels.length;
	const w = pixels[0]?.length ?? 0;
	const out = [];
	for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) out.push(pixels[r][c] ? 1 : 0);
	return out;
}

export function softmax(logits) {
	const m = Math.max(...logits);
	const exps = logits.map((x) => Math.exp(x - m));
	const s = exps.reduce((a, b) => a + b, 0) || 1;
	return exps.map((e) => e / s);
}

export function argmax(arr) {
	let bestI = 0,
		bestV = arr[0] ?? -Infinity;
	for (let i = 1; i < arr.length; i++)
		if (arr[i] > bestV) {
			bestV = arr[i];
			bestI = i;
		}
	return bestI;
}

// 간단 선형 모델: class별 weights[dim], bias
export function createModel(classes, dim) {
	return {
		classes,
		dim,
		W: classes.map(() => Array(dim).fill(0)), // 시작 0이면 "아무것도 모름" 느낌 좋음
		b: classes.map(() => 0)
	};
}

export function predictProbs(model, x) {
	const logits = model.W.map((w, i) => {
		let s = model.b[i] || 0;
		for (let k = 0; k < model.dim; k++) s += w[k] * x[k];
		return s;
	});
	return softmax(logits);
}

export function trainOne(model, x, truthLabel, lr = 0.25) {
	const probs = predictProbs(model, x);
	const predI = argmax(probs);
	const truthI = model.classes.indexOf(truthLabel);
	if (truthI < 0) return { probs, pred: model.classes[predI], changed: false };

	const predLabel = model.classes[predI];
	const changed = predLabel !== truthLabel;

	if (changed) {
		// perceptron-style update (교육용 직관)
		const wT = model.W[truthI];
		const wP = model.W[predI];
		for (let k = 0; k < model.dim; k++) {
			const v = x[k];
			if (v === 0) continue;
			wT[k] += lr;
			wP[k] -= lr;
		}
		model.b[truthI] += lr * 0.2;
		model.b[predI] -= lr * 0.2;
	}
	const probsAfter = predictProbs(model, x);
	return { probsBefore: probs, probsAfter, pred: predLabel, changed };
}

// 저장/로드 (localStorage)
export function loadModel(key, classes, dim) {
	if (!key) return createModel(classes, dim);
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return createModel(classes, dim);
		const obj = JSON.parse(raw);
		// 최소 검증
		if (!obj?.W || !obj?.classes) return createModel(classes, dim);
		if (obj.dim !== dim) return createModel(classes, dim);
		if (JSON.stringify(obj.classes) !== JSON.stringify(classes)) return createModel(classes, dim);
		return obj;
	} catch {
		return createModel(classes, dim);
	}
}

export function saveModel(key, model) {
	if (!key) return;
	localStorage.setItem(key, JSON.stringify(model));
}

// 중요 픽셀 topK (classIndex 기준)
export function topKImportant(model, classIndex, topK = 35) {
	const w = model.W[classIndex] || [];
	const idx = w
		.map((v, i) => ({ i, a: Math.abs(v) }))
		.sort((p, q) => q.a - p.a)
		.slice(0, topK)
		.map((p) => p.i);
	return new Set(idx);
}

// 0..1 loss 게이지(간단): ce 근사
export function lossCE(probs, truthI) {
	const p = Math.max(1e-6, probs[truthI] ?? 1e-6);
	const ce = -Math.log(p); // 0..무한
	// 보기 좋게 0..1로 압축
	const scaled = 1 - Math.exp(-ce); // 0..1
	return { ce, scaled };
}
