import anime from 'animejs/lib/anime.es.js'
import { clamp, mapRange } from '../helpers/mathHelpers'

export default class PokeTimelineManager {
    config = {
        discRotationDuration: 30000
    }

    constructor({disc, item, itemStand, images}) {
        this.disc = disc
        this.item = item
        this.itemStand = itemStand
        this.images = images
        console.log(itemStand)
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

    createItemTimeline = (method) => {
        const { 
            getRotationOffset, 
            config, 
            item, 
            itemStand,
            images
        } = this
        anime.remove(item)
        anime.remove(itemStand)

        anime.set( item, {
            // center hack
            translateX: '-50%'
        })

        anime({
            // sets the rotation out from center of the item
            targets: item,
            easing: 'easeOutExpo',
            rotate: (el, i, l) => {
                return (i + 1 === l) && method === 'add'
                    ? [ getRotationOffset(i, l) - 10, getRotationOffset(i, l) ]
                    : getRotationOffset(i, l)
            },
            duration: 2000
        })

        anime({
            // reduces the size of items based on the number of items,
            // also adds a scale in effect to the image
            targets: images,
            easing: 'easeOutExpo',
            scale: (el, i, l) => {
                // scale reduce based on item
                const scale = clamp(10 / l, .6, 1.2)
                // scales up the newly added item
                return (i + 1 === l) && method === 'add'
                    ? [ 0, scale ]
                    : scale
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
            rotateZ: ( el, i, l ) => {
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