import Head from 'next/head';
import { parse } from '@iter-tools/regex';
// @ts-ignore-error
import { Engine } from '@iter-tools/regex/internal/engine';
// @ts-ignore-error
import { debugPrint } from '@iter-tools/regex/internal/debug';

import { Grommet, Button, CheckBox, Header, TextInput } from 'grommet';

import { Grid, BlockQuote } from 'grommet-icons';
import { Component } from 'react';
import { forkerate, concat } from 'iter-tools-es';
import { Inspector } from '../components/inspector';

if (typeof window !== 'undefined') {
  (window as any).debugPrint = debugPrint;
}

type InspectorState = {
  engine: any;
  forkr: any;
  pattern: string;
  text: string;
  matches: Array<Array<string | undefined>>;
};

let url: URL | null = null;

if (typeof document !== 'undefined') {
  console.log('Welcome to the inspector! Try running:');
  console.log('console.log($e)');

  url = new URL(document.location.href);
  document.getElementById('inputs')?.focus();
}

export default class App extends Component<never, InspectorState> {
  state: InspectorState = {
    engine: null,
    forkr: null,
    matches: null!,
    pattern: url?.searchParams.get('pattern') || '',
    text: url?.searchParams.get('text') || '',
  };

  execute(pattern, flags, text) {
    const engine = new Engine(parse(pattern as string, Object.keys(flags).join('')));

    this.setState({
      forkr: forkerate(concat([null], text, [null])),
      engine,
      matches: [],
    });

    (window as any).$e = engine;
  }

  onPatternInput = (e) => {
    this.setState({ pattern: e.target.value });
  };

  onTextInput = (e) => {
    this.setState({ text: e.target.value });
  };

  onSubmit = (e) => {
    const { pattern, text, ...flags } = Object.fromEntries(new FormData(e.target));

    this.execute(pattern, flags, text);

    const url = new URL(document.location.href);

    url.searchParams.set('pattern', pattern as string);
    url.searchParams.set('text', text as string);

    history.replaceState(null, '', url);

    e.preventDefault();
  };

  render() {
    const { pattern, text } = this.state;
    return (
      <Grommet
        full
        theme={{
          tip: { content: { background: '#ffffffbb' } },
        }}
        background="light-2"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <Head>
          <title>Regex playground</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <form id="inputs" onSubmit={this.onSubmit}>
          <Header background="white" pad="medium" elevation="medium">
            <TextInput
              name="pattern"
              icon={<Grid />}
              value={pattern}
              onInput={this.onPatternInput}
              placeholder="pattern"
            />
            <TextInput
              name="text"
              icon={<BlockQuote />}
              value={text}
              onInput={this.onTextInput}
              placeholder="text"
            />
            <CheckBox name="g" label="g" />
            <CheckBox name="i" label="i" />
            <CheckBox name="s" label="s" />
            <CheckBox name="m" label="m" />
            <CheckBox name="y" label="y" />
            <Button primary type="submit" label="execute" />
          </Header>
        </form>
        <Inspector {...this.state} />
      </Grommet>
    );
  }
}
