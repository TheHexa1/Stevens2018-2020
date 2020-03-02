const axios = require("axios");
const people = require('./people');

const weather_url = 'https://gist.githubusercontent.com/robherley/1b950dc4fbe9d5209de4a0be7d503801/raw/eee79bf85970b8b2b80771a66182aa488f1d7f29/weather.json';

async function getWeather(){
    const {data} = await axios.get(weather_url);
    return data;
}

module.exports = {
     
    async shouldTheyGoOutside(firstName, lastName){

        if(!firstName || !lastName){throw 'Please pass both firstname and lastname!'}
        if(typeof(firstName) != 'string'){throw 'firstName should be string!'}
        if(typeof(lastName) != 'string'){throw 'lastName should be string!'}

        people_data = await people.getPeople();
        var n_people = people_data.length;  
        var person_zip_code;

        for(let i=0; i<n_people; i++){
            let temp_person = people_data[i];
            if(temp_person.firstName.toLowerCase() == firstName.toLowerCase() && temp_person.lastName.toLowerCase() == lastName.toLowerCase()){
                person_zip_code = temp_person.zip;
            }
        }

        if(person_zip_code == undefined){throw `There is no person named ${firstName} ${lastName}!`}

        weather_data = await getWeather();
        var n_weather = weather_data.length;

        for(let j=0; j<n_weather; j++){
            let temp_weather = weather_data[j];
            if(temp_weather.zip == person_zip_code){
                if(temp_weather.temp >= 34){
                    return `Yes, ${firstName} should go outside.`
                }else{
                    return `No, ${firstName} should not go outside.`
                }
            }
        }

    }
}