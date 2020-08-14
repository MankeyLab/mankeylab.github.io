import times from 'lodash/times';

export default class PokeStats {
    statsSelectors = [
        'hp',
        'attack',
        'defense',
        'special-attack',
        'special-defense',
        'speed'
    ]

    meters = []

    config = {
        numSegments: 20
    }

    constructor(component, stats) {
        const { statsSelectors } = this
        this.stats = stats
        this.component = component
        this.meters = statsSelectors.map((statName) => {
            return this.component
                .querySelector(`[data-element="${statName}"]`)
                .querySelector('.stats-meter')
        })
        this.prepareDOM()
    }

    prepareDOM = () => {
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

}