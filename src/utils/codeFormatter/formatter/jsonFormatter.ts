export default (strJsonCode: any) => {
    return JSON.stringify(JSON.parse(strJsonCode),null,'\t\t');
};