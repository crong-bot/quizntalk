<!-- C:\Users\user\quizntalk\src\lib\components\workplace\simulation\effects\OldCameraBootOverlay.svelte -->
<script>
	import { onMount, tick } from 'svelte';

	export let screenOn = false;

	let gsap;

	let previousScreenOn = false;
	let mounted = false;

	let powerOffOverlay;
	let bootLine;
	let bootFlash;
	let noiseOverlay;
	let scanlineOverlay;
	let distortionOverlay;
	let cameraMask;

	onMount(async () => {
		mounted = true;

		const gsapModule = await import('gsap');
		gsap = gsapModule.gsap;

		if (screenOn) {
			previousScreenOn = true;
			playOldCameraBoot();
		} else {
			resetScreenOff();
		}

		return () => {
			mounted = false;
			if (gsap) {
				gsap.killTweensOf([
					powerOffOverlay,
					bootLine,
					bootFlash,
					noiseOverlay,
					scanlineOverlay,
					distortionOverlay,
					cameraMask
				]);
			}
		};
	});

	$: if (mounted && gsap && screenOn && !previousScreenOn) {
		previousScreenOn = true;
		playOldCameraBoot();
	}

	$: if (mounted && gsap && !screenOn && previousScreenOn) {
		previousScreenOn = false;
		resetScreenOff();
	}

	async function playOldCameraBoot() {
		await tick();

		if (
			!gsap ||
			!powerOffOverlay ||
			!bootLine ||
			!bootFlash ||
			!noiseOverlay ||
			!scanlineOverlay ||
			!distortionOverlay ||
			!cameraMask
		) {
			return;
		}

		gsap.killTweensOf([
			powerOffOverlay,
			bootLine,
			bootFlash,
			noiseOverlay,
			scanlineOverlay,
			distortionOverlay,
			cameraMask
		]);

		gsap.set(cameraMask, {
			opacity: 1,
			x: 0,
			clipPath: 'inset(50% 0% 50% 0%)',
			filter: 'contrast(1.4) brightness(0.55) saturate(0.4)'
		});

		gsap.set(powerOffOverlay, { opacity: 1 });
		gsap.set(bootLine, { opacity: 0, scaleX: 0.06, scaleY: 1 });
		gsap.set(bootFlash, { opacity: 0 });
		gsap.set(noiseOverlay, { opacity: 0.18 });
		gsap.set(scanlineOverlay, { opacity: 0 });
		gsap.set(distortionOverlay, { opacity: 0 });

		const timeline = gsap.timeline();

		timeline
			.to(noiseOverlay, {
				opacity: 0.55,
				duration: 0.18,
				ease: 'steps(2)'
			})
			.to(bootLine, {
				opacity: 1,
				scaleX: 1,
				duration: 0.12,
				ease: 'power3.out'
			})
			.to(bootFlash, {
				opacity: 0.9,
				duration: 0.05,
				ease: 'none'
			})
			.to(bootFlash, {
				opacity: 0,
				duration: 0.18,
				ease: 'power2.out'
			})
			.to(
				cameraMask,
				{
					clipPath: 'inset(0% 0% 0% 0%)',
					filter: 'contrast(1.25) brightness(0.85) saturate(0.65)',
					duration: 0.38,
					ease: 'power2.out'
				},
				'-=0.12'
			)
			.to(
				powerOffOverlay,
				{
					opacity: 0,
					duration: 0.18,
					ease: 'none'
				},
				'-=0.28'
			)
			.to(
				scanlineOverlay,
				{
					opacity: 0.28,
					duration: 0.16,
					ease: 'none'
				},
				'-=0.18'
			)
			.to(distortionOverlay, {
				opacity: 0.45,
				duration: 0.08,
				ease: 'steps(1)'
			})
			.to(distortionOverlay, {
				opacity: 0.08,
				duration: 0.12,
				ease: 'steps(1)'
			})
			.to(cameraMask, {
				x: -8,
				duration: 0.04,
				ease: 'none'
			})
			.to(cameraMask, {
				x: 7,
				duration: 0.04,
				ease: 'none'
			})
			.to(cameraMask, {
				x: 0,
				duration: 0.05,
				ease: 'none'
			})
			.to(cameraMask, {
				opacity: 0.15,
				duration: 0.06,
				ease: 'none'
			})
			.to(cameraMask, {
				opacity: 1,
				duration: 0.08,
				ease: 'none'
			})
			.to(cameraMask, {
				filter: 'contrast(1.08) brightness(1) saturate(0.85)',
				duration: 0.55,
				ease: 'power2.out'
			})
			.to(
				noiseOverlay,
				{
					opacity: 0.13,
					duration: 0.45,
					ease: 'power2.out'
				},
				'-=0.35'
			)
			.to(
				distortionOverlay,
				{
					opacity: 0,
					duration: 0.45,
					ease: 'power2.out'
				},
				'-=0.35'
			)
			.to(
				bootLine,
				{
					opacity: 0,
					duration: 0.22,
					ease: 'power2.out'
				},
				'-=0.35'
			);
	}

	function resetScreenOff() {
		if (
			!gsap ||
			!powerOffOverlay ||
			!bootLine ||
			!bootFlash ||
			!noiseOverlay ||
			!scanlineOverlay ||
			!distortionOverlay ||
			!cameraMask
		) {
			return;
		}

		gsap.killTweensOf([
			powerOffOverlay,
			bootLine,
			bootFlash,
			noiseOverlay,
			scanlineOverlay,
			distortionOverlay,
			cameraMask
		]);

		gsap.set(cameraMask, {
			opacity: 1,
			x: 0,
			clipPath: 'inset(50% 0% 50% 0%)',
			filter: 'contrast(1.4) brightness(0.45) saturate(0.4)'
		});

		gsap.set(powerOffOverlay, { opacity: 1 });
		gsap.set(bootLine, { opacity: 0, scaleX: 0.06 });
		gsap.set(bootFlash, { opacity: 0 });
		gsap.set(noiseOverlay, { opacity: 0.18 });
		gsap.set(scanlineOverlay, { opacity: 0 });
		gsap.set(distortionOverlay, { opacity: 0 });
	}
</script>

<!-- 이 슬롯 안에 PixiSimulationCanvas가 들어감 -->
<div class="relative h-full w-full overflow-hidden">
	<div bind:this={cameraMask} class="absolute inset-0">
		<slot />
	</div>

	<div
		bind:this={powerOffOverlay}
		class="pointer-events-none absolute inset-0 z-20 bg-slate-950"
		style:opacity={screenOn ? 0 : 1}
	></div>

	<div
		bind:this={noiseOverlay}
		class="pointer-events-none absolute inset-0 z-30 opacity-[0.08] old-noise"
	></div>

	<div
		bind:this={scanlineOverlay}
		class="pointer-events-none absolute inset-0 z-30 opacity-0 scanlines"
	></div>

	<div
		bind:this={distortionOverlay}
		class="pointer-events-none absolute inset-0 z-30 opacity-0 distortion-lines"
	></div>

	<div
		bind:this={bootLine}
		class="pointer-events-none absolute left-1/2 top-1/2 z-40 h-[3px] w-[86%] origin-center -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100 opacity-0 shadow-[0_0_28px_rgba(207,250,254,0.95)]"
	></div>

	<div
		bind:this={bootFlash}
		class="pointer-events-none absolute inset-0 z-40 bg-white opacity-0 mix-blend-screen"
	></div>
</div>

<style>
	.old-noise {
		background-image: radial-gradient(
				circle at 18% 24%,
				rgba(255, 255, 255, 0.16) 0 1px,
				transparent 1px
			),
			radial-gradient(circle at 72% 36%, rgba(255, 255, 255, 0.1) 0 1px, transparent 1px),
			radial-gradient(circle at 38% 82%, rgba(255, 255, 255, 0.11) 0 1px, transparent 1px),
			linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
		background-size:
			6px 6px,
			9px 9px,
			12px 12px,
			100% 100%;
		mix-blend-mode: screen;
		animation: noiseShift 0.16s steps(2) infinite;
	}

	.scanlines {
		background-image: repeating-linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0.13) 0px,
			rgba(255, 255, 255, 0.13) 1px,
			transparent 1px,
			transparent 4px
		);
		mix-blend-mode: overlay;
		animation: scanMove 1.4s linear infinite;
	}

	.distortion-lines {
		background-image: linear-gradient(
				to bottom,
				transparent 0%,
				rgba(103, 232, 249, 0.16) 48%,
				transparent 52%
			),
			repeating-linear-gradient(
				to bottom,
				transparent 0px,
				transparent 16px,
				rgba(255, 255, 255, 0.12) 17px,
				transparent 18px
			);
		mix-blend-mode: screen;
		animation: distortionMove 0.34s steps(2) infinite;
	}

	@keyframes noiseShift {
		0% {
			transform: translate(0, 0);
		}
		25% {
			transform: translate(-1px, 1px);
		}
		50% {
			transform: translate(1px, -1px);
		}
		75% {
			transform: translate(1px, 1px);
		}
		100% {
			transform: translate(0, 0);
		}
	}

	@keyframes scanMove {
		0% {
			background-position-y: 0;
		}
		100% {
			background-position-y: 24px;
		}
	}

	@keyframes distortionMove {
		0% {
			transform: translateY(-12%);
		}
		100% {
			transform: translateY(12%);
		}
	}
</style>
