//variables globales
let formulario = document.querySelector("#formulario")
let tbody = document.querySelector("#tbody")
let myModalEl = document.querySelector("#modalFormProducto")
let inputNombre = document.querySelector("#nombre")
let inputPrecio = document.querySelector("#precio")
let inputStock = document.querySelector("#stock")

let bandera = false;


//fetch - solicitudes
//peticion
const requestPost = async (data) => {
    try {
        let res = await fetch("https://63364e0965d1e8ef266ab394.mockapi.io/productos", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body : JSON.stringify(data),
        })

        let json = await res.json();
        console.log(res);
        if(!res.ok) {
            throw {status:res.statusText}
        }
    } catch (error) {
        document.querySelector("#errorAlcargar").innerHTML = `<h2>Error: ${error.status}, vuelva a cosultar.</h2>`
    }
}


const requestGet = async () => {
    try {
        let res = await fetch("https://63364e0965d1e8ef266ab394.mockapi.io/productos",)
        let json = await res.json();
        console.log(json);

        if(!res.ok) {
            throw {status:res.statusText}
        }

        generarTabla(json)

    } catch (error) {
        alert("Error: " + error.status)
    }
    
}

const requestDelete = (url) => {

    fetch(url,{
        method: "DELETE",
    })

}

//PUT: sirve para modificar
const requestPut = (url, data) =>{
    fetch(url, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        //body: cuerpo de la peticion, contenido
        body: JSON.stringify(data)
    })
}

//programa - eventos
const generarTabla = (arrayProductos) =>{
    arrayProductos.map( el => {
        let {id, nombre, precio, stock} = el;
        tbody.innerHTML += `
            <tr>
                <th scope="row">${id}</th>
                <td>${nombre}</td>
                <td>${precio}</td>
                <td>${stock}</td>
                <td>
                <button class="btn-editar btn btn-warning" data-id=${id} data-producto=${nombre} data-precio=${precio} data-stock=${stock}>editar</button>
                <button class="btn-eliminar btn btn-danger" data-id=${id}>eliminar</button>
                </td>

            </tr>
            `
            eventoEliminar()
            eventoEditar()
    })
}

const eventoEliminar = () =>{
    let btns = document.querySelectorAll(".btn-eliminar");
    for (const btn of btns) {
        btn.addEventListener("click", (evento) =>{
            let idEliminar = evento.target.attributes[1].textContent;
            requestDelete(`https://63364e0965d1e8ef266ab394.mockapi.io/productos/${idEliminar}`)
        })
    }
    

}

const eventoEditar = () =>{
    let btns = document.querySelectorAll(".btn-editar")

    for (const btn of btns) {
        btn.addEventListener("click", (event) =>{
            console.dir(event.target.attributes[1].textContent);
            let modal = new bootstrap.Modal(myModalEl)
            modal.show(myModalEl) //metodo show bootstrap documentacion
            inputNombre.value = event.target.attributes[2].textContent;
            inputPrecio.value = event.target.attributes[3].textContent;
            inputStock.value = event.target.attributes[4].textContent;
            let btnActualizar = document.querySelector("#formulario .btn-primary");
            btnActualizar.setAttribute("data-id", event.target.attributes[1].textContent);
            bandera = true
        })
        
    }
    
    

    
}

formulario.addEventListener("submit", async (event)=>{
    event.preventDefault()
    let nombre = inputNombre.value;
        let precio = inputPrecio.value;
        let stock = inputStock.value;

        let producto ={
            nombre,
            precio,
            stock
        }

    if(bandera == false){
        await requestPost(producto)
    }else{
        let btnActualizar = document.querySelector("#formulario .btn-primary")
        console.dir(btnActualizar)
        let id = btnActualizar.attributes[1].textContent;
        console.log(id);
        await requestPut(`https://63364e0965d1e8ef266ab394.mockapi.io/productos/${id}`, producto)
        bandera = false;
    }
    
    formulario.reset()
    location.reload()
    console.log(producto);
})

document.addEventListener("DOMContentLoaded", requestGet)
