import fs from 'fs/promises'
import { PATH } from '../constants'
import { User } from '../models/User'
import { WeekMenu } from '../models/WeekMenu'
import path from 'path'

export const writeUsers = async (
    payload: Record<string, User>
): Promise<void> =>
    await fs.writeFile(PATH.USER_SAVE_PATH, JSON.stringify(payload))

export const readUsers = async (): Promise<Record<string, User>> => {
    try {
        const content = await fs.readFile(PATH.USER_SAVE_PATH)
        return JSON.parse(content.toString())
    } catch (error) {
        // TODO: handle error; be more precise regarding type of error ( file not found, etc )
        return {}
    }
}

const makeWeekMenuPath = (date: string): string =>
    path.join(PATH.MEALSBYWEEK_SAVE_FOLDER_PATH, `${date}.json`)

export const writeWeekMenu = async (payload: WeekMenu): Promise<void> =>
    await fs.writeFile(makeWeekMenuPath(payload.date), JSON.stringify(payload))

export const readWeekMenu = async (forDate: string): Promise<WeekMenu> => {
    try {
        const content = await fs.readFile(makeWeekMenuPath(forDate))
        return JSON.parse(content.toString())
    } catch (error) {
        // TODO: handle error; be more precise regarding type of error ( file not found, etc )
        throw error
    }
}
