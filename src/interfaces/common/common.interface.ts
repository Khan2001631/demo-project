export interface Tile {
  tileCode: string,
  tilePage: string,
  tileRating: number,
  tileShareTitle: string,
  tileShareDesc: string,
  tileShareURL: string,
  tileShareImageURL: string,
}
export interface commonSliceInterface {
  isLoggedIn: boolean,
  fullPageLoader: boolean,
  alertMessage: {
    status: string, message: string, timeout: number | null
  },
  isSessionExpired: boolean,
  isRefreshTokenExpired: boolean;
  reloadPageAfterSessionExpired: boolean,
  user: {
    userEmail: string,
    userId: number,
    firstName: string,
    lastName: string,
    picPath: string,
    totalCCPoints: string,
    usrCreatedDate: string,
    referralId: string,
    libraryType: string,
    roleInOrg: string,
    blcUsercount: number,
    GPTBlueID: number,
    blcFlag: boolean,
    accId: number,
    orgId: number,
    accountType: string,
  },
  currentPrompt: object,
  TileInfo: Tile[]
}