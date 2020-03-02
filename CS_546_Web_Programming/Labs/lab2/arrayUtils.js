
/* Function to check boundary conditions for array */
function checkArray(arr, checkEmpty){
    if(arr == undefined){
        throw 'Please pass an array as argument!';
    }else if(!(arr instanceof Array)){
        throw 'Please pass valid array as argument!';
    }else if(checkEmpty && arr.length == 0){
        throw 'Array cannot be empty!';
    }else{
        return arr;
    }
} 

// Returns first element of an array
function head(arr){
    arr = checkArray(arr, true);
    return arr[0];
}
// Returns last element of an array
function last(arr){
    arr = checkArray(arr, true)[arr.length-1];
    return arr;
}

// Removes the element at the specified index of the array, and returns the new array
function remove(arr, index){
    checkArray(arr, true);
    if(index == undefined){
        throw 'Please pass valid index!';
    }else if(arr.length <= index){
        throw 'Index is out of bounds!';
    }else{
        return arr.filter(i => i !== arr[index]);
    }
}

// return range from 0 to given number
function range(end, value){
    if(end == undefined){
        throw 'Please pass end number!';
    }else if(typeof(end) != 'number'){
        throw 'end should be a number!';
    }else if(end <= 0){
        throw 'end number should be greated than 0!';
    }else{
        arr = [];
        if(value){
            for(let i=0; i<end; i++){
                arr[i] = value;
            }
        }else{
            for(let j=0; j<end; j++){
                arr[j] = j;
            }
        }        
        return arr;
    }
}

// Will return an object with the count of each unique element in the array
function countElements(arr){
    checkArray(arr, false);

    var countObj = new Object;
    for (let i=0; i<arr.length; i++){
        if(countObj.hasOwnProperty(arr[i])){
            countObj[String(arr[i])] += 1;
        }else{
            countObj[String(arr[i])] = 1;
        }
    }

    return countObj;
}

// Given two arrays, check if they are equal in terms of size and elements and return a boolean
function isEqual(arrOne, arrTwo){
    checkArray(arrOne, false);
    checkArray(arrTwo, false);

    if(arrOne.length != arrTwo.length){
        return false;
    }else{
        for (let i=0; i<arrOne.length; i++){
            if(arrOne[i] !== arrTwo[i]){
                return false;
            }else{
                continue;
            }
        }
        return true;
    }    
}

module.exports = {
    head,
    last,
    countElements,
    isEqual,
    remove,
    range
}