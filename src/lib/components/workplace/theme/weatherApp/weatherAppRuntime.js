// src/lib/components/workplace/theme/weatherApp/weatherAppRuntime.js

const PHONE_SCREEN = {
	x: 324,
	y: 200,
	width: 816,
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
	green: 0x16a34a,
	greenSoft: 0xdcfce7,
	yellowSoft: 0xfef3c7,
	yellowText: 0xa16207,
	orangeSoft: 0xffedd5,
	orangeText: 0xc2410c
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

function drawPill(
	PIXI,
	container,
	text,
	x,
	y,
	width,
	color = COLORS.blueText,
	bg = COLORS.blueSoft
) {
	const pill = new PIXI.Graphics();
	drawRoundRect(pill, x, y, width, 62, 31, bg, 1);
	container.addChild(pill);

	const t = makeText(PIXI, text, {
		fontSize: 26,
		fill: color,
		fontWeight: '900',
		align: 'center'
	});

	addCenteredText(container, t, x + width / 2, y + 31);
}

function getItems(flags) {
	return [flags.item1, flags.item2, flags.item3, flags.item4].filter(Boolean);
}

function drawAdminScreen(PIXI, container, flags, time) {
	drawPhoneWhiteBackground(PIXI, container);
	drawTopBar(PIXI, container, '분실물찾기', '관리자 접속');

	const circle = new PIXI.Graphics();
	circle.circle(PHONE_SCREEN.x + PHONE_SCREEN.width / 2, PHONE_SCREEN.y + 500, 165);
	circle.fill({
		color: flags.managerConnected ? COLORS.greenSoft : COLORS.blueSoft,
		alpha: 1
	});
	container.addChild(circle);

	const iconText = makeText(PIXI, flags.managerConnected ? '✓' : '관리', {
		fontSize: flags.managerConnected ? 130 : 70,
		fill: flags.managerConnected ? COLORS.green : COLORS.blueText,
		fontWeight: '900'
	});

	addCenteredText(
		container,
		iconText,
		PHONE_SCREEN.x + PHONE_SCREEN.width / 2,
		PHONE_SCREEN.y + 510
	);

	const message = makeText(
		PIXI,
		flags.managerConnected ? '관리자 모드 접속 완료' : '관리자 접속 대기 중',
		{
			fontSize: 46,
			fill: COLORS.text,
			fontWeight: '900'
		}
	);

	addCenteredText(
		container,
		message,
		PHONE_SCREEN.x + PHONE_SCREEN.width / 2,
		PHONE_SCREEN.y + 760
	);

	const dots = '.'.repeat((Math.floor(time / 25) % 3) + 1);

	const sub = makeText(
		PIXI,
		flags.managerConnected
			? '분실물 등록 시스템을 사용할 수 있습니다.'
			: `접속 정보를 확인하는 중${dots}`,
		{
			fontSize: 30,
			fill: COLORS.subText,
			fontWeight: '700'
		}
	);

	addCenteredText(container, sub, PHONE_SCREEN.x + PHONE_SCREEN.width / 2, PHONE_SCREEN.y + 825);

	const card = new PIXI.Graphics();
	drawRoundRect(
		card,
		PHONE_SCREEN.x + 80,
		PHONE_SCREEN.y + 1010,
		PHONE_SCREEN.width - 160,
		290,
		44,
		COLORS.cardSoft,
		1
	);
	container.addChild(card);

	const guide = makeText(PIXI, '미션 1', {
		fontSize: 30,
		fill: COLORS.blueText,
		fontWeight: '900'
	});
	addLeftText(container, guide, PHONE_SCREEN.x + 125, PHONE_SCREEN.y + 1065);

	const guide2 = makeText(PIXI, '관리자 접속이 완료되면\n분실물 등록 준비를 시작합니다.', {
		fontSize: 36,
		fill: COLORS.text,
		fontWeight: '900',
		lineHeight: 50,
		align: 'left'
	});
	addLeftText(container, guide2, PHONE_SCREEN.x + 125, PHONE_SCREEN.y + 1115);
}

function drawCategoryScreen(PIXI, container, flags) {
	drawPhoneWhiteBackground(PIXI, container);
	drawTopBar(PIXI, container, '분류기준 만들기', '분실물을 종류별로 정리합니다');

	const status = makeText(PIXI, flags.categoryReady ? '분류 기준 준비 완료' : '분류 기준 대기 중', {
		fontSize: 44,
		fill: flags.categoryReady ? COLORS.green : COLORS.text,
		fontWeight: '900'
	});
	addCenteredText(container, status, PHONE_SCREEN.x + PHONE_SCREEN.width / 2, PHONE_SCREEN.y + 300);

	const categoryCard = new PIXI.Graphics();
	drawRoundRect(
		categoryCard,
		PHONE_SCREEN.x + 70,
		PHONE_SCREEN.y + 430,
		PHONE_SCREEN.width - 140,
		430,
		42,
		COLORS.cardSoft,
		1
	);
	drawStrokeRoundRect(
		categoryCard,
		PHONE_SCREEN.x + 70,
		PHONE_SCREEN.y + 430,
		PHONE_SCREEN.width - 140,
		430,
		42,
		COLORS.line,
		2,
		1
	);
	container.addChild(categoryCard);

	const title1 = makeText(PIXI, '사용 가능한 종류', {
		fontSize: 36,
		fill: COLORS.text,
		fontWeight: '900',
		align: 'left'
	});
	addLeftText(container, title1, PHONE_SCREEN.x + 115, PHONE_SCREEN.y + 485);

	const categories = flags.categories?.length
		? flags.categories
		: ['학용품', '의류', '우산', '생활용품','기타'];

	categories.slice(0, 6).forEach((category, index) => {
		const x = PHONE_SCREEN.x + 115 + (index % 2) * 315;
		const y = PHONE_SCREEN.y + 575 + Math.floor(index / 2) * 95;

		drawPill(PIXI, container, category, x, y, 270);
	});

	const placeCard = new PIXI.Graphics();
	drawRoundRect(
		placeCard,
		PHONE_SCREEN.x + 70,
		PHONE_SCREEN.y + 930,
		PHONE_SCREEN.width - 140,
		430,
		42,
		0xeff6ff,
		1
	);
	drawStrokeRoundRect(
		placeCard,
		PHONE_SCREEN.x + 70,
		PHONE_SCREEN.y + 930,
		PHONE_SCREEN.width - 140,
		430,
		42,
		0xbfdbfe,
		2,
		1
	);
	container.addChild(placeCard);

	const title2 = makeText(PIXI, '보관장소', {
		fontSize: 36,
		fill: COLORS.text,
		fontWeight: '900',
		align: 'left'
	});
	addLeftText(container, title2, PHONE_SCREEN.x + 115, PHONE_SCREEN.y + 985);

	const places = flags.storagePlaces?.length
		? flags.storagePlaces
		: ['교무실', '교실', '도서관', '분실물보관함'];

	places.slice(0, 6).forEach((place, index) => {
		const x = PHONE_SCREEN.x + 115 + (index % 2) * 315;
		const y = PHONE_SCREEN.y + 1075 + Math.floor(index / 2) * 95;

		drawPill(PIXI, container, place, x, y, 270, COLORS.blueText, COLORS.white);
	});

	const bottom = makeText(PIXI, '이 기준에 맞춰 실제 분실물을 등록하세요.', {
		fontSize: 30,
		fill: COLORS.subText,
		fontWeight: '800'
	});
	addCenteredText(
		container,
		bottom,
		PHONE_SCREEN.x + PHONE_SCREEN.width / 2,
		PHONE_SCREEN.y + 1510
	);
}

function drawItemCard(PIXI, container, item, x, y, width, height) {
	const card = new PIXI.Graphics();
	drawRoundRect(card, x, y, width, height, 34, COLORS.white, 1);
	drawStrokeRoundRect(card, x, y, width, height, 34, COLORS.line, 2, 1);
	container.addChild(card);

	const number = makeText(PIXI, `#${item.cardNumber}`, {
		fontSize: 24,
		fill: COLORS.blueText,
		fontWeight: '900',
		align: 'left'
	});
	addLeftText(container, number, x + 28, y + 24);

	const statusText = item.ownerFound ? '주인 찾음' : '찾는 중';
	const statusBg = item.ownerFound ? COLORS.greenSoft : COLORS.yellowSoft;
	const statusColor = item.ownerFound ? COLORS.green : COLORS.yellowText;
	drawPill(PIXI, container, statusText, x + width - 176, y + 20, 140, statusColor, statusBg);

	const name = makeText(PIXI, item.name || '이름 없음', {
		fontSize: 35,
		fill: COLORS.text,
		fontWeight: '900',
		align: 'left'
	});
	addLeftText(container, name, x + 28, y + 73);

	const meta = makeText(PIXI, `${item.category || '-'} · ${item.color || '-'}`, {
		fontSize: 25,
		fill: COLORS.subText,
		fontWeight: '800',
		align: 'left'
	});
	addLeftText(container, meta, x + 28, y + 122);

	const place = makeText(
		PIXI,
		`발견: ${item.foundPlace || '-'}\n보관: ${item.storagePlace || '-'}`,
		{
			fontSize: 23,
			fill: COLORS.text,
			fontWeight: '700',
			lineHeight: 34,
			align: 'left'
		}
	);
	addLeftText(container, place, x + 28, y + 168);

	const featureText = item.features?.length ? item.features.slice(0, 2).join(', ') : '특징 없음';
	const features = makeText(PIXI, `특징: ${featureText}`, {
		fontSize: 22,
		fill: COLORS.muted,
		fontWeight: '700',
		wordWrap: true,
		wordWrapWidth: width - 56,
		lineHeight: 32,
		align: 'left'
	});
	addLeftText(container, features, x + 28, y + 250);

	if (item.hasPhoto) {
		const photo = makeText(PIXI, '사진 있음', {
			fontSize: 21,
			fill: COLORS.blueText,
			fontWeight: '900',
			align: 'left'
		});
		addLeftText(container, photo, x + 28, y + height - 48);
	}
}

function drawRegisterScreen(PIXI, container, flags) {
	drawPhoneWhiteBackground(PIXI, container);
	// drawTopBar(PIXI, container, '분실물 목록', '각자 등록한 카드가 모입니다');

	const items = getItems(flags);

	const summary = makeText(PIXI, `등록된 분실물 ${items.length} / 4`, {
		fontSize: 44,
		fill: items.length >= 4 ? COLORS.green : COLORS.text,
		fontWeight: '900'
	});
	addCenteredText(container, summary, PHONE_SCREEN.x + PHONE_SCREEN.width / 2, PHONE_SCREEN.y + 65);

	if (items.length >= 4) {
		drawPill(
			PIXI,
			container,
			'목록 완성',
			PHONE_SCREEN.x + PHONE_SCREEN.width / 2 - 150,
			PHONE_SCREEN.y + 115,
			300,
			COLORS.green,
			COLORS.greenSoft
		);
	} else {
		const waiting = makeText(PIXI, '4개의 카드가 모두 모이면 앱 목록이 완성됩니다.', {
			fontSize: 27,
			fill: COLORS.muted,
			fontWeight: '800'
		});
		addCenteredText(
			container,
			waiting,
			PHONE_SCREEN.x + PHONE_SCREEN.width / 2,
			PHONE_SCREEN.y + 135
		);
	}

	const startX = PHONE_SCREEN.x + 65;
	const startY = PHONE_SCREEN.y + 200;
	const cardWidth = 330;
	const cardHeight = 360;
	const gapX = 30;
	const gapY = 35;

	for (let i = 0; i < 4; i += 1) {
		const cardNumber = i + 1;
		const item = items.find((next) => next.cardNumber === cardNumber);
		const x = startX + (i % 2) * (cardWidth + gapX);
		const y = startY + Math.floor(i / 2) * (cardHeight + gapY);

		if (item) {
			drawItemCard(PIXI, container, item, x, y, cardWidth, cardHeight);
		} else {
			const empty = new PIXI.Graphics();
			drawRoundRect(empty, x, y, cardWidth, cardHeight, 34, COLORS.cardSoft, 1);
			drawStrokeRoundRect(empty, x, y, cardWidth, cardHeight, 34, COLORS.line, 2, 0.8);
			container.addChild(empty);

			const text = makeText(PIXI, `#${cardNumber}\n등록 대기`, {
				fontSize: 32,
				fill: COLORS.muted,
				fontWeight: '900',
				align: 'center',
				lineHeight: 48
			});
			addCenteredText(container, text, x + cardWidth / 2, y + cardHeight / 2);
		}
	}
}

export function createWeatherAppRuntime({ app, PIXI, getState }) {
	const uiLayer = new PIXI.Container();
	app.stage.addChild(uiLayer);

	let lastRenderKey = '';

	function getRenderKey(flags) {
		return JSON.stringify({
			managerConnected: flags.managerConnected,
			categoryReady: flags.categoryReady,
			registerMode: flags.registerMode,
			appName: flags.appName,
			managerName: flags.managerName,
			schoolName: flags.schoolName,
			categories: flags.categories,
			storagePlaces: flags.storagePlaces,
			item1: flags.item1,
			item2: flags.item2,
			item3: flags.item3,
			item4: flags.item4
		});
	}

	function render(time) {
		const state = getState?.() ?? {};
		const flags = state.flags ?? {};

		const renderKey = getRenderKey(flags) + `:${Math.floor(time / 25)}`;

		if (renderKey === lastRenderKey) return;
		lastRenderKey = renderKey;

		clearContainer(uiLayer);

		if (flags.registerMode || flags.item1 || flags.item2 || flags.item3 || flags.item4) {
			drawRegisterScreen(PIXI, uiLayer, flags);
			return;
		}

		if (flags.categoryReady) {
			drawCategoryScreen(PIXI, uiLayer, flags);
			return;
		}

		drawAdminScreen(PIXI, uiLayer, flags, time);
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
