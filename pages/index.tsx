import Head from 'next/head';
import { parse } from '@iter-tools/regex';
// @ts-ignore-error
import { Engine } from '@iter-tools/regex/internal/engine';
import { Box, Button, CheckBox, Header, Main, Markdown, TextInput } from 'grommet';

import { Grid, BlockQuote } from 'grommet-icons';
import { PureComponent } from 'react';
import { concat, forkerate } from 'iter-tools-es';
import { Inspector } from '../components/inspector';

type InspectorState = {
  index: number;
  width: number;
  engine: any;
  forkr: any;
  done: boolean;
  matches: Array<Array<string | undefined>>;
};

const welcomeText = `

Welcome to the [@iter-tools/regex](https://github.com/iter-tools/regex) playground!
      
This playground allows you to step through the incremental process by which \`@iter-tools/regex\`
does matching.

To get started, enter a pattern and some text to match against, press "execute" to setup the engine,
then press the step button repeatedly to see how matching progresses.`;

const Welcome = () => {
  return (
    <Main pad="medium">
      <Markdown components={{ p: { props: { fill: true } } }}>{welcomeText}</Markdown>
    </Main>
  );
};

export default class App extends PureComponent<never, InspectorState> {
  state: InspectorState = {
    index: null!,
    width: null!,
    engine: null,
    forkr: null,
    done: null!,
    matches: null!,
  };

  dispatch = (action) => {
    switch (action.type) {
      case 'step':
        this.step();
        break;
    }
  };

  execute = () => {
    const { pattern, text, ...flags } = Object.fromEntries(new FormData(document.forms[0]));
    this.setState({
      index: 0,
      width: 0,
      forkr: forkerate(concat([null], text as string, [null])),
      engine: new Engine(parse(pattern as string, Object.keys(flags).join(''))),
      done: false,
      matches: [],
    });
  };

  step = () => {
    const { index, width, forkr, engine, matches } = this.state;

    const [lastChr, chr] = forkr;
    if (width === 0) {
      const { value, done } = engine.step0(lastChr, chr);

      this.setState({ width: 1, matches: value ? [...matches, ...value] : matches, done });

      if (done && chr === null) {
        forkr.advance();
        this.setState({ index: index + 1 });
      }
    } else {
      engine.step1(chr);

      forkr.advance();
      this.setState({ width: 0, index: index + 1 });
    }
  };

  render() {
    const { engine } = this.state;
    const content = engine ? <Inspector {...this.state} dispatch={this.dispatch} /> : <Welcome />;

    return (
      <Box
        flex
        margin={{ horizontal: 'auto', vertical: '0' }}
        width={{ max: '100%' }}
        height={{ min: '100vh' }}
        background="light-2"
      >
        <Head>
          <title>Regex playground</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <form id="inputs">
          <Header background="white" pad="medium">
            <TextInput name="pattern" icon={<Grid />} value="ab" placeholder="pattern" />
            <TextInput name="text" icon={<BlockQuote />} value="moab" placeholder="text" />
            <CheckBox name="g" label="g" />
            <CheckBox name="i" label="i" />
            <CheckBox name="s" label="s" />
            <CheckBox name="m" label="m" />
            <CheckBox name="y" label="y" />
            <Button primary label="execute" onClick={this.execute} />
          </Header>
        </form>
        {content}
      </Box>
    );
  }
}
