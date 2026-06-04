// src/lib/components/workplace/theme/monsterDefense/monsterDefenseEffect.js

const MONSTER_START = {
	x: 635,
	y: 120
};

const MONSTER_TRAP_POINT = {
	x: 635,
	y: 360
};

const MONSTER_END = {
	x: 635,
	y: 450
};

const WALL_POSITIONS = {
	북쪽: { x: 640, y: 300 },
	동쪽: { x: 860, y: 430 },
	남쪽: { x: 640, y: 620 },
	서쪽: { x: 420, y: 430 }
};

const TRAP_POSITIONS = {
	북쪽길: { x: 635, y: 385 },
	동쪽길: { x: 820, y: 455 },
	남쪽길: { x: 635, y: 610 },
	서쪽길: { x: 450, y: 455 }
};

const CANNON_POSITIONS = {
	물대포: { x: 505, y: 525 },
	불대포: { x: 505, y: 525 },
	바람대포: { x: 505, y: 525 }
};

function hide(sprite) {
	if (!sprite) return;
	sprite.visible = false;
	sprite.alpha = 0;
}

function show(sprite, x, y, alpha = 1) {
	if (!sprite) return;
	sprite.visible = true;
	sprite.alpha = alpha;
	sprite.x = x;
	sprite.y = y;
}

function hideMonsterFrames(sprites) {
	hide(sprites.monsterWalk1);
	hide(sprites.monsterWalk2);
	hide(sprites.monsterWalk3);
	hide(sprites.monsterHit);
	hide(sprites.monsterGroggy);
}

function showWalkFrame({ sprites, x, y, time }) {
	const frames = [sprites.monsterWalk1, sprites.monsterWalk2, sprites.monsterWalk3].filter(Boolean);
	if (frames.length === 0) return;

	const frame = frames[Math.floor(Date.now() / 160) % frames.length];

	show(frame, x + Math.sin(time * 0.25) * 6, y);
	frame.rotation = Math.sin(time * 0.18) * 0.04;
}

function resetTemporaryEffects(sprites) {
	hide(sprites.waterShot);
	hide(sprites.effect);
	hide(sprites.failEffect);
}

function placeDefenseTools({ sprites, flags, time }) {
	const wallDirection = flags.wallDirection;
	const trapPosition = flags.trapPosition;
	const cannonType = flags.cannonType;

	if (sprites.wallNorth) {
		const wallPoint = WALL_POSITIONS[wallDirection];

		if (flags.wallDoorClosed === true && wallPoint) {
			show(sprites.wallNorth, wallPoint.x, wallPoint.y);
		} else {
			hide(sprites.wallNorth);
		}
	}

	if (sprites.trap) {
		const trapPoint = TRAP_POSITIONS[trapPosition];

		if (flags.trapActive === true && trapPoint) {
			show(sprites.trap, trapPoint.x, trapPoint.y, 0.85 + Math.sin(time * 0.18) * 0.12);
		} else {
			hide(sprites.trap);
		}
	}

	if (sprites.waterCannon) {
		const cannonPoint = CANNON_POSITIONS[cannonType];

		if (flags.cannonActive === true && cannonPoint) {
			show(sprites.waterCannon, cannonPoint.x, cannonPoint.y);
			sprites.waterCannon.y = cannonPoint.y + Math.sin(time * 0.15) * 3;
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
		monsterDefeated: wallOk && trapOk && cannonOk
	};
}

export function createMonsterDefenseEffect({ sprites, getState }) {
	const monster = {
		x: MONSTER_START.x,
		y: MONSTER_START.y,
		state: 'idle',
		timer: 0,
		lastFinalKey: ''
	};

	function resetFinalAnimation() {
		monster.x = MONSTER_START.x;
		monster.y = MONSTER_START.y;
		monster.state = 'walking';
		monster.timer = 0;
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

			hide(sprites.wallNorth);
			hide(sprites.trap);
			hide(sprites.waterCannon);
			return;
		}

		const finalKey = JSON.stringify({
			finalSuccess: flags.finalSuccess,
			finalFail: flags.finalFail,
			wallDirection: flags.wallDirection,
			trapPosition: flags.trapPosition,
			cannonType: flags.cannonType
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

		if (monster.state === 'walking') {
			monster.y = Math.min(MONSTER_TRAP_POINT.y, monster.y + 1.1 * delta);

			showWalkFrame({
				sprites,
				x: monster.x,
				y: monster.y,
				time
			});

			if (monster.y >= MONSTER_TRAP_POINT.y) {
				monster.state = result.monsterCaught ? 'trapped' : 'breakthrough';
				monster.timer = 0;
			}

			return;
		}

		if (monster.state === 'trapped') {
			monster.timer += delta;

			show(sprites.monsterWalk2 ?? sprites.monsterWalk1, monster.x, monster.y);

			if (sprites.trap) {
				sprites.trap.alpha = 1;
				sprites.trap.scale.x = 1 + Math.sin(time * 0.7) * 0.06;
				sprites.trap.scale.y = 1 + Math.sin(time * 0.7) * 0.06;
			}

			if (monster.timer > 45) {
				monster.state = result.cannonOk ? 'hit' : 'breakthrough';
				monster.timer = 0;
			}

			return;
		}

		if (monster.state === 'hit') {
			monster.timer += delta;

			show(
				sprites.monsterHit,
				monster.x + Math.sin(time * 1.2) * 8,
				monster.y + Math.sin(time * 0.9) * 5
			);

			if (sprites.monsterHit) {
				sprites.monsterHit.rotation = Math.sin(time * 0.9) * 0.14;
			}

			if (sprites.waterShot) {
				sprites.waterShot.visible = true;
				sprites.waterShot.alpha = 0.7 + Math.sin(time * 0.8) * 0.25;
			}

			if (monster.timer > 70) {
				monster.state = flags.finalSuccess ? 'groggy' : 'breakthrough';
				monster.timer = 0;
			}

			return;
		}

		if (monster.state === 'groggy') {
			show(sprites.monsterGroggy, monster.x, monster.y + 35);

			if (sprites.effect) {
				sprites.effect.visible = true;
				sprites.effect.alpha = 0.85 + Math.sin(time * 0.16) * 0.15;
			}

			return;
		}

		if (monster.state === 'breakthrough') {
			monster.timer += delta;
			monster.y = Math.min(MONSTER_END.y, monster.y + 1.35 * delta);

			showWalkFrame({
				sprites,
				x: monster.x + Math.sin(time * 0.18) * 4,
				y: monster.y,
				time
			});

			if (sprites.failEffect && (monster.y >= MONSTER_END.y || monster.timer > 110)) {
				sprites.failEffect.visible = true;
				sprites.failEffect.alpha = 0.8 + Math.sin(time * 0.25) * 0.18;
			}
		}
	}

	function destroy() {}

	return {
		tick,
		destroy
	};
}