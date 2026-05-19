// src/lib/components/workplace/theme/animalRescue/animalRescueLayers.js

export const animalRescueLayers = {
	baseMap: 'baseMap',
	pathA: 'pathA',
	pathB: 'pathB',
	pathC: 'pathC',
	reportSignal: 'reportSignal',
	traceSignal: 'traceSignal',
	timeSignal: 'timeSignal',
	safetySignal: 'safetySignal',
	meetingReady: 'meetingReady',
	captureComplete: 'captureComplete'
};

export function createAnimalRescueInitialLayers() {
	return {
		[animalRescueLayers.baseMap]: true,
		[animalRescueLayers.pathA]: true,
		[animalRescueLayers.pathB]: true,
		[animalRescueLayers.pathC]: true,

		[animalRescueLayers.reportSignal]: false,
		[animalRescueLayers.traceSignal]: false,
		[animalRescueLayers.timeSignal]: false,
		[animalRescueLayers.safetySignal]: false,
		[animalRescueLayers.meetingReady]: false,
		[animalRescueLayers.captureComplete]: false
	};
}
