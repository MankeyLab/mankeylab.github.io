import Axios from 'axios'

export default class PokeGetter {
    _API = 'https://pokeapi.co/api/v2/pokemon'

    async getPokemon() {
        console.log('asdf')
        try {
            const response = await Axios.get( `${this._API}/${this.getRandomInt(0, 100)}` )
            return this.formatResponse( response.data )
        } catch( error ) {
            return { error: true }
        }
    }

    getRandomInt = (min, max) => (
        parseInt((Math.random() * (max - min + 1)), 10) + min
    )

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