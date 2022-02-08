import React from 'react'
import styled from 'styled-components'
import { Bet, Game, PlayerGameStats } from '../types'

const Container = styled.div<{ color: string }>`
	background-color: ${({ color }) => color};
	margin: 16px 0px;
	border-radius: 24px;
	padding: 24px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`

const Column = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`

interface Props {
	bet: Bet
	game?: Game
	stats?: PlayerGameStats
}

export const Row: React.FC<Props> = ({ bet, stats, game }) => {
	const team = game && (bet.teamId === game.home_team.id ? game.home_team.name : game.visitor_team.name)

	let pointsOnTrack = false
	if (game && game.period > 0 && stats && bet.pointsGoal && stats.pts / Number(bet.pointsGoal) > 1 - 1 / game.period) {
		pointsOnTrack = true
	}
	let threesOnTrack = false
	if (game && game.period > 0 && stats && bet.threesGoal && stats.fg3m / Number(bet.threesGoal) > 1 - 1 / game.period) {
		threesOnTrack = true
	}

	let color = 'beige'
	if (game?.status === 'Final') {
		color = 'transparent'
	} else if (game?.status.endsWith('ET')) {
		color = 'lightgrey'
	} else if (pointsOnTrack && threesOnTrack) {
		color = 'lightgreen'
	} else if (pointsOnTrack || threesOnTrack) {
		color = 'yellow'
	}

	return (
		<Container color={color}>
			<span>{bet.toWin}</span>
			<span>
				{game?.status} {game?.time && `-`} {game?.time}
			</span>
			<Column>
				<b>
					{bet.playerName} - {team} - {bet.overGoal}
				</b>
				<span>
					{game?.home_team.name} vs {game?.visitor_team.name}
				</span>
				<span>
					{game?.home_team_score} - {game?.visitor_team_score}
				</span>
			</Column>
			<Column>
				<span>Current points: {stats?.pts}</span>
				<span>Points needed: {bet.pointsGoal}</span>
			</Column>
			<Column>
				<span>Current threes: {stats?.fg3m}</span>
				<span>Threes needed: {bet.threesGoal}</span>
			</Column>
		</Container>
	)
}
