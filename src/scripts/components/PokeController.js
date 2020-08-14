import PokeGetter from './PokeGetter'
import PokeItem from './PokeItem'
import PokeTimelineManager from './PokeTimelineManager'
import PokeStats from './PokeStats'
import times from 'lodash/times'

export default class PokeController {
    pokeGetter = new PokeGetter()
    timelineManager = new PokeTimelineManager({
        disc: '.poke-controller__disc',
        item: '.poke-controller__item',
        itemStand: '.poke-controller__item-stand'
    })

    state = {
        items: [],
    }
    config = {
        initialAmount: 5
    }

    constructor(component) {
        this.component = component
        this.controlContainer = document.querySelector('[data-component="poke-ui__controls"]') 
        this.disc = this.component.querySelector('[data-element="disc"]')
        this.controls = {
            addItem: this.controlContainer.querySelector('[data-action="add-item"]'),
            toggleWireframes: this.controlContainer.querySelector('[data-action="toggle-wireframes"]'),
            removeItem: this.controlContainer.querySelector('[data-action="remove-item"]')
        }
        this.stats = new PokeStats(document.querySelector('[data-component="poke-stats"]'))
    }

    start = () => {
        this.bindEvents()
        this.getInitialData()
    }

    bindEvents = () => {
        const { addItem, toggleWireframes, removeItem } = this.controls
        toggleWireframes.onclick = () => this.handleToggleWireframes()
        addItem.onclick = () => this.handleAddItem()
        removeItem.onclick = () => this.handleRemoveItem()
    }

    handleToggleWireframes = () => {
        this.component.classList.toggle('poke-controller--show-wireframes')
    }

    async handleAddItem() {
        const { 
            pokeGetter, 
            timelineManager,
            injectItem,
            state,
            config
        } = this

        pokeGetter.getPokemon()
            .then((data) => {
                console.log(data)
                const pokeItem = new PokeItem(data)
                if (!pokeItem.error) {
                    state.items = [ ...state.items, pokeItem ]
                    injectItem(pokeItem)
                    timelineManager.createItemTimeline('add')
                }
            })
    }

    handleRemoveItem = () => {

    }

    async getInitialData() {
        const { 
            pokeGetter, 
            injectItem,
            state,
            config,
            timelineManager
        } = this

        await Promise.all(
            times(
                config.initialAmount, 
                () => pokeGetter.getPokemon()
            )
        ).then((data) => {
            state.items = data
                .filter(({error}) => !error)
                .map((item) => {
                    const pokeItem = new PokeItem(item)
                    injectItem(pokeItem)
                    return pokeItem
                })

            timelineManager.createDiscTimeline()
            timelineManager.createItemTimeline('add')
        })
    }

    injectItem = item => {
        this.disc.insertAdjacentHTML(
            'beforeend',
            item.getMarkup()
        )
    }
}