import jsFormatter from "./formatter/jsFormatter"
import jsonFormatter from "./formatter/jsonFormatter"
export default (content: string, lang: string):string => {
    switch (lang) {
        case 'javascript':
            return jsFormatter(content)
        case 'json':
            return jsonFormatter(content)
        default:
            return "nonono"
    }
}