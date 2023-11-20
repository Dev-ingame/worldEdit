export function language(param, command=undefined, actor=undefined, result=undefined){
    if(command) return param.replace('${command}', command)
    if(actor) return param.replace('${actor}', actor)
    if(result) return param.replace('${result}', result)
    
}