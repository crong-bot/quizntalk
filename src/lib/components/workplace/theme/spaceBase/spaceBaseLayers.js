export function lightOn(alpha = 1, pulseAmount = 0.99) {
	return {
		visible: true,
		alpha,
		pulse: true,
		pulseAmount
	};
}

export const spaceBaseRoleSuccessLayers = {
	connect: {
		power: {
			screenOn: true
		},
		oxygen: {
			screenOn: true
		},
		communication: {
			screenOn: true
		},
		rover: {
			screenOn: true
		}
	},

	powerLink: {
		power: {
			commandCenterLight: lightOn()
		},
		oxygen: {
			oxygenCenterLight: lightOn()
		},
		communication: {
			communicationLight: lightOn()
		},
		rover: {
			roverLight: lightOn()
		}
	},

	finalSync: {
		power: {
			finalPowerPiece: true
		},
		oxygen: {
			finalOxygenPiece: true
		},
		communication: {
			finalCommunicationPiece: true
		},
		rover: {
			finalRoverPiece: true
		}
	}
};

export const spaceBaseMissionSuccessLayers = {
	connect: {
		screenOn: true
	},

	powerLink: {
		commandCenterLight: lightOn(),
		oxygenCenterLight: lightOn(),
		communicationLight: lightOn(),
		roverLight: lightOn()
	},

	finalSync: {
		systemOnline: true,
		energyLines: true,
		basePulse: true,
		finalSequence: true,
		baseOnline: true,

		commandCenterLight: lightOn(1, 0.08),
		oxygenCenterLight: lightOn(1, 0.08),
		communicationLight: lightOn(1, 0.08),
		roverLight: lightOn(1, 0.08)
	}
};

export function getSpaceBaseMissionSuccessLayers(layerKey) {
	return spaceBaseMissionSuccessLayers[layerKey] ?? {};
}

export function getSpaceBaseRoleSuccessLayers(layerKey, roleId) {
	return spaceBaseRoleSuccessLayers[layerKey]?.[roleId] ?? {};
}
