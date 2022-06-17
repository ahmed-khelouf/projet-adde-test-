import { WebClient } from '@slack/web-api'
import { User } from '../models/User'
import { writeUsers } from './SaveManager'

export const createDefaultUser = (
    id: string,
    mealsByWeek = 0,
    credits = 0,
    isSubscribed = false,
    pendingResponses = []
): User => ({
    id,
    mealsByWeek,
    credits,
    isSubscribed,
    pendingResponses,
})

export const handleUser = async (
    userID: string,
    users: Record<string, User>,
    client: WebClient
): Promise<void> => {
    const _previousUsersState = { ...users }
    if (!users[userID]) {
        // create a new user for this userID
        users[userID] = createDefaultUser(userID)
    }
    if (!users[userID].profile) {
        // get the user's profile
        const { profile } = await client.users.profile.get({ user: userID })
        users[userID].profile = profile
    }
    if (JSON.stringify(_previousUsersState) != JSON.stringify(users)) {
        await writeUsers(users)
    }
}
