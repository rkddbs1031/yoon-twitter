export interface IUserInfo {
  uid: string | null
  displayName: string | null
}

export interface IYweetsData {
  id: string
  createdAt?: number
  yweet?: string
  creatorId?: string
  imageurl?: string
}
