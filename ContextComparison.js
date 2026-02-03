// 'this' context: global vs object vs lexical (arrows)

// 1. Global context - 'this' refers to global object (window in browser, global in Node)
function globalContext() {
    console.log("Global 'this':", this);
}

// 2. Object method - 'this' refers to the object
const obj = {
    name: "MyObject",
    regularMethod: function () {
        console.log("Regular method 'this':", this.name);
    },
    arrowMethod: () => {
        console.log("Arrow method 'this':", this.name); // 'this' is lexical, not obj
    }
};

// 3. Nested function comparison
const person = {
    name: "Alice",
    hobbies: ["reading", "coding"],

    // Regular function loses 'this' in nested callback
    showHobbiesRegular: function () {
        this.hobbies.forEach(function (hobby) {
            console.log(this.name + " likes " + hobby); // 'this' is undefined/global
        });
    },

    // Arrow function preserves 'this' from parent scope
    showHobbiesArrow: function () {
        this.hobbies.forEach((hobby) => {
            console.log(this.name + " likes " + hobby); // 'this' is person
        });
    }
};

// Test functions
console.log("=== Context Comparison ===");
globalContext();
obj.regularMethod();
obj.arrowMethod();
console.log("\n=== Nested Functions ===");
person.showHobbiesRegular();
person.showHobbiesArrow();