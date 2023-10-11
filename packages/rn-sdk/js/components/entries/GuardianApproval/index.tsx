import { SocialRecoveryConfig } from 'model/verify/social-recovery';
import { PortkeyEntries } from '../../../config/entries';
import BaseContainer, { BaseContainerProps } from '../../../model/container/BaseContainer';
import GuardianApproval from 'pages/Guardian/GuardianApproval';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class GuardianApprovalEntryPage extends BaseContainer<
  GuardianApprovalPageProps,
  GuardianApprovalPageState,
  GuardianApprovalPageResult
> {
  constructor(props: GuardianApprovalPageProps) {
    super(props);
    const { deliveredGuardianListInfo } = props;
    if (!deliveredGuardianListInfo) throw new Error('guardianConfig is null!');
    const verifiedTime = new Date().getTime();
    this.state = {
      verifiedTime,
      socialRecoveryConfig: JSON.parse(deliveredGuardianListInfo),
    };
  }

  getEntryName = (): string => PortkeyEntries.GUARDIAN_APPROVAL_ENTRY;

  onPageFinish = (result: GuardianApprovalPageResult) => {
    this.onFinish({
      status: result.isVerified ? 'success' : 'fail',
      data: result,
    });
  };

  render() {
    const { socialRecoveryConfig, verifiedTime } = this.state;
    return (
      <SafeAreaProvider>
        <GuardianApproval
          guardianListConfig={socialRecoveryConfig}
          verifiedTime={verifiedTime}
          onPageFinish={this.onPageFinish}
        />
      </SafeAreaProvider>
    );
  }
}

export interface GuardianApprovalPageProps extends BaseContainerProps {
  deliveredGuardianListInfo: string; // SocialRecoveryConfig
}

export interface GuardianApprovalPageState {
  verifiedTime: number;
  socialRecoveryConfig: SocialRecoveryConfig;
}

export interface GuardianApprovalPageResult {
  isVerified: boolean;
}
