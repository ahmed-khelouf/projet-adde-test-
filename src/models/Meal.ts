export interface Meal {
    id: string
    name: string
    price?: number
    description: string
    imageUrl: string
    users: string[]
}

const meal: Meal = {
    id: '213232',
    name: 'Poulet',
    description: 'Poulet au curry',
    imageUrl: 'sd;sld;sld;sld',
    users: ['user1', 'user2'],
}
