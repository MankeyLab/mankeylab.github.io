import times from 'lodash/times'
import { clamp, mapRange } from '../helpers/mathHelpers'

export default class PokeStats {
    meters = []
    currentStats = [
        {name: 'hp', value: undefined},
        {name: 'attack', value: undefined},
        {name: 'defense', value: undefined},
        {name: 'special-attack', value: undefined},
        {name: 'special-defense', value: undefined},
        {name: 'speed', value: undefined}
    ]
    pokeName = undefined

    config = {
        numSegments: 20,
        minStat: 0,
        maxStat: 180,
        filledSegmentClass: 'stats-meter__segment--filled',
    }

    constructor(component) {
        const { currentStats } = this
        this.component = component
        this.nameContainer = component.querySelector('[data-element="poke-name"]')
        this.meters = currentStats.map(({ name }) => {
            // creates reference for each of the DOM nodes per stat
            return this.component
                .querySelector(`[data-element="${name}"]`)
                .querySelector('.stats-meter')
        })
        this.prepareDOM()
    }

    prepareDOM = () => {
        // this function injects a bunch of empty list items that
        // correspond to the segments
        const { numSegments } = this.config
        const { meters } = this
        this.meters.forEach((meter) => {
            times(numSegments, () => {
                meter.insertAdjacentHTML(
                    'beforeend',
                    `<li class="stats-meter__segment"></li>`
                )
            })
        })
    }

    renderStats = (stats, name) => {
        const { renderMeterSegments } = this
        this.currentStats = stats
        this.meters.forEach((meter, i) => {
            renderMeterSegments(
                meter,
                this.currentStats[i].value, 
            )
        })
        this.nameContainer.innerHTML = name
    }

    renderMeterSegments = (meter, value) => {
        const { getMappedValue } = this
        const { filledSegmentClass } = this.config

        meter.children.forEach((segment, i) => {
            segment.classList.toggle(
                filledSegmentClass, 
                i + 1 <= getMappedValue( value )
            )
        })
    }

    getMappedValue = value => {
        const { minStat, maxStat, numSegments } = this.config
        return Math.round(
            mapRange(
                clamp(value, minStat, maxStat),
                minStat,
                maxStat,
                0,
                numSegments
            )
        )
    }
}