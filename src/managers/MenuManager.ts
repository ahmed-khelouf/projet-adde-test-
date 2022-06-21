import { DateTime } from 'luxon'
import fs from 'fs/promises'
import { PATH } from '../constants'
import { fetchMealsFromSeazon } from '../services/SlackService'
import { readWeekMenu, writeWeekMenu } from './SaveManager'
import { WeekMenu } from '../models/WeekMenu'

export const getMenuForDate = async (
    requestedDate: DateTime = DateTime.now().plus({ week: 1 })
): Promise<WeekMenu> => {
    const requestedStartOfWeekDate = requestedDate.startOf('week')
    const requestedDateString = requestedStartOfWeekDate.toFormat('yyyy-LL-dd')
    const expectedFilename = `${requestedDateString}.json`
    // 1: check saved menus in local folder
    const meals = await fs.readdir(PATH.MEALSBYWEEK_SAVE_FOLDER_PATH)
    const index = meals.indexOf(expectedFilename)
    const isFileFound = index !== -1
    if (isFileFound) {
        // -> if found, return it
        // 4: return it
        return await readWeekMenu(requestedDateString)
    } else {
        // -> if not found, fetch it from Seazon
        // 2: fetch it from Seazon
        // 3: save it in local folder
        const nextWeekMeal = await fetchMealsFromSeazon(requestedDate)
        await writeWeekMenu(nextWeekMeal)
        return nextWeekMeal
    }
}
