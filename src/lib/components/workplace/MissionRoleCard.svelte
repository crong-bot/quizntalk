<script>
	export let role;
</script>

<div class="rounded-[22px] border border-amber-200 bg-amber-50 p-4">
	<div class="text-sm font-extrabold text-amber-600">내 역할</div>

	<div class="mt-3 flex items-center gap-3">
		<div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
			{role.icon}
		</div>

		<div>
			<div class="text-xl font-extrabold tracking-[-0.03em] text-slate-900">
				{role.title}
			</div>
			<div class="mt-1 text-sm font-semibold leading-relaxed text-slate-600">
				{role.description}
			</div>
		</div>
	</div>
</div>
