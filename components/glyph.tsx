import { Box } from 'grommet';

export const Glyph = ({ glyph, index }: any) => (
  <Box
    pad="small"
    background={glyph === null ? 'black' : 'white'}
    elevation="medium"
    style={{ position: 'relative' }}
  >
    <Box style={{ position: 'absolute', top: '-24px' }}>{index !== null ? index : ' '}</Box>
    <pre style={{ margin: 0 }}>{glyph || ' '}</pre>
  </Box>
);
