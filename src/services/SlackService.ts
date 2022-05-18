import { Meal } from '../models/Meal'
import axios from 'axios'
import { RawMeal, SeazonRawData } from '../models/SeazonRawData'
import { DateTime } from 'luxon'
import { WeekMenu } from '../models/WeekMenu'

const DEFAULT_IMAGE_URL =
    'https://www.reliccastle.com/data/avatars/l/0/519.jpg?1497908869'
const SHIPPING_DAY_SEAZON_URL = 'https://seazon.fr/parse/classes/ShippingDay'
const BASE_IMAGE_SEAZON_URL =
    'https://res.cloudinary.com/eatzy/image/upload/q_auto,f_auto/c_fill,h_420,w_600/v1/'

const seazonShippingData = (startDate: string, endDate: string) => ({
    where: {
        date: {
            $gte: startDate,
            $lte: endDate,
        },
    },
    include: 'menu,menu.meal,menu.meal.kfcIngredients,menu.meal',
    keys: 'menu',
    limit: 1,
    _method: 'GET',
    _ApplicationId: 'seazon',
    _ClientVersion: 'js2.14.0',
    _InstallationId: '5ff39845-ba06-bd44-ee64-fd78817876c4',
})

export const fetchMealsFromSeazon = async (
    date: DateTime = DateTime.now()
): Promise<WeekMenu> => {
    const startDate = date.startOf('week')
    const startDateString = startDate.toISODate()
    const endDateString = startDate.plus({ days: 1 }).toISODate()
    const response = await axios.post<SeazonRawData>(
        SHIPPING_DAY_SEAZON_URL,
        seazonShippingData(startDateString, endDateString)
    )
    const { data } = response
    if (!data || !data.results) {
        throw new Error('Failed to fetch meals from Seazon')
    }
    const meals = parseMeals(data)
    return {
        date: startDateString,
        meals,
    }
}

const parseMeals = (data: SeazonRawData): Meal[] => {
    const rawMeals = data.results.reduce<RawMeal[]>((acc, cur) => {
        const { menu } = cur
        if (!menu) {
            return acc
        }
        const meals = menu.reduce<RawMeal[]>(
            (acc, cur) => [...acc, cur.meal],
            []
        )
        return [...acc, ...meals]
    }, [])
    const filteredMeals = rawMeals.filter((meal) => meal.type === 'plat')
    return filteredMeals.map((meal) => {
        const { objectId, text, description, medias } = meal
        const imageUrl = medias[0]
            ? `${BASE_IMAGE_SEAZON_URL}${medias[0]}`
            : DEFAULT_IMAGE_URL
        return {
            id: objectId,
            name: text,
            description,
            imageUrl,
            users: [],
        }
    })
}
