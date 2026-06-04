// src/lib/components/workplace/theme/monsterDefense/monsterDefenseRuntime.js

const MONSTER_START = {
	x: 595,
	y: -30
};

const MONSTER_WALL_POINT = {
	x: 595,
	y: 195
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

// 불덩어리탄 시작 위치
// 물대포 입구에 맞게 여기만 조정하면 됨
const FIREBALL_START = {
	x: 935,
	y: 455
};

// 몬스터 몸통 어느 지점을 맞출지 조정
const FIREBALL_TARGET_OFFSET = {
	x: 35,
	y: 35
};

const HP_BAR = {
	x: 1060,
	y: 85,
	width: 270,
	height: 22,
	radius: 11
};

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

function hideMonsterFrames(sprites) {
	hide(sprites.monsterWalk1);
	hide(sprites.monsterWalk2);
	hide(sprites.monsterWalk3);
	hide(sprites.monsterHit);
	hide(sprites.monsterGroggy);
}

function hideWallSprites(sprites) {
	hide(sprites.wallNorth);
	hide(sprites.wallEast);
	hide(sprites.wallSouth);
	hide(sprites.wallWest);
}

function getWallSpriteByDirection(sprites, direction = '') {
	if (direction.includes('북쪽')) return sprites.wallNorth;
	if (direction.includes('동쪽')) return sprites.wallEast;
	if (direction.includes('남쪽')) return sprites.wallSouth ?? sprites.wallNorth;
	if (direction.includes('서쪽')) return sprites.wallWest ?? sprites.wallEast;

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
	hide(sprites.waterCannon);
	hide(sprites.waterShot);
}

function placeDefenseTools({ sprites, flags }) {
	hideWallSprites(sprites);

	const wallSprite = getWallSpriteByDirection(sprites, flags.wallDirection);

	if (wallSprite && flags.wallDoorClosed === true) {
		showOnly(wallSprite);
	}

	if (sprites.trap) {
		if (flags.trapActive === true && flags.trapName) {
			showOnly(sprites.trap, 1);
		} else {
			hide(sprites.trap);
		}
	}

	if (sprites.waterCannon) {
		if (flags.cannonActive === true && flags.cannonType) {
			showOnly(sprites.waterCannon);
		} else {
			hide(sprites.waterCannon);
		}
	}
}

function getDefenseResult(flags) {
	const monsterComesFromNorth = flags.monsterDirection === '북쪽';

	const wallOk =
		monsterComesFromNorth &&
		flags.wallDirection === '북쪽' &&
		flags.wallDoorClosed === true;

	const trapOk =
		monsterComesFromNorth &&
		flags.trapName === '그물트랩' &&
		flags.trapPosition === '북쪽길' &&
		flags.trapActive === true;

	const cannonOk = flags.cannonType === '물대포' && flags.cannonActive === true;

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

export function createMonsterDefenseRuntime({ app, PIXI, sprites, getState }) {
	const hpBar = createHpBar({
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

			fireballIndex: 0,
			fireballPhase: 'waiting',
			fireballTimer: 0,

			fireballBaseScaleX: null,
			fireballBaseScaleY: null
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

		resetFireballState();

		hpBar?.show(monster.hp);
	}

	function damageMonster(amount = 1) {
		monster.hp = Math.max(monster.hp - amount, 0);
		hpBar?.draw(monster.hp);
	}

	function tick({ delta, time }) {
		const state = getState?.() ?? {};
		const flags = state.flags ?? {};

		hideMonsterFrames(sprites);
		resetTemporaryEffects(sprites);

		if (!flags.finalStarted) {
			monster.state = 'idle';
			monster.timer = 0;
			monster.x = MONSTER_START.x;
			monster.y = MONSTER_START.y;
			monster.hp = MONSTER_MAX_HP;
			monster.trapDamageApplied = false;

			resetFireballState();

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
			cannonActive: flags.cannonActive
		});

		if (monster.lastFinalKey !== finalKey) {
			monster.lastFinalKey = finalKey;
			resetFinalAnimation();
		}

		placeDefenseTools({
			sprites,
			flags
		});

		const result = getDefenseResult(flags);

		if (monster.state === 'walking') {
			monster.y = Math.min(MONSTER_WALL_POINT.y, monster.y + MONSTER_WALK_SPEED * delta);

			showWalkFrame({
				sprites,
				x: monster.x,
				y: monster.y,
				time
			});

			if (monster.y >= MONSTER_WALL_POINT.y) {
				monster.state = result.monsterCaught ? 'trapped' : 'breakthrough';
				monster.timer = 0;
			}

			return;
		}

		if (monster.state === 'trapped') {
			monster.timer += delta;

			showAt(sprites.monsterWalk2 ?? sprites.monsterWalk1, monster.x, monster.y);

			if (!monster.trapDamageApplied) {
				damageMonster(1);
				monster.trapDamageApplied = true;
			}

			if (sprites.trap) {
				sprites.trap.alpha = 1;
			}

			if (monster.timer > 45) {
				monster.state = result.cannonOk ? 'hit' : 'breakthrough';
				monster.timer = 0;

				// 트랩 데미지는 유지하고, 불덩어리탄 카운트만 새로 시작
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
	// 최초 1번만 theme에서 만들어진 원래 scale 저장
	if (monster.fireballBaseScaleX === null || monster.fireballBaseScaleY === null) {
		monster.fireballBaseScaleX = sprites.waterShot.scale.x;
		monster.fireballBaseScaleY = sprites.waterShot.scale.y;
	}

	showAt(sprites.waterShot, fireballX, fireballY, 1);

	sprites.waterShot.rotation += 0.22 * delta;

	// 원래 크기를 기준으로 살짝 커졌다 작아지게 함
	const pulse = 1 + Math.sin(progress * Math.PI) * 0.12;
	sprites.waterShot.scale.x = monster.fireballBaseScaleX * pulse;
	sprites.waterShot.scale.y = monster.fireballBaseScaleY * pulse;
}

				if (progress >= 1) {
					damageMonster(1);
					monster.fireballIndex += 1;
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

						// 끝났을 때만 탄 숨기고 상태 정리
						resetFireballState({ resetCount: false });
					} else {
						// 다음 탄 발사 전에는 다시 걷는 프레임으로 보이게 함
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

			return;
		}
	}

	function destroy() {
		hpBar?.destroy?.();
	}

	return {
		tick,
		destroy
	};
}