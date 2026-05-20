// src/lib/components/workplace/state/workspaceState.js

export function createInitialMissionProgress(course) {
	return course?.missions?.map((_, missionIndex) =>
		missionIndex === 0 ? 'playing' : 'locked'
	) ?? [];
}

export function createMockPlayers(course) {
	return (
		course?.mockPlayers ??
		course?.roles?.map((role, index) => ({
			id: `player_${index + 1}`,
			name: role.name ?? `학생${index + 1}`,
			avatarSrc: role.avatarSrc ?? `/images/avatars/${index + 1}.png`,
			roleId: role.id,
			roleName: role.roleName ?? role.name ?? role.id,
			isAutoCleared: false,
			missionProgress: createInitialMissionProgress(course)
		})) ??
		[]
	);
}

export function createAutoClearedPlayer(course, roleId) {
	const role = course?.roles?.find((item) => item.id === roleId);

	return {
		id: `auto_${roleId}`,
		name: '시스템',
		avatarSrc: role?.avatarSrc ?? '',
		roleId,
		roleName: role?.roleName ?? role?.name ?? roleId,
		isAutoCleared: true,
		missionProgress:
			course?.missions?.map((mission) => {
				return mission.type === 'team-final' ? 'submitted' : 'cleared';
			}) ?? []
	};
}

export function buildWorkspacePlayers({
	course,
	participants = [],
	room = null,
	useMockPlayers = false,
	shouldUseFirebase = false
}) {
	const basePlayers = shouldUseFirebase
		? participants.map((participant) => ({
				id: participant.id,
				name: participant.name,
				avatarSrc: participant.avatarSrc,
				roleId: participant.roleId,
				roleName: participant.roleName,
				isAutoCleared: false,
				missionProgress: participant.missionProgress ?? createInitialMissionProgress(course)
			}))
		: createMockPlayers(course);

	const autoClearedRoles = shouldUseFirebase ? room?.autoClearedRoles ?? [] : [];

	return [
		...basePlayers,
		...autoClearedRoles.map((roleId) => createAutoClearedPlayer(course, roleId))
	];
}

export function markPlayerMissionState({ players, playerId, missionIndex, nextState }) {
	return players.map((player) => {
		if (player.id !== playerId) return player;

		const nextProgress = [...(player.missionProgress ?? [])];
		nextProgress[missionIndex] = nextState;

		return {
			...player,
			missionProgress: nextProgress
		};
	});
}

export function resetPlayersMissionProgress({ players, course }) {
	return players.map((player) => ({
		...player,
		missionProgress: createInitialMissionProgress(course)
	}));
}

export function setAllPlayersMissionState({ players, missionIndex, nextState }) {
	return players.map((player) => {
		const nextProgress = [...(player.missionProgress ?? [])];
		nextProgress[missionIndex] = nextState;

		return {
			...player,
			missionProgress: nextProgress
		};
	});
}

export function getPlayerMissionProgress(player, course) {
	return player?.missionProgress ?? createInitialMissionProgress(course);
}

export function getNextMissionProgressForPlayer({ player, course, missionIndex, nextState }) {
	const nextProgress = [...getPlayerMissionProgress(player, course)];
	nextProgress[missionIndex] = nextState;

	return nextProgress;
}