function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}

function toNumber(value) {
	const number = Number(value);
	return Number.isFinite(number) ? number : 0;
}

export function mapSpaceBaseJsonToSimulationState(jsonText) {
	try {
		const data = JSON.parse(jsonText);
		const layers = {};

		if (data.전력) {
			const 태양광패널켜짐 = data.전력.태양광패널 === true;
			const 배터리수치 = toNumber(data.전력.배터리);
			const 우선공급맞음 = data.전력.우선공급 === '생명유지장치';

			const canPowerOn = 태양광패널켜짐 && 우선공급맞음 && 배터리수치 >= 50;
			const alpha = canPowerOn ? clamp(배터리수치 / 100, 0, 1) : 0;

			layers.commandCenterLight = {
				visible: alpha > 0,
				alpha,
				pulse: alpha >= 0.7,
				pulseAmount: alpha >= 0.8 ? 0.16 : 0.08
			};

			return {
				ok: canPowerOn,
				role: 'power',
				message: canPowerOn
					? `전력 시스템이 배터리 ${배터리수치}% 밝기로 가동됩니다.`
					: '전력 조건이 부족합니다. 태양광패널은 true, 배터리는 50 이상, 우선공급은 "생명유지장치"여야 합니다.',
				state: {
					layers
				}
			};
		}

		return {
			ok: false,
			role: null,
			message: '실행할 수 있는 역할 JSON이 없습니다.',
			state: {
				layers: {}
			}
		};
	} catch (e) {
		return {
			ok: false,
			role: null,
			message: 'JSON 문법이 올바르지 않습니다.',
			state: {
				layers: {}
			}
		};
	}
}
