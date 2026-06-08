// src/lib/components/workplace/theme/weatherApp/weatherAppRuntime.js

const PHONE_SCREEN = {
	x: 322,
	y: 200,
	width: 818,
	height: 1800
};

const COLORS = {
	white: 0xffffff,
	page: 0xf8fafc,
	text: 0x0f172a,
	subText: 0x475569,
	muted: 0x64748b,
	line: 0xe2e8f0,
	card: 0xffffff,
	cardSoft: 0xf1f5f9,
	blue: 0x2563eb,
	blueSoft: 0xdbeafe,
	blueText: 0x1d4ed8,
	sky: 0x38bdf8,
	yellow: 0xfacc15,
	orange: 0xfb923c,
	warningBg: 0xfff7ed,
	warningText: 0xc2410c,
	green: 0x16a34a
};

function clearContainer(container) {
	if (!container) return;
	container.removeChildren();
}

function makeText(PIXI, text, style = {}) {
	return new PIXI.Text({
		text,
		style: {
			fontFamily: 'Arial',
			fontSize: 28,
			fill: COLORS.text,
			fontWeight: '700',
			align: 'center',
			...style
		}
	});
}

function drawRoundRect(graphics, x, y, width, height, radius, color, alpha = 1) {
	graphics.roundRect(x, y, width, height, radius);
	graphics.fill({ color, alpha });
}

function drawStrokeRoundRect(
	graphics,
	x,
	y,
	width,
	height,
	radius,
	strokeColor,
	strokeWidth = 3,
	alpha = 1
) {
	graphics.roundRect(x, y, width, height, radius);
	graphics.stroke({
		width: strokeWidth,
		color: strokeColor,
		alpha
	});
}

function addCenteredText(container, textObject, x, y) {
	textObject.anchor.set(0.5);
	textObject.x = x;
	textObject.y = y;
	container.addChild(textObject);
}

function addLeftText(container, textObject, x, y) {
	textObject.x = x;
	textObject.y = y;
	container.addChild(textObject);
}

function drawSun(PIXI, container, x, y, size = 150) {
	const g = new PIXI.Graphics();

	g.circle(x, y, size * 0.28);
	g.fill({ color: COLORS.yellow, alpha: 1 });

	for (let i = 0; i < 12; i += 1) {
		const angle = (Math.PI * 2 * i) / 12;
		const inner = size * 0.4;
		const outer = size * 0.62;

		g.moveTo(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner);
		g.lineTo(x + Math.cos(angle) * outer, y + Math.sin(angle) * outer);
		g.stroke({ width: 8, color: 0xfbbf24, alpha: 1 });
	}

	container.addChild(g);
}

function drawCloudShape(graphics, x, y, size, color = 0xe2e8f0) {
	graphics.circle(x - size * 0.22, y + size * 0.08, size * 0.22);
	graphics.circle(x, y - size * 0.02, size * 0.28);
	graphics.circle(x + size * 0.26, y + size * 0.08, size * 0.23);
	graphics.roundRect(x - size * 0.46, y + size * 0.06, size * 0.92, size * 0.28, size * 0.14);
	graphics.fill({ color, alpha: 1 });
}

function drawCloud(PIXI, container, x, y, size = 160) {
	const shadow = new PIXI.Graphics();
	drawCloudShape(shadow, x + 8, y + 10, size, 0xcbd5e1);
	shadow.alpha = 0.35;
	container.addChild(shadow);

	const g = new PIXI.Graphics();
	drawCloudShape(g, x, y, size, 0xe2e8f0);
	container.addChild(g);
}

function drawRain(PIXI, container, x, y, size = 160) {
	const g = new PIXI.Graphics();

	drawCloudShape(g, x, y, size, 0xdbeafe);

	for (let i = 0; i < 5; i += 1) {
		const rx = x - size * 0.32 + i * size * 0.16;
		const ry = y + size * 0.42;

		g.moveTo(rx, ry);
		g.lineTo(rx - size * 0.04, ry + size * 0.24);
		g.stroke({ width: 7, color: COLORS.sky, alpha: 1 });
	}

	container.addChild(g);
}

function drawWeatherIcon(PIXI, container, condition, x, y) {
	if (condition === '맑음') {
		drawSun(PIXI, container, x, y, 170);
		return;
	}

	if (condition === '흐림') {
		drawCloud(PIXI, container, x, y, 180);
		return;
	}

	if (condition === '비옴') {
		drawRain(PIXI, container, x, y, 180);
		return;
	}

	const unknown = makeText(PIXI, '?', {
		fontSize: 120,
		fill: COLORS.muted
	});
	addCenteredText(container, unknown, x, y);
}

function drawPhoneWhiteBackground(PIXI, container) {
	const bg = new PIXI.Graphics();
	drawRoundRect(
		bg,
		PHONE_SCREEN.x,
		PHONE_SCREEN.y,
		PHONE_SCREEN.width,
		PHONE_SCREEN.height,
		56,
		COLORS.white,
		1
	);
	container.addChild(bg);
}

function drawTopBar(PIXI, container, title, subtitle = '') {
	const titleText = makeText(PIXI, title, {
		fontSize: 54,
		fill: COLORS.text,
		fontWeight: '900'
	});
	addCenteredText(
		container,
		titleText,
		PHONE_SCREEN.x + PHONE_SCREEN.width / 2,
		PHONE_SCREEN.y + 125
	);

	if (subtitle) {
		const subText = makeText(PIXI, subtitle, {
			fontSize: 28,
			fill: COLORS.muted,
			fontWeight: '700'
		});
		addCenteredText(
			container,
			subText,
			PHONE_SCREEN.x + PHONE_SCREEN.width / 2,
			PHONE_SCREEN.y + 182
		);
	}
}

function drawStatusBadge(
	PIXI,
	container,
	text,
	x,
	y,
	color = COLORS.blue,
	bgColor = COLORS.blueSoft
) {
	const badge = new PIXI.Graphics();
	drawRoundRect(badge, x, y, 320, 76, 38, bgColor, 1);
	container.addChild(badge);

	const badgeText = makeText(PIXI, text, {
		fontSize: 30,
		fill: color,
		fontWeight: '900'
	});
	addCenteredText(container, badgeText, x + 160, y + 38);
}

function drawLoadingScreen(PIXI, container, flags, time) {
	drawPhoneWhiteBackground(PIXI, container);
	drawTopBar(PIXI, container, '날씨 API 앱', '데이터 연결 준비');

	const circle = new PIXI.Graphics();
	circle.circle(PHONE_SCREEN.x + PHONE_SCREEN.width / 2, PHONE_SCREEN.y + 480, 155);
	circle.fill({ color: flags.apiConnected ? 0xdcfce7 : COLORS.blueSoft, alpha: 1 });
	container.addChild(circle);

	const iconText = makeText(PIXI, flags.apiConnected ? '✓' : 'API', {
		fontSize: flags.apiConnected ? 120 : 70,
		fill: flags.apiConnected ? COLORS.green : COLORS.blue,
		fontWeight: '900'
	});
	addCenteredText(
		container,
		iconText,
		PHONE_SCREEN.x + PHONE_SCREEN.width / 2,
		PHONE_SCREEN.y + 485
	);

	const message = flags.apiConnected ? 'API 연결 완료' : 'API 연결 대기 중';
	const msg = makeText(PIXI, message, {
		fontSize: 46,
		fill: COLORS.text,
		fontWeight: '900'
	});
	addCenteredText(container, msg, PHONE_SCREEN.x + PHONE_SCREEN.width / 2, PHONE_SCREEN.y + 720);

	const dots = '.'.repeat((Math.floor(time / 25) % 3) + 1);
	const sub = makeText(
		PIXI,
		flags.apiConnected ? '날씨 데이터를 받을 준비가 끝났습니다.' : `서버 연결 중${dots}`,
		{
			fontSize: 30,
			fill: COLORS.subText,
			fontWeight: '700'
		}
	);
	addCenteredText(container, sub, PHONE_SCREEN.x + PHONE_SCREEN.width / 2, PHONE_SCREEN.y + 785);

	const card = new PIXI.Graphics();
	drawRoundRect(
		card,
		PHONE_SCREEN.x + 80,
		PHONE_SCREEN.y + 960,
		PHONE_SCREEN.width - 160,
		250,
		44,
		COLORS.cardSoft,
		1
	);
	container.addChild(card);

	const guide = makeText(PIXI, '미션 1', {
		fontSize: 28,
		fill: COLORS.blueText,
		fontWeight: '900'
	});
	addLeftText(container, guide, PHONE_SCREEN.x + 125, PHONE_SCREEN.y + 1015);

	const guide2 = makeText(PIXI, '날씨 API와 연결하면\n앱 화면이 켜집니다.', {
		fontSize: 36,
		fill: COLORS.text,
		fontWeight: '900',
		lineHeight: 48
	});
	addLeftText(container, guide2, PHONE_SCREEN.x + 125, PHONE_SCREEN.y + 1062);
}

function drawAnalyzeScreen(PIXI, container, flags) {
	drawPhoneWhiteBackground(PIXI, container);
	drawTopBar(PIXI, container, 'API 데이터 해석', '역할별 데이터 확인');

	const items = [
		['지역', flags.city ? `${flags.city} 확인` : '지역 데이터 대기'],
		['현재', flags.condition ? `${flags.condition} / ${flags.temp ?? '-'}℃` : '현재 날씨 대기'],
		['예보', flags.forecast?.length ? `${flags.forecast.length}일 예보 확인` : '예보 데이터 대기'],
		['알림', flags.alert?.message ? '안전 알림 확인' : '알림 데이터 대기']
	];

	items.forEach(([label, value], index) => {
		const y = PHONE_SCREEN.y + 330 + index * 230;

		const card = new PIXI.Graphics();
		drawRoundRect(
			card,
			PHONE_SCREEN.x + 70,
			y,
			PHONE_SCREEN.width - 140,
			165,
			36,
			COLORS.cardSoft,
			1
		);
		drawStrokeRoundRect(
			card,
			PHONE_SCREEN.x + 70,
			y,
			PHONE_SCREEN.width - 140,
			165,
			36,
			COLORS.line,
			2,
			1
		);
		container.addChild(card);

		const badge = new PIXI.Graphics();
		drawRoundRect(badge, PHONE_SCREEN.x + 105, y + 38, 130, 58, 29, COLORS.blueSoft, 1);
		container.addChild(badge);

		const labelText = makeText(PIXI, label, {
			fontSize: 28,
			fill: COLORS.blueText,
			fontWeight: '900'
		});
		addCenteredText(container, labelText, PHONE_SCREEN.x + 170, y + 67);

		const valueText = makeText(PIXI, value, {
			fontSize: 34,
			fill: COLORS.text,
			fontWeight: '900'
		});
		addLeftText(container, valueText, PHONE_SCREEN.x + 265, y + 55);

		const stateText = makeText(PIXI, value.includes('대기') ? '대기' : '완료', {
			fontSize: 24,
			fill: value.includes('대기') ? COLORS.muted : COLORS.green,
			fontWeight: '900'
		});
		addLeftText(container, stateText, PHONE_SCREEN.x + 265, y + 103);
	});
}

function drawForecastCards(PIXI, container, forecast = []) {
	const list = forecast.slice(0, 3);

	list.forEach((item, index) => {
		const cardWidth = 205;
		const gap = 24;
		const cardX = PHONE_SCREEN.x + 70 + index * (cardWidth + gap);
		const cardY = PHONE_SCREEN.y + 1190;

		const card = new PIXI.Graphics();
		drawRoundRect(card, cardX, cardY, cardWidth, 230, 36, COLORS.white, 1);
		drawStrokeRoundRect(card, cardX, cardY, cardWidth, 230, 36, COLORS.line, 2, 1);
		container.addChild(card);

		const day = makeText(PIXI, item?.요일 ?? '-', {
			fontSize: 36,
			fill: COLORS.text,
			fontWeight: '900'
		});
		addCenteredText(container, day, cardX + cardWidth / 2, cardY + 48);

		const temp = makeText(PIXI, `${item?.최저 ?? '-'}° / ${item?.최고 ?? '-'}°`, {
			fontSize: 28,
			fill: COLORS.blueText,
			fontWeight: '900'
		});
		addCenteredText(container, temp, cardX + cardWidth / 2, cardY + 112);

		const rain = makeText(PIXI, `비 ${item?.강수확률 ?? '-'}%`, {
			fontSize: 26,
			fill: COLORS.subText,
			fontWeight: '800'
		});
		addCenteredText(container, rain, cardX + cardWidth / 2, cardY + 170);
	});
}

function drawFinalWeatherApp(PIXI, container, flags, time) {
	drawPhoneWhiteBackground(PIXI, container);

	const topBg = new PIXI.Graphics();
	drawRoundRect(
		topBg,
		PHONE_SCREEN.x + 45,
		PHONE_SCREEN.y + 45,
		PHONE_SCREEN.width - 90,
		760,
		60,
		0xeff6ff,
		1
	);
	container.addChild(topBg);

	const header = makeText(PIXI, '오늘의 날씨', {
		fontSize: 42,
		fill: COLORS.blueText,
		fontWeight: '900'
	});
	addCenteredText(container, header, PHONE_SCREEN.x + PHONE_SCREEN.width / 2, PHONE_SCREEN.y + 110);

	const city = makeText(PIXI, flags.city || '우리 동네', {
		fontSize: 62,
		fill: COLORS.text,
		fontWeight: '900'
	});
	addCenteredText(container, city, PHONE_SCREEN.x + PHONE_SCREEN.width / 2, PHONE_SCREEN.y + 190);

	drawWeatherIcon(
		PIXI,
		container,
		flags.condition || '맑음',
		PHONE_SCREEN.x + PHONE_SCREEN.width / 2,
		PHONE_SCREEN.y + 410
	);

	const tempValue = flags.temp ?? '-';
	const temp = makeText(PIXI, `${tempValue}℃`, {
		fontSize: 120,
		fill: COLORS.text,
		fontWeight: '900'
	});
	addCenteredText(container, temp, PHONE_SCREEN.x + PHONE_SCREEN.width / 2, PHONE_SCREEN.y + 640);

	const condition = makeText(PIXI, flags.condition || '날씨 정보 없음', {
		fontSize: 44,
		fill: COLORS.subText,
		fontWeight: '900'
	});
	addCenteredText(
		container,
		condition,
		PHONE_SCREEN.x + PHONE_SCREEN.width / 2,
		PHONE_SCREEN.y + 750
	);

	const detailCard = new PIXI.Graphics();
	drawRoundRect(
		detailCard,
		PHONE_SCREEN.x + 70,
		PHONE_SCREEN.y + 875,
		PHONE_SCREEN.width - 140,
		175,
		40,
		COLORS.cardSoft,
		1
	);
	container.addChild(detailCard);

	const detail = makeText(PIXI, `습도 ${flags.humidity ?? '-'}%     바람 ${flags.wind ?? '-'}m/s`, {
		fontSize: 36,
		fill: COLORS.text,
		fontWeight: '900'
	});
	addCenteredText(container, detail, PHONE_SCREEN.x + PHONE_SCREEN.width / 2, PHONE_SCREEN.y + 962);

	const forecastTitle = makeText(PIXI, '요일별 예보', {
		fontSize: 38,
		fill: COLORS.text,
		fontWeight: '900'
	});
	addLeftText(container, forecastTitle, PHONE_SCREEN.x + 70, PHONE_SCREEN.y + 1120);

	drawForecastCards(PIXI, container, flags.forecast ?? []);

	if (flags.alert?.message) {
		const alertBox = new PIXI.Graphics();
		drawRoundRect(
			alertBox,
			PHONE_SCREEN.x + 70,
			PHONE_SCREEN.y + 1490,
			PHONE_SCREEN.width - 140,
			190,
			40,
			COLORS.warningBg,
			1
		);
		drawStrokeRoundRect(
			alertBox,
			PHONE_SCREEN.x + 70,
			PHONE_SCREEN.y + 1490,
			PHONE_SCREEN.width - 140,
			190,
			40,
			0xfdba74,
			3,
			1
		);
		container.addChild(alertBox);

		const alertTitle = makeText(PIXI, flags.alert?.type || '날씨 알림', {
			fontSize: 32,
			fill: COLORS.warningText,
			fontWeight: '900'
		});
		addLeftText(container, alertTitle, PHONE_SCREEN.x + 115, PHONE_SCREEN.y + 1528);

		const alertMessage = makeText(PIXI, flags.alert.message, {
			fontSize: 28,
			fill: 0x7c2d12,
			fontWeight: '800',
			wordWrap: true,
			wordWrapWidth: PHONE_SCREEN.width - 230,
			lineHeight: 38
		});
		addLeftText(container, alertMessage, PHONE_SCREEN.x + 115, PHONE_SCREEN.y + 1585);
	}
}

export function createWeatherAppRuntime({ app, PIXI, getState }) {
	const uiLayer = new PIXI.Container();
	app.stage.addChild(uiLayer);

	let lastRenderKey = '';

	function getRenderKey(flags) {
		return JSON.stringify({
			apiConnected: flags.apiConnected,
			apiAnalyzed: flags.apiAnalyzed,
			appReady: flags.appReady,
			city: flags.city,
			country: flags.country,
			condition: flags.condition,
			temp: flags.temp,
			humidity: flags.humidity,
			wind: flags.wind,
			forecast: flags.forecast,
			alert: flags.alert
		});
	}

	function render(time) {
		const state = getState?.() ?? {};
		const flags = state.flags ?? {};



		const renderKey = getRenderKey(flags) + `:${Math.floor(time / 20)}`;

		if (renderKey === lastRenderKey) return;
		lastRenderKey = renderKey;

		clearContainer(uiLayer);

		if (flags.appReady) {
			drawFinalWeatherApp(PIXI, uiLayer, flags, time);
			return;
		}

		if (flags.apiAnalyzed) {
			drawAnalyzeScreen(PIXI, uiLayer, flags);
			return;
		}

		drawLoadingScreen(PIXI, uiLayer, flags, time);
	}

	function tick({ time }) {
		render(time);
	}

	function destroy() {
		uiLayer.destroy({ children: true });
	}

	return {
		tick,
		destroy
	};
}
