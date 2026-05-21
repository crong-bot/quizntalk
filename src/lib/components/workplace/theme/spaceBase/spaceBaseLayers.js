export function lightOn(alpha = 1, pulseAmount = 0.99) {
	return {
		visible: true,
		alpha,
		pulse: true,
		pulseAmount
	};
}

export const spaceBaseRoleSuccessStates = {
	connect: {
		power: {
			layers: {
				screenOn: true
			}
		},
		oxygen: {
			layers: {
				screenOn: true
			}
		},
		communication: {
			layers: {
				screenOn: true
			}
		},
		rover: {
			layers: {
				screenOn: true
			}
		}
	},

	powerLink: {
		power: {
			layers: {
				commandCenterLight: lightOn()
			}
		},
		oxygen: {
			layers: {
				oxygenCenterLight: lightOn()
			}
		},
		communication: {
			layers: {
				communicationLight: lightOn()
			}
		},
		rover: {
			layers: {
				roverLight: lightOn()
			}
		}
	}
};

export const spaceBaseMissionSuccessStates = {
	connect: {
		layers: {
			screenOn: true
		}
	},

	powerLink: {
		layers: {
			commandCenterLight: lightOn(),
			oxygenCenterLight: lightOn(),
			communicationLight: lightOn(),
			roverLight: lightOn()
		}
	},

	finalSync: {
		layers: {
			finalHud: {
				visible: true,
				alpha: 1
			}
		},
		camera: {
			shake: true,
			shakeAmount: 4,
			shakeSpeed: 1.4,
			durationMs: 900
		}
	}
};

export function getSpaceBaseRoleSuccessState(layerKey, roleId) {
	return (
		spaceBaseRoleSuccessStates[layerKey]?.[roleId] ?? {
			layers: {}
		}
	);
}

export function getSpaceBaseMissionSuccessState(layerKey) {
	return (
		spaceBaseMissionSuccessStates[layerKey] ?? {
			layers: {}
		}
	);
}