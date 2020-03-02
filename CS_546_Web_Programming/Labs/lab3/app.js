const people = require('./people');
const weather = require('./weather');
const work = require('./work');

async function main(){

    try{
        console.log(await people.getPersonById(43));
    }catch(e){
        console.log (e);
    }

    try{
        console.log(await people.lexIndex(2));
    }catch(e){
        console.log (e);
    }

    try{
        console.log(await people.firstNameMetrics());
    }catch(e){
        console.log (e);
    }

    try{
        console.log(await weather.shouldTheyGoOutside("Bob", "Smith"));
    }catch(e){
        console.log (e);
    }

    try{
        console.log(await work.whereDoTheyWork("Demetra", "Durrand"));
    }catch(e){
        console.log (e);
    }

    try{
        console.log(await work.findTheHacker("185.180.242.112"));
    }catch(e){
        console.log (e);
    }
}

main();
