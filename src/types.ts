export interface PlayerGameStats {
	game: {
		id: number
	}
	fg3m: number
	pts: number
	team: {
		id: number
		name: string
	}
	player: {
		id: number
	}
}

export interface GameStats {
	currentPeriod: string
	clock: string
	vTeam: GameTeamStats
	hTeam: GameTeamStats
	statusGame: string
}

export interface GameTeamStats {
	teamId: string
	nickName: string
	score: {
		points: string
	}
}

export interface Player {
	id: number
	first_name: string
	last_name: string
	team: {
		id: number
	}
}

export interface Game {
	id: number
	date: string
	period: number
	status: string
	time: string
	visitor_team: {
		id: number
		name: string
	}
	home_team: {
		id: number
		name: string
	}
	home_team_score: number
	visitor_team_score: number
}

export interface Bet {
	toWin: string
	playerName?: string
	pointsGoal?: string
	threesGoal?: string
	playerId?: number
	teamId?: number
	overGoal?: string
}
