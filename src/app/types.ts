export type AppContextType = {
    isMobile: boolean
    isLoggedIn: boolean | null
    setIsLoggedIn: (value: boolean) => void
    darkMode: boolean
    setDarkMode: (value: boolean) => void
}

export type onChangeEventType = React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>

export type dataObj<T = any> = Record<string | number, T>

export type userType = {
    _id?: string
    username?: string
    email?: string
    password?: string
    newData?: { [key: string]: string }
    token?: string
}