// Utility Functions

function sumArray(arr) {
    return arr.reduce((sum, num) => sum + num, 0);
}


function countFrequency(arr) {
    const frequency = {};
    for (let item of arr) {
        frequency[item] = (frequency[item] || 0) + 1;
    }
    return frequency;
}

function reverseString(str) {
    return str.split('').reverse().join('');
}

console.log('Sum of [1, 2, 3, 4, 5]:', sumArray([1, 2, 3, 4, 5]));
console.log('Frequency of [a, b, a, c, b, a]:', countFrequency(['a', 'b', 'a', 'c', 'b', 'a']));
console.log('Reverse of "hello":', reverseString('hello'));