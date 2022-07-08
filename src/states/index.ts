import { atom } from 'recoil'
import { IUserInfo } from 'types/yweets'

export const userObjstate = atom<IUserInfo>({
  key: '#userObjstate',
  default: {
    uid: null,
    displayName: null,
  },
})
