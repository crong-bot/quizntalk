<!-- C:\Users\user\quizntalk\src\lib\components\workplace\PixiSimulationCanvas.svelte -->
<script>
	import { onDestroy, onMount, tick as svelteTick } from 'svelte';
	import { createMonsterDefenseRuntime } from './theme/monsterDefense/monsterDefenseRuntime';

	export let theme;
	export let simulationState = {
		layers: {},
		sprites: {},
		camera: {}
	};
	export let onFinalResultShown = () => {};

	let containerEl;
	let app;
	let PIXI;
	let sprites = {};
	let time = 0;
	let mounted = false;
	let resizeObserver;
	let themeRuntime = null;

	let baseStageScale = 1;
	let baseStageX = 0;
	let baseStageY = 0;

	onMount(async () => {
		mounted = true;

		PIXI = await import('pixi.js');

		app = new PIXI.Application();

		await app.init({
			width: theme.width,
			height: theme.height,
			backgroundAlpha: 0,
			antialias: true,
			resolution: window.devicePixelRatio || 1,
			autoDensity: true
		});

		if (!mounted || !containerEl) return;

		app.canvas.style.display = 'block';
		app.canvas.style.width = '100%';
		app.canvas.style.height = '100%';

		containerEl.appendChild(app.canvas);

		await PIXI.Assets.load(theme.assets.map((asset) => asset.src));

		for (const asset of theme.assets) {
			const sprite = PIXI.Sprite.from(asset.src);

			applyAssetLayout(sprite, asset);

			if (asset.blendMode) {
				sprite.blendMode = asset.blendMode;
			}

			// layer 제어 대상이면 처음에는 숨김
			if (isControllableLayer(asset)) {
				sprite.visible = false;
				sprite.alpha = 0;
			}

			sprites[asset.id] = sprite;
			app.stage.addChild(sprite);
		}
		if (theme?.id === 'monsterDefense') {
			themeRuntime = createMonsterDefenseRuntime({
				app,
				PIXI,
				sprites,
				getState: () => simulationState,
				onFinalResultShown
			});
		}

		await svelteTick();
		resizeCanvas();

		resizeObserver = new ResizeObserver(() => {
			resizeCanvas();
		});

		resizeObserver.observe(containerEl);

		window.addEventListener('resize', resizeCanvas);
		app.ticker.add(tick);
	});

	onDestroy(() => {
		mounted = false;

		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', resizeCanvas);
		}

		if (resizeObserver) {
			resizeObserver.disconnect();
			resizeObserver = null;
		}

		if (app) {
			app.ticker?.remove?.(tick);

			// 테마별 런타임 정리
			if (themeRuntime) {
				themeRuntime.destroy?.();
				themeRuntime = null;
			}

			app.destroy(true);
			app = null;
		}

		sprites = {};
	});

	function isControllableLayer(asset) {
		return asset.layer === true || asset.type === 'light' || asset.type === 'effect';
	}

	function applyAssetLayout(sprite, asset) {
	sprite.x = asset.x ?? 0;
	sprite.y = asset.y ?? 0;

	if (asset.anchor) {
		sprite.anchor.set(asset.anchor);
	}

	if (asset.width && asset.height) {
		sprite.width = asset.width;
		sprite.height = asset.height;
	}

	if (asset.scale) {
		sprite.scale.set(asset.scale);
	}

	if (!asset.width && !asset.height && !asset.scale && asset.fullCanvas !== false) {
		sprite.width = theme.width;
		sprite.height = theme.height;
	}

	if (asset.flipX) {
		sprite.scale.x *= -1;

		if (!asset.anchor) {
			sprite.x += sprite.width;
		}
	}

	if (asset.flipY) {
		sprite.scale.y *= -1;

		if (!asset.anchor) {
			sprite.y += sprite.height;
		}
	}
}

	function tick(ticker) {
		time += ticker.deltaTime * 0.055;

		resetSpritesToBaseLayout();
		applyLayers();
		applySpriteEffects();
		themeRuntime?.tick?.({
			delta: ticker.deltaTime,
			time
		});
		applyCameraEffects();
	}

	function resetSpritesToBaseLayout() {
	for (const asset of theme.assets) {
		const sprite = sprites[asset.id];
		if (!sprite) continue;

		applyAssetLayout(sprite, asset);

		if (asset.rotation) {
			sprite.rotation = asset.rotation;
		} else {
			sprite.rotation = 0;
		}
	}
}

	function applyLayers() {
		for (const asset of theme.assets) {
			if (!isControllableLayer(asset)) continue;

			const sprite = sprites[asset.id];
			const layerState = simulationState?.layers?.[asset.id];

			applyLayerState(sprite, layerState);
		}
	}

	function applyLayerState(sprite, layerState) {
		if (!sprite) return;

		if (layerState === true) {
			sprite.visible = true;
			sprite.alpha = 1;
			return;
		}

		if (!layerState || !layerState.visible) {
			sprite.alpha = 0;
			sprite.visible = false;
			return;
		}

		sprite.visible = true;

		let alpha = layerState.alpha ?? 1;

		if (layerState.pulse) {
			alpha += Math.sin(time) * (layerState.pulseAmount ?? 0.1);
		}

		sprite.alpha = clamp(alpha, 0, 1);
	}

	function applySpriteEffects() {
		const spriteEffects = simulationState?.sprites ?? {};

		for (const [spriteId, effect] of Object.entries(spriteEffects)) {
			const sprite = sprites[spriteId];
			const asset = theme.assets.find((item) => item.id === spriteId);

			if (!sprite || !asset || !effect) continue;

			if (effect.visible === false) {
				sprite.visible = false;
				continue;
			}

			if (typeof effect.alpha === 'number') {
				sprite.alpha = clamp(effect.alpha, 0, 1);
			}

			if (effect.bounce) {
				const amount = effect.amount ?? effect.bounceAmount ?? 8;
				const speed = effect.speed ?? effect.bounceSpeed ?? 0.12;
				sprite.y = (asset.y ?? 0) + Math.sin(time * speed) * amount;
			}

			if (effect.float) {
				const amount = effect.amount ?? effect.floatAmount ?? 6;
				const speed = effect.speed ?? effect.floatSpeed ?? 0.08;
				sprite.y = (asset.y ?? 0) + Math.sin(time * speed) * amount;
			}

			if (effect.rotate) {
				const amount = effect.amount ?? effect.rotateAmount ?? 0.04;
				const speed = effect.speed ?? effect.rotateSpeed ?? 0.08;
				sprite.rotation = (asset.rotation ?? 0) + Math.sin(time * speed) * amount;
			}

			if (effect.shake) {
				const amount = effect.amount ?? effect.shakeAmount ?? 3;
				const speed = effect.speed ?? effect.shakeSpeed ?? 0.8;
				sprite.x = (asset.x ?? 0) + Math.sin(time * speed) * amount;
				sprite.y = (asset.y ?? 0) + Math.cos(time * speed * 1.2) * amount;
			}
		}
	}

	function applyCameraEffects() {
		if (!app) return;

		const camera = simulationState?.camera ?? {};

		const zoom = camera.zoom ?? 1;
		let nextX = baseStageX + (camera.x ?? 0);
		let nextY = baseStageY + (camera.y ?? 0);

		if (camera.shake) {
			const amount = camera.shakeAmount ?? 3;
			const speed = camera.shakeSpeed ?? 1.1;

			nextX += Math.sin(time * speed) * amount;
			nextY += Math.cos(time * speed * 1.25) * amount;
		}

		app.stage.scale.set(baseStageScale * zoom);
		app.stage.x = Math.round(nextX);
		app.stage.y = Math.round(nextY);
	}

	function resizeCanvas() {
		if (!app || !containerEl || !theme) return;

		const rect = containerEl.getBoundingClientRect();

		if (rect.width <= 0 || rect.height <= 0) return;

		app.renderer.resize(rect.width, rect.height);

		baseStageScale = Math.max(rect.width / theme.width, rect.height / theme.height);
		baseStageX = Math.round((rect.width - theme.width * baseStageScale) / 2);
		baseStageY = Math.round((rect.height - theme.height * baseStageScale) / 2);

		app.stage.scale.set(baseStageScale);
		app.stage.x = baseStageX;
		app.stage.y = baseStageY;
	}

	function clamp(value, min, max) {
		return Math.max(min, Math.min(max, value));
	}
</script>

<div class="absolute inset-0 h-full w-full overflow-hidden" bind:this={containerEl}></div>
