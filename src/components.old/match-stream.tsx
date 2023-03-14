import { Box, Card, CardBody } from 'grommet';

const printMatch = (match) => {
  return `Match [${match.map((str) => `'${str.replace(/'/g, "\\'")}'`).join(', ')}]`;
};

export const Match = ({ match }) => {
  return (
    <Card background="white" pad="small">
      <CardBody>{printMatch(match)}</CardBody>
    </Card>
  );
};

export const MatchStream = ({ matches, engine }) => {
  const content = !engine ? '' : matches.map((match, i) => <Match key={i} match={match} />);

  return <Box direction="row-reverse">{content}</Box>;
};
