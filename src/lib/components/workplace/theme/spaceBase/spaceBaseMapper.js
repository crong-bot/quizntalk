import { spaceBaseMissionSuccessLayers, spaceBaseRoleSuccessLayers } from './spaceBaseLayers';

function toNumber(value) {
	const number = Number(value);
	return Number.isFinite(number) ? number : 0;
}

function isObject(value) {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function makeResult({ ok, role = null, message, layers = {} }) {
	return {
		ok,
		role,
		message,
		state: {
			layers
		}
	};
}

function mapConnectMission(data) {
	const baseId = data['기지번호'];
	const accessCode = data['접속코드'];

	const answers = {
		'전력-01': {
			role: 'power',
			code: 1204,
			layerKey: 'powerConnected',
			label: '전력 장치'
		},
		'산소-01': {
			role: 'oxygen',
			code: 2108,
			layerKey: 'oxygenConnected',
			label: '산소 장치'
		},
		'통신-01': {
			role: 'communication',
			code: 3407,
			layerKey: 'communicationConnected',
			label: '통신 장치'
		},
		'로버-01': {
			role: 'rover',
			code: 5521,
			layerKey: 'roverConnected',
			label: '탐사로봇'
		}
	};

	const answer = answers[baseId];

	if (!answer) {
		return makeResult({
			ok: false,
			message: '알 수 없는 기지번호입니다. 단서를 다시 확인하세요.'
		});
	}

	if (accessCode !== answer.code) {
		return makeResult({
			ok: false,
			role: answer.role,
			message: `${answer.label}의 접속코드가 맞지 않습니다. 숫자로 입력했는지 확인하세요.`
		});
	}

	return makeResult({
		ok: true,
		role: answer.role,
		message: `${answer.label} 접속에 성공했습니다.`,
		layers: spaceBaseMissionSuccessLayers.connect
	});
}

function mapPowerLinkMission(data) {
	const device = data['장치'];
	const connected = data['연결'];
	const voltage = data['전압'];

	const answers = {
		전력센터: {
			role: 'power',
			voltage: 220,
			layerKey: 'commandCenterLight',
			label: '전력센터'
		},
		산소센터: {
			role: 'oxygen',
			voltage: 110,
			layerKey: 'oxygenCenterLight',
			label: '산소센터'
		},
		통신안테나: {
			role: 'communication',
			voltage: 48,
			layerKey: 'communicationLight',
			label: '통신안테나'
		},
		탐사로봇: {
			role: 'rover',
			voltage: 24,
			layerKey: 'roverLight',
			label: '탐사로봇'
		}
	};

	const answer = answers[device];

	if (!answer) {
		return makeResult({
			ok: false,
			message: '알 수 없는 장치입니다. 단서를 다시 확인하세요.'
		});
	}

	if (connected !== true) {
		return makeResult({
			ok: false,
			role: answer.role,
			message: `${answer.label}의 연결 값은 true여야 합니다.`
		});
	}

	if (voltage !== answer.voltage) {
		return makeResult({
			ok: false,
			role: answer.role,
			message: `${answer.label}의 전압이 맞지 않습니다. 숫자로 입력했는지 확인하세요.`
		});
	}

	return makeResult({
		ok: true,
		role: answer.role,
		message: `${answer.label} 전원 연결에 성공했습니다.`,
		layers: spaceBaseRoleSuccessLayers.powerLink[answer.role] ?? {}
	});
}

function mapFinalSyncMission(data) {
	const power = data['전력'];
	const oxygen = data['산소'];
	const communicationCode = data['통신코드'];
	const rover = data['탐사로봇'];

	const ok = power === 100 && oxygen === true && communicationCode === 'AD32' && rover === true;

	if (!ok) {
		return makeResult({
			ok: false,
			role: 'team',
			message:
				'최종 JSON 값이 맞지 않습니다. 전력은 100, 산소는 true, 통신코드는 "AD32", 탐사로봇은 true여야 합니다.'
		});
	}

	return makeResult({
		ok: true,
		role: 'team',
		message: '최종 JSON이 완성되었습니다. 달 기지가 온라인 상태로 전환됩니다.',
		layers: spaceBaseMissionSuccessLayers.finalSync
	});
}

export function mapSpaceBaseJsonToSimulationState(jsonText) {
	try {
		const data = JSON.parse(jsonText);

		if (!isObject(data)) {
			return makeResult({
				ok: false,
				message: 'JSON은 { }로 감싼 객체 형태여야 합니다.'
			});
		}

		// 미션 1: 기지 접속
		if ('기지번호' in data || '접속코드' in data) {
			return mapConnectMission(data);
		}

		// 미션 2: 전원 연결
		if ('장치' in data || '연결' in data || '전압' in data) {
			return mapPowerLinkMission(data);
		}

		// 미션 3: 최종 시스템 동기화
		if ('전력' in data || '산소' in data || '통신코드' in data || '탐사로봇' in data) {
			return mapFinalSyncMission(data);
		}

		return makeResult({
			ok: false,
			message: '실행할 수 있는 미션 JSON이 없습니다.'
		});
	} catch (e) {
		return makeResult({
			ok: false,
			message: 'JSON 문법이 올바르지 않습니다.'
		});
	}
}
