import { IUser } from '../globalTypes'

export interface IAuth  {
    msg?:string
    access_token?: string,
    user?: IUser
}

