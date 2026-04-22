import { derived, writable } from 'svelte/store';

function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function getStages(lesson) {
	return Array.isArray(lesson?.stages) ? lesson.stages : [];
}

function getFirstStageId(lesson) {
	return getStages(lesson)[0]?.id ?? null;
}

function findStageIndex(lesson, stageId) {
	return getStages(lesson).findIndex((stage) => stage.id === stageId);
}

function getStageById(lesson, stageId) {
	return getStages(lesson).find((stage) => stage.id === stageId) || null;
}

function ensureModuleData(state, stageId) {
	if (!stageId) return {};
	return state.moduleData?.[stageId] ?? {};
}

function initializeModuleData(lesson) {
	const map = {};
	const stages = getStages(lesson);

	for (const stage of stages) {
		map[stage.id] = clone(stage.initialData || {});
	}

	return map;
}

function evaluateCompletion(stage, stageData, wholeState) {
	if (!stage) return false;

	const completion = stage.completion || null;
	if (!completion) return false;

	switch (completion.type) {
		case 'always':
			return true;

		case 'field-truthy':
			return !!stageData?.[completion.field];

		case 'field-equals':
			return stageData?.[completion.field] === completion.value;

		case 'count-gte': {
			const value = Number(stageData?.[completion.field] || 0);
			return value >= Number(completion.value || 0);
		}

		case 'array-length-gte': {
			const arr = Array.isArray(stageData?.[completion.field]) ? stageData[completion.field] : [];
			return arr.length >= Number(completion.value || 0);
		}

		case 'all-fields-truthy': {
			const fields = Array.isArray(completion.fields) ? completion.fields : [];
			return fields.every((field) => !!stageData?.[field]);
		}

		case 'custom-flag':
			return !!stageData?.flags?.[completion.key];

		case 'custom-fn':
			if (typeof completion.fn === 'function') {
				return !!completion.fn({
					stage,
					stageData,
					state: wholeState
				});
			}
			return false;

		default:
			return false;
	}
}

function recomputeProgressState(draft) {
	const currentStage = getStageById(draft.lesson, draft.currentStageId);
	if (!currentStage) return;

	const currentStageData = ensureModuleData(draft, currentStage.id);
	const isComplete = evaluateCompletion(currentStage, currentStageData, draft);

	if (isComplete && !draft.completedStageIds.includes(currentStage.id)) {
		draft.completedStageIds = [...draft.completedStageIds, currentStage.id];
	}

	const currentIndex = findStageIndex(draft.lesson, currentStage.id);
	const nextStage = getStages(draft.lesson)[currentIndex + 1];

	if (isComplete && nextStage && !draft.unlockedStageIds.includes(nextStage.id)) {
		draft.unlockedStageIds = [...draft.unlockedStageIds, nextStage.id];
	}
}

export function createProjectPlayerStore(lesson) {
	const safeLesson = clone(lesson || {});
	const firstStageId = getFirstStageId(safeLesson);

	const initialState = {
		lesson: safeLesson,
		currentStageId: firstStageId,
		completedStageIds: [],
		unlockedStageIds: firstStageId ? [firstStageId] : [],
		notes: [],
		moduleData: initializeModuleData(safeLesson)
	};

	const { subscribe, update, set } = writable(initialState);

	const currentStage = derived({ subscribe }, ($state) => {
		return getStageById($state.lesson, $state.currentStageId);
	});

	const currentStageData = derived({ subscribe }, ($state) => {
		return ensureModuleData($state, $state.currentStageId);
	});

	const progress = derived({ subscribe }, ($state) => {
		const total = getStages($state.lesson).length;
		const done = $state.completedStageIds.length;
		return total === 0 ? 0 : Math.round((done / total) * 100);
	});

	const canGoPrev = derived({ subscribe }, ($state) => {
		const currentIndex = findStageIndex($state.lesson, $state.currentStageId);
		return currentIndex > 0;
	});

	const canGoNext = derived({ subscribe }, ($state) => {
		const currentIndex = findStageIndex($state.lesson, $state.currentStageId);
		const nextStage = getStages($state.lesson)[currentIndex + 1];
		if (!nextStage) return false;
		return $state.unlockedStageIds.includes(nextStage.id);
	});

	const actions = {
		reset() {
			set(clone(initialState));
		},

		goToStage(stageId) {
			update((state) => {
				if (!state.unlockedStageIds.includes(stageId)) return state;
				return {
					...state,
					currentStageId: stageId
				};
			});
		},

		goNext() {
			update((state) => {
				const currentIndex = findStageIndex(state.lesson, state.currentStageId);
				const nextStage = getStages(state.lesson)[currentIndex + 1];
				if (!nextStage) return state;
				if (!state.unlockedStageIds.includes(nextStage.id)) return state;

				return {
					...state,
					currentStageId: nextStage.id
				};
			});
		},

		goPrev() {
			update((state) => {
				const currentIndex = findStageIndex(state.lesson, state.currentStageId);
				const prevStage = getStages(state.lesson)[currentIndex - 1];
				if (!prevStage) return state;

				return {
					...state,
					currentStageId: prevStage.id
				};
			});
		},

		setStageData(stageId, patch) {
			update((state) => {
				const targetStageId = stageId || state.currentStageId;
				const prevStageData = ensureModuleData(state, targetStageId);

				const nextStageData =
					typeof patch === 'function'
						? patch(clone(prevStageData))
						: {
								...prevStageData,
								...patch
						  };

				const draft = {
					...state,
					moduleData: {
						...state.moduleData,
						[targetStageId]: nextStageData
					}
				};

				recomputeProgressState(draft);
				return draft;
			});
		},

		mergeStageData(stageId, patch) {
			this.setStageData(stageId, patch);
		},

		setFlag(stageId, key, value = true) {
			update((state) => {
				const targetStageId = stageId || state.currentStageId;
				const prevStageData = ensureModuleData(state, targetStageId);

				const draft = {
					...state,
					moduleData: {
						...state.moduleData,
						[targetStageId]: {
							...prevStageData,
							flags: {
								...(prevStageData.flags || {}),
								[key]: value
							}
						}
					}
				};

				recomputeProgressState(draft);
				return draft;
			});
		},

		incrementField(stageId, field, amount = 1) {
			update((state) => {
				const targetStageId = stageId || state.currentStageId;
				const prevStageData = ensureModuleData(state, targetStageId);
				const currentValue = Number(prevStageData?.[field] || 0);

				const draft = {
					...state,
					moduleData: {
						...state.moduleData,
						[targetStageId]: {
							...prevStageData,
							[field]: currentValue + amount
						}
					}
				};

				recomputeProgressState(draft);
				return draft;
			});
		},

		pushArrayItem(stageId, field, item) {
			update((state) => {
				const targetStageId = stageId || state.currentStageId;
				const prevStageData = ensureModuleData(state, targetStageId);
				const prevArray = Array.isArray(prevStageData?.[field]) ? prevStageData[field] : [];

				const draft = {
					...state,
					moduleData: {
						...state.moduleData,
						[targetStageId]: {
							...prevStageData,
							[field]: [...prevArray, item]
						}
					}
				};

				recomputeProgressState(draft);
				return draft;
			});
		},

		addNote(text) {
			const value = String(text || '').trim();
			if (!value) return;

			update((state) => {
				return {
					...state,
					notes: [...state.notes, value]
				};
			});
		},

		markCurrentStageComplete() {
			update((state) => {
				const current = getStageById(state.lesson, state.currentStageId);
				if (!current) return state;

				const draft = clone(state);

				if (!draft.completedStageIds.includes(current.id)) {
					draft.completedStageIds.push(current.id);
				}

				const currentIndex = findStageIndex(draft.lesson, current.id);
				const nextStage = getStages(draft.lesson)[currentIndex + 1];

				if (nextStage && !draft.unlockedStageIds.includes(nextStage.id)) {
					draft.unlockedStageIds.push(nextStage.id);
				}

				return draft;
			});
		}
	};

	return {
		subscribe,
		currentStage,
		currentStageData,
		progress,
		canGoPrev,
		canGoNext,
		actions
	};
}
