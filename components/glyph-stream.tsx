import { Box } from 'grommet';
import { take, map, drop, isEmpty, execPipe, toArray } from 'iter-tools-es';
import { Glyph } from './glyph';

export const GlyphStream = ({ nLetters = 10, index, width, engine, forkr }: any) => {
  const streamLetters = execPipe(
    forkr as IterableIterator<string>,
    take(nLetters),
    map((glyph, i) => <Glyph key={index + i} index={index + i} glyph={glyph} />),
    toArray,
  );

  if (index === 0 && width === 0) {
    streamLetters.unshift(<Glyph key="start" index={null} glyph={null} />);
  }
  if (isEmpty(drop(nLetters, forkr))) {
    streamLetters.push(<Glyph key="end" index={null} glyph={null} />);
  } else {
    streamLetters.push(<Glyph key="more" index={null} glyph={'...'} />);
  }

  return (
    <Box direction="row" gap="medium" style={{ paddingTop: '1.4em' }}>
      {streamLetters}
    </Box>
  );
};
