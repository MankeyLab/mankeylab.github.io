export default class PokeItem {
    constructor({name, art, status, sprite, stats}) {
        this.name = name
        this.art = art
        this.sprite = sprite
        this.stats = stats
    }

    getMarkup = () => (`
        <li class="poke-controller__item">
            <div class="poke-controller__item-plane">
                <button class="poke-controller__item-stand">
                    <img 
                        class="poke-controller__sprite"
                        src="${this.art}"
                        alt="${this.name} offical artwork"  
                    />
                </button>
            </div>
        </li>
    `)
}