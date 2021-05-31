console.log(10)
const reqUrl='/test'
const xhr =new XMLHttpRequest()
xhr.open('GET', reqUrl)
xhr.responseType='json'
xhr.onload= ()=>{
    console.log(xhr.response)
}
xhr.send()