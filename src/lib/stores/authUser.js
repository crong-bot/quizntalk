import { auth } from '$lib/firebase/client';
import { onAuthStateChanged } from 'firebase/auth';
import { writable } from 'svelte/store';

export const authUser = writable(null);

// 앱 시작 시 1회 연결
let started = false;
export function startAuthListener() {
	if (started) return;
	started = true;

	onAuthStateChanged(auth, (user) => {
		authUser.set(user ?? null);
	});
}
