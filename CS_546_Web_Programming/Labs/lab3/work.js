const axios = require("axios");
const people = require('./people');

const work_url = 'https://gist.githubusercontent.com/robherley/61d560338443ba2a01cde3ad0cac6492/raw/8ea1be9d6adebd4bfd6cf4cc6b02ad8c5b1ca751/work.json';

async function getWorkDetails(){
    const {data} = await axios.get(work_url);
    return data;
}

module.exports = {
     
    async whereDoTheyWork(firstName, lastName){

        if(!firstName || !lastName){throw 'Please pass both firstname and lastname!'}
        if(typeof(firstName) != 'string'){throw 'firstName should be string!'}
        if(typeof(lastName) != 'string'){throw 'lastName should be string!'}

        people_data = await people.getPeople();
        var n_people = people_data.length;  
        var person_ssn;

        for(let i=0; i<n_people; i++){
            let temp_person = people_data[i];
            if(temp_person.firstName.toLowerCase() == firstName.toLowerCase() && temp_person.lastName.toLowerCase() == lastName.toLowerCase()){
                person_ssn = temp_person.ssn;
            }
        }

        if(person_ssn == undefined){throw `There is no person named ${firstName} ${lastName}!`}

        work_data = await getWorkDetails();
        var n_work = work_data.length;

        for(let j=0; j<n_work; j++){
            let temp_work = work_data[j];
            if(temp_work.ssn == person_ssn){  
                if(temp_work.willBeFired == true){
                    return `${firstName} ${lastName} - ${temp_work.jobTitle} at ${temp_work.company}. They will be fired.`
                }else{
                    return `${firstName} ${lastName} - ${temp_work.jobTitle} at ${temp_work.company}. They will not be fired.`
                }  
            }            
        }
    },

    async findTheHacker(ip){
        if(!ip){throw 'Please pass valid ip!'};
        if(typeof(ip) != 'string'){throw 'ip should be string!'}

        work_data = await getWorkDetails();
        var n_work = work_data.length;  
        var person_ssn;

        for(let i=0; i<n_work; i++){
            let temp_person = work_data[i];
            if(temp_person.ip == ip){
                person_ssn = temp_person.ssn;
            }
        }

        if(person_ssn == undefined){throw `There is no person with ip ${ip}!`}

        people_data = await people.getPeople();
        var n_people = people_data.length;  

        for(let i=0; i<n_people; i++){
            let temp_person = people_data[i];
            if(temp_person.ssn == person_ssn){
                return `${temp_person.firstName} ${temp_person.lastName} is the hacker!`;
            }
        }
    }
}