import dotenv from 'dotenv'
dotenv.config()

import { App } from '@slack/bolt'
import {
    isBlockAction,
    isBlockButtonElementAction,
    isGenericMessageEvent,
} from './utils/helpers'
import { handleUser } from './managers/UserManager'
import { User } from './models/User'
import {
    readUsers,
    readWeekMenu,
    writeUsers,
    writeWeekMenu,
} from './managers/SaveManager'
import { mealToBlock } from './MessageBlock'
import { WeekMenu } from './models/WeekMenu'

// GlobalVar
let users: Record<string, User> = {}
let weekMenu: WeekMenu

// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true, // add this
    appToken: process.env.SLACK_APP_TOKEN, // add this
})
const startMyApp = async () => {
    // Start your app
    users = await readUsers()
    await app.start(process.env.PORT || 1234)

    console.log('⚡️ Bolt app is running!')
}

app.message(
    /^(hi|hello|hey|wesh|yo|salut).*/,
    async ({ client, context, message, say }) => {
        if (!isGenericMessageEvent(message)) return
        handleUser(message.user, users, client)
        const greeting = context.matches[1]
        await say(`${greeting}, <@${message.user}>`)
    }
)

app.message(/(total)/, async ({ client, context, message, say }) => {
    if (!isGenericMessageEvent(message)) return
    console.log(client.users.profile.get)

    // checking if there are users in memory
    if (Object.keys(users).length === 0) {
        say(`Aucun utilisateur n'est enregistré`)
        return
    }
    for (const userID in users) {
        const user = users[userID]
        const mealsByWeekString = user.mealsByWeek > 1 ? `plats` : 'plat'
        await say(
            `<@${user.id}>, il te reste ${user.mealsByWeek} ${mealsByWeekString} cette semaine!`
        )
    }
})

app.message(
    /(commande|commandé) ([0-9]*)/,
    async ({ context, client, message, say }) => {
        if (!isGenericMessageEvent(message)) return
        handleUser(message.user, users, client)
        users[message.user].mealsByWeek = parseInt(context.matches[2])
        await writeUsers(users)
        await say(
            `voila <@${message.user}>, tu as commandé ${
                users[message.user].mealsByWeek
            } plats cette semaine!`
        )
    }
)

app.message(
    /(mange|mangé) ([0-9]*)/,
    async ({ context, client, message, say }) => {
        if (!isGenericMessageEvent(message)) return
        handleUser(message.user, users, client)
        users[message.user].mealsByWeek -= parseInt(context.matches[2])

        await say(
            `voila <@${message.user}>, il te reste ${
                users[message.user].mealsByWeek
            } plats cette semaine!`
        )
    }
)

app.message(/(menu)/, async ({ client, message, say }) => {
    if (!isGenericMessageEvent(message)) return
    handleUser(message.user, users, client)
    // TODO: schedule to fetch meals from Seazon and get the last week's meals from cache
    if (!weekMenu || new Date(weekMenu.date).valueOf() > new Date().valueOf()) {
        const _weekMenu = await readWeekMenu('2022-02-28')

        weekMenu = _weekMenu
    }
    const rawBlocks = weekMenu.meals.map((meal) => mealToBlock(meal, users))
    rawBlocks.forEach(async (block) => {
        await say({ blocks: block, text: 'Menu de la semaine' })
    })
    // let blocks = rawBlocks.reduce((acc, curr) => [...acc, ...curr], [])
    // const headerBlocks = [
    //     TEXT_BLOCK(`Voila <@${message.user}>! Voici les plats de la semaine:`),
    //     DIVIDER_BLOCK,
    // ]
    // blocks = [...headerBlocks, ...blocks]
    // let chunksBlocks = []
    // for (let i = 0; i < blocks.length; i += 4 * 12) {
    //     chunksBlocks.push(blocks.slice(i, i + 4 * 12))
    // }
    // // chunksBlocks[0] = [...headerBlocks, ...chunksBlocks[0]]
    // for (const block of chunksBlocks) {
    //     await say({ blocks: block, text: 'Menu de la semaine' })
    // }
})

app.action('addMeal', async ({ body, action, client, ack, respond, say }) => {
    await ack()
    const currentUser = body.user.id
    if (isBlockButtonElementAction(action)) {
        for (let index = 0; index < weekMenu.meals.length; index++) {
            const aMeal = weekMenu.meals[index]
            if (aMeal.id === action.value) {
                // on a trouvé le plat
                if (aMeal.users.includes(currentUser)) {
                    // on supprime l'utilisateur du plat
                    aMeal.users = aMeal.users.filter(
                        (user: string) => user !== currentUser
                    )
                } else {
                    // on ajoute l'utilisateur au plat
                    aMeal.users.push(currentUser)
                }
                // on enregistre les modifications
                await writeWeekMenu(weekMenu)
                // on envoie un message à l'utilisateur
                await respond({ blocks: mealToBlock(aMeal, users) })
            }
        }
    }
    // rajoute l'utilisateur pour le plat selectionnée: voir
})

app.action(
    /seazon_lunch_eat_(yes|no)_id/,
    async ({ context, body, client, ack, say, payload }) => {
        if (!isBlockButtonElementAction(payload)) return
        if (!isBlockAction(body)) return
        await ack()
        await client.chat.delete({
            ts: body.message?.ts!,
            channel: body.channel?.id!,
        })

        // console.log(context.actionIdMatches)
        const localUser = users[body.user?.id!]
        if (context.actionIdMatches[1] === 'yes') {
            localUser.mealsByWeek -= 1
        }
        localUser.pendingResponses = localUser.pendingResponses.filter(
            (pendingResponse) => pendingResponse.ts !== body.message?.ts!
        )
        writeUsers(users)
        const mealsByWeekString = localUser.mealsByWeek > 1 ? `plats` : 'plat'
        await say(
            `entendu <@${body.user.id}>! il te reste ${localUser.mealsByWeek} ${mealsByWeekString} cette semaine!`
        )
    }
)

startMyApp()
