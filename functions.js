function f(){
    console.log(251)
}
function SetArray(arr, field){
    let setArray=[]
    for(el of arr){
        setArray.push(el[field])
      }
      setArray=Array.from(new Set(setArray))
      return setArray
}
module.exports.f=f
module.exports.SetArray=SetArray