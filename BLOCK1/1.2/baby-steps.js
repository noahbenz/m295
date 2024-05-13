
const args = process.argv.slice(2);

let sum = 0;

for (let i = 0; i < args.length; i++) {
    // Convert each argument to a number and add it to the sum
    sum += Number(args[i]);
}

console.log(sum);
