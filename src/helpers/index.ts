import { File } from "buffer"

export const shuffleArray = (array: any[]) => {
    const newArr = [...array]
    let currentIndex = newArr.length, randomIndex
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        [newArr[currentIndex], newArr[randomIndex]] = [newArr[randomIndex], newArr[currentIndex]]
    }
    return newArr
}

export const sortArray = (arr: any[], key: string | number, order?: boolean) => {
    return arr.slice().sort((a: any, b: any) => {
        const aValue = a[key]
        const bValue = b[key]
        if (typeof aValue !== 'number' && !aValue) return 1
        if (typeof bValue !== 'number' && !bValue) return -1
        return order ? aValue < bValue ? 1 : -1 : aValue < bValue ? -1 : 1
    })
}

export const getUser = () => localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}

export const convertToBase64 = (file: any) => {
    try {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result)
            }
            fileReader.onerror = (error) => {
                reject(error)
            }
        })
    } catch (err) {
        console.error(err)
    }
}

export const retryWithDelay = async <T>(fn: () => Promise<T>, maxAttempts: number, delayMs = 1000): Promise<T> => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    let attempts = 0
    while (attempts < maxAttempts) {
        try {
            const result = await fn()
            if (result) {
                return result
            }
        } catch (err: any) {
            console.error(`Attempt ${attempts + 1} failed: ${err.message}`)
        }
        attempts++
        await delay(delayMs)
    }
    throw new Error(`Maximum retry attempts reached (${maxAttempts})`)
}

export const createSlug = (word: string) => {
    return word
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

export const getDate = (dateString: Date | number | string | undefined) => {
    if (dateString) {
        const date = new Date(dateString)
        if (date.getHours() === 24) date.setHours(0)
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    }
}

export const history = (path = '/') => {
    const prod = process.env.NODE_ENV === 'production'
    const mainDomain = prod ? 'anechooftheheart.com' : 'localhost:3000'
    const protocol = prod ? window.location.protocol : 'http:'
    window.location.href = `${protocol}//${mainDomain}${path}`;
}

export const capitalizeFirstLetter = (str: string) => {
    return String(str).charAt(0).toUpperCase() + String(str).slice(1)
}