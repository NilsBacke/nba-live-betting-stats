import React from 'react'
import styled from 'styled-components'
import { Bet, Game, PlayerGameStats } from '../types'

const Container = styled.div`
	margin: 16px 0px;
	border-radius: 24px;
	padding: 24px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	background-color: transparent;
	position: relative;
`

const Column = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`

const HalfBackground = styled.div<{ color: string; right?: boolean }>`
	background-color: ${({ color }) => color};
	position: absolute;
	z-index: -1;
	top: 0px;
	bottom: 0px;
	${({ right }) => (right ? `right: 0px;` : `left: 0px;`)}
	width: 50%;
`

interface Props {
	bet: Bet
	game?: Game
	stats?: PlayerGameStats
}

export const Row: React.FC<Props> = ({ bet, stats, game }) => {
	const team = game && (bet.teamId === game.home_team.id ? game.home_team.name : game.visitor_team.name)

	let pointsOnTrack = false
	let pointsMade = false
	if (game && game.period > 0 && stats && bet.pointsGoal && stats.pts / Number(bet.pointsGoal) > game.period / 4) {
		if (stats.pts >= Number(bet.pointsGoal)) {
			pointsMade = true
		} else {
			pointsOnTrack = true
		}
	}
	let threesOnTrack = false
	let threesMade = false
	if (game && game.period > 0 && stats && bet.threesGoal && stats.fg3m / Number(bet.threesGoal) > game.period / 4) {
		if (stats.fg3m >= Number(bet.threesGoal)) {
			threesMade = true
		} else {
			threesOnTrack = true
		}
	}

	let leftColor = 'beige'
	let rightColor = 'beige'
	if (game?.status === 'Final') {
		leftColor = rightColor = 'transparent'
	} else if (game?.status.endsWith('ET')) {
		leftColor = rightColor = 'lightgrey'
	} else {
		if (pointsOnTrack) {
			leftColor = 'yellow'
		}
		if (pointsMade) {
			leftColor = 'green'
		}
		if (threesOnTrack) {
			rightColor = 'yellow'
		}
		if (threesMade) {
			rightColor = 'green'
		}
	}

	return (
		<Container>
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
			<HalfBackground color={leftColor} />
			<HalfBackground color={rightColor} right />
		</Container>
	)
}
