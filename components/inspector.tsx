import { Button, Main } from 'grommet';

import { GlyphStream } from '../components/glyph-stream';
import { Matches } from '../components/matches';

export const Inspector = ({ index, width, engine, forkr, done, matches, dispatch }) => {
  return (
    <Main pad="medium" gap="large">
      <Matches matches={matches} />
      <Button
        primary
        disabled={done}
        label={done ? 'done' : width ? 'step1' : 'step0'}
        alignSelf="start"
        onClick={() => dispatch({ type: 'step' })}
      />
      <GlyphStream index={index} width={width} engine={engine} forkr={forkr} />
    </Main>
  );
};
