export const isUserBiometricsError = (error: { message?: string }): boolean =>
  !!(error?.message?.includes('canceled') || error?.message?.includes('authentication'));
