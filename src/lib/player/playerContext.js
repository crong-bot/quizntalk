import { getContext, setContext } from 'svelte';

const PLAYER_CONTEXT_KEY = 'project-player-context';

export function setPlayerContext(playerStore) {
	setContext(PLAYER_CONTEXT_KEY, playerStore);
}

export function getPlayerContext() {
	return getContext(PLAYER_CONTEXT_KEY);
}
