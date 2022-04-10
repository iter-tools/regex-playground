import { Box, Card, CardBody } from 'grommet';

export const Match = ({ globalIndex, match }) => {
  return (
    <Card key={globalIndex} background="white" pad="small">
      <CardBody>Match {JSON.stringify(match)}</CardBody>
    </Card>
  );
};

export const MatchStream = ({ matches, engine }) => {
  const content = !engine ? '' : matches.map((match, i) => <Match globalIndex={i} match={match} />);

  return <Box direction="row-reverse">{content}</Box>;
};
