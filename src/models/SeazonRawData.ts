export interface SeazonRawData {
    results: { menu: RawMenu[] }[]
}

export interface RawMenu {
    meal: RawMeal
}

export interface RawMeal {
    objectId: string
    type: string
    text: string
    description: string
    medias: string[]
}
