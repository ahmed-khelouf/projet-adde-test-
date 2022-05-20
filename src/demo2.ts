import { getMenuForDate } from './managers/MenuManager'
import { writeWeekMenu } from './managers/SaveManager'
import { fetchMealsFromSeazon } from './services/SlackService'

const fetchAndWriteWeekMenu = async () => {
    const meals = await getMenuForDate()
    // const meals = await fetchMealsFromSeazon()
    // await writeWeekMenu(meals)
}

fetchAndWriteWeekMenu()
