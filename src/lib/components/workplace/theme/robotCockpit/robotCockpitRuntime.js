// src/lib/components/workplace/theme/robotCockpit/robotCockpitRuntime.js

const LOOK_DURATION = 320;

const MISSILE_FLY_DURATION = 230;
const EXPLOSION_DURATION = 90;

// 미사일 시작 위치
const MISSILE_START = {
	x: 0,
	y: 620
};

// 미사일 도착 / 폭발 위치
const MISSILE_TARGET = {
	x: 860,
	y: 610
};

const MISSILE_SIZE = {
	width: 330,
	height: 225
};

const TARGET_LOCK_SIZE = {
	width: 120,
	height: 120
};

const EXPLOSION_SIZE = {
	width: 180,
	height: 180
};

function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}

function lerp(start, end, progress) {
	return start + (end - start) * progress;
}

function easeOutCubic(t) {
	return 1 - Math.pow(1 - t, 3);
}

function show(displayObject, alpha = 1) {
	if (!displayObject) return;

	displayObject.visible = true;
	displayObject.alpha = alpha;
}

function hide(displayObject) {
	if (!displayObject) return;

	displayObject.visible = false;
	displayObject.alpha = 0;
}

function rememberBasePosition(sprite) {
	if (!sprite || sprite.__robotCockpitBaseSaved) return;

	sprite.__baseX = sprite.x;
	sprite.__baseY = sprite.y;
	sprite.__robotCockpitBaseSaved = true;
}

function getBaseX(sprite) {
	return sprite?.__baseX ?? sprite?.x ?? 0;
}

function getBaseY(sprite) {
	return sprite?.__baseY ?? sprite?.y ?? 0;
}
function setRuntimeSpriteSize(sprite, size) {
	if (!sprite || !size) return;

	sprite.width = size.width;
	sprite.height = size.height;
}

function setRuntimeSpriteSizeRatio(sprite, size, ratio = 1) {
	if (!sprite || !size) return;

	sprite.width = size.width * ratio;
	sprite.height = size.height * ratio;
}

function createRuntimeImageSprite({ PIXI, src, width, height, name = '' }) {
	const sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);

	sprite.anchor.set(0.5);
	sprite.width = width;
	sprite.height = height;
	sprite.visible = false;
	sprite.alpha = 0;
	sprite.label = name;

	PIXI.Assets.load(src)
		.then((texture) => {
			if (sprite.destroyed) return;

			sprite.texture = texture;
			sprite.width = width;
			sprite.height = height;
		})
		.catch((error) => {
			console.error(`[robotCockpitRuntime] 이미지 로드 실패: ${src}`, error);
		});

	return sprite;
}

export function createRobotCockpitRuntime({
	app,
	PIXI,
	sprites,
	getState,
	onFinalResultShown = () => {}
}) {
	rememberBasePosition(sprites.baseFar);
	rememberBasePosition(sprites.baseMiddle);
	rememberBasePosition(sprites.baseNear);
	rememberBasePosition(sprites.cockpit);
	rememberBasePosition(sprites.cockpitHud);

	function addWeaponLayerBelowCockpit(displayObject) {
		if (!displayObject) return;

		const cockpitSprite = sprites.cockpitHud ?? sprites.cockpit;

		if (!cockpitSprite || !cockpitSprite.parent) {
			app.stage.addChild(displayObject);
			return;
		}

		const cockpitIndex = app.stage.getChildIndex(cockpitSprite);
		app.stage.addChildAt(displayObject, Math.max(0, cockpitIndex));
	}

	// 무기 이펙트는 theme asset/layer가 아니라 runtime에서 직접 생성
	const targetLock = createRuntimeImageSprite({
		PIXI,
		src: '/images/themes/robot-cockpit/target-lock.png',
		width: TARGET_LOCK_SIZE.width,
		height: TARGET_LOCK_SIZE.height,
		name: 'targetLock'
	});

	const missile = createRuntimeImageSprite({
		PIXI,
		src: '/images/themes/robot-cockpit/missile.png',
		width: MISSILE_SIZE.width,
		height: MISSILE_SIZE.height,
		name: 'missile'
	});

	const explosion = createRuntimeImageSprite({
		PIXI,
		src: '/images/themes/robot-cockpit/explosion.png',
		width: EXPLOSION_SIZE.width,
		height: EXPLOSION_SIZE.height,
		name: 'explosion'
	});

	// 중요: 배경 위, 콕핏 아래에 배치
	addWeaponLayerBelowCockpit(targetLock);
	addWeaponLayerBelowCockpit(missile);
	addWeaponLayerBelowCockpit(explosion);

	const runtime = {
		lastLookKey: '',
		lookTimer: 0,
		lookPlaying: false,

		lastMissileKey: '',
		missileTimer: 0,
		missilePlaying: false,
		explosionPlaying: false,
		resultSent: false
	};

	function resetBasePositions() {
		for (const sprite of [
			sprites.baseFar,
			sprites.baseMiddle,
			sprites.baseNear,
			sprites.cockpit,
			sprites.cockpitHud
		]) {
			if (!sprite) continue;

			sprite.x = getBaseX(sprite);
			sprite.y = getBaseY(sprite);
		}
	}

	function applyParallaxLook(delta) {
		const progress = clamp(runtime.lookTimer / LOOK_DURATION, 0, 1);

		let lookX = 0;

		const leftMoveEnd = 0.22;
		const backCenterEnd = 0.42;
		const pauseEnd = 0.52;
		const rightMoveEnd = 0.74;

		if (progress < leftMoveEnd) {
			const t = progress / leftMoveEnd;
			lookX = -easeOutCubic(t);
		} else if (progress < backCenterEnd) {
			const t = (progress - leftMoveEnd) / (backCenterEnd - leftMoveEnd);
			lookX = -(1 - easeOutCubic(t));
		} else if (progress < pauseEnd) {
			lookX = 0;
		} else if (progress < rightMoveEnd) {
			const t = (progress - pauseEnd) / (rightMoveEnd - pauseEnd);
			lookX = easeOutCubic(t);
		} else {
			const t = (progress - rightMoveEnd) / (1 - rightMoveEnd);
			lookX = 1 - easeOutCubic(t);
		}

		const farX = lookX * 18;
		const middleX = lookX * 55;
		const nearX = lookX * 105;

		if (sprites.baseFar) sprites.baseFar.x = getBaseX(sprites.baseFar) + farX;
		if (sprites.baseMiddle) sprites.baseMiddle.x = getBaseX(sprites.baseMiddle) + middleX;
		if (sprites.baseNear) sprites.baseNear.x = getBaseX(sprites.baseNear) + nearX;

		if (sprites.cockpitHud) {
			sprites.cockpitHud.x = getBaseX(sprites.cockpitHud) + lookX * 8;
			sprites.cockpitHud.y = getBaseY(sprites.cockpitHud) + Math.sin(progress * Math.PI * 6) * 1.5;
		}

		runtime.lookTimer += delta;

		if (runtime.lookTimer >= LOOK_DURATION) {
			runtime.lookPlaying = false;
			resetBasePositions();
		}
	}

	function hideWeaponSprites() {
		hide(targetLock);
		hide(missile);
		hide(explosion);

		setRuntimeSpriteSize(targetLock, TARGET_LOCK_SIZE);
		setRuntimeSpriteSize(missile, MISSILE_SIZE);
		setRuntimeSpriteSize(explosion, EXPLOSION_SIZE);
	}

	function resetMissile() {
		runtime.missileTimer = 0;
		runtime.missilePlaying = true;
		runtime.explosionPlaying = false;
		runtime.resultSent = false;

		hideWeaponSprites();

		targetLock.x = MISSILE_TARGET.x;
		targetLock.y = MISSILE_TARGET.y;
		targetLock.rotation = 0;
		setRuntimeSpriteSize(targetLock, TARGET_LOCK_SIZE);
		show(targetLock, 1);

		missile.x = MISSILE_START.x;
		missile.y = MISSILE_START.y;
		missile.rotation = 0.1;
		setRuntimeSpriteSizeRatio(missile, MISSILE_SIZE, 0.9);
		show(missile, 1);
	}

	function updateTargetLock(time) {
		if (!runtime.missilePlaying) return;

		targetLock.rotation += 0.018;
		targetLock.alpha = 0.75 + Math.sin(time * 0.22) * 0.2;

		const pulse = 1 + Math.sin(time * 0.18) * 0.045;
		setRuntimeSpriteSizeRatio(targetLock, TARGET_LOCK_SIZE, pulse);
	}

	function startExplosion() {
		runtime.missilePlaying = false;
		runtime.explosionPlaying = true;
		runtime.missileTimer = 0;

		hide(missile);
		hide(targetLock);

		explosion.x = MISSILE_TARGET.x;
		explosion.y = MISSILE_TARGET.y;
		explosion.rotation = 0;
		setRuntimeSpriteSizeRatio(explosion, EXPLOSION_SIZE, 0.55);
		show(explosion, 1);
	}

	function updateMissile(delta, time) {
		if (!runtime.missilePlaying) return;

		runtime.missileTimer += delta;

		const progress = clamp(runtime.missileTimer / MISSILE_FLY_DURATION, 0, 1);

		// 직선 비행: easing 없이 progress 그대로 사용
		const x = lerp(MISSILE_START.x, MISSILE_TARGET.x, progress);
		const y = lerp(MISSILE_START.y, MISSILE_TARGET.y, progress);

		updateTargetLock(time);

		missile.x = x;
		missile.y = y;

		// 시작점 -> 목표점 방향으로 정확히 회전
		const angle = Math.atan2(
			MISSILE_TARGET.y - MISSILE_START.y,
			MISSILE_TARGET.x - MISSILE_START.x
		);
		missile.rotation = angle;

		// 날아갈수록 점점 작아짐
		const startScale = 0.95;
		const endScale = 0.05;
		const scale = lerp(startScale, endScale, progress);

		setRuntimeSpriteSizeRatio(missile, MISSILE_SIZE, scale);

		show(missile, 1);

		if (progress >= 1) {
			startExplosion();
		}
	}

	function updateExplosion(delta) {
		if (!runtime.explosionPlaying) return;

		runtime.missileTimer += delta;

		const progress = clamp(runtime.missileTimer / EXPLOSION_DURATION, 0, 1);

		explosion.x = MISSILE_TARGET.x;
		explosion.y = MISSILE_TARGET.y;

		const scale = 0.55 + progress * 0.4;
		setRuntimeSpriteSizeRatio(explosion, EXPLOSION_SIZE, scale);

		explosion.alpha = 1 - progress * 0.3;
		explosion.rotation += 0.01;
		show(explosion, explosion.alpha);

		if (progress >= 1) {
			runtime.explosionPlaying = false;
			hide(explosion);

			if (!runtime.resultSent) {
				runtime.resultSent = true;

				onFinalResultShown?.({
					themeId: 'robotCockpit',
					result: 'success'
				});
			}
		}
	}

	function tick({ delta, time }) {
		const state = getState?.() ?? {};
		const flags = state.flags ?? {};

		const lookKey = JSON.stringify({
			lookSequenceStarted: flags.lookSequenceStarted,
			hudOn: flags.hudOn
		});

		if (flags.lookSequenceStarted && runtime.lastLookKey !== lookKey) {
			runtime.lastLookKey = lookKey;
			runtime.lookTimer = 0;
			runtime.lookPlaying = true;
		}

		const missileKey = JSON.stringify({
			missileStarted: flags.missileStarted
		});

		if (flags.missileStarted && runtime.lastMissileKey !== missileKey) {
			runtime.lastMissileKey = missileKey;
			resetMissile();
		}

		if (!flags.missileStarted && !runtime.missilePlaying && !runtime.explosionPlaying) {
			hideWeaponSprites();
		}

		if (runtime.lookPlaying) {
			applyParallaxLook(delta);
		}

		updateMissile(delta, time);
		updateExplosion(delta);
	}

	function destroy() {
		targetLock.destroy();
		missile.destroy();
		explosion.destroy();
	}

	return {
		tick,
		destroy
	};
}
