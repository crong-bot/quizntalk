export function normalizeAnswer(value) {
	return String(value ?? '').trim();
}

export function isCorrectAnswers(inputs = [], answers = [], options = {}) {
	const { ignoreCase = false } = options;

	const normalize = (value) => {
		let v = String(value ?? '').trim();
		if (ignoreCase) v = v.toLowerCase();
		return v;
	};

	const normalizedInputs = inputs.map(normalize);
	const normalizedAnswers = answers.map(normalize);

	return (
		normalizedInputs.length === normalizedAnswers.length &&
		normalizedInputs.every((v, i) => v === normalizedAnswers[i])
	);
}
