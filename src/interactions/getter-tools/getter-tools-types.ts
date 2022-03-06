export interface Coordinate {
    x: number
    y: number
};

export interface FindInactivePlayerOptions {
    departure: Coordinate,
    range: number,
    maxVillages: number,
    minPopulation: number,
    maxPopulation: number,
    includeNatars: boolean
};