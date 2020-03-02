const axios = require("axios");

const people_url = 'https://gist.githubusercontent.com/robherley/5112d73f5c69a632ef3ae9b7b3073f78/raw/24a7e1453e65a26a8aa12cd0fb266ed9679816aa/people.json';

async function getPeople(){
    const {data} = await axios.get(people_url);
    return data;
}

function countVowels(text) {
    // counting vowels
    text = text.toLowerCase();

    var count = 0;
    var vowels = ['a', 'e', 'i', 'o', 'u'];

    for(let i = 0; i < text.length; i++){
        if (vowels.includes(text[i]))
            count += 1
    }
    return count;
}

function countConsonents(text) {
    // counting consonents
    text = text.toLowerCase();

    var count = 0;
    var consonents = ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z'];

    for(let i = 0; i < text.length; i++){
        if (consonents.includes(text[i]))
            count += 1
    }
    return count;
}

module.exports = {

    async getPersonById(id) {
        if(id == undefined){throw 'Please pass valid id!'};
        if(typeof(id) != 'number'){throw 'id should be a number!'};
        data = await getPeople();
        var n_people = data.length;  
        if(id < 1 || id > n_people){throw 'id is OutOfBounds!'};
        for(let i=0; i<n_people; i++){
            let temp_person = data[i];
            if(temp_person.id == id){
                return temp_person.firstName + " " + temp_person.lastName;
            }
        }
    },
  
    async lexIndex(index){
        if(index == undefined){throw 'Please pass valid index!'};
        if(typeof(index) != 'number'){throw 'index should be a number!'};

        data = await getPeople();
        var n_people = data.length;  

        if(index < 1 || index > n_people){throw 'index is OutOfBounds!'};

        data.sort(function(a, b){
            var a_lastname=a.lastName.toLowerCase(), b_lastname=b.lastName.toLowerCase();
            if (a_lastname < b_lastname) 
             return -1;
            if (a_lastname > b_lastname)
             return 1;
            return 0; 
        });

        return data[index].firstName + " " + data[index].lastName;
    },

    async firstNameMetrics(){

        data = await getPeople();
        var n_people = data.length;

        var output = {
            totalLetters: 0,
            totalVowels: 0,
            totalConsonants: 0,
            longestName: "",
            shortestName: ""
        };

        // array of firstnames
        var firstNames = [];
        for(let i=0; i<n_people; i++){
            firstNames[i] = data[i].firstName;
        }

        // count of letters for each firstname
        let firstNames_letters = firstNames.map(x => {
            return x.length;
        });

        // count of vowels for each firstname
        let firstNames_vowels = firstNames.map(x => {
            return countVowels(x);
        });

        // count of consonents for each firstname
        let firstNames_consonents = firstNames.map(x => {
            return countConsonents(x);
        });

        // total letters
        output.totalLetters = firstNames_letters.reduce((total, newValue) => {
            const newTotal = total + newValue;
            return newTotal;
        }, 0);

        // total vowels
        output.totalVowels = firstNames_vowels.reduce((total, newValue) => {
            const newTotal = total + newValue;
            return newTotal;
        }, 0);

        // total consonents
        output.totalConsonants = firstNames_consonents.reduce((total, newValue) => {
            const newTotal = total + newValue;
            return newTotal;
        }, 0);

        // longest name
        output.longestName = firstNames[firstNames_letters.indexOf(Math.max(...firstNames_letters))];

        // shortest name
        output.shortestName = firstNames[firstNames_letters.indexOf(Math.min(...firstNames_letters))];

        return output;
    },
    getPeople
}