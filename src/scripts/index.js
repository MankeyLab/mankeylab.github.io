import '../styles/index.scss'
import PokeController from './components/PokeController'

if (process.env.NODE_ENV === 'development') {
    require('../index.html')
}

window.onload = () => {
    const pokeController = new PokeController(
        document.querySelector('[data-component="poke-controller"]')
    )
    pokeController.start()
};
