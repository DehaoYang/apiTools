export class LocalStorage {
    set: (key: string, value: any) => void
    get: (key: string) => any
    constructor() {
        this.set = (key: string, value: any): void => {
            window.localStorage[key] = JSON.stringify(value)
        }
        this.get = (key: string): any => {
            return window.localStorage[key] ? JSON.parse(window.localStorage[key]) : undefined
        }
    }
}
export class SessionStorage {
    set: (key: string, value: any) => void
    get: (key: string) => any
    constructor() {
        this.set = (key: string, value: any): void => {
            window.sessionStorage[key] = JSON.stringify(value)
        }
        this.get = (key: string): any => {
            return window.sessionStorage[key] ? JSON.parse(window.sessionStorage[key]) : undefined
        }
    }
}
