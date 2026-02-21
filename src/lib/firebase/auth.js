import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './client';

import { idToEmail } from '$lib/utils/idToEmail';

// 가입
export async function signupWithId(id, password) {
	const email = idToEmail(id);
	return createUserWithEmailAndPassword(auth, email, password);
}

// 로그인
export async function loginWithId(id, password) {
	const email = idToEmail(id);
	return signInWithEmailAndPassword(auth, email, password);
}

// 로그아웃
export async function logout() {
	return signOut(auth);
}
