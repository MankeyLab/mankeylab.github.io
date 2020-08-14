import anime from 'animejs/lib/anime.es.js'

export default class PokeTimelineManager {
    config = {
        discRotationDuration: 30000
    }

    constructor({disc, item, itemStand}) {
        this.disc = disc
        this.item = item
        this.itemStand = itemStand
    }

    createDiscTimeline = () => {
        const { config, disc } = this

        this.discRotationTimeline = anime.timeline({
            targets: disc,
            easing: 'linear',
            duration: config.discRotationDuration,
            loop: true,
            autoplay: true
        }).add({
            rotate: [ 0, 360 ],
        })
    }

    createItemTimeline = () => {
        const { 
            getRotationOffset, 
            config, 
            item, 
            itemStand 
        } = this
        anime.remove(item)
        anime.remove(itemStand)

        anime.set( item, {
            translateX: '-50%'
        })

        anime({
            targets: item,
            easing: 'easeOutExpo',
            rotate: function(el, i, l) {
                return getRotationOffset(i, l)
            },
            duration: 2000
        })

        this.standsRotationTimeline = anime.timeline({
            easing: 'linear',
            targets: itemStand,
            duration: config.discRotationDuration,
            loop: true,
            autoplay: false
        }).add({
            rotateZ: function( el, i, l ) {
                const from = 180 - getRotationOffset(i, l)
                const to =  -180 - getRotationOffset(i, l)

                return [ from, to ]
            },
            rotateX: [ -90, -90 ],
        })

        this.standsRotationTimeline.seek(
            this.discRotationTimeline.progress * (config.discRotationDuration / 100)
        )
        this.standsRotationTimeline.play()
    }

    getRotationOffset = (i, length) => (
        ( 360 / length ) * ( i + 1 )
    )
}