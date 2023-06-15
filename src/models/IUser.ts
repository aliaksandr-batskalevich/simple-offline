export type IUser = {
    id: number
    username: string
    isActivated: boolean
    isFollowed: boolean
    status: null | string
} & IUserStatistics;

export type IUserStatistics = {
    subscribersCount: number

    gamesJuniorCount: number
    gamesJuniorWinsCount: number
    gamesMiddleCount: number
    gamesMiddleWinsCount: number
    gamesSeniorCount: number
    gamesSeniorWinsCount: number

    sparringCount: number
    sparringWinsCount: number

    rating: number
}

export type IUserPart = Pick<IUser, 'id' | 'username' | 'rating' | 'isFollowed'>;