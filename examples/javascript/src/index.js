import parser from "./math.pegjs";
const input = process.argv.slice(2).join(" ").trim();
const output = parser.parse(input);
console.log(output);
