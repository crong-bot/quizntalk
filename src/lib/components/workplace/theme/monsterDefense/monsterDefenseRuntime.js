// src/lib/components/workplace/theme/monsterDefense/monsterDefenseRuntime.js

export function createMonsterDefenseRuntime({ sprites, getState }) {
	const monster = {
		x: 635,
		y: 130,
		state: 'hidden',
		timer: 0,
		hasStartedFinal: false
	};

	function hideMonsterFrames() {
		const frames = [
			sprites.monsterWalk1,
			sprites.monsterWalk2,
			sprites.monsterWalk3,
			sprites.monsterHit,
			sprites.monsterGroggy
		];

		for (const frame of frames) {
			if (!frame) continue;
			frame.visible = false;
			frame.alpha = 0;
		}
	}

	function show(sprite, x, y) {
		if (!sprite) return;

		sprite.visible = true;
		sprite.alpha = 1;
		sprite.x = x;
		sprite.y = y;
	}

	function showWalk(time) {
		const frames = [sprites.monsterWalk1, sprites.monsterWalk2, sprites.monsterWalk3].filter(
			Boolean
		);
		if (frames.length === 0) return;

		const frame = frames[Math.floor(Date.now() / 160) % frames.length];

		show(frame, monster.x + Math.sin(time * 0.25) * 6, monster.y);
		frame.rotation = Math.sin(time * 0.18) * 0.04;
	}

	function resetTemporaryEffects() {
		if (sprites.waterShot) {
			sprites.waterShot.visible = false;
			sprites.waterShot.alpha = 0;
		}

		if (sprites.effect) {
			sprites.effect.visible = false;
			sprites.effect.alpha = 0;
		}
	}

	function tick({ delta, time }) {
		const state = getState?.() ?? {};
		const flags = state.flags ?? {};

		const scoutDone = flags.scoutDone === true;
		const finalSuccess = flags.finalSuccess === true;

		hideMonsterFrames();
		resetTemporaryEffects();

		if (sprites.trap?.visible) {
			sprites.trap.alpha = 0.85 + Math.sin(time * 0.18) * 0.12;
		}

		if (sprites.waterCannon?.visible) {
			sprites.waterCannon.y += Math.sin(time * 0.15) * 3;
		}

		if (!scoutDone && !finalSuccess) {
			monster.state = 'hidden';
			monster.y = 130;
			monster.timer = 0;
			monster.hasStartedFinal = false;
			return;
		}

		if (!finalSuccess) {
			monster.state = 'walking';
			monster.hasStartedFinal = false;
			monster.timer = 0;
			monster.y = Math.min(330, monster.y + 0.45 * delta);
			showWalk(time);
			return;
		}

		if (!monster.hasStartedFinal) {
			monster.hasStartedFinal = true;
			monster.state = 'walking';
			monster.timer = 0;
			monster.y = Math.max(monster.y, 300);
		}

		monster.timer += delta;

		if (monster.state === 'walking') {
			monster.y = Math.min(360, monster.y + 1.1 * delta);
			showWalk(time);

			if (monster.y >= 360) {
				monster.state = 'trapped';
				monster.timer = 0;
			}

			return;
		}

		if (monster.state === 'trapped') {
			show(sprites.monsterWalk2 ?? sprites.monsterWalk1, monster.x, monster.y);

			if (sprites.trap) {
				sprites.trap.alpha = 1;
				sprites.trap.scale.x = 1 + Math.sin(time * 0.7) * 0.06;
				sprites.trap.scale.y = 1 + Math.sin(time * 0.7) * 0.06;
			}

			if (monster.timer > 45) {
				monster.state = 'hit';
				monster.timer = 0;
			}

			return;
		}

		if (monster.state === 'hit') {
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
				monster.state = 'groggy';
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
		}
	}

	function destroy() {}

	return {
		tick,
		destroy
	};
}
