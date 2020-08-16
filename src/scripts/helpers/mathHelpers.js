export const mapRange = (value, low1, high1, low2, high2) => (
    low2 + ( high2 - low2 ) * ( value - low1 ) / ( high1 - low1 )
)
export const clamp = (value, min, max) => (
    value <= min ? min : value >= max ? max : value
)
export const getRandomInt = (min, max) => (
    parseInt((Math.random() * (max - min + 1)), 10) + min
)