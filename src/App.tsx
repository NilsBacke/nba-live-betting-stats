import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import SelectSearch from 'react-select-search'
import { Bet, Game, Player, PlayerGameStats } from './types'
import { getAllStatsForPlayers, getTodaysGames, searchForPlayerByLastName } from './api'
import { formatInput } from './inputFormatter'
import { testData } from './testdata'
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
	const [rawBets, setRawBets] = useState('')
	const [bets, setBets] = useState<Bet[]>([])
	const [games, setGames] = useState<Game[]>([])
	const [stats, setStats] = useState<PlayerGameStats[]>([])

	const submit = () => {
		if (rawBets) {
			setIsLoading(true)
			const b = formatInput(rawBets)
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
			const players = await searchForPlayerByLastName(name)

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
			<button onClick={submit}>Submit</button>
			{isLoading ? (
				<Loader />
			) : (
				bets.map((r, i) => {
					const stat = stats.find((s) => s.player.id === r.playerId)
					const game = games.find((g) => g.home_team.id === r.teamId || g.visitor_team.id === r.teamId)!
					return <Row bet={r} stats={stat} game={game} key={r.playerName! + i} />
				})
			)}
			<ToastContainer />
		</Wrapper>
	)
}

export default App
