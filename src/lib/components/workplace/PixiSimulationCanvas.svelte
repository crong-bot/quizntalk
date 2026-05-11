<script>
	import { onDestroy, onMount } from 'svelte';

	export let theme;
	export let simulationState = {
		layers: {}
	};

	let containerEl;
	let app;
	let PIXI;
	let sprites = {};
	let time = 0;
	let mounted = false;

	onMount(async () => {
		mounted = true;

		// ✅ SSR 방지: 브라우저에서만 Pixi import
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

		containerEl.appendChild(app.canvas);

		await PIXI.Assets.load(theme.assets.map((asset) => asset.src));

		for (const asset of theme.assets) {
			const sprite = PIXI.Sprite.from(asset.src);

			applyAssetLayout(sprite, asset);

			if (asset.blendMode) {
				sprite.blendMode = asset.blendMode;
			}

			if (asset.type === 'light') {
				sprite.alpha = 0;
			}

			sprites[asset.id] = sprite;
			app.stage.addChild(sprite);
		}

		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);
		app.ticker.add(tick);
	});

	onDestroy(() => {
		mounted = false;

		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', resizeCanvas);
		}

		if (app) {
			app.destroy(true);
			app = null;
		}

		sprites = {};
	});

	function applyAssetLayout(sprite, asset) {
		sprite.x = asset.x ?? 0;
		sprite.y = asset.y ?? 0;

		if (asset.width && asset.height) {
			sprite.width = asset.width;
			sprite.height = asset.height;
			return;
		}

		if (asset.scale) {
			sprite.scale.set(asset.scale);
			return;
		}

		if (asset.fullCanvas !== false) {
			sprite.width = theme.width;
			sprite.height = theme.height;
		}
	}

	function tick(ticker) {
		time += ticker.deltaTime * 0.055;

		for (const asset of theme.assets) {
			if (asset.type !== 'light') continue;

			const sprite = sprites[asset.id];
			const layerState = simulationState?.layers?.[asset.id];

			applyLayerState(sprite, layerState);
		}
	}

	function applyLayerState(sprite, layerState) {
		if (!sprite) return;

		if (!layerState || !layerState.visible) {
			sprite.alpha = 0;
			return;
		}

		let alpha = layerState.alpha ?? 1;

		if (layerState.pulse) {
			alpha += Math.sin(time) * (layerState.pulseAmount ?? 0.1);
		}

		sprite.alpha = clamp(alpha, 0, 1);
	}

	function resizeCanvas() {
		if (!app || !containerEl) return;

		const rect = containerEl.getBoundingClientRect();

		if (rect.width <= 0 || rect.height <= 0) return;

		app.renderer.resize(rect.width, rect.height);

		const scale = Math.max(rect.width / theme.width, rect.height / theme.height);

		app.stage.scale.set(scale);
		app.stage.x = (rect.width - theme.width * scale) / 2;
		app.stage.y = (rect.height - theme.height * scale) / 2;
	}

	function clamp(value, min, max) {
		return Math.max(min, Math.min(max, value));
	}
</script>

<div class="h-full w-full" bind:this={containerEl}></div>
