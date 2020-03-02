
var arrUtils = require('./arrayUtils');

/* Function to check boundary conditions for given string */
function checkString(string){
    if(string == undefined){
        throw 'Please pass string as argument!';
    }else if(typeof(string) != 'string'){
        throw 'Please pass valid string as argument!';
    }else{
        return string;
    }
} 

// Given a string, capitalize the first letter and lowercase the remaining characters
function capitalize(string){
    checkString(string);
    lower_cased_str = string.toLowerCase();
    return lower_cased_str.charAt(0).toUpperCase() + lower_cased_str.substring(1, lower_cased_str.length);
}

// Given string and num, repeat the string num amount of times
function repeat(string, num){
    checkString(string);

    if(num == undefined){
        throw 'Please pass valid number!';
    }else if(num < 0){
        throw 'number should be non-negative!';
    }else{
        repeated_str = "";
        for(let i=0; i<num; i++){
            repeated_str += string; 
        }
        return repeated_str;
    }
}

// Returns an object that has the mapping of a character and the amount of times it appears in a string
function countChars(string){
    checkString(string);
    return arrUtils.countElements(string.split(""));
}

// export functions
module.exports = {
    capitalize,
    repeat,
    countChars
}