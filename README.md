# [Front-end Demo](https://mankeylab.github.io/build)

### Installation
```
npm install
```

### Start Dev Server
```
npm start
```

### Build Prod Version
```
npm run build
```

## About
I picked an entirely arbitrary concept to demonstrate my CSS, React, and JavaScript skillset. _Why pokémon-and why are they spinning?_

### Well, a couple of reasons
- There's a [free Pokémon api](https://pokeapi.co/), which is cool. It was useful to demonstrate REST API integration.
    - I had been thinking about how to recreate some retro/pixel interface elements in CSS. Specifically utilizing step transition, dither effects, and simulating pixelation.
- _But why are they spinning?_ 
    - I wanted an exercise to practice CSS 3D transforms.
    - Once I had the inital proof of concept down I wanted to push it a little further, to see if I could smoothly add items into it without disrupting the animation. 
    - One nuance that might not be apparent at first is how each item has to counter-rotate in sync with the disc in order to always be facing towards the user. All of the rotation animations are done using a function of the item's index and the number of items in the carousel.

### Instructions
- Click on a pokémon to load it's stats.
- Toggling wireframes to see the underlying CSS transforms.
- Toggle sprites to swap offical nintendo art for the game sprites.
- Click add item to fetch a random pokémon.
- Click remove when you've added to many pokés
- Enjoy this perfectly useless front-end demo!