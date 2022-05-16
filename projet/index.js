console.log("bonjour");


function multi  (nombre){
    return nombre * 3
}

function ajouter(nb){
    return nb + 1
}

nombre = multi(3)
console.log("valeur du nombre  : " + nombre)

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  for (i=0 ; i<name ; i++){
  readline.question(`saisir un nombre `, name => {
    console.log(`le nombre :  ${multi(name)}!`);
    readline.close();
  });
  }

  //const age = require('readline').createInterface({
   // input: process.stdin,
   // output: process.stdout,
  //});
  
  //age.question(`saisir un age `, age => {
   // console.log(`ton age:  ${age}!`);
   // readline.close();
  //});



