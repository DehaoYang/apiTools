export default (sendData:any,type:string)=>{
    switch (type){
        case 'params':
            return 1
        case 'body':
            return 2
        case 'formData':
            return 3
        default:
            return 0
    }
}
