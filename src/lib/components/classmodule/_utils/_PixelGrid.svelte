<!-- src/lib/components/ai/_PixelGrid.svelte -->
<script>
	export let pixels = []; // 2D array 0..1 (흑백)
	export let size = 12; // 한 칸 px
</script>

<div
	style="display:grid; grid-template-columns: repeat({pixels[0]?.length ?? 0}, {size}px); gap:2px;"
>
	{#each pixels as row}
		{#each row as v}
			<div
				style="
          width:{size}px;height:{size}px;
          border-radius:3px;
          background: rgba(15,23,42,{v ? 0.9 : 0.08});
          border: 1px solid rgba(148,163,184,0.2);
        "
			/>
		{/each}
	{/each}
</div>
