import { Component } from 'react';
import {
  Box,
  Card,
  CardHeader,
  Heading,
  Button,
  CardBody,
  Text,
  ResponsiveContext,
  NameValueList,
  NameValuePair,
} from 'grommet';

const StepButton = ({ engine, dispatch }) => {
  // prettier-ignore
  const label =
    !engine
      ? '&nbsp;'
      : engine.starved
        ? 'feed'
        : engine.done
          ? 'done'
          : engine.width > 0
            ? 'step1'
            : 'step0';

  return (
    <Button
      primary
      disabled={engine?.done || !engine}
      label={label}
      alignSelf="start"
      onClick={() => dispatch({ type: 'step' })}
      style={{ visibility: engine ? 'visible' : 'hidden' }}
    />
  );
};

export type EngineProps = {
  engine: any;
  forkr: any;
  style: any;
  matches: Array<Array<string | undefined>>;
  inspector: Component;
};

const InstanceBody = ({ engine }) => {
  const columns: any = { columns: ['auto', 'auto'] };
  return (
    <CardBody gap="xxsmall" pad="small">
      <Box direction="row" justify="between">
        <Box>
          <NameValueList nameProps={{ align: 'end' }} gap="xsmall" {...columns}>
            <NameValuePair name="width">{engine.width}</NameValuePair>
            <NameValuePair name="index">{engine.index}</NameValuePair>
            <NameValuePair name="starved">{String(engine.starved)}</NameValuePair>
            <NameValuePair name="done">{String(engine.done)}</NameValuePair>
            <NameValuePair name="lastChr">{String(engine.lastChr)}</NameValuePair>
            <NameValuePair name="chr">{String(engine.chr)}</NameValuePair>
          </NameValueList>
        </Box>
        <Box
          direction="column-reverse"
          style={{ textAlign: 'right', fontSize: '18px', lineHeight: '24px' }}
          gap="xsmall"
        >
          <Box as="strong">root</Box>
        </Box>
      </Box>
    </CardBody>
  );
};

const NullBody = () => {
  return (
    <CardBody gap="xxsmall" pad="small">
      To create an engine, use the execute button
    </CardBody>
  );
};

export class Engine extends Component<EngineProps> {
  step() {
    const { forkr, engine, matches } = this.props;

    if (engine.starved) {
      engine.feed(forkr.value);
      forkr.advance();
    } else if (engine.width === 0) {
      matches.push(...engine.step0());
    } else {
      engine.step1();
    }

    this.setState({});
  }

  dispatch = (action) => {
    switch (action.type) {
      case 'step':
        this.step();
        break;
    }

    this.props.inspector.forceUpdate();
  };

  render() {
    const { engine, style } = this.props;

    const headerText = (
      <>
        Engine
        <Text
          as="pre"
          size="medium"
          weight="normal"
          margin={{ left: '.6em' }}
          style={{ display: 'inline', verticalAlign: 'middle' }}
        >
          {engine ? '== $e' : '== null'}
        </Text>
      </>
    );

    return (
      <ResponsiveContext.Consumer>
        {(size) => {
          return (
            <Card
              alignSelf="start"
              background="light-6"
              elevation="medium"
              width={size === 'small' ? '200px' : '300px'}
              flex={{ shrink: 0 }}
              style={style}
            >
              <CardHeader direction="row" pad="small" background="#fff">
                <Box flex="grow">
                  <Heading level={4} size="small" margin="0">
                    <Text weight="bold" size="1.2em">
                      {headerText}
                    </Text>
                  </Heading>
                </Box>
                <Box flex="shrink">
                  <StepButton engine={engine} dispatch={this.dispatch} />
                </Box>
              </CardHeader>
              {engine ? <InstanceBody engine={engine} /> : <NullBody />}
            </Card>
          );
        }}
      </ResponsiveContext.Consumer>
    );
  }
}
