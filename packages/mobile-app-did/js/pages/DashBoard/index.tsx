import React from 'react';
import Card from './Card';
import DashBoardTab from './DashBoardTab';
import SafeAreaBox from 'components/SafeAreaBox';
import { BGStyles } from 'assets/theme/styles';

const DashBoard: React.FC = () => {
  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.bg5]}>
      <Card />
      <DashBoardTab />
    </SafeAreaBox>
  );
};

export default DashBoard;
