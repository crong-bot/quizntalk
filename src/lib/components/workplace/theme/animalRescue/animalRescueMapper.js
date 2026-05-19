// src/lib/components/workplace/theme/animalRescue/animalRescueMapper.js

import { animalRescueLayers, createAnimalRescueInitialLayers } from './animalRescueLayers.js';

const roleSignalLayerByRoleId = {
	report: animalRescueLayers.reportSignal,
	trace: animalRescueLayers.traceSignal,
	time: animalRescueLayers.timeSignal,
	safety: animalRescueLayers.safetySignal
};

export function mapAnimalRescueRoomToSimulationState(room, participants = []) {
	const layers = createAnimalRescueInitialLayers();

	for (const participant of participants) {
		const roleId = participant.roleId;
		const submitted = participant.submissions?.['role-analysis']?.submitted === true;
		const layerKey = roleSignalLayerByRoleId[roleId];

		if (submitted && layerKey) {
			layers[layerKey] = true;
		}
	}

	const allRoleAnalysisSubmitted =
		participants.length > 0 &&
		participants.every(
			(participant) => participant.submissions?.['role-analysis']?.submitted === true
		);

	if (allRoleAnalysisSubmitted) {
		layers[animalRescueLayers.meetingReady] = true;
	}

	if (room?.status === 'completed') {
		layers[animalRescueLayers.captureComplete] = true;
	}

	return {
		layers
	};
}
