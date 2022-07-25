let arr=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100]
let name=document.querySelector('#name')
let surname=document.querySelector('#surname')
let number=document.querySelector('#number')
let week=Math.floor(Math.random()*arr.length)
let curPage=1
let pageTotalCount=1
let month=Math.floor(Math.random()*arr.length)

let bntAdd=document.querySelector('#btn-add')

let API='http://localhost:8000/students'
let search=document.querySelector('#search')
let searchVal=''
let studentsList=document.querySelector('#students-list')
let id=Math.floor(Date.now()/10000000)

let prev=document.querySelector('.prev')
let next=document.querySelector('.next')
let closebtn=document.querySelector('#closeBtn')
closebtn.addEventListener('click',()=>{
    modal_edit.style.display='none'
})
let paginationList=document.querySelector('.pagination-list')
let btnEdit=document.querySelector('#btn-save-edit')
let nameEdit=document.querySelector('#nameEdit')
let surnameEdit=document.querySelector('#surnameEdit')
let numberEdit=document.querySelector('#numberEdit')

let btn_Edit = document.querySelector('#btn-edit')
let modal_edit = document.querySelector('#modal_edit')

btn_Edit.addEventListener('click', ()=> {
modal_edit.style.display='block';
})


bntAdd.addEventListener('click',async ()=>{
let obj={
    name:name.value,
    surname:surname.value,
    number:number.value,
    weekKpi:week,
    monthKpi:month,
}
    if(!obj.name.trim() || !obj.surname.trim()||!obj.number.trim()){
        alert('enter values');
        return
    }
await fetch(API,{
    method:"POST",
    body:JSON.stringify(obj),
    headers:{
        "Content-type":"application/json; charset=utf-8"
    }
})
name.value=''
surname.value=''
number.value=''
    render()
})
async function render(){
    let students=await fetch(`${API}?q=${searchVal}&_page=${curPage}&_limit=3`).then(res=>res.json())
    drawPageButton()
    studentsList.innerHTML=""
    students.forEach((el)=>{
        let newEl=document.createElement('div')
        newEl.innerHTML=`
<table style="border-collapse: collapse; border-spacing: 0">
        
			<th>${el.id}</th>
			<th>${el.name}</th>
			<th>${el.surname}</th>
			<th>${el.number}</th>
			<th>${el.weekKpi}</th>
			<th>${el.monthKpi}</th>
		<th><button class="btn btn-danger" id=${el.id}>DELETE</button></th>
		<th><button  data-bs-toggle="modal" data-bs-target="#exampleModal" id=${el.id} class="btn btn-primary btn-edit">EDIT</button></th>
		
        </table>
        `
        studentsList.append(newEl)
    })
}
render()

document.addEventListener('click',async (e)=>{
    if(e.target.classList.contains('btn-danger')){
        let id=e.target.id
        await fetch(`${API}/${id}`,{
            method:"DELETE",
        })
        render()
    }
})
search.addEventListener('input', () => {
    searchVal = search.value;
    curPage = 1;
    render();
});
function drawPageButton(){
    fetch(`${API}?q=${searchVal}`).then(res=>res.json()).then(data=>{
        pageTotalCount=Math.ceil(data.length/3)
        paginationList.innerHTML=''
        for(let i=1;i<=pageTotalCount;i++){
            if(curPage===i){
                let page=document.createElement('li')
                page.innerHTML=`<li class="page-item active"><a class="page-link page-number" href="#">${i}</a></li>`
                paginationList.append(page)
            }
            else{
                let page=document.createElement('li')
                page.innerHTML=`<li class="page-item"><a class="page-link page-number" href="#">${i}</a></li>`
                paginationList.append(page)
            }
        }
    })
}
drawPageButton()
prev.addEventListener('click',()=>{
    if(curPage<=1){
        return;
    }
    curPage--
    render()
})
next.addEventListener('click',()=>{
    if(curPage>=pageTotalCount){
        return;
    }
    curPage++
    render()
})
document.addEventListener('click',(e)=>{
    if(e.target.classList.contains('page-number')){
        curPage=e.target.innerText
    }
    render()
})
document.addEventListener('click',(e)=>{
    if(e.target.classList.contains('btn-edit')){
        let id=e.target.id
        fetch(`${API}/${id}`).then(res=>res.json()).then(data=>{
            nameEdit.value=data.name
            surnameEdit.value=data.surname
            numberEdit.value=data.number

            btnEdit.setAttribute('id',data.id)
        })


    }

})

btnEdit.addEventListener('click',function (e){
    let id=this.id
    let name=nameEdit.value
    let surname=surnameEdit.value
    let number=numberEdit.value

    let editted={
        name:name,
        surname:surname,
        number:number,
    }
    saveEdit(editted,id)
})
async function saveEdit(editted,id){
    await  fetch(`${API}/${id}`,{
        method:'PATCH',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(editted)
    })
    render()
}