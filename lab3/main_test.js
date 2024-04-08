const c = new Calculator(), d = Math, e = Error;
const t = (op, cases) => describe(`Calculator.${op}() Test`, () => cases.forEach(({ a, out, msg }) => it(`${a} should return ${out}`, () => (out === e) ? assert.throws(() => c[op](a), out, msg) : assert.strictEqual(c[op](a), out))));
