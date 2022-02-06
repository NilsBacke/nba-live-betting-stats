import axios from 'axios'
import { toast } from 'react-toastify'
import { Game, Player, PlayerGameStats } from './types'

function formatDate() {
	var d = new Date(),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear()

	if (month.length < 2) month = '0' + month
	if (day.length < 2) day = '0' + day

	return [year, month, day].join('-')
}

export const getAllStatsForPlayers = async (playerIds: number[]): Promise<PlayerGameStats[] | undefined> => {
	const options = {
		url: `https://www.balldontlie.io/api/v1/stats?per_page=100&dates[]=${formatDate()}${playerIds.map(
			(id) => `&player_ids[]=${id}`
		)}`,
	}

	try {
		const response = await axios.request(options)
		if (response.status === 429) {
			toast('Too many requests, try again in 1 minute')
		}
		return response.data.data
	} catch (e) {
		console.error(e)
		return undefined
	}
}

export const searchForPlayerByLastName = async (fullName: string): Promise<Player[] | undefined> => {
	const options = {
		url: `https://www.balldontlie.io/api/v1/players?search=${fullName}`,
	}

	try {
		const response = await axios.request(options)
		if (response.status === 429) {
			toast('Too many requests, try again in 1 minute')
		}
		return response.data.data
	} catch (e) {
		console.error(e)
		return undefined
	}
}

export const getTodaysGames = async (): Promise<Game[] | undefined> => {
	const options = {
		url: `https://www.balldontlie.io/api/v1/games?per_page=100&dates[]=${formatDate()}`,
	}

	try {
		const response = await axios.request(options)
		if (response.status === 429) {
			toast('Too many requests, try again in 1 minute')
		}
		return response.data.data
	} catch (e) {
		console.error(e)
		return undefined
	}
}
