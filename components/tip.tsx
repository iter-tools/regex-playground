import { useContext } from 'react';
import { Box, Button, Tip as GrommetTip, ResponsiveContext } from 'grommet';
import { CircleInformation } from 'grommet-icons';

export const Tip = ({ content, dropProps = { align: { left: 'right' } } as any }) => {
  const size = useContext(ResponsiveContext);

  return (
    <GrommetTip
      content={
        <Box pad="small" gap="small" width={{ max: size }}>
          {content}
        </Box>
      }
      dropProps={dropProps}
    >
      <Button
        icon={<CircleInformation size="medium" />}
        plain
        size="small"
        margin={{ horizontal: 'small' }}
        style={{ display: 'inline', verticalAlign: 'bottom' }}
      />
    </GrommetTip>
  );
};
