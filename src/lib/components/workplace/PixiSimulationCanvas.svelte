<script>
	import { onDestroy, onMount, tick as svelteTick } from 'svelte';

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
	let resizeObserver;

	onMount(async () => {
		mounted = true;

		// SSR 방지: 브라우저에서만 Pixi import
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

		// canvas가 부모 영역에 딱 붙도록 처리
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

			if (asset.type === 'light') {
				sprite.alpha = 0;
			}

			sprites[asset.id] = sprite;
			app.stage.addChild(sprite);
		}

		await svelteTick();
		resizeCanvas();

		// 부모 크기가 바뀔 때마다 Pixi 화면 다시 맞춤
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
		if (!app || !containerEl || !theme) return;

		const rect = containerEl.getBoundingClientRect();

		if (rect.width <= 0 || rect.height <= 0) return;

		app.renderer.resize(rect.width, rect.height);

		// 중요:
		// Math.max = 부모 박스를 빈틈 없이 꽉 채움
		// 넘치는 부분은 overflow-hidden으로 잘림
		const scale = Math.max(rect.width / theme.width, rect.height / theme.height);

		app.stage.scale.set(scale);

		// 가운데 정렬
		app.stage.x = Math.round((rect.width - theme.width * scale) / 2);
		app.stage.y = Math.round((rect.height - theme.height * scale) / 2);
	}

	function clamp(value, min, max) {
		return Math.max(min, Math.min(max, value));
	}
</script>

<div class="absolute inset-0 h-full w-full overflow-hidden" bind:this={containerEl}></div>
