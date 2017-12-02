import React from 'react';
import styled from 'styled-components';
import 'roboto-fontface';

const Container = styled.div`
  position: absolute;
  bottom: 80px;
  left: 32px;
  background: #fff;
  min-width: 240px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 16px;
  background: rgba(108, 154, 173, 0.79);
  color: #fff;
  font-family: 'roboto';
  border-radius: 3px;
`;
const Title = styled.div`
  text-transform: uppercase;
  font-weight: 500;
  padding: 8px;
  text-align: center;
  width: 100%;
  margin-bottom: 16px;
  background: rgba(255,255,255,0.3);
`;

const Rows = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-between;
`;
// Row subcomponents
const RowWrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
  justify-content: space-between;
  width: 100%;
`;
const ColorCode = styled.div`
  height: 12px;
  width: 12px;
  background: ${({ color }) => color };
  border: 1px solid #fff;
`;
const Text = styled.div`
  margin: 0 16px;
`;
const Number = styled.div``;

const Row = ({ row={} }) => {
  return (
    <RowWrapper>
      <ColorCode color={row.color} />
      <Text>{row.displayName || 'Unknown'}</Text>
      <Number>{row.count}</Number>
    </RowWrapper>
  );
};

const Legend = ({ rows=[] }) => {
  return (
    <Container className="legend">
      <Title>legend</Title>
      <Rows>
        {
          rows.map((row, i) => (
            <Row row={row} key={i} />
          ))
        }
      </Rows>
    </Container>
  );
};

export default Legend;
