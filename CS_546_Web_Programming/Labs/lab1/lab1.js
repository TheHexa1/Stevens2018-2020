const questionOne = function questionOne(arr) {
    // Implement question 1 here
    // Sum of sqaures

    let squaredArray = arr.map(x => {
        return x * x;
      });

    let sumOfSquares = squaredArray.reduce((total, newValue) => {
        const newTotal = total + newValue;
        return newTotal;
      }, 0);

    return sumOfSquares
}

const questionTwo = function questionTwo(num) { 
    // Implement question 2 here
    // fibonacci

    let output;

    if (num < 1)
        output = 0;
    else if (num === 1)
        output = 1;
    else
        output = questionTwo(num-1) + questionTwo(num-2);

    return output;
}

const questionThree = function questionThree(text) {
    // Implement question 3 here
    // counting vowels

    var count = 0;
    var vowels = ['a', 'e', 'i', 'o', 'u'];

    for(let i = 0; i < text.length; i++){
        if (vowels.includes(text[i]))
            count += 1
    }
    return count;
}

const questionFour = function questionFour(num) {
    // Implement question 4 here
    // factorial

    if (num < 0)
        return NaN;
    else if (num == 0)
        return 1;
    else 
        return num * questionFour(num-1);
}

module.exports = {
    firstName: "Viveksinh", 
    lastName: "Solanki", 
    studentId: "10441787",
    questionOne,
    questionTwo,
    questionThree,
    questionFour
};