import React from 'react';
import SafeAreaBox from 'components/SafeAreaBox';
import { ScrollView, Text } from 'react-native';
import CommonButton from 'components/CommonButton';

export interface IErrorBoundary {
  error: Error;
  componentStack: string | null;
  eventId?: string | null;
  resetError?(): void;
}

export type FallbackProps = IErrorBoundary;
export function Fallback({ error, componentStack, resetError }: FallbackProps) {
  return (
    <SafeAreaBox>
      <ScrollView>
        <Text>
          {error.toString()}
          {componentStack}
        </Text>
        <CommonButton onPress={resetError} title="Click here to reset!" />
      </ScrollView>
    </SafeAreaBox>
  );
}
