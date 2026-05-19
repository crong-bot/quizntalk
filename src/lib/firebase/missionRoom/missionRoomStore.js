// src/lib/features/mission-room/missionRoomStore.js

import { writable } from 'svelte/store';
import {
	subscribeLessonRooms,
	subscribeParticipants,
	subscribeRoom,
	subscribeTeacherLessons
} from './missionRoomRepository';

export function createLessonRoomsStore() {
	const { subscribe, set } = writable({
		rooms: [],
		isLoading: false,
		errorMessage: ''
	});

	let unsubscribeRooms = null;

	function start(lessonId) {
		stop();

		set({
			rooms: [],
			isLoading: true,
			errorMessage: ''
		});

		unsubscribeRooms = subscribeLessonRooms(
			lessonId,
			(nextRooms) => {
				set({
					rooms: nextRooms,
					isLoading: false,
					errorMessage: ''
				});
			},
			(error) => {
				set({
					rooms: [],
					isLoading: false,
					errorMessage: error?.message ?? '방 목록을 불러오지 못했습니다.'
				});
			}
		);
	}

	function stop() {
		unsubscribeRooms?.();
		unsubscribeRooms = null;
	}

	return {
		subscribe,
		start,
		stop
	};
}

export function createMissionRoomStore() {
	const { subscribe, set, update } = writable({
		room: null,
		participants: [],
		isLoading: false,
		errorMessage: ''
	});

	let unsubscribeRoom = null;
	let unsubscribeParticipants = null;

	function start({ lessonId, roomId, initialRoom = null }) {
		stop();

		set({
			room: initialRoom,
			participants: [],
			isLoading: true,
			errorMessage: ''
		});

		unsubscribeRoom = subscribeRoom(
			{ lessonId, roomId },
			(nextRoom) => {
				update((state) => ({
					...state,
					room: nextRoom,
					isLoading: false,
					errorMessage: ''
				}));
			},
			(error) => {
				update((state) => ({
					...state,
					isLoading: false,
					errorMessage: error?.message ?? '방 정보를 불러오지 못했습니다.'
				}));
			}
		);

		unsubscribeParticipants = subscribeParticipants(
			{ lessonId, roomId },
			(nextParticipants) => {
				update((state) => ({
					...state,
					participants: nextParticipants
				}));
			},
			(error) => {
				update((state) => ({
					...state,
					errorMessage: error?.message ?? '참가자 목록을 불러오지 못했습니다.'
				}));
			}
		);
	}

	function stop() {
		unsubscribeRoom?.();
		unsubscribeParticipants?.();

		unsubscribeRoom = null;
		unsubscribeParticipants = null;
	}

	return {
		subscribe,
		start,
		stop
	};
}
export function createTeacherLessonsStore() {
	const { subscribe, set } = writable({
		lessons: [],
		isLoading: false,
		errorMessage: ''
	});

	let unsubscribeLessons = null;

	function start(ownerUid) {
		stop();

		set({
			lessons: [],
			isLoading: true,
			errorMessage: ''
		});

		unsubscribeLessons = subscribeTeacherLessons(
			ownerUid,
			(nextLessons) => {
				set({
					lessons: nextLessons,
					isLoading: false,
					errorMessage: ''
				});
			},
			(error) => {
				set({
					lessons: [],
					isLoading: false,
					errorMessage: error?.message ?? '수업 목록을 불러오지 못했습니다.'
				});
			}
		);
	}

	function stop() {
		unsubscribeLessons?.();
		unsubscribeLessons = null;
	}

	return {
		subscribe,
		start,
		stop
	};
}
