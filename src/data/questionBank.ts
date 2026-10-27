import { Question } from '../types/game';

export const QUESTION_BANK: Question[] = [
  // JAVASCRIPT - EASY (7 questions)
  {
    id: 'js-e1',
    topic: 'javascript',
    difficulty: 'easy',
    title: 'Strict Equality vs Type Coercion',
    codeSnippet: 'const val1 = 5;\nconst val2 = "5";\nconsole.log(val1 == val2, val1 === val2);',
    codeLanguage: 'javascript',
    question: 'What gets logged to the console?',
    options: [
      'true true',
      'true false',
      'false false',
      'false true'
    ],
    correctIndex: 1,
    explanation: 'The loose equality operator `==` coerces string "5" into the number 5, returning true. The strict equality operator `===` checks both value and type, returning false.',
    bugType: 'Implicit Coercion'
  },
  {
    id: 'js-e2',
    topic: 'javascript',
    difficulty: 'easy',
    title: 'Type of Null Trap',
    codeSnippet: 'const user = null;\nconsole.log(typeof user);',
    codeLanguage: 'javascript',
    question: 'What is the evaluated output of typeof user?',
    options: [
      '"null"',
      '"undefined"',
      '"object"',
      '"boolean"'
    ],
    correctIndex: 2,
    explanation: 'This is a famous historical bug in JavaScript from its first implementation where values were represented with type tags; null had a tag of 0 (same as object). Hence, typeof null returns "object".',
    bugType: 'Historical Quirks'
  },
  {
    id: 'js-e3',
    topic: 'javascript',
    difficulty: 'easy',
    title: 'Array Push Return Value',
    codeSnippet: 'const bugs = ["SyntaxError", "TypeError"];\nconst result = bugs.push("RangeError");\nconsole.log(result);',
    codeLanguage: 'javascript',
    question: 'What is stored in the `result` variable?',
    options: [
      '["SyntaxError", "TypeError", "RangeError"]',
      '3',
      'undefined',
      '"RangeError"'
    ],
    correctIndex: 1,
    explanation: '`Array.prototype.push()` mutates the array in-place and returns the NEW length of the array (3), not the modified array or the inserted element.',
    bugType: 'API Return Invariant'
  },
  {
    id: 'js-e4',
    topic: 'javascript',
    difficulty: 'easy',
    title: 'Var Hoisting Shadowing',
    codeSnippet: 'console.log(score);\nvar score = 100;',
    codeLanguage: 'javascript',
    question: 'What happens when this snippet executes?',
    options: [
      'ReferenceError: score is not defined',
      'Logs undefined',
      'Logs 100',
      'Throws TypeError'
    ],
    correctIndex: 1,
    explanation: '`var` declarations are hoisted to the top of their scope and initialized with `undefined`. The assignment `score = 100` remains at its original location.',
    bugType: 'Variable Hoisting'
  },
  {
    id: 'js-e5',
    topic: 'javascript',
    difficulty: 'easy',
    title: 'NaN Equality Self-Check',
    codeSnippet: 'const calculation = 0 / 0;\nconsole.log(calculation === NaN);',
    codeLanguage: 'javascript',
    question: 'What does this check print?',
    options: [
      'true',
      'false',
      'TypeError',
      'undefined'
    ],
    correctIndex: 1,
    explanation: 'By IEEE 754 floating point specification, `NaN` is not equal to anything, including another `NaN`. You should always use `Number.isNaN(calculation)` instead.',
    bugType: 'NaN Comparison Failure'
  },
  {
    id: 'js-e6',
    topic: 'javascript',
    difficulty: 'easy',
    title: 'Array Sort Lexicographical Default',
    codeSnippet: 'const numbers = [10, 5, 25, 1];\nnumbers.sort();\nconsole.log(numbers);',
    codeLanguage: 'javascript',
    question: 'What is the order of elements after sorting?',
    options: [
      '[1, 5, 10, 25]',
      '[1, 10, 25, 5]',
      '[25, 10, 5, 1]',
      '[5, 10, 25, 1]'
    ],
    correctIndex: 1,
    explanation: 'By default, `Array.prototype.sort()` converts elements to strings and compares UTF-16 code units. "10" precedes "25" and "5", resulting in `[1, 10, 25, 5]`. Provide `(a, b) => a - b` for numeric sorting.',
    bugType: 'Unintended String Comparison'
  },
  {
    id: 'js-e7',
    topic: 'javascript',
    difficulty: 'easy',
    title: 'Const Object Mutation',
    codeSnippet: 'const hunter = { level: 1 };\nhunter.level = 2;\nhunter = { level: 3 };',
    codeLanguage: 'javascript',
    question: 'At which line does an error occur, if any?',
    options: [
      'hunter.level = 2 throws an error',
      'hunter = { level: 3 } throws TypeError',
      'Both throw errors',
      'No error; objects are always mutable'
    ],
    correctIndex: 1,
    explanation: '`const` prevents re-assigning the variable identifier itself (`hunter = ...`), but does not freeze the internal properties of objects. Mutating `hunter.level` is legal.',
    bugType: 'Const Reassignment'
  },

  // JAVASCRIPT - MEDIUM (7 questions)
  {
    id: 'js-m1',
    topic: 'javascript',
    difficulty: 'medium',
    title: 'Classic Loop Closure with Var',
    codeSnippet: 'for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 50);\n}',
    codeLanguage: 'javascript',
    question: 'What prints when the timeouts trigger?',
    options: [
      '0, 1, 2',
      '3, 3, 3',
      '2, 2, 2',
      'undefined, undefined, undefined'
    ],
    correctIndex: 1,
    explanation: 'Because `var` is function-scoped rather than block-scoped, all three timer callbacks close over the exact same variable `i`. By the time the event loop fires them, `i` has incremented to 3.',
    bugType: 'Closure Scope Leak'
  },
  {
    id: 'js-m2',
    topic: 'javascript',
    difficulty: 'medium',
    title: 'Arrow Function This Binding',
    codeSnippet: 'const hunter = {\n  tag: "Elite",\n  getTag: () => this.tag\n};\nconsole.log(hunter.getTag());',
    codeLanguage: 'javascript',
    question: 'What is logged when `hunter.getTag()` is executed in standard module code?',
    options: [
      '"Elite"',
      'undefined',
      'TypeError: this is not defined',
      'ReferenceError: tag is undefined'
    ],
    correctIndex: 1,
    explanation: 'Arrow functions do not have their own `this` binding; they capture `this` from the enclosing lexical context (e.g. global or undefined in modules), not the object literal `hunter`.',
    bugType: 'Lexical This Misunderstanding'
  },
  {
    id: 'js-m3',
    topic: 'javascript',
    difficulty: 'medium',
    title: 'Microtasks vs Macrotasks Scheduling',
    codeSnippet: 'console.log("1");\nsetTimeout(() => console.log("2"), 0);\nPromise.resolve().then(() => console.log("3"));\nconsole.log("4");',
    codeLanguage: 'javascript',
    question: 'What is the precise execution sequence?',
    options: [
      '1, 2, 3, 4',
      '1, 4, 3, 2',
      '1, 4, 2, 3',
      '1, 3, 4, 2'
    ],
    correctIndex: 1,
    explanation: 'Synchronous statements run first ("1", "4"). Then the microtask queue (Promise `.then`) drains before any macrotask (setTimeout). Hence "3" executes before "2".',
    bugType: 'Event Loop Order'
  },
  {
    id: 'js-m4',
    topic: 'javascript',
    difficulty: 'medium',
    title: 'Shallow Copy Object Reference Trap',
    codeSnippet: 'const config1 = { env: "prod", flags: { debug: false } };\nconst config2 = { ...config1 };\nconfig2.flags.debug = true;\nconsole.log(config1.flags.debug);',
    codeLanguage: 'javascript',
    question: 'What is the value of `config1.flags.debug`?',
    options: [
      'false',
      'true',
      'undefined',
      'TypeError'
    ],
    correctIndex: 1,
    explanation: 'Object spread `{ ...config1 }` performs a shallow copy. Nested objects like `flags` are copied by memory reference, so modifying `config2.flags.debug` directly alters `config1.flags.debug`.',
    bugType: 'Shallow Clone Mutation'
  },
  {
    id: 'js-m5',
    topic: 'javascript',
    difficulty: 'medium',
    title: 'Delete Operator on Variables',
    codeSnippet: 'let bugCount = 42;\nconst result = delete bugCount;\nconsole.log(result, bugCount);',
    codeLanguage: 'javascript',
    question: 'What does this output in non-strict mode?',
    options: [
      'true undefined',
      'false 42',
      'true 42',
      'SyntaxError'
    ],
    correctIndex: 1,
    explanation: 'The `delete` operator is designed strictly for object properties. When called on variables declared with `var`, `let`, or `const`, it returns `false` and does not delete the variable.',
    bugType: 'Invalid Delete Target'
  },
  {
    id: 'js-m6',
    topic: 'javascript',
    difficulty: 'medium',
    title: 'Truthy Check on Empty Arrays',
    codeSnippet: 'const activeBugs = [];\nif (activeBugs) {\n  console.log(activeBugs == false ? "A" : "B");\n}',
    codeLanguage: 'javascript',
    question: 'What character gets logged to the console?',
    options: [
      '"A"',
      '"B"',
      'Nothing; if block is false',
      'TypeError'
    ],
    correctIndex: 0,
    explanation: 'In boolean contexts (`if (activeBugs)`), an empty array is truthy. But when comparing `activeBugs == false`, `[]` is coerced to `""` then `0`, and `false` is coerced to `0`, making `0 == 0` true! So it prints "A".',
    bugType: 'Boolean vs Coercion Asymmetry'
  },
  {
    id: 'js-m7',
    topic: 'javascript',
    difficulty: 'medium',
    title: 'Async Function Return Value',
    codeSnippet: 'async function fetchStatus() {\n  return "OK";\n}\nconst status = fetchStatus();\nconsole.log(typeof status, status);',
    codeLanguage: 'javascript',
    question: 'What is the type and identity of `status`?',
    options: [
      '"string" "OK"',
      '"object" Promise { "OK" }',
      '"function" [Function: fetchStatus]',
      '"undefined" undefined'
    ],
    correctIndex: 1,
    explanation: 'Any function declared with `async` automatically wraps its return value in a resolved Promise. Without `await`, you receive the Promise instance directly.',
    bugType: 'Missing Await Unwrapping'
  },

  // JAVASCRIPT - HARD (4 questions)
  {
    id: 'js-h1',
    topic: 'javascript',
    difficulty: 'hard',
    title: 'Temporal Dead Zone in Default Parameters',
    codeSnippet: 'function compute(a = b, b = 2) {\n  return a + b;\n}\ncompute();',
    codeLanguage: 'javascript',
    question: 'What happens when `compute()` is invoked with no arguments?',
    options: [
      'Returns 4',
      'Returns NaN',
      'Throws ReferenceError: Cannot access "b" before initialization',
      'Returns 2'
    ],
    correctIndex: 2,
    explanation: 'Function parameters have their own scope and are evaluated left-to-right. When evaluating `a = b`, variable `b` has not yet been initialized and sits in the Temporal Dead Zone (TDZ).',
    bugType: 'Parameter TDZ Violation'
  },
  {
    id: 'js-h2',
    topic: 'javascript',
    difficulty: 'hard',
    title: 'WeakMap Key Garbage Collection',
    codeSnippet: 'let element = { id: "bug_node" };\nconst cache = new WeakMap();\ncache.set(element, "data");\n// Can primitive strings be WeakMap keys?',
    codeLanguage: 'javascript',
    question: 'What happens if you execute `cache.set("bug_key", "meta")`?',
    options: [
      'Key is stored normally',
      'Throws TypeError: Invalid value used as weak map key',
      'Key is converted into a Symbol',
      'Silent failure returning false'
    ],
    correctIndex: 1,
    explanation: 'WeakMap keys must be garbage-collectable objects (or non-registered symbols in modern specs). Primitive strings cannot be tracked for weak reference garbage collection and throw a TypeError.',
    bugType: 'Weak Reference Contract'
  },
  {
    id: 'js-h3',
    topic: 'javascript',
    difficulty: 'hard',
    title: 'Generator Delegation and Finally Clean-up',
    codeSnippet: 'function* generator() {\n  try {\n    yield 1;\n    yield 2;\n  } finally {\n    console.log("Cleanup");\n  }\n}\nconst gen = generator();\ngen.next();\ngen.return();',
    codeLanguage: 'javascript',
    question: 'What is logged when `gen.return()` is called?',
    options: [
      'Nothing until gen.next() is called again',
      'Logs "Cleanup"',
      'Throws an UncaughtException',
      'Logs undefined'
    ],
    correctIndex: 1,
    explanation: 'Calling `.return()` on an active generator immediately terminates the execution context but guarantees that any surrounding `finally` blocks are executed before closing.',
    bugType: 'Generator Lifecycle'
  },
  {
    id: 'js-h4',
    topic: 'javascript',
    difficulty: 'hard',
    title: 'Proxy Revocation Trap',
    codeSnippet: 'const { proxy, revoke } = Proxy.revocable({ bug: "Z-1" }, {});\nconsole.log(proxy.bug);\nrevoke();\nconsole.log(proxy.bug);',
    codeLanguage: 'javascript',
    question: 'What happens at the second `console.log(proxy.bug)`?',
    options: [
      'Logs undefined',
      'Logs "Z-1"',
      'Throws TypeError: Cannot perform "get" on a proxy that has been revoked',
      'Logs null'
    ],
    correctIndex: 2,
    explanation: 'Once a revocable proxy is revoked via `revoke()`, any subsequent operations on the proxy instance immediately throw a TypeError to safeguard access.',
    bugType: 'Revoked Proxy Invariant'
  },

  // REACT - EASY (6 questions)
  {
    id: 'react-e1',
    topic: 'react',
    difficulty: 'easy',
    title: 'State Mutating Anti-Pattern',
    codeSnippet: 'const [bugs, setBugs] = useState(["Bug 1", "Bug 2"]);\n\nfunction addBug() {\n  bugs.push("Bug 3");\n  setBugs(bugs);\n}',
    codeLanguage: 'typescript',
    question: 'Why does the component fail to re-render when `addBug` runs?',
    options: [
      'push() is an invalid JavaScript method',
      'setBugs requires a callback function',
      'React uses Object.is comparison; the array reference did not change',
      'setBugs is synchronous and conflicts with push()'
    ],
    correctIndex: 2,
    explanation: 'React compares state updates using shallow referential equality (`Object.is`). Mutating the existing array in-place preserves the same memory reference, so React bails out of re-rendering. Use `setBugs([...bugs, "Bug 3"])`.',
    bugType: 'Direct State Mutation'
  },
  {
    id: 'react-e2',
    topic: 'react',
    difficulty: 'easy',
    title: 'Missing Key Prop in Lists',
    codeSnippet: 'function BugList({ items }) {\n  return (\n    <ul>\n      {items.map(bug => <li>{bug.name}</li>)}\n    </ul>\n  );\n}',
    codeLanguage: 'typescript',
    question: 'What issue arises from omitting `key` in dynamic lists?',
    options: [
      'Compilation fails with a fatal build error',
      'React console warning and erratic DOM node reconciliation during reorders',
      'List fails to render entirely on the first pass',
      'Memory leak in the browser V8 engine'
    ],
    correctIndex: 1,
    explanation: 'Without stable keys, React falls back to index-based reconciliation, which causes inefficient re-renders and subtle UI bugs when items are reordered, inserted, or removed.',
    bugType: 'Reconciliation Reconciliation Key'
  },
  {
    id: 'react-e3',
    topic: 'react',
    difficulty: 'easy',
    title: 'Conditional Hook Invocation Bug',
    codeSnippet: 'function BugTracker({ isOnline }) {\n  if (isOnline) {\n    useEffect(() => { subscribe(); }, []);\n  }\n  return <div>Tracker</div>;\n}',
    codeLanguage: 'typescript',
    question: 'Why does this trigger a React runtime error?',
    options: [
      'useEffect cannot be used with arrow functions',
      'Hooks must not be called inside conditions, loops, or nested functions',
      'isOnline is a reserved keyword',
      'The return statement must come before conditions'
    ],
    correctIndex: 1,
    explanation: 'The Rules of Hooks require hooks to be called in the exact same order on every render. Putting `useEffect` inside an `if` block violates the internal hook linked-list order.',
    bugType: 'Rule of Hooks Violation'
  },
  {
    id: 'react-e4',
    topic: 'react',
    difficulty: 'easy',
    title: 'Asynchronous State Update Batching',
    codeSnippet: 'const [score, setScore] = useState(0);\n\nfunction incrementTwice() {\n  setScore(score + 1);\n  setScore(score + 1);\n}',
    codeLanguage: 'typescript',
    question: 'If `score` is initially 0, what is its value after `incrementTwice` finishes?',
    options: [
      '2',
      '1',
      '0',
      'NaN'
    ],
    correctIndex: 1,
    explanation: 'In a single render pass, `score` is captured as 0. Both calls evaluate `0 + 1`, effectively overwriting each other. To queue successive updates, use the functional updater: `setScore(prev => prev + 1)`.',
    bugType: 'Stale State Capture'
  },
  {
    id: 'react-e5',
    topic: 'react',
    difficulty: 'easy',
    title: 'Immediate Handler Execution in JSX',
    codeSnippet: 'function RestartButton({ onReset }) {\n  // What bug is present below?\n  return <button onClick={onReset()}>Restart</button>;\n}',
    codeLanguage: 'typescript',
    question: 'What bug does this button code cause?',
    options: [
      'The button cannot be clicked at all',
      'onReset is invoked immediately during render instead of on click',
      'Syntax error in JSX attributes',
      'The component renders an empty button'
    ],
    correctIndex: 1,
    explanation: 'Passing `onClick={onReset()}` invokes the function immediately when the component renders. It must be passed as a reference: `onClick={onReset}` or `onClick={() => onReset()}`.',
    bugType: 'Premature Function Call'
  },
  {
    id: 'react-e6',
    topic: 'react',
    difficulty: 'easy',
    title: 'React Fragment Shorthand with Key',
    codeSnippet: 'items.map(item => (\n  <>\n    <dt>{item.term}</dt>\n    <dd>{item.desc}</dd>\n  </>\n));',
    codeLanguage: 'typescript',
    question: 'Why can you not attach a `key` prop to the fragment shorthand `<> ... </>`?',
    options: [
      'Fragments cannot contain dt/dd tags',
      'Empty fragment syntax `<> ... </>` does not support any attributes or keys',
      'Keys are prohibited on non-div elements',
      'React automatically generates keys for fragments'
    ],
    correctIndex: 1,
    explanation: 'The short `<>` syntax does not accept any attributes or keys. When mapping lists requiring a key, you must use explicit `<React.Fragment key={item.id}>`.',
    bugType: 'JSX Fragment Syntax'
  },

  // REACT - MEDIUM (7 questions)
  {
    id: 'react-m1',
    topic: 'react',
    difficulty: 'medium',
    title: 'Stale Closure in useEffect Timer',
    codeSnippet: 'const [seconds, setSeconds] = useState(0);\nuseEffect(() => {\n  const id = setInterval(() => {\n    setSeconds(seconds + 1);\n  }, 1000);\n  return () => clearInterval(id);\n}, []);',
    codeLanguage: 'typescript',
    question: 'What happens to the counter after 3 seconds have passed?',
    options: [
      'Counter displays 3',
      'Counter remains stuck at 1',
      'Counter displays NaN',
      'Throws MaximumUpdateDepthExceeded'
    ],
    correctIndex: 1,
    explanation: 'The interval callback closes over `seconds` with its initial value (0). Every second it runs `setSeconds(0 + 1)`, repeatedly setting the state to 1. Fix it with `setSeconds(prev => prev + 1)`.',
    bugType: 'Stale Closure Effect'
  },
  {
    id: 'react-m2',
    topic: 'react',
    difficulty: 'medium',
    title: 'Infinite Loop in useEffect Dependency Array',
    codeSnippet: 'const [filter, setFilter] = useState({ active: true });\nuseEffect(() => {\n  setFilter({ active: false });\n}, [filter]);',
    codeLanguage: 'typescript',
    question: 'What happens when this component mounts?',
    options: [
      'Filter updates to false once and halts',
      'Infinite re-render loop exceeding max update depth',
      'No re-render occurs because the keys match',
      'Console logs an unhandled promise rejection'
    ],
    correctIndex: 1,
    explanation: 'Setting state inside `useEffect` with the updated object in the dependency array produces a new object reference on every pass, re-triggering the effect endlessly.',
    bugType: 'Infinite Re-render Loop'
  },
  {
    id: 'react-m3',
    topic: 'react',
    difficulty: 'medium',
    title: 'useCallback with Missing Dependencies',
    codeSnippet: 'const [multiplier, setMultiplier] = useState(2);\n\nconst calculateScore = useCallback((base: number) => {\n  return base * multiplier;\n}, []); // note empty deps',
    codeLanguage: 'typescript',
    question: 'If `multiplier` changes to 5, what will `calculateScore(10)` return?',
    options: [
      '50',
      '20',
      'NaN',
      'Throws ReferenceError'
    ],
    correctIndex: 1,
    explanation: 'Because the dependency array is empty (`[]`), `useCallback` memoizes the function created on the first render, freezing `multiplier` at 2 forever.',
    bugType: 'Missing Dependency Invariant'
  },
  {
    id: 'react-m4',
    topic: 'react',
    difficulty: 'medium',
    title: 'React 18 Strict Mode Double Invocation',
    codeSnippet: 'let bugCount = 0;\nfunction BugCounter() {\n  bugCount++;\n  return <div>Count: {bugCount}</div>;\n}',
    codeLanguage: 'typescript',
    question: 'In React 18 development mode with StrictMode, what count displays initially?',
    options: [
      'Count: 1',
      'Count: 2',
      'Count: 0',
      'Throws HydrationError'
    ],
    correctIndex: 1,
    explanation: 'StrictMode deliberately invokes component bodies and pure render functions twice in dev to help spot non-idempotent side effects and impure rendering logic.',
    bugType: 'Impure Component Render'
  },
  {
    id: 'react-m5',
    topic: 'react',
    difficulty: 'medium',
    title: 'useState Lazy Initializer Function',
    codeSnippet: '// Option A\nconst [data] = useState(computeHeavyData());\n// Option B\nconst [data] = useState(() => computeHeavyData());',
    codeLanguage: 'typescript',
    question: 'What is the performance difference between Option A and Option B?',
    options: [
      'There is no difference in execution timing',
      'Option A re-runs computeHeavyData() on every single render; Option B only runs once on mount',
      'Option B fails if computeHeavyData is synchronous',
      'Option A prevents re-renders automatically'
    ],
    correctIndex: 1,
    explanation: 'In Option A, the function `computeHeavyData()` is evaluated before `useState` is called on EVERY re-render, even though its return value is discarded. Passing an arrow callback (lazy initialization) ensures it is executed only during initial mount.',
    bugType: 'Unnecessary Expensive Computation'
  },
  {
    id: 'react-m6',
    topic: 'react',
    difficulty: 'medium',
    title: 'Ref Value Changes Do Not Trigger Re-renders',
    codeSnippet: 'const clicks = useRef(0);\nfunction handleClick() {\n  clicks.current += 1;\n}\nreturn <div>{clicks.current}</div>;',
    codeLanguage: 'typescript',
    question: 'What happens on screen when the user clicks repeatedly?',
    options: [
      'Number increments smoothly',
      'Number on screen stays 0 until a state change causes a re-render',
      'Throws read-only property error',
      'Component unmounts'
    ],
    correctIndex: 1,
    explanation: 'Mutating `.current` on a React Ref is a plain JavaScript property mutation. Unlike `useState`, ref mutations do NOT notify React or trigger reconciliation.',
    bugType: 'Ref Misuse as Reactive State'
  },
  {
    id: 'react-m7',
    topic: 'react',
    difficulty: 'medium',
    title: 'Event Pooling Myth vs Synthetic Event Persistence',
    codeSnippet: 'function InputBug({ onChange }) {\n  const handleChange = (e) => {\n    setTimeout(() => {\n      console.log(e.target.value);\n    }, 100);\n  };\n  return <input onChange={handleChange} />;\n}',
    codeLanguage: 'typescript',
    question: 'In React 17+ (and React 19), does `e.target.value` work inside the timeout?',
    options: [
      'No, synthetic event pooling clears e.target to null',
      'Yes, event pooling was completely removed in React 17+',
      'Only if e.persist() is called first',
      'Throws SyntheticEventPooledException'
    ],
    correctIndex: 1,
    explanation: 'React 17 eliminated SyntheticEvent pooling entirely. Event properties now remain accessible across asynchronous boundaries without needing `e.persist()`.',
    bugType: 'Event Pooling Legacy'
  },

  // REACT - HARD (4 questions)
  {
    id: 'react-h1',
    topic: 'react',
    difficulty: 'hard',
    title: 'useLayoutEffect vs useEffect Visual Glitches',
    codeSnippet: 'useLayoutEffect(() => {\n  tooltipRef.current.style.top = `${calcPosition()}px`;\n}, [isOpen]);',
    codeLanguage: 'typescript',
    question: 'Why is `useLayoutEffect` preferred here over standard `useEffect`?',
    options: [
      'It runs asynchronously off the main thread',
      'It fires synchronously after DOM mutations but BEFORE the browser paints, preventing visual flickering',
      'It supports async/await natively',
      'It has smaller bundle size overhead'
    ],
    correctIndex: 1,
    explanation: '`useLayoutEffect` runs synchronously after all DOM mutations but before the browser paints. This ensures layout recalculations and DOM adjustments happen seamlessly without the user seeing a frame of misplaced content (flicker).',
    bugType: 'Layout Paint Synchronization'
  },
  {
    id: 'react-h2',
    topic: 'react',
    difficulty: 'hard',
    title: 'Custom Hook Return Reference Stability',
    codeSnippet: 'function useBugFilter() {\n  const [query, setQuery] = useState("");\n  return { query, setQuery, clear: () => setQuery("") };\n}',
    codeLanguage: 'typescript',
    question: 'What performance anti-pattern is embedded in this custom hook?',
    options: [
      'setQuery is not allowed inside custom hooks',
      'The returned object literal and `clear` function receive new references on every render',
      'query is not reactive',
      'Custom hooks must return an array, not an object'
    ],
    correctIndex: 1,
    explanation: 'Returning a new object literal `{ ... }` and inline arrow function on every render creates unstable object references. Consumers passing these to `useEffect` or memoized children will trigger unintended re-renders. Use `useMemo` and `useCallback`.',
    bugType: 'Unstable Hook Export Reference'
  },
  {
    id: 'react-h3',
    topic: 'react',
    difficulty: 'hard',
    title: 'Server Component Boundary Leak',
    codeSnippet: '// app/HunterPage.tsx\nimport { useState } from "react";\n\nexport default function HunterPage() {\n  const [active, setActive] = useState(true);\n  return <section>Active</section>;\n}',
    codeLanguage: 'typescript',
    question: 'In Next.js App Router / React Server Components, why does this fail without `"use client"`?',
    options: [
      'useState cannot hold boolean values',
      'Server Components execute exclusively on the server and cannot use interactive client hooks like useState or useEffect',
      'App Router requires all components to be class components',
      'section tags are prohibited in Server Components'
    ],
    correctIndex: 1,
    explanation: 'React Server Components (RSC) run only on the server, have no DOM state, and cannot use client hooks. Files utilizing `useState` or browser APIs must declare the `"use client"` directive at the top.',
    bugType: 'RSC Boundary Contract'
  },
  {
    id: 'react-h4',
    topic: 'react',
    difficulty: 'hard',
    title: 'ForwardRef with Generics Resolution',
    codeSnippet: 'const GenericList = React.forwardRef(<T,>(props: ListProps<T>, ref: React.Ref<HTMLUListElement>) => {\n  return <ul ref={ref}>{/* items */}</ul>;\n});',
    codeLanguage: 'typescript',
    question: 'Why does TypeScript often erase generic `T` on components wrapped with standard `React.forwardRef`?',
    options: [
      'React.forwardRef type definitions drop the generic parameter type unless explicitly re-asserted',
      'Generics are not supported in TSX files',
      'HTMLUListElement cannot accept generic arguments',
      'forwardRef only accepts classes'
    ],
    correctIndex: 0,
    explanation: 'The built-in TypeScript signature for `React.forwardRef` returns a standard component type that discards arbitrary generic type arguments `T`. Developers typically need a custom type assertion helper to retain generics.',
    bugType: 'TypeScript Generic ForwardRef Erasure'
  },

  // NODE.JS - EASY (5 questions)
  {
    id: 'node-e1',
    topic: 'nodejs',
    difficulty: 'easy',
    title: 'CommonJS vs ES Module Exports',
    codeSnippet: '// math.js\nexports.add = (a, b) => a + b;\nmodule.exports = (a, b) => a * b;',
    codeLanguage: 'javascript',
    question: 'What is exported from `math.js` when required by another file?',
    options: [
      '{ add: [Function], default: [Function] }',
      'The multiplication function `(a, b) => a * b`',
      'The addition function `(a, b) => a + b`',
      'Throws ExportConflictError'
    ],
    correctIndex: 1,
    explanation: 'Initially, `exports` is just a reference pointing to `module.exports`. When `module.exports` is reassigned to the multiplication function, the previous `exports.add` property is completely overwritten and lost.',
    bugType: 'Exports Reference Reassignment'
  },
  {
    id: 'node-e2',
    topic: 'nodejs',
    difficulty: 'easy',
    title: 'Process Exit Code Default',
    codeSnippet: 'process.on("exit", (code) => {\n  setTimeout(() => {\n    console.log("Will this log?");\n  }, 0);\n});',
    codeLanguage: 'javascript',
    question: 'What occurs when Node.js begins the exit phase?',
    options: [
      'Node waits for the setTimeout macrotask to finish',
      'The setTimeout callback is ignored; the process exits immediately after synchronous listener execution',
      'Process crashes with DeadlockError',
      'Node logs "Will this log?" 1 second later'
    ],
    correctIndex: 1,
    explanation: 'Listeners on the `exit` event must strictly perform synchronous work. The event loop is shutting down, so scheduled asynchronous callbacks like `setTimeout` or Promises will never execute.',
    bugType: 'Async in Process Exit Event'
  },
  {
    id: 'node-e3',
    topic: 'nodejs',
    difficulty: 'easy',
    title: 'Buffer Alloc vs AllocUnsafe',
    codeSnippet: 'const bufA = Buffer.alloc(1024);\nconst bufB = Buffer.allocUnsafe(1024);',
    codeLanguage: 'javascript',
    question: 'What is the critical security difference between `alloc` and `allocUnsafe`?',
    options: [
      'alloc allocates on the stack; allocUnsafe on the heap',
      'alloc zeroes out the memory; allocUnsafe leaves uninitialized memory that may expose sensitive prior data',
      'alloc is asynchronous; allocUnsafe is synchronous',
      'allocUnsafe limits memory to 256 bytes'
    ],
    correctIndex: 1,
    explanation: '`Buffer.allocUnsafe` does not zero-fill the allocated memory segment for speed. It might contain old sensitive process data (passwords, tokens, keys) and should be used with extreme caution.',
    bugType: 'Uninitialized Memory Leak'
  },
  {
    id: 'node-e4',
    topic: 'nodejs',
    difficulty: 'easy',
    title: 'Path Join vs Resolve',
    codeSnippet: 'const path = require("path");\nconsole.log(path.resolve("subfolder"));',
    codeLanguage: 'javascript',
    question: 'What does `path.resolve("subfolder")` return?',
    options: [
      '"subfolder"',
      'An absolute path from the current working directory to "subfolder"',
      'A URL string beginning with file://',
      'Throws TypeError if directory does not exist'
    ],
    correctIndex: 1,
    explanation: 'Unlike `path.join()`, which merely concatenates path segments, `path.resolve()` resolves the path sequence into an absolute path using the current working directory (`process.cwd()`).',
    bugType: 'Relative vs Absolute Path Resolution'
  },
  {
    id: 'node-e5',
    topic: 'nodejs',
    difficulty: 'easy',
    title: 'Event Emitter Max Listeners Warning',
    codeSnippet: 'const EventEmitter = require("events");\nconst bus = new EventEmitter();\nfor (let i = 0; i < 15; i++) {\n  bus.on("bug", () => {});\n}',
    codeLanguage: 'javascript',
    question: 'What happens when 15 listeners are attached to the same event by default?',
    options: [
      'Node crashes with OutOfMemoryError',
      'Node logs a MaxListenersExceededWarning to stderr indicating a possible memory leak',
      'Listeners past the 10th are silently dropped',
      'Execution continues without any warning'
    ],
    correctIndex: 1,
    explanation: 'Default `EventEmitter` allows up to 10 listeners per event before printing a `MaxListenersExceededWarning`. This safety alert helps developers identify event listener memory leaks.',
    bugType: 'EventEmitter Leak Warning'
  },

  // NODE.JS - MEDIUM (6 questions)
  {
    id: 'node-m1',
    topic: 'nodejs',
    difficulty: 'medium',
    title: 'process.nextTick vs setImmediate Phase',
    codeSnippet: 'setImmediate(() => console.log("immediate"));\nprocess.nextTick(() => console.log("nextTick"));\nPromise.resolve().then(() => console.log("promise"));',
    codeLanguage: 'javascript',
    question: 'What is the correct print order in Node.js?',
    options: [
      'immediate, nextTick, promise',
      'nextTick, promise, immediate',
      'promise, nextTick, immediate',
      'nextTick, immediate, promise'
    ],
    correctIndex: 1,
    explanation: '`process.nextTick` executes immediately after the current operation before any microtasks or event loop phase transitions. Then microtask promises run, and finally `setImmediate` fires in the check phase.',
    bugType: 'Event Loop Phase Precedence'
  },
  {
    id: 'node-m2',
    topic: 'nodejs',
    difficulty: 'medium',
    title: 'Stream Backpressure Ignored',
    codeSnippet: 'readable.on("data", (chunk) => {\n  writable.write(chunk);\n});',
    codeLanguage: 'javascript',
    question: 'What disaster can occur if the destination `writable` is slower than the source `readable`?',
    options: [
      'Buffer underflow causing data duplication',
      'Unbounded memory consumption as write buffers accumulate (backpressure failure)',
      'Socket disconnects automatically',
      'Chunks are silently dropped by V8'
    ],
    correctIndex: 1,
    explanation: 'If `writable.write()` returns `false`, the stream buffer is full. Continuing to push data without pausing the readable stream ignores backpressure and can crash the Node process with Out of Memory. Use `readable.pipe(writable)` or pipeline.',
    bugType: 'Stream Backpressure Neglect'
  },
  {
    id: 'node-m3',
    topic: 'nodejs',
    difficulty: 'medium',
    title: 'Synchronous File I/O Blocking the Event Loop',
    codeSnippet: 'app.get("/data", (req, res) => {\n  const content = fs.readFileSync("/large-log.txt");\n  res.send(content);\n});',
    codeLanguage: 'javascript',
    question: 'Why is `fs.readFileSync` toxic in a high-throughput Express server?',
    options: [
      'readFileSync returns a stream instead of a string',
      'It blocks the single JavaScript thread, freezing requests for all other connected users until disk read completes',
      'readFileSync only works in command line scripts',
      'Node caches the file indefinitely in heap memory'
    ],
    correctIndex: 1,
    explanation: 'Node.js relies on a single event loop thread for JavaScript. Any blocking call like `fs.readFileSync` or heavy synchronous crypto stops all incoming HTTP requests and timers dead in their tracks.',
    bugType: 'Event Loop Thread Blocking'
  },
  {
    id: 'node-m4',
    topic: 'nodejs',
    difficulty: 'medium',
    title: 'Unhandled Promise Rejection Behavior in Node 16+',
    codeSnippet: 'async function huntBug() {\n  throw new Error("Critical Null Pointer");\n}\nhuntBug();',
    codeLanguage: 'javascript',
    question: 'What happens in modern Node.js (v16+) when an unhandled rejection occurs without a catch handler?',
    options: [
      'Node logs a deprecation warning and continues running',
      'The process terminates with a non-zero exit code (crashes)',
      'The error is swallowed silently',
      'Node automatically restarts the process'
    ],
    correctIndex: 1,
    explanation: 'Starting with Node.js v15/v16, unhandled promise rejections trigger the `unhandledRejection` hook and default to terminating the process with an exit code of 1.',
    bugType: 'Process Crash on Unhandled Promise'
  },
  {
    id: 'node-m5',
    topic: 'nodejs',
    difficulty: 'medium',
    title: 'Cluster Module Memory Sharing',
    codeSnippet: 'const cluster = require("cluster");\nlet requestCount = 0;\nif (cluster.isPrimary) {\n  cluster.fork();\n  cluster.fork();\n}',
    codeLanguage: 'javascript',
    question: 'Do the forked worker processes share the `requestCount` variable in memory?',
    options: [
      'Yes, cluster forks operate as shared-memory threads',
      'No, each worker is an isolated child process with its own separate memory heap',
      'Only if IPC channels are disabled',
      'Yes, but variables must be declared with `shared` keyword'
    ],
    correctIndex: 1,
    explanation: 'The `cluster` module launches independent OS processes via `child_process.fork()`. They do not share memory space or variables; inter-process state sharing requires Redis or IPC messages.',
    bugType: 'Cluster Process Memory Isolation'
  },
  {
    id: 'node-m6',
    topic: 'nodejs',
    difficulty: 'medium',
    title: 'Circular Dependency in CommonJS',
    codeSnippet: '// a.js\nconst b = require("./b");\nexports.done = false;\n\n// b.js\nconst a = require("./a");\nexports.aDone = a.done;',
    codeLanguage: 'javascript',
    question: 'When `a.js` is loaded, what is the value of `b.aDone` during circular evaluation?',
    options: [
      'false',
      'undefined',
      'Throws CircularDependencyError',
      'true'
    ],
    correctIndex: 1,
    explanation: 'In CommonJS, circular dependencies return an unfinished copy of the exports object. Because `exports.done = false` has not yet executed when `b.js` evaluates `a.done`, it resolves to `undefined`.',
    bugType: 'Incomplete Circular Export'
  },

  // NODE.JS - HARD (4 questions)
  {
    id: 'node-h1',
    topic: 'nodejs',
    difficulty: 'hard',
    title: 'AsyncLocalStorage Context Loss in Callbacks',
    codeSnippet: 'const { AsyncLocalStorage } = require("async_hooks");\nconst storage = new AsyncLocalStorage();\n\nstorage.run(new Map([["reqId", "123"]]), () => {\n  legacyCallbackAPI(() => {\n    console.log(storage.getStore()?.get("reqId"));\n  });\n});',
    codeLanguage: 'javascript',
    question: 'Why might `storage.getStore()` return undefined if `legacyCallbackAPI` wraps an external C++ addon?',
    options: [
      'AsyncLocalStorage only works in TypeScript',
      'External native addons that do not propagate async resource IDs break the AsyncHooks execution context chain',
      'Map is not a valid store type for AsyncLocalStorage',
      'AsyncLocalStorage requires process.env.NODE_ASYNC=1'
    ],
    correctIndex: 1,
    explanation: '`AsyncLocalStorage` relies on Node\'s internal `async_hooks` engine. If an external native C++ addon or uninstrumented event emitter loses the execution context without binding to `AsyncResource`, context is lost.',
    bugType: 'AsyncHooks Context Severance'
  },
  {
    id: 'node-h2',
    topic: 'nodejs',
    difficulty: 'hard',
    title: 'Worker Threads SharedArrayBuffer Concurrency',
    codeSnippet: 'const { Worker, isMainThread, workerData } = require("worker_threads");\n// Two workers incrementing a shared Uint32Array index 0\n// worker.js: shared[0]++ vs Atomics.add(shared, 0, 1)',
    codeLanguage: 'javascript',
    question: 'Why is `shared[0]++` unsafe across multiple worker threads?',
    options: [
      'SharedArrayBuffer is read-only in Worker threads',
      'The ++ operator is a read-modify-write operation susceptible to data race conditions without Atomics',
      'Uint32Array does not support arithmetic operators',
      'V8 locks the buffer automatically'
    ],
    correctIndex: 1,
    explanation: '`shared[0]++` expands to reading the memory slot, adding 1, and writing back. With true OS threads in `worker_threads`, concurrent non-atomic writes produce race conditions. Use `Atomics.add(shared, 0, 1)`.',
    bugType: 'Thread Race Condition'
  },
  {
    id: 'node-h3',
    topic: 'nodejs',
    difficulty: 'hard',
    title: 'libuv Threadpool Exhaustion',
    codeSnippet: 'const crypto = require("crypto");\nfor (let i = 0; i < 8; i++) {\n  crypto.pbkdf2("secret", "salt", 100000, 64, "sha512", () => {});\n}',
    codeLanguage: 'javascript',
    question: 'By default, how many pbkdf2 tasks can execute simultaneously in libuv?',
    options: [
      '1',
      '4 (the default UV_THREADPOOL_SIZE)',
      '8',
      'Unlimited based on CPU cores'
    ],
    correctIndex: 1,
    explanation: 'Libuv provides a default worker threadpool of size 4 (`UV_THREADPOOL_SIZE = 4`) for CPU-heavy tasks like `pbkdf2` and certain DNS/filesystem calls. The remaining 4 tasks must queue up until threads free up.',
    bugType: 'Libuv Threadpool Starvation'
  },
  {
    id: 'node-h4',
    topic: 'nodejs',
    difficulty: 'hard',
    title: 'HTTP Agent Keep-Alive Socket Leak',
    codeSnippet: 'const http = require("http");\nconst agent = new http.Agent({ keepAlive: true, maxSockets: 5 });\n// Client makes request but forgets to consume res body:\nconst req = http.request({ agent, path: "/" }, (res) => {\n  // No "data" listener or res.resume()\n});',
    codeLanguage: 'javascript',
    question: 'What bug occurs if the response stream is neither consumed nor resumed?',
    options: [
      'The server immediately returns HTTP 500',
      'The socket is never returned to the keep-alive pool, eventually stalling all future HTTP requests',
      'Memory garbage collector destroys the socket immediately',
      'The agent ignores keepAlive automatically'
    ],
    correctIndex: 1,
    explanation: 'A keep-alive socket in Node\'s `http.Agent` cannot be reused until the entire response body has been consumed or dumped via `res.resume()`. Unconsumed responses lead to socket pool starvation.',
    bugType: 'Socket Pool Starvation'
  },

  // BONUS JS/REACT/NODE QUESTIONS TO HIT 50 TOTAL!
  // Question 43
  {
    id: 'js-m8',
    topic: 'javascript',
    difficulty: 'medium',
    title: 'Object.freeze Shallow Immutability',
    codeSnippet: 'const rule = Object.freeze({\n  penalty: 10,\n  details: { severity: "high" }\n});\nrule.details.severity = "low";\nconsole.log(rule.details.severity);',
    codeLanguage: 'javascript',
    question: 'What is the logged value of `rule.details.severity`?',
    options: [
      '"high"',
      '"low"',
      'TypeError: Cannot assign to read only property',
      'undefined'
    ],
    correctIndex: 1,
    explanation: '`Object.freeze()` only freezes the top-level properties of the target object. Nested objects like `details` remain completely mutable unless deeply frozen recursively.',
    bugType: 'Shallow Immutability Leak'
  },
  // Question 44
  {
    id: 'js-h5',
    topic: 'javascript',
    difficulty: 'hard',
    title: 'Function.prototype.bind Argument Currying',
    codeSnippet: 'function multiply(a, b) {\n  return a * b;\n}\nconst double = multiply.bind(null, 2);\nconsole.log(double(4, 10));',
    codeLanguage: 'javascript',
    question: 'What is returned by `double(4, 10)`?',
    options: [
      '8',
      '20',
      '80',
      'NaN'
    ],
    correctIndex: 0,
    explanation: '`bind(null, 2)` prepends 2 as argument `a`. When `double(4, 10)` is invoked, `b` receives 4, while the extra argument 10 is ignored because `multiply` only takes two arguments. 2 * 4 = 8.',
    bugType: 'Partial Application Over-argument'
  },
  // Question 45
  {
    id: 'react-m8',
    topic: 'react',
    difficulty: 'medium',
    title: 'Controlled vs Uncontrolled Input Reset',
    codeSnippet: 'function BugField() {\n  const [text, setText] = useState<string | undefined>(undefined);\n  return <input value={text} onChange={e => setText(e.target.value)} />;\n}',
    codeLanguage: 'typescript',
    question: 'What warning does React emit when the user first types into this input?',
    options: [
      'Maximum update depth exceeded',
      'A component is changing an uncontrolled input to be controlled',
      'Invalid event listener',
      'Missing defaultValue'
    ],
    correctIndex: 1,
    explanation: 'Passing `undefined` as `value` causes React to treat the element as uncontrolled. Once the user types and state becomes a string, it switches to controlled, triggering a React warning. Initialize with `""` instead.',
    bugType: 'Controlled/Uncontrolled Input Flipping'
  },
  // Question 46
  {
    id: 'react-h5',
    topic: 'react',
    difficulty: 'hard',
    title: 'Automatic Batching in Promises (React 18)',
    codeSnippet: 'function handleBugSquash() {\n  fetch("/squash").then(() => {\n    setBugs(b => b - 1);\n    setScore(s => s + 100);\n  });\n}',
    codeLanguage: 'typescript',
    question: 'In React 18+, how many re-renders are triggered inside this promise callback?',
    options: [
      '2 re-renders (one per state setter)',
      '1 re-render (due to Automatic Batching across promises and timeouts)',
      '0 re-renders until next frame',
      '4 re-renders'
    ],
    correctIndex: 1,
    explanation: 'React 18 introduced Automatic Batching across all contexts, including Promises, `setTimeout`, and native event handlers, grouping state updates into a single performant re-render.',
    bugType: 'State Batching Optimization'
  },
  // Question 47
  {
    id: 'node-e6',
    topic: 'nodejs',
    difficulty: 'easy',
    title: 'URL Constructor Port Parsing',
    codeSnippet: 'const { URL } = require("url");\nconst myUrl = new URL("https://api.bugquest.dev:8080/v1/hunt");\nconsole.log(myUrl.port);',
    codeLanguage: 'javascript',
    question: 'What does `myUrl.port` evaluate to?',
    options: [
      '8080 (number)',
      '"8080" (string)',
      'undefined',
      '":8080"'
    ],
    correctIndex: 1,
    explanation: 'The WHATWG `URL` class in Node.js returns the `port` property as a string (e.g. `"8080"`), or an empty string `""` if the default protocol port is used.',
    bugType: 'String Port Property'
  },
  // Question 48
  {
    id: 'node-m7',
    topic: 'nodejs',
    difficulty: 'medium',
    title: 'Event Loop Timers vs I/O Polling',
    codeSnippet: 'const fs = require("fs");\nfs.readFile(__filename, () => {\n  setTimeout(() => console.log("timeout"), 0);\n  setImmediate(() => console.log("immediate"));\n});',
    codeLanguage: 'javascript',
    question: 'Inside an I/O callback, what is the guaranteed execution order between `setImmediate` and `setTimeout(..., 0)`?',
    options: [
      'timeout always executes before immediate',
      'immediate always executes before timeout',
      'The order is non-deterministic and random',
      'Both execute in parallel on separate threads'
    ],
    correctIndex: 1,
    explanation: 'Inside an I/O cycle (like `fs.readFile`), the poll phase is active. The check phase (where `setImmediate` resides) follows immediately after poll, guaranteeing `setImmediate` runs before the timer phase wraps around.',
    bugType: 'I/O Cycle Phase Determinism'
  },
  // Question 49
  {
    id: 'js-e8',
    topic: 'javascript',
    difficulty: 'easy',
    title: 'JSON.stringify Function Omission',
    codeSnippet: 'const payload = {\n  id: "bug-49",\n  squash: () => true,\n  meta: undefined\n};\nconsole.log(JSON.stringify(payload));',
    codeLanguage: 'javascript',
    question: 'What is the resulting JSON string?',
    options: [
      '\'{"id":"bug-49","squash":"function","meta":null}\'',
      '\'{"id":"bug-49"}\'',
      '\'{"id":"bug-49","squash":null,"meta":null}\'',
      'Throws TypeError'
    ],
    correctIndex: 1,
    explanation: '`JSON.stringify()` silently omits functions, `undefined`, and Symbols when serializing object properties. Only `{"id":"bug-49"}` remains in the output string.',
    bugType: 'Silent JSON Property Stripping'
  },
  // Question 50
  {
    id: 'react-m9',
    topic: 'react',
    difficulty: 'medium',
    title: 'Derived State Anti-Pattern',
    codeSnippet: 'function UserBadge({ user }) {\n  const [name, setName] = useState(user.name);\n  return <span>{name}</span>;\n}',
    codeLanguage: 'typescript',
    question: 'What happens if the parent component updates `user.name` with a new prop?',
    options: [
      'UserBadge updates its display immediately',
      'UserBadge continues displaying the old name because useState only reads props on mount',
      'Throws an invariant error',
      'Component automatically re-mounts'
    ],
    correctIndex: 1,
    explanation: 'Copying props into local state creates duplicated source of truth. If props change later, local state will NOT update. Instead, compute derived values directly during render or use a `key` to reset.',
    bugType: 'Stale Prop Synchronization'
  }
];

export const TOPIC_INFO = {
  javascript: {
    name: 'JavaScript',
    icon: '⚡',
    color: '#00ff88',
    description: 'V8 runtime, event loops, coercion, closures, microtasks & prototypes.'
  },
  react: {
    name: 'React',
    icon: '⚛️',
    color: '#c084fc',
    description: 'Hooks lifecycle, stale closures, synthetic events, RSC & reconciliation.'
  },
  nodejs: {
    name: 'Node.js',
    icon: '🟢',
    color: '#38bdf8',
    description: 'libuv threadpool, backpressure, buffers, async_hooks & cluster workers.'
  }
};
