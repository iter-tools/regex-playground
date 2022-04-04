import { Button, Main } from 'grommet';

import { GlyphStream } from '../components/glyph-stream';
import { Matches } from '../components/matches';

const formatChr = (chr: string | null) => (chr !== null ? `'${chr}'` : 'null');

export const Inspector = ({ index, width, engine, forkr, done, matches, dispatch }) => {
  const [lastChr, chr] = forkr;
  return (
    <Main pad="medium" gap="large">
      <Matches matches={matches} />
      <Button
        primary
        disabled={done}
        label={
          done
            ? 'done'
            : width
            ? `step1(${formatChr(chr)})`
            : `step0(${formatChr(lastChr)}, ${formatChr(chr)})`
        }
        alignSelf="start"
        onClick={() => dispatch({ type: 'step' })}
      />
      <GlyphStream index={index} width={width} engine={engine} forkr={forkr} />
    </Main>
  );
};
