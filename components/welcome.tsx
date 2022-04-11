import { Markdown } from 'grommet';

const welcomeText = `
### Welcome!

This regular expression evaluation playground allows you to look inside a non-backtracking regex engine and
see how its state evolves as it performs matching.

#### The engine
The particular engine the playground uses is the [@iter-tools/regex](https://github.com/iter-tools/regex) engine, which we'll refer to simply as "the engine".

The engine is written in Javascript. It is running in your browser, and can be used in any sufficiently modern
Javascript execution environment.

The non-backtracking design of the engine means that it never needs to hold on to more than two characters of the input at a time,
making it ideal for matching against streams of input. In formal terms the implementation uses Nondeterministic Finite Automata, or NFAs.
`;

export const Welcome = (props) => {
  return (
    <Markdown components={{ p: { props: { fill: true } } }} {...props}>
      {welcomeText}
    </Markdown>
  );
};
