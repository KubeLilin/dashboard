import { USER_MENU } from '../actionType';

export default function user<T>(state: any = null, action: { type: string; data: T }) {
  switch (action.type) {
    case USER_MENU:
      return {
        ...state,
        "menu": action.data
      }
    default:
      return state
  }
}