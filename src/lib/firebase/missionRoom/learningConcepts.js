export const JSON_CONCEPT_LABELS = {
	parse: 'JSON 문법',
	quote: '문자열 따옴표',
	keyName: '키 이름',
	valueExpected: '값 입력',
	requiredKey: '필수 키',
	wrongValue: '값 확인',
	stringType: '문자열 값',
	numberType: '숫자 값',
	booleanType: 'true/false 값',
	comma: '쉼표',
	colon: '콜론',
	objectStructure: '객체 구조',
	arrayStructure: '배열 구조',
	nesting: '중첩 구조'
};

export function getConceptLabel(concept) {
	return JSON_CONCEPT_LABELS[concept] ?? concept;
}

export function getTopConcepts(conceptErrors = {}, limit = 3) {
	return Object.entries(conceptErrors)
		.sort((a, b) => b[1] - a[1])
		.slice(0, limit)
		.map(([concept, count]) => ({
			concept,
			label: getConceptLabel(concept),
			count
		}));
}
