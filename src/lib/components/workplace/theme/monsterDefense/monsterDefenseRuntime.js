// src/lib/components/workplace/theme/monsterDefense/monsterDefenseRuntime.js

import { GlowFilter } from 'pixi-filters';

const MONSTER_START = {
	x: 595,
	y: -30
};

const MONSTER_WALL_POINT = {
	x: 595,
	y: 155
};

// 실패했을 때 성벽을 뚫고 더 내려오는 위치
const MONSTER_END = {
	x: 635,
	y: 450
};

const MONSTER_MAX_HP = 4;

// 트랩 데미지 1 + 불덩어리탄 3발 = 총 4 데미지
const FIREBALL_COUNT = 3;

// 불덩어리탄 발사 간격 / 이동 시간 / 피격 표시 시간
const FIREBALL_WAIT_TIME = 45;
const FIREBALL_FLY_TIME = 35;
const MONSTER_HIT_FLASH_TIME = 18;

const MONSTER_WALK_SPEED = 0.4;
const MONSTER_BREAKTHROUGH_SPEED = 0.9;

const TRAP_HIT_FLASH_TIME = 18;
const FINAL_RESULT_DELAY_TIME = 35;
// 불덩어리탄 시작 위치
const FIREBALL_START = {
	x: 935,
	y: 455
};

// 몬스터 몸통 어느 지점을 맞출지 조정
const FIREBALL_TARGET_OFFSET = {
	x: 130,
	y: 65
};

const MONSTER_TRAP_POINT = {
	x: 595,
	y: 10
};

const HP_BAR = {
	x: 1060,
	y: 85,
	width: 270,
	height: 22,
	radius: 11
};
const TRAP_POSITIONS = {
	북쪽: { x: 595, y: 55 },
	동쪽: { x: 1190, y: 550 },
	남쪽: { x: 550, y: 920 },
	서쪽: { x: 0, y: 560 }
};

const CANNON_POSITIONS = {
	북쪽: { x: 905, y: 400 },
	동쪽: { x: 890, y: 720 },
	남쪽: { x: 820, y: 680 },
	서쪽: { x: 290, y: 720 }
};
const WALL_POSITIONS = {
	북쪽: { x: 450, y: 240 },
	동쪽: { x: 960, y: 580 },
	남쪽: { x: 450, y: 810 },
	서쪽: { x: 160, y: 581 }
};

function getDirectionFromText(value = '', fallback = '북쪽') {
	const text = normalizeText(value);

	if (text === '북' || text.includes('북쪽') || text.includes('북문') || text.includes('북쪽길')) {
		return '북쪽';
	}

	if (text === '동' || text.includes('동쪽') || text.includes('동문') || text.includes('동쪽길')) {
		return '동쪽';
	}

	if (text === '남' || text.includes('남쪽') || text.includes('남문') || text.includes('남쪽길')) {
		return '남쪽';
	}

	if (text === '서' || text.includes('서쪽') || text.includes('서문') || text.includes('서쪽길')) {
		return '서쪽';
	}

	return fallback;
}

function applyInstallGlow(sprite, color = 0xdfe4ea) {
	if (!sprite) return;

	if (!sprite.__installGlowFilter) {
		sprite.__installGlowFilter = new GlowFilter({
			distance: 8,
			outerStrength: 2.8,
			innerStrength: 0,
			color,
			quality: 0.4
		});
	}

	sprite.__installGlowFilter.color = color;
	sprite.__installGlowFilter.outerStrength = 2.8;
	sprite.filters = [sprite.__installGlowFilter];
}

function clearInstallGlow(sprite) {
	if (!sprite) return;
	sprite.filters = null;
}
const INSTALL_GLOW_COLOR = 0xdfe4ea;

function moveSpriteTo(sprite, position) {
	if (!sprite || !position) return;

	sprite.x = position.x;
	sprite.y = position.y;
}

function hide(sprite) {
	if (!sprite) return;

	sprite.visible = false;
	sprite.alpha = 0;
}

function showOnly(sprite, alpha = 1) {
	if (!sprite) return;

	sprite.visible = true;
	sprite.alpha = alpha;
}

function showAt(sprite, x, y, alpha = 1) {
	if (!sprite) return;

	sprite.visible = true;
	sprite.alpha = alpha;
	sprite.x = x;
	sprite.y = y;
}

function lerp(start, end, progress) {
	return start + (end - start) * progress;
}

function easeOutCubic(t) {
	return 1 - Math.pow(1 - t, 3);
}

function normalizeText(value = '') {
	return String(value).replaceAll(' ', '').trim();
}
function getCannonSpriteByType(sprites, cannonType = '') {
	const type = normalizeText(cannonType);

	if (type.includes('불대포') || type.includes('불')) {
		return sprites.fireCannon;
	}

	if (type.includes('물대포') || type.includes('물')) {
		return sprites.waterCannon;
	}

	return null;
}

function hideCannonSprites(sprites) {
	clearInstallGlow(sprites.waterCannon);
	clearInstallGlow(sprites.fireCannon);

	hide(sprites.waterCannon);
	hide(sprites.fireCannon);
}

function hideMonsterFrames(sprites) {
	hide(sprites.monsterWalk1);
	hide(sprites.monsterWalk2);
	hide(sprites.monsterWalk3);
	hide(sprites.monsterHit);
	hide(sprites.monsterGroggy);
}

function hideWallSprites(sprites) {
	clearInstallGlow(sprites.wallNorth);
	clearInstallGlow(sprites.wallEast);
	clearInstallGlow(sprites.wallSouth);
	clearInstallGlow(sprites.wallWest);

	hide(sprites.wallNorth);
	hide(sprites.wallEast);
	hide(sprites.wallSouth);
	hide(sprites.wallWest);
}

function getWallSpriteByDirection(sprites, direction = '') {
	const normalizedDirection = getDirectionFromText(direction, '');

	if (normalizedDirection === '북쪽') return sprites.wallNorth;
	if (normalizedDirection === '동쪽') return sprites.wallEast;
	if (normalizedDirection === '남쪽') return sprites.wallNorth;
	if (normalizedDirection === '서쪽') return sprites.wallWest;

	return null;
}

function showWalkFrame({ sprites, x, y, time }) {
	const frames = [sprites.monsterWalk1, sprites.monsterWalk2, sprites.monsterWalk3].filter(Boolean);

	if (frames.length === 0) return;

	const frame = frames[Math.floor(Date.now() / 160) % frames.length];

	showAt(frame, x + Math.sin(time * 0.25) * 6, y);
	frame.rotation = Math.sin(time * 0.18) * 0.04;
}

function resetTemporaryEffects(sprites) {
	hide(sprites.waterShot);
	hide(sprites.effect);
	hide(sprites.failEffect);
}

function resetDefenseTools(sprites) {
	hideWallSprites(sprites);
	hide(sprites.trap);
	hideCannonSprites(sprites);
	hide(sprites.waterShot);
}

function placeDefenseTools({ sprites, flags, time }) {
	hideWallSprites(sprites);

	const wallDirection = getDirectionFromText(flags.wallDirection, '북쪽');
	const wallSprite = getWallSpriteByDirection(sprites, wallDirection);

	if (wallSprite && flags.wallDoorClosed === true) {
		moveSpriteTo(wallSprite, WALL_POSITIONS[wallDirection]);

		showOnly(wallSprite, 1);
		applyInstallGlow(wallSprite, INSTALL_GLOW_COLOR);
	}

	if (sprites.trap) {
		if (flags.trapActive === true && flags.trapName) {
			const trapDirection = getDirectionFromText(flags.trapPosition);
			moveSpriteTo(sprites.trap, TRAP_POSITIONS[trapDirection]);

			showOnly(sprites.trap, 1);
			applyInstallGlow(sprites.trap, INSTALL_GLOW_COLOR);
		} else {
			clearInstallGlow(sprites.trap);
			hide(sprites.trap);
		}
	}

	hideCannonSprites(sprites);

	if (flags.cannonActive === true && flags.cannonType) {
		const cannonDirection = getDirectionFromText(flags.cannonPosition, '북쪽');
		const cannonSprite = getCannonSpriteByType(sprites, flags.cannonType);

		if (cannonSprite) {
			moveSpriteTo(cannonSprite, CANNON_POSITIONS[cannonDirection]);

			showOnly(cannonSprite, 1);
			applyInstallGlow(cannonSprite, INSTALL_GLOW_COLOR);
		}
	}
}

function getDefenseResult(flags) {
	const monsterDirection = normalizeText(flags.monsterDirection);
	const wallDirection = normalizeText(flags.wallDirection);
	const trapName = normalizeText(flags.trapName);
	const trapPosition = getDirectionFromText(flags.trapPosition, '');
	const cannonType = normalizeText(flags.cannonType);
	const cannonPosition = getDirectionFromText(flags.cannonPosition, '');

	const monsterComesFromNorth = monsterDirection === '북쪽';

	const wallOk = monsterComesFromNorth && wallDirection === '북쪽' && flags.wallDoorClosed === true;

	// 띄어쓰기 차이 때문에 안 걸리는 문제 방지
	// "그물트랩", "그물 트랩" 둘 다 허용
	// "북쪽길", "북쪽 길" 둘 다 허용
	const trapOk =
		monsterComesFromNorth &&
		trapName === '그물트랩' &&
		trapPosition === '북쪽' &&
		flags.trapActive === true;

	const cannonOk =
		cannonType === '불대포' && cannonPosition === '북쪽' && flags.cannonActive === true;

	return {
		wallOk,
		trapOk,
		cannonOk,
		monsterCaught: trapOk,
		canDefeat: wallOk && trapOk && cannonOk
	};
}

function createHpBar({ app, PIXI }) {
	if (!app || !PIXI) return null;

	const container = new PIXI.Container();

	container.visible = false;
	container.x = HP_BAR.x;
	container.y = HP_BAR.y;

	const bg = new PIXI.Graphics();
	const fill = new PIXI.Graphics();
	const frame = new PIXI.Graphics();

	container.addChild(bg);
	container.addChild(fill);
	container.addChild(frame);

	app.stage.addChild(container);

	function draw(hp = MONSTER_MAX_HP) {
		const ratio = Math.max(0, Math.min(hp / MONSTER_MAX_HP, 1));
		const fillWidth = HP_BAR.width * ratio;

		bg.clear();
		bg.roundRect(0, 0, HP_BAR.width, HP_BAR.height, HP_BAR.radius);
		bg.fill({
			color: 0x0f172a,
			alpha: 0.72
		});

		fill.clear();

		if (fillWidth > 0) {
			fill.roundRect(0, 0, fillWidth, HP_BAR.height, HP_BAR.radius);
			fill.fill({
				color: 0xef4444,
				alpha: 0.95
			});
		}

		frame.clear();
		frame.roundRect(0, 0, HP_BAR.width, HP_BAR.height, HP_BAR.radius);
		frame.stroke({
			width: 3,
			color: 0xffffff,
			alpha: 0.85
		});
	}

	function show(hp = MONSTER_MAX_HP) {
		container.visible = true;
		draw(hp);
	}

	function hide() {
		container.visible = false;
	}

	function destroy() {
		container.destroy({
			children: true
		});
	}

	draw(MONSTER_MAX_HP);

	return {
		show,
		hide,
		draw,
		destroy
	};
}
function createResultText({ app, PIXI }) {
	if (!app || !PIXI) return null;

	const text = new PIXI.Text({
		text: '',
		style: {
			fontFamily: 'Arial',
			fontSize: 72,
			fontWeight: '900',
			fill: 0xffffff,
			stroke: {
				color: 0x111827,
				width: 8
			},
			dropShadow: {
				color: 0x000000,
				blur: 8,
				angle: Math.PI / 4,
				distance: 5,
				alpha: 0.45
			}
		}
	});

	text.anchor.set(0.5);
	text.x = 705;
	text.y = 285;
	text.visible = false;
	text.alpha = 0;
	text.scale.set(0.8);

	app.stage.addChild(text);

	function show(message, color = 0x22c55e) {
		text.text = message;
		text.style.fill = color;
		text.visible = true;
		text.alpha = 1;
		text.scale.set(1);
	}

	function hide() {
		text.visible = false;
		text.alpha = 0;
		text.scale.set(0.8);
	}

	function pulse(time) {
		if (!text.visible) return;

		text.scale.set(1 + Math.sin(time * 0.18) * 0.04);
		text.alpha = 0.9 + Math.sin(time * 0.16) * 0.1;
	}

	function destroy() {
		text.destroy();
	}

	return {
		show,
		hide,
		pulse,
		destroy
	};
}
export function createMonsterDefenseRuntime({
	app,
	PIXI,
	sprites,
	getState,
	onFinalResultShown = () => {}
}) {
	const hpBar = createHpBar({
		app,
		PIXI
	});
	const resultText = createResultText({
		app,
		PIXI
	});

	const monster = {
		x: MONSTER_START.x,
		y: MONSTER_START.y,
		state: 'idle',
		timer: 0,
		lastFinalKey: '',
		hp: MONSTER_MAX_HP,

		waterShotIndex: 0,
		trapDamageApplied: false,
		trapHitFlashTimer: 0,

		fireballIndex: 0,
		fireballPhase: 'waiting',
		fireballTimer: 0,

		fireballBaseScaleX: null,
		fireballBaseScaleY: null,

		finalResultShown: false,
		finalResultPending: false,
		finalResultTimer: 0,
		finalResultType: ''
	};

	function resetFireballState({ resetCount = true } = {}) {
		if (resetCount) {
			monster.fireballIndex = 0;
			monster.waterShotIndex = 0;
		}

		monster.fireballPhase = 'waiting';
		monster.fireballTimer = 0;

		if (sprites.waterShot) {
			hide(sprites.waterShot);
			sprites.waterShot.rotation = 0;

			if (monster.fireballBaseScaleX !== null && monster.fireballBaseScaleY !== null) {
				sprites.waterShot.scale.x = monster.fireballBaseScaleX;
				sprites.waterShot.scale.y = monster.fireballBaseScaleY;
			}
		}
	}

	function resetFinalAnimation() {
		monster.x = MONSTER_START.x;
		monster.y = MONSTER_START.y;
		monster.state = 'walking';
		monster.timer = 0;
		monster.hp = MONSTER_MAX_HP;
		monster.trapDamageApplied = false;
		monster.trapHitFlashTimer = 0;

		resetFireballState();
		resultText?.hide();

		monster.finalResultShown = false;
		monster.finalResultPending = false;
		monster.finalResultTimer = 0;
		monster.finalResultType = '';

		hpBar?.show(monster.hp);
	}

	function damageMonster(amount = 1) {
		monster.hp = Math.max(monster.hp - amount, 0);
		hpBar?.draw(monster.hp);
	}
	function queueFinalResult(result) {
		if (monster.finalResultShown || monster.finalResultPending) return;

		monster.finalResultPending = true;
		monster.finalResultTimer = 0;
		monster.finalResultType = result;
	}

	function showFinalResult(result) {
		if (monster.finalResultShown) return;

		monster.finalResultShown = true;
		monster.finalResultPending = false;

		if (result === 'success') {
			console.log('방어 성공 표시');
			resultText?.show('방어 성공!', 0x22c55e);
		} else {
			console.log('방어 실패 표시');
			resultText?.show('방어 실패!', 0xef4444);
		}

		//모달 콜백 연결
		onFinalResultShown?.({
			themeId: 'monsterDefense',
			result
		});
	}

	function updateFinalResultQueue(delta) {
		if (!monster.finalResultPending || monster.finalResultShown) return;

		monster.finalResultTimer += delta;

		if (monster.finalResultTimer >= FINAL_RESULT_DELAY_TIME) {
			showFinalResult(monster.finalResultType);
		}
	}

	function tick({ delta, time }) {
		const state = getState?.() ?? {};
		const flags = state.flags ?? {};
		// if (flags.finalStarted) {
		// 	console.log('RUNTIME FINAL FLAGS', {
		// 		finalStarted: flags.finalStarted,
		// 		finalSuccess: flags.finalSuccess,
		// 		finalFail: flags.finalFail,
		// 		wallDirection: flags.wallDirection,
		// 		trapPosition: flags.trapPosition,
		// 		cannonType: flags.cannonType
		// 	});
		// }

		hideMonsterFrames(sprites);
		resetTemporaryEffects(sprites);

		if (!flags.finalStarted) {
			monster.state = 'idle';
			monster.timer = 0;
			monster.x = MONSTER_START.x;
			monster.y = MONSTER_START.y;
			monster.hp = MONSTER_MAX_HP;
			monster.waterShotIndex = 0;
			monster.trapDamageApplied = false;
			resultText?.hide();
			monster.trapHitFlashTimer = 0;

			resetFireballState();

			monster.finalResultShown = false;
			monster.finalResultPending = false;
			monster.finalResultTimer = 0;
			monster.finalResultType = '';

			hpBar?.hide();

			resetDefenseTools(sprites);
			return;
		}

		const finalKey = JSON.stringify({
			finalStarted: flags.finalStarted,
			finalSuccess: flags.finalSuccess,
			finalFail: flags.finalFail,
			wallDirection: flags.wallDirection,
			wallDoorClosed: flags.wallDoorClosed,
			trapName: flags.trapName,
			trapPosition: flags.trapPosition,
			trapActive: flags.trapActive,
			cannonType: flags.cannonType,
			cannonPosition: flags.cannonPosition,
			cannonActive: flags.cannonActive
		});

		if (monster.lastFinalKey !== finalKey) {
			monster.lastFinalKey = finalKey;
			resetFinalAnimation();
		}

		placeDefenseTools({
			sprites,
			flags,
			time
		});

		const result = getDefenseResult(flags);
		updateFinalResultQueue(delta);
		resultText?.pulse(time);

		if (monster.state === 'walking') {
			monster.y = Math.min(MONSTER_WALL_POINT.y, monster.y + MONSTER_WALK_SPEED * delta);

			showWalkFrame({
				sprites,
				x: monster.x,
				y: monster.y,
				time
			});

			// 트랩이 맞게 설치되어 있으면 벽이 아니라 트랩 지점에서 먼저 걸림
			if (result.monsterCaught && monster.y >= MONSTER_TRAP_POINT.y) {
				monster.state = 'trapped';
				monster.timer = 0;
				monster.trapHitFlashTimer = TRAP_HIT_FLASH_TIME;
				return;
			}

			// 트랩이 없거나 틀렸으면 벽까지 감
			if (monster.y >= MONSTER_WALL_POINT.y) {
				monster.state = 'breakthrough';
				monster.timer = 0;
			}

			return;
		}

		if (monster.state === 'trapped') {
			monster.timer += delta;

			if (!monster.trapDamageApplied) {
				damageMonster(1);
				monster.trapDamageApplied = true;
				monster.trapHitFlashTimer = TRAP_HIT_FLASH_TIME;
			}

			if (sprites.trap) {
				sprites.trap.alpha = 1;
			}

			if (monster.trapHitFlashTimer > 0) {
				monster.trapHitFlashTimer = Math.max(monster.trapHitFlashTimer - delta, 0);

				showAt(
					sprites.monsterHit,
					monster.x + Math.sin(time * 1.2) * 8,
					monster.y + Math.sin(time * 0.9) * 5
				);

				if (sprites.monsterHit) {
					sprites.monsterHit.rotation = Math.sin(time * 0.9) * 0.14;
				}
			} else {
				showWalkFrame({
					sprites,
					x: monster.x,
					y: monster.y,
					time
				});
			}

			// 트랩에 걸린 뒤 잠깐 hit 표시하고 다시 걸어감
			if (monster.timer > TRAP_HIT_FLASH_TIME + 12) {
				monster.state = 'afterTrapWalking';
				monster.timer = 0;
			}

			return;
		}

		if (monster.state === 'afterTrapWalking') {
			monster.y = Math.min(MONSTER_WALL_POINT.y, monster.y + MONSTER_WALK_SPEED * delta);

			showWalkFrame({
				sprites,
				x: monster.x,
				y: monster.y,
				time
			});

			if (monster.y >= MONSTER_WALL_POINT.y) {
				monster.state = result.cannonOk ? 'hit' : 'breakthrough';
				monster.timer = 0;
				resetFireballState({ resetCount: true });
			}

			return;
		}

		if (monster.state === 'hit') {
			monster.timer += delta;
			monster.fireballTimer += delta;

			const targetX = monster.x + FIREBALL_TARGET_OFFSET.x;
			const targetY = monster.y + FIREBALL_TARGET_OFFSET.y;

			hide(sprites.waterShot);

			if (monster.fireballPhase === 'waiting') {
				showWalkFrame({
					sprites,
					x: monster.x,
					y: monster.y,
					time
				});

				if (monster.fireballTimer >= FIREBALL_WAIT_TIME) {
					monster.fireballPhase = 'flying';
					monster.fireballTimer = 0;
				}

				return;
			}

			if (monster.fireballPhase === 'flying') {
				showWalkFrame({
					sprites,
					x: monster.x,
					y: monster.y,
					time
				});

				const progress = Math.min(monster.fireballTimer / FIREBALL_FLY_TIME, 1);
				const easedProgress = easeOutCubic(progress);

				const fireballX = lerp(FIREBALL_START.x, targetX, easedProgress);
				const fireballY = lerp(FIREBALL_START.y, targetY, easedProgress);

				if (sprites.waterShot) {
					if (monster.fireballBaseScaleX === null || monster.fireballBaseScaleY === null) {
						monster.fireballBaseScaleX = sprites.waterShot.scale.x;
						monster.fireballBaseScaleY = sprites.waterShot.scale.y;
					}

					showAt(sprites.waterShot, fireballX, fireballY, 1);

					sprites.waterShot.rotation += 0.22 * delta;

					const pulse = 1 + Math.sin(progress * Math.PI) * 0.42;
					sprites.waterShot.scale.x = monster.fireballBaseScaleX * pulse;
					sprites.waterShot.scale.y = monster.fireballBaseScaleY * pulse;
				}

				if (progress >= 1) {
					damageMonster(1);
					monster.fireballIndex += 1;

					if (monster.hp <= 0 && flags.finalSuccess) {
						queueFinalResult('success');
					}

					monster.fireballPhase = 'hitFlash';
					monster.fireballTimer = 0;
				}

				return;
			}

			if (monster.fireballPhase === 'hitFlash') {
				hide(sprites.waterShot);

				showAt(
					sprites.monsterHit,
					monster.x + Math.sin(time * 1.2) * 8,
					monster.y + Math.sin(time * 0.9) * 5
				);

				if (sprites.monsterHit) {
					sprites.monsterHit.rotation = Math.sin(time * 0.9) * 0.14;
				}

				if (monster.fireballTimer >= MONSTER_HIT_FLASH_TIME) {
					if (monster.fireballIndex >= FIREBALL_COUNT) {
						monster.state = monster.hp <= 0 && flags.finalSuccess ? 'groggy' : 'breakthrough';
						monster.timer = 0;

						resetFireballState({ resetCount: false });
					} else {
						monster.fireballPhase = 'waiting';
						monster.fireballTimer = 0;
						monster.timer = 0;
					}
				}

				return;
			}

			return;
		}

		if (monster.state === 'groggy') {
			showAt(sprites.monsterGroggy, monster.x, monster.y + 35);

			if (sprites.effect) {
				showOnly(sprites.effect, 0.85 + Math.sin(time * 0.16) * 0.15);
			}

			return;
		}

		if (monster.state === 'breakthrough') {
			monster.timer += delta;
			monster.y = Math.min(MONSTER_END.y, monster.y + MONSTER_BREAKTHROUGH_SPEED * delta);

			showWalkFrame({
				sprites,
				x: monster.x + Math.sin(time * 0.18) * 4,
				y: monster.y,
				time
			});

			if (sprites.failEffect && (monster.y >= MONSTER_END.y || monster.timer > 110)) {
				showOnly(sprites.failEffect, 0.8 + Math.sin(time * 0.25) * 0.18);
			}

			if (monster.y >= MONSTER_END.y || monster.timer > 110) {
				showFinalResult('fail');
				resultText?.pulse(time);
			}

			return;
		}
	}

	function destroy() {
		hpBar?.destroy?.();
		resultText?.destroy?.();
	}

	return {
		tick,
		destroy
	};
}
