import { Bet } from './types'

export const formatInput = (input: string): Bet[] => {
	const bets = input.split('Placed - ')
	bets.shift()
	const results: Bet[] = []
	for (const bet of bets) {
		const lines = bet.split('\n')
		const overLine = lines.find((l) => l.includes('Team Total Points'))
		const pointsLine = lines.find((l) => l.includes('points'))
		const threesLine = lines.find((l) => l.includes('or more three point field goals'))
		if (pointsLine?.split(' of the')[0] && lines[1]) {
			results.push({
				toWin: lines[1],
				overGoal: overLine?.split(' ')[1],
				playerName: pointsLine?.split(' of the')[0],
				pointsGoal: pointsLine?.split('will score ')[1].split(' ')[0],
				threesGoal: threesLine?.split('will score ')[1].split(' ')[0],
			})
		}
	}
	return results
}

export const nilayFormatInput = (input: string): Bet[] => {
	const bets = input.split(' - ')
	console.log(bets)
	bets.shift()
	const results: Bet[] = []
	for (const bet of bets) {
		const name = bet.split('of the').at(-2)?.split(',').at(-1)
		const toWin = bet.split('Future/Prop\t').at(-1)?.split('\t')[1]
		const overLine = bet.split('Team Total Points')[0].split(' ').at(-2)
		const pointsLine = bet.split(' or more points')[0].split(' ').at(-1)
		const threesLine = bet.split(' or more three point field goals')[0].split(' ').at(-1)
		if (name && toWin) {
			results.push({
				toWin: toWin!,
				overGoal: overLine,
				playerName: name?.trim(),
				pointsGoal: pointsLine,
				threesGoal: threesLine,
			})
		}
	}
	return results
}
