import readline from 'readline'

const questionCallback = (value: string) => {
    const nombre = parseInt(value)
    if (!isNaN(nombre)) {
        console.log(`le nombre :  ${multi(nombre)}!`)
        return retry()
    }
    console.log(`hey connard! j'ai pas compris ${value}!`)
    question()
}

const retryCallback = (reponse = 'y') => {
    if (reponse === 'y' || reponse === '') {
        question()
    } else if (reponse === 'n') {
        input.close()
    } else {
        console.log(
            `hey connard! j'ai pas demandé ${reponse}, j'ai demandé y ou n!`
        )
        retry()
    }
}

console.log('bonjour')
function multi(nombre: number) {
    return nombre * 3
}

const incrementer = (nb: number) => ajouter(nb, 1)
const decrementer = (nb: number) => ajouter(nb, -1)
const ajouter = (nb: number, nb2: number) => nb + nb2

// const nombre = multi(3)
// console.log('valeur du nombre  : ' + nombre)

const question = () => input.question(`saisir un nombre `, questionCallback)

const retry = () => {
    input.question(`continuer ? (y) `, retryCallback)
}

const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

question()
