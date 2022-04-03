import { Box, Card, CardBody } from 'grommet';

export const Matches = ({ matches }) => {
  const content = !matches.length
    ? 'There are no matches yet'
    : matches.map((match, i) => (
        <Card key={i} background="white" pad="small">
          <CardBody>Match {JSON.stringify(match)}</CardBody>
        </Card>
      ));

  return <Box direction="row">{content}</Box>;
};
