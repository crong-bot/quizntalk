// C:\Users\user\quizntalk\src\lib\components\workplace\theme\spaceBase\spaceBaseMapper.js

import { getSpaceBaseMissionSuccessState, getSpaceBaseRoleSuccessState } from './spaceBaseLayers';

function isObject(value) {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function makeResult({ ok, role = null, message, state = { layers: {} } }) {
	return {
		ok,
		role,
		message,
		state
	};
}

function mapConnectMission(data) {
	const baseId = data['기지번호'];
	const accessCode = data['접속코드'];

	const answers = {
		'전력-01': {
			role: 'power',
			code: 1204,
			label: '전력 장치'
		},
		'산소-01': {
			role: 'oxygen',
			code: 2108,
			label: '산소 장치'
		},
		'통신-01': {
			role: 'communication',
			code: 3407,
			label: '통신 장치'
		},
		'로버-01': {
			role: 'rover',
			code: 5521,
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
		state: getSpaceBaseRoleSuccessState('connect', answer.role)
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
			label: '전력센터'
		},
		산소센터: {
			role: 'oxygen',
			voltage: 110,
			label: '산소센터'
		},
		통신안테나: {
			role: 'communication',
			voltage: 48,
			label: '통신안테나'
		},
		탐사로봇: {
			role: 'rover',
			voltage: 24,
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
		state: getSpaceBaseRoleSuccessState('powerLink', answer.role)
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
		state: getSpaceBaseMissionSuccessState('finalSync')
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

		if ('기지번호' in data || '접속코드' in data) {
			return mapConnectMission(data);
		}

		if ('장치' in data || '연결' in data || '전압' in data) {
			return mapPowerLinkMission(data);
		}

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