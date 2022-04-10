import { Box, Diagram, Main, Stack } from 'grommet';
import { Component } from 'react';

import { Engine } from './engine';
import { Glyph, GlyphStream } from './glyph-stream';
import { Match, MatchStream } from './match-stream';
import { StateTree } from './state-tree';

const padAll = (padding) => ({
  top: padding,
  right: padding,
  bottom: padding,
  left: padding,
});

export const IOStream = ({ children, id, spacer }) => {
  return (
    <Box
      id={id}
      background="#CFCFCFDD"
      pad={{ ...padAll('small'), left: 'large' }}
      round="medium"
      style={{ position: 'relative', zIndex: 1 }}
      elevation="medium"
    >
      <Stack anchor="left">
        <Box style={{ visibility: 'hidden' }}>{spacer}</Box>
        <>{children}</>
      </Stack>
    </Box>
  );
};

type InspectorProps = {
  engine: any;
  forkr: any;
  matches: Array<Array<string | undefined>>;
};

export class Inspector extends Component<InspectorProps> {
  render() {
    const { engine, forkr, matches } = this.props;

    return (
      <Box flex="grow" style={{ position: 'relative' }}>
        <Diagram
          style={{ position: 'absolute', zIndex: 1 }}
          connections={[
            {
              fromTarget: 'input_stream_socket',
              toTarget: 'input_stream',
              anchor: 'horizontal',
              thickness: 'xsmall',
              color: 'neutral-3',
              type: 'rectilinear',
            },
            {
              fromTarget: 'output_stream_socket',
              toTarget: 'output_stream',
              anchor: 'horizontal',
              thickness: 'xsmall',
              color: 'neutral-3',
              type: 'rectilinear',
            },
          ]}
        />
        <Main pad="medium" direction="row">
          <>
            <Engine
              engine={engine}
              forkr={forkr}
              matches={matches}
              inspector={this}
              style={{ position: 'relative', zIndex: 2 }}
            />
            <Box pad={{ left: 'xlarge' }} gap="medium" fill="horizontal">
              <IOStream id="input_stream" spacer={<Glyph glyph={null} />}>
                {forkr ? <GlyphStream forkr={forkr} /> : '...no input'}
              </IOStream>
              <IOStream id="output_stream" spacer={<Match match={[]} />}>
                {matches?.length ? (
                  <MatchStream engine={engine} matches={matches} />
                ) : engine && !engine.done ? (
                  '...no matches yet'
                ) : (
                  '...no matches'
                )}
              </IOStream>
              <Box id="ideal_viewbox" flex="grow" style={{ position: 'relative', zIndex: 0 }} />
            </Box>
          </>
          <StateTree engine={engine} style={{ position: 'absolute', inset: 0 }} />
        </Main>
      </Box>
    );
  }
}
