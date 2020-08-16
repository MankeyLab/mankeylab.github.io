import Axios from 'axios'
import { getRandomInt } from '../helpers/mathHelpers'

export default class PokeGetter {
    _API = 'https://pokeapi.co/api/v2/pokemon'
    config = {
        minId: 1,
        maxId: 255
    }

    async getPokemon() {
        const { minId, maxId } = this.config
        try {
            const response = await Axios.get( `${this._API}/${getRandomInt(minId, maxId)}` )
            return this.formatResponse( response.data )
        } catch( error ) {
            return { error: true }
        }
    }

    formatResponse = data => ({
        error: false,
        name: data.species.name,
        sprite: data.sprites.front_default,
        art: data.sprites.other['official-artwork'].front_default,
        stats: data.stats.map((stat) => ({
            name: stat.stat.name,
            value: stat.base_stat
        }))
    })
}