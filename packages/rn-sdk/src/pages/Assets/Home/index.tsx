import React from 'react';
import AssetsHome from './AssetsHome';
import DashBoardTab from './DashBoardTab';
import SafeAreaBox from '@portkey-wallet/rn-components/components/SafeAreaBox';
import { BGStyles } from 'assets/theme/styles';

const DashBoard: React.FC = ({ containerId }: { containerId?: any }) => {
  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.bg5]}>
      <AssetsHome containerId={containerId} />
      <DashBoardTab />
    </SafeAreaBox>
  );
};

export default DashBoard;
