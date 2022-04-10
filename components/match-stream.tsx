import { Box, Card, CardBody } from 'grommet';

export const Match = ({ match }) => {
  return (
    <Card background="white" pad="small">
      <CardBody>Match {JSON.stringify(match)}</CardBody>
    </Card>
  );
};

export const MatchStream = ({ matches, engine }) => {
  const content = !engine ? '' : matches.map((match, i) => <Match key={i} match={match} />);

  return <Box direction="row-reverse">{content}</Box>;
};
