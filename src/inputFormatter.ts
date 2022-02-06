import { Bet } from './types'

export const formatInput = (input: string): Bet[] => {
	const bets = input.split('Placed - ')
	bets.shift()
	const results = []
	for (const bet of bets) {
		const lines = bet.split('\n')
		const overLine = lines.find((l) => l.includes('Team Total Points'))
		const pointsLine = lines.find((l) => l.includes('or more points against'))
		const threesLine = lines.find((l) => l.includes('or more three point field goals'))
		results.push({
			toWin: lines[1],
			overGoal: overLine?.split(' ')[1],
			playerName: pointsLine?.split(' of the')[0],
			pointsGoal: pointsLine?.split('will score ')[1].split(' ')[0],
			threesGoal: threesLine?.split('will score ')[1].split(' ')[0],
		})
	}
	return results
}
