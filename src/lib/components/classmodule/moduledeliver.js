import Cognitive11 from '$lib/components/classmodule/cognitive/cognitive11.svelte';
import Cognitive21 from '$lib/components/classmodule/cognitive/cognitive21.svelte';
import Cognitive22 from '$lib/components/classmodule/cognitive/cognitive22.svelte';
import Cognitive23 from '$lib/components/classmodule/cognitive/cognitive23.svelte';
import find1 from '$lib/components/classmodule/find/find1.svelte';
import find2 from '$lib/components/classmodule/find/find2.svelte';
import Rgb11 from '$lib/components/classmodule/rgb1/rgb11.svelte';
import Rgb121 from '$lib/components/classmodule/rgb1/rgb12-1.svelte';
import Rgb122 from '$lib/components/classmodule/rgb1/rgb12-2.svelte';
import Rgb13 from '$lib/components/classmodule/rgb1/rgb13.svelte';
import Rgb14 from '$lib/components/classmodule/rgb1/rgb14.svelte';
import Rgb15 from '$lib/components/classmodule/rgb1/rgb15.svelte';
import sound11 from '$lib/components/classmodule/sound1/sound11.svelte';
import sound12 from '$lib/components/classmodule/sound1/sound12.svelte';
import sound21 from '$lib/components/classmodule/sound1/sound21.svelte';
import sound31 from '$lib/components/classmodule/sound1/sound31.svelte';

export const moduleRegistry = {
	'cognitive/cognitive11': Cognitive11,
	'cognitive/cognitive21': Cognitive21,
	'cognitive/cognitive22': Cognitive22,
	'cognitive/cognitive23': Cognitive23,
	'rgb1/rgb11': Rgb11,
	'rgb1/rgb121': Rgb121,
	'rgb1/rgb122': Rgb122,
	'rgb1/rgb13': Rgb13,
	'rgb1/rgb14': Rgb14,
	'rgb1/rgb15': Rgb15,
	'sound1/sound11': sound11,
	'sound1/sound12': sound12,
	'sound1/sound21': sound21,
	'sound1/sound31': sound31,
	'find/find1': find1,
	'find/find2': find2
};
