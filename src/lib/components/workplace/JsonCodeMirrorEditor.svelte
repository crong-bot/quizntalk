<script>
	import { onDestroy, onMount } from 'svelte';

	export let value = '';
	export let onChange = () => {};
	export let onReady = () => {};

	let editorHost;
	let view;
	let ignoreExternalUpdate = false;

	onMount(async () => {
		const { EditorView, basicSetup } = await import('codemirror');
		const { json } = await import('@codemirror/lang-json');

		const { dracula } = await import('@uiw/codemirror-theme-dracula');
		view = new EditorView({
			parent: editorHost,
			doc: value,
			extensions: [
				basicSetup,
				json(),
				dracula,
				EditorView.updateListener.of((update) => {
					if (!update.docChanged) return;

					const nextValue = update.state.doc.toString();

					ignoreExternalUpdate = true;
					value = nextValue;
					onChange(nextValue);

					queueMicrotask(() => {
						ignoreExternalUpdate = false;
					});
				}),
				EditorView.theme({
					'&': {
						height: '100%',
						fontSize: '15px',
						backgroundColor: '#101827'
					},

					'.cm-scroller': {
						height: '100%',
						overflow: 'auto',
						padding: '14px 0',
						fontFamily:
							'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
						lineHeight: '28px'
					},

					'.cm-content': {
						minHeight: '100%',
						padding: '0',
						lineHeight: '28px'
					},

					'.cm-line': {
						lineHeight: '28px',
						padding: '0 16px'
					},

					'.cm-gutters': {
						padding: '0',
						backgroundColor: '#0f172a',
						borderRight: '1px solid rgba(255,255,255,0.1)'
					},

					'.cm-gutterElement': {
						height: '28px',
						lineHeight: '28px'
					},

					'.cm-lineNumbers .cm-gutterElement': {
						padding: '0 10px 0 8px',
						color: '#64748b'
					},

					'.cm-activeLine': {
						backgroundColor: 'rgba(255,255,255,0.04)'
					},

					'.cm-activeLineGutter': {
						backgroundColor: 'rgba(255,255,255,0.04)',
						color: '#cbd5e1'
					}
				})
			]
		});

		onReady({
			insertAtCursor,
			format
		});
	});

	onDestroy(() => {
		if (view) {
			view.destroy();
			view = null;
		}
	});

	$: if (view && !ignoreExternalUpdate) {
		const current = view.state.doc.toString();

		if (current !== value) {
			view.dispatch({
				changes: {
					from: 0,
					to: current.length,
					insert: value
				}
			});
		}
	}

	function insertAtCursor(text) {
		if (!view) return;

		const selection = view.state.selection.main;

		view.dispatch({
			changes: {
				from: selection.from,
				to: selection.to,
				insert: text
			},
			selection: {
				anchor: selection.from + text.length
			},
			scrollIntoView: true
		});

		view.focus();
	}

	function format() {
		if (!view) return false;

		try {
			const parsed = JSON.parse(view.state.doc.toString());
			const formatted = JSON.stringify(parsed, null, 2);

			view.dispatch({
				changes: {
					from: 0,
					to: view.state.doc.length,
					insert: formatted
				}
			});

			onChange(formatted);
			return true;
		} catch (e) {
			return false;
		}
	}
</script>

<div
	class="h-full w-full overflow-hidden rounded-2xl bg-[#101827] shadow-inner"
	bind:this={editorHost}
></div>
