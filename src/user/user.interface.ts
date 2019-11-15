export interface IOAuthProfile {
  provider?: string;
  thirdPartyId?: string;
  name?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  verified: boolean;
}
