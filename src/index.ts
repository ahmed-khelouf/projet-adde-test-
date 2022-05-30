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
import { fetchMealsFromSeazon } from './services/SlackService'
import { DateTime } from 'luxon'
import { getMenuForDate } from './managers/MenuManager'

// GlobalVar
let users: Record<string, User> = {}

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


//  app.start()
//  .catch(console.error);


        // app.event('app_home_opened', async ({ event, say }) => {  
        //     await say(`BIENVENUE :smiley:<@${event.user}>!:smiley:`);
        // });
       


        // const SlackBot = require('slackbots')
        // const bot = new SlackBot ({
        //     token :process.env.SLACK_BOT_TOKEN,
        //     name: ' Seazon',
        // })
        // bot.on('start' , () => {
        //     const params = {
        //         icon_emoji : ':smiley:',
        //     }

        //     bot.postMessageToChannel(
        //         'Seazon',
        //         "Salut",
        //         params,
        //     )
        // })

        
   // Listen for users opening your App Home
app.event('app_home_opened', async ({ event, client, logger }) => {
    try {
      // Call views.publish with the built-in client
      const result = await client.views.publish({
        // Use the user ID associated with the event
        user_id: event.user,
        view: {
          // Home tabs must be enabled in your app configuration page under "App Home"
          "type": "home",
          blocks: [
            {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Bienvenue <@" + event.user + "> :house:*"
                }
              },
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": "Du lundi au mercredi, vous aurez la possibilité de choisir vos plats.",
                    "emoji": true
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Cliquer sur le bouton pour voir le menu sur le site ."
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Click Me",
                        "emoji": true
                    },
                    "value": "click_me_123",
                    "url": "https://seazon.fr/menu",
                    "action_id": "button-action"
                }
            }
        ]
    }
});
      logger.info(result);
    }
    catch (error) {
      logger.error(error);
    }
  });         
              
             
       

app.message(
    /^(hi|hello|hey|wesh|yo|salut).*/,
    async ({ client, context, message, say }) => {
        if (!isGenericMessageEvent(message)) return
        handleUser(message.user, users, client)
        const greeting = context.matches[1]
        await say(`${greeting}, <@${message.user}>`)
    }
)
// app.event(
//     /^(t).*/,
//     async ({ client, context, message, say }) => {
//         if (!isGenericMessageEvent(message)) return
//         handleUser(message, users, client)
//         const greeting = context.matches[1]
//         await say(`${greeting}, <@${message}>`)
//     }
// )

app.message(/^(information).*/, async ({ client, context, message, say }) => {
    if (!isGenericMessageEvent(message)) return
    handleUser(message.user, users, client)
    for (const userID in users) {
        const user = users[userID]
        await say(`<@${user.id}>, info ${user.id} + ${user.mealsByWeek} `)
    }
})


// app.event('app_home_opened', async ({ event, say }) => {  
//     for (const userID in users) {
//         const user = users[userID]
//         const mealsByWeekString = user.mealsByWeek > 1 ? `plats` : 'plat'
//         if (user.mealsByWeek > 0) {
//             await say(
//                 `<@${user.id}>, il te reste ${user.mealsByWeek} ${mealsByWeekString} cette semaine!`
//             )
//         } else {
//             user.mealsByWeek <= 0
//             await say(`<@${user.id}>, TU AS TOUT MANGE  !`)
//         }
//     }

// });
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
        if (user.mealsByWeek > 0) {
            await say(
                `<@${user.id}>, il te reste ${user.mealsByWeek} ${mealsByWeekString} cette semaine!`
            )
        } else {
            user.mealsByWeek <= 0
            await say(`<@${user.id}>, TU AS TOUT MANGE  !`)
        }
    }
})
app.message(/(credit) ([0-9]*)/, async ({ context, client, message, say }) => {
    if (!isGenericMessageEvent(message)) return
    handleUser(message.user, users, client)
    users[message.user].credits = parseInt(context.matches[2])
    await writeUsers(users)
    await say(
        ` <@${message.user}>,  ${
            users[message.user].credits
        } credit ajouté pour la semaine`
    )
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
        const total =
            users[message.user].credits - users[message.user].mealsByWeek
        await say(
            `voila <@${message.user}> ${total} nombre de credits restant !`
        )
        if (users[message.user].mealsByWeek > users[message.user].credits) {
            await say(
                `voila <@${message.user}> TU ES ENDETTE DE  ${total} CREDIT `
            )
        }
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

app.message(/^(help).*/, async ({ client, context, message, say }) => {
    if (!isGenericMessageEvent(message)) return
    await say(
        'voici les commandes disponible : \n hi / hello / hey / wesh /yo / salut \n total \n commande / commandé \n mange / mangé'
    )
    const greeting = context.matches[1]
    await say(`${greeting}, <@${message.user}>`)
})

app.message(
    /menu( ([0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9]))?/,
    async ({ client, message, context, say }) => {
        if (!isGenericMessageEvent(message)) return
        handleUser(message.user, users, client)
        const regexMatches: RegExpMatchArray = context.matches
        const matchingInput = regexMatches.input
        const requestedDateRegexMatches = matchingInput?.match(
            /([0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])/
        )
        const requestedDate =
            requestedDateRegexMatches && requestedDateRegexMatches.length > 0
                ? DateTime.fromISO(requestedDateRegexMatches[0])
                : undefined
        const weekMenu = await getMenuForDate(requestedDate)
        const rawBlocks = weekMenu.meals.map((meal) =>
            mealToBlock(weekMenu.date, meal, users)
        )
        rawBlocks.forEach(async (block) => {
            await say({ blocks: block, text: 'Menu de la semaine' })
        })
    }
)

app.action(
    /addMeal-(([0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9]))/,
    async ({ body, action, client, context, ack, respond, say }) => {
        await ack()

        const currentUser = body.user.id
        const targetMenuDate = context.actionIdMatches[1]
        const targetMenuISODate = DateTime.fromISO(targetMenuDate)
        const _weekMenu = await getMenuForDate(targetMenuISODate)
        if (isBlockButtonElementAction(action)) {
            for (let index = 0; index < _weekMenu.meals.length; index++) {
                const aMeal = _weekMenu.meals[index]
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
                    await writeWeekMenu(_weekMenu)
                    // on envoie un message à l'utilisateur
                    await respond({
                        blocks: mealToBlock(_weekMenu.date, aMeal, users),
                    })
                }
            }
        }
        // rajoute l'utilisateur pour le plat selectionnée: voir
    }
)

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

