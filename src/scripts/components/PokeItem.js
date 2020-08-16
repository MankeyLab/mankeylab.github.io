export default class PokeItem {
    constructor({name, art, sprite, stats}) {
        this.name = name
        this.art = art
        this.sprite = sprite
        this.stats = stats
    }

    getMarkup = () => (`
        <li class="poke-controller__item" data-element="poke-item">
            <div class="poke-controller__item-plane">
                <button class="poke-controller__item-stand" data-element="poke-button">
                    <img 
                        class="poke-controller__art"
                        src="${this.art}"
                        alt="${this.name} offical artwork"  
                    />
                    <img 
                        class="poke-controller__sprite"
                        src="${this.sprite}"
                        alt="${this.name} offical artwork"  
                    />
                </button>
            </div>
        </li>
    `)
}