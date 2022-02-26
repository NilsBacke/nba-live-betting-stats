import React, { useState } from 'react'
import styled from 'styled-components'
// import SelectSearch from 'react-select-search'
import { Bet, Game, PlayerGameStats } from './types'
import { getAllStatsForPlayers, getTodaysGames, searchForPlayerByLastName } from './api'
import { formatInput, nilayFormatInput } from './inputFormatter'
import { Row } from './components/Row'
import { Loader } from './components/Spinner'
import { ToastContainer } from 'react-toastify'

const Wrapper = styled.div`
	padding: 16px;
	flex: 1;
	height: 100%;
`

function App() {
	const [isLoading, setIsLoading] = useState(false)
	const [rawBets, setRawBets] = useState(() => {
		const saved = localStorage.getItem('rawBets')
		return saved || ''
	})
	const [checked, setChecked] = useState(false)
	const [bets, setBets] = useState<Bet[]>([])
	const [games, setGames] = useState<Game[]>([])
	const [stats, setStats] = useState<PlayerGameStats[]>([])

	const submit = () => {
		if (rawBets) {
			localStorage.setItem('rawBets', rawBets)
			setIsLoading(true)
			const b = checked ? nilayFormatInput(rawBets) : formatInput(rawBets)
			console.log(b)
			setBets(b)
			fetchData(b)
		}
	}

	const fetchData = async (bets: Bet[]) => {
		if (bets.length === 0) return

		const playerIds: number[] = []
		const newBets = [...bets]

		for (let i = 0; i < bets.length; i++) {
			let name = bets[i].playerName!
			if (name.endsWith('Jr.')) {
				const split = name.split(' ')
				split.pop()
				name = split.join(' ')
			}

			// remove suffix
			const split = name.split(' ')
			if (split.length >= 3) {
				name = split[0] + ' ' + split[1]
			}
			let players = await searchForPlayerByLastName(name)

			console.log(name, players)

			let triedAgain = false
			if (players?.length === 0) {
				if (name.includes('.')) {
					name = name.replaceAll('.', '')
					players = await searchForPlayerByLastName(name)
					triedAgain = true
				}
				if (players?.length === 0) {
					alert('could not find player for ' + name + (triedAgain ? ` And tried again with no dots` : ''))
				}
			}

			let id = 0
			let player
			if (players!.length > 1) {
				player = players!.find((p) => p.first_name + ' ' + p.last_name === bets[i].playerName)!
				id = player.id
			} else {
				player = players![0]
				id = player.id
			}

			playerIds.push(id)
			newBets[i].playerId = id
			newBets[i].teamId = player.team.id
		}

		const games = await getTodaysGames()
		setGames(games!)

		getAllStatsForPlayers(playerIds).then((stats) => {
			setStats(stats!)
			setIsLoading(false)
		})

		setBets(newBets)
	}

	return (
		<Wrapper>
			{/* <SelectSearch
				options={[]}
				getOptions={async (query) => {
					const players = await searchForPlayerByLastName(query)
					return players ? players.map((p) => ({ name: p.firstName + p.lastName, value: p.playerId })) : []
				}}
				placeholder='Search player by last name'
				debounce={300}
				search
			/> */}
			<textarea value={rawBets} onChange={(e) => setRawBets(e.target.value)} />
			<label htmlFor='input'>Nilay Check This</label>
			<input name='input' type='checkbox' checked={checked} onChange={(e) => setChecked(e.target.checked)} />
			<button onClick={submit}>Submit</button>
			{isLoading ? (
				<Loader />
			) : (
				bets
					.sort((a, b) => {
						const game1 = games!.find((g) => g.home_team.id === a.teamId || g.visitor_team.id === a.teamId)!
						const game2 = games!.find((g) => g.home_team.id === b.teamId || g.visitor_team.id === b.teamId)!
						if (!game1 || !game2) return 0

						return (
							Number(game1.status === 'Final') - Number(game2.status === 'Final') ||
							Number(game1.status.endsWith('ET')) - Number(game2.status.endsWith('ET')) ||
							game1.period - game2.period
						)
					})
					.map((r, i) => {
						const stat = stats.find((s) => s.player.id === r.playerId)
						const game = games.find((g) => g.home_team.id === r.teamId || g.visitor_team.id === r.teamId)
						return <Row bet={r} stats={stat} game={game} key={r.playerName! + i} />
					})
			)}
			<ToastContainer />
		</Wrapper>
	)
}

export default App
