import PokeGetter from './PokeGetter'
import PokeItem from './PokeItem'
import PokeTimelineManager from './PokeTimelineManager'
import PokeStats from './PokeStats'
import times from 'lodash/times'
import sample from 'lodash/sample'

export default class PokeController {
    pokeGetter = new PokeGetter()
    timelineManager = new PokeTimelineManager({
        disc: '.poke-controller__disc',
        item: '.poke-controller__item',
        itemStand: '.poke-controller__item-stand',
        images: '.poke-controller__image'
    })

    state = {
        items: [],
        activePoke: undefined
    }
    config = {
        initialAmount: 5,
        maxAmount: 20,
        activeItemClass: 'poke-controller__item--active'
    }

    constructor(component) {
        this.component = component
        this.controlContainer = document.querySelector('[data-component="poke-ui__controls"]') 
        this.disc = this.component.querySelector('[data-element="disc"]')
        this.controls = {
            addItem: this.controlContainer.querySelector('[data-action="add-item"]'),
            toggleWireframes: this.controlContainer.querySelector('[data-action="toggle-wireframes"]'),
            removeItem: this.controlContainer.querySelector('[data-action="remove-item"]'),
            toggleSprites: this.controlContainer.querySelector('[data-action="toggle-sprites"]'),
        }
        this.stats = new PokeStats(document.querySelector('[data-component="poke-stats"]'))
    }

    start = () => {
        this.bindEvents()
        this.getInitialData()
    }

    bindEvents = () => {
        const { addItem, toggleWireframes, removeItem, toggleSprites } = this.controls
        toggleWireframes.onclick = () => this.handleToggleWireframes()
        addItem.onclick = () => this.handleAddItem()
        removeItem.onclick = () => this.handleRemoveItem()
        toggleSprites.onclick = () => this.handleToggleSprites()
    }

    handleToggleWireframes = () => {
        this.component.classList.toggle('poke-controller--show-wireframes')
    }

    handleToggleSprites = () => {
        this.component.classList.toggle('poke-controller--show-sprites')
    }

    async handleAddItem() {
        // this function adds a new item from the PokeGetter API, injects it
        // into the DOM, then restarts the Items' counter rotation timeline
        // and re-syncs it to the disc's timeline
        const { 
            pokeGetter, 
            timelineManager,
            injectItem,
            state,
            setActivePoke,
            manageControlsState
        } = this

        pokeGetter.getPokemon()
            .then((data) => {
                const pokeItem = new PokeItem(data)
                if (!pokeItem.error) {
                    state.items = [ ...state.items, pokeItem ]
                    injectItem(pokeItem)
                    setActivePoke(pokeItem)
                    timelineManager.createItemTimeline('add')
                    manageControlsState()
                }
            })
    }

    handleRemoveItem = () => {
        // this function removes a random PokeItem from state
        // and from the DOM. It also resyncs the timelines to
        // account for one less item
        const { 
            state,
            timelineManager,
            manageControlsState,
            setActivePoke 
        } = this

        const removedItem = sample(state.items)
        state.items = state.items.filter((item) => item !== removedItem)
        removedItem.element.remove()
        timelineManager.createItemTimeline('remove')

        if (removedItem === state.activePoke) {
            setActivePoke(sample(state.items)) 
        }

        manageControlsState()
    }

    manageControlsState = () => {
        const { state, controls, config } = this
        controls.addItem.disabled = state.items.length >= config.maxAmount
            ? true
            : false
        controls.removeItem.disabled = this.state.items.length === 1
            ? true
            : false
    }

    async getInitialData() {
        // this function grabs the initial data and starts up the timeline manager,
        // and also sets the first PokeItem as the active one
        const { 
            pokeGetter, 
            injectItem,
            state,
            config,
            timelineManager,
            setActivePoke
        } = this

        await Promise.all(
            times(
                config.initialAmount, 
                () => pokeGetter.getPokemon()
            )
        ).then((data) => {
            state.items = data
                .filter(({error}) => !error)
                .map((item, i) => {
                    const pokeItem = new PokeItem(item)
                    injectItem(pokeItem)
                    return pokeItem
                })

            timelineManager.createDiscTimeline()
            timelineManager.createItemTimeline('add')
            setActivePoke(state.items[0])
        })
    }

    injectItem = pokeItem => {
        // this function creates the markup from a PokeItem, stores
        // the reference to its DOM node in .element, and injects
        // the markup into the DOM
        const { setActivePoke } = this
        const fragment = document
            .createRange()
            .createContextualFragment(pokeItem.getMarkup())
        pokeItem.element = fragment.children[0]
        fragment
            .querySelector('[data-element="poke-item"]')
            .addEventListener('click', () => setActivePoke(pokeItem))

        this.disc.appendChild(pokeItem.element)
    }

    setActivePoke = (pokeItem) => {
        // this function passes the PokeItem's stats to the
        // PokeStats component and sets an active state
        // on the PokeItem's DOM element.
        const { component, state } = this
        const { activeItemClass } = this.config
        state.activePoke = pokeItem

        state.items.forEach((stateItem) => stateItem
            .element
            .classList
            .toggle(activeItemClass, stateItem.element === pokeItem.element)
        )

        this.stats.renderStats(
            pokeItem.stats,
            pokeItem.name
        )
    }
}