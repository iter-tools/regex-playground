import { Box } from 'grommet';
import { take, map, drop, isEmpty, execPipe, toArray } from 'iter-tools-es';

export const Glyph = ({ glyph }) => (
  <Box pad="small" background={glyph === null ? 'black' : 'white'} elevation="medium">
    <pre style={{ margin: 0, fontWeight: 'bold' }}>{glyph || ' '}</pre>
  </Box>
);

export const GlyphStream = ({ nLetters = 10, forkr }) => {
  const { index } = forkr;
  const streamLetters = execPipe(
    forkr as IterableIterator<string>,
    take(nLetters),
    map((glyph, i) => <Glyph key={index + i} glyph={glyph} />),
    toArray,
  );

  if (!isEmpty(drop(nLetters, forkr))) {
    streamLetters.push(<Glyph key="more" glyph={'...'} />);
  }

  return (
    <Box direction="row" gap="medium">
      {streamLetters}
    </Box>
  );
};
