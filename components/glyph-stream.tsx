import { Box } from 'grommet';
import { take, map, drop, isEmpty, execPipe, toArray } from 'iter-tools-es';
import { Glyph } from './glyph';

export const GlyphStream = ({ nLetters = 10, index, forkr }: any) => {
  const streamLetters = execPipe(
    forkr as IterableIterator<string>,
    take(nLetters),
    map((glyph, i) => <Glyph key={index + i - 1} index={index + i - 1} glyph={glyph} />),
    toArray,
  );

  if (!isEmpty(drop(nLetters, forkr))) {
    streamLetters.push(<Glyph key="more" index={null} glyph={'...'} />);
  }

  return (
    <Box direction="row" gap="medium" style={{ paddingTop: '1.4em' }}>
      {streamLetters}
    </Box>
  );
};
