// a simple grammar accepting expressions like
// "1 + 2" or "2 * (3.4 + -5)", returning the
// computed value.

START =
  Additive

Additive
  = left:Multiplicative WS op:("+" / "-") WS right:Additive { return op === "+" ? left + right : left - right; }
  / Multiplicative

Multiplicative
  = left:Term WS op:("*" / "/") WS right:Multiplicative { return op === "*" ? left * right : left / right; }
  / Term

Term "numeric literal or parenthetical expression"
  = Number
  / "(" value:Additive ")" { return value; }

Number "simple numeric literal"
  = "-"? [0-9]+ ("."[0-9]+)? { return parseFloat(text()); }

WS "optional whitespace"
  = [ \t\n\r]*
