const formulario = document.querySelector('#formulario');
const listaTareas = document.querySelector('#lista-tareas');

const tareaInput = document.querySelector('#tarea');
const fechaInput = document.querySelector('#fecha');

let editando;

eventsListeners();
function eventsListeners(){ 
    tareaInput.addEventListener('input', leerInput)
    fechaInput.addEventListener('input', leerInput)

    formulario.addEventListener('submit', agregarTarea);
}

window.addEventListener('DOMContentLoaded', () => {
    //Agregar al localStore
  
    
})

//CLASES

class Tareas{
    constructor(){
        this.arregloTareas = []
        
    }

    agregarTareaArreglo(infoTarea){
        this.arregloTareas = [...this.arregloTareas,infoTarea];
    }

    borrarTarea(id){
        this.arregloTareas = this.arregloTareas.filter(tarea => tarea.id !== id)
    }

    editarArreglo(infoTarea){
        this.arregloTareas = this.arregloTareas.map(tarea => tarea.id === infoTarea.id ? infoTarea : tarea)
        
    
    }
}

class UI{
    mostrarAlertas(mensaje,tipo){
        const divAlertas = document.createElement('div');
        divAlertas.classList.add('text-center', 'alert', 'p-0')

        divAlertas.textContent = mensaje;
        if(tipo === 'error'){
            divAlertas.classList.add('alert-danger')
        }else{
            divAlertas.classList.add('alert-success')
        }


        document.querySelector('.container').insertBefore(divAlertas, document.querySelector('.row'))

        setTimeout(() => {
            divAlertas.remove();
        },3000)
    }

    mostrarTareasHTML({arregloTareas}){
        this.limpiarHTML()

        agregarLocalStore(arregloTareas)

        arregloTareas.forEach(tareaObj => {
            
            const {tarea,fecha,id} = tareaObj;

            const itemTarea = document.createElement('li');
            itemTarea.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-2')


            itemTarea.innerHTML = `<span class="fw-bolder">${tarea} - ${fecha}</span>`

            const divBtn = document.createElement('div');
            divBtn.classList.add('d-flex', 'align-items-center', 'divBtn')
        

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'eliminar')
            btnEliminar.innerHTML = '<i class="far fa-trash-alt"></i>'
            btnEliminar.onclick = () => eliminarTarea(id)

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-success', 'editar')
            btnEditar.onclick = () => editarTarea(tareaObj)
            btnEditar.innerHTML = '<i class="fas fa-edit"></i>'

            const checked = document.createElement('input')
            checked.classList.add('check')
            checked.style.width = '25px'
            checked.style.height = '25px'
            checked.type = 'checkbox'
            checked.onchange = (e) => completas(e);

            divBtn.appendChild(btnEditar)
            divBtn.appendChild(btnEliminar)
            divBtn.appendChild(checked)

            itemTarea.appendChild(divBtn);
            listaTareas.appendChild(itemTarea)

            mostrarLocal()

        })
    }

    limpiarHTML(){
        while(listaTareas.firstChild){
            listaTareas.removeChild(listaTareas.firstChild)
        }
    }
}

//Instanciar las clases
const ui = new UI();
const administrarTareas = new Tareas();

const infoTarea = {
    tarea: '',
    fecha:'',
    
}

function leerInput(e){
    infoTarea[e.target.name] = e.target.value;

}

function agregarTarea(e){
    e.preventDefault();

    const { tarea, fecha } = infoTarea;
    if(tarea === '' || fecha === '' ){
        ui.mostrarAlertas('Debe agregar una tarea y una fecha', 'error')
        return;
    }

    if(editando){
        ui.mostrarAlertas('Se han guardado los cambios')

        administrarTareas.editarArreglo({...infoTarea})

        formulario.querySelector('button').textContent = 'Agregar Tarea'

        editando = false;
    }else{
        infoTarea.id = Date.now();

        //Agregar el objeto al arreglo
        administrarTareas.agregarTareaArreglo({...infoTarea})

        ui.mostrarAlertas('Se ha agregado la tarea')
    }
    

    //Limpiar el objeto
    limpiarObjeto()

    //Mostrar las tareas en el HTML
    ui.mostrarTareasHTML(administrarTareas)


    formulario.reset()


}

function limpiarObjeto(){
    infoTarea.tarea = '';
    infoTarea.fecha = '';
}

function eliminarTarea(id){
    administrarTareas.borrarTarea(id)

    ui.mostrarTareasHTML(administrarTareas)
}

function editarTarea(tareaObj){
    const {tarea,fecha,id} = tareaObj;

    tareaInput.value = tarea;
    fechaInput.value = fecha;


    infoTarea.tarea = tarea;
    infoTarea.fecha = fecha;
    infoTarea.id = id;

    formulario.querySelector('button').textContent = 'Guardar Cambios'

    editando = true;

}

function completas(e){
    const check = e.target.checked;
    const span = e.target.parentElement.parentElement.firstChild;
    const btnEditar = e.target.parentElement.firstChild;


    console.log(btnEditar)


    if(check){
        span.style.textDecoration = 'line-through'
        span.style.background = '#ccc'
        span.style.color = '#0000006b'
        btnEditar.disabled = true;
    }else{
        span.style.textDecoration = 'none'
        span.style.background = 'none'
        span.style.color = 'black'
        btnEditar.disabled = false;
    }

}

function agregarLocalStore(arregloTareas){
    localStorage.setItem('tarea', JSON.stringify(arregloTareas))

}

function mostrarLocal(){
    
    const tareasLocal = JSON.parse(localStorage.getItem('tarea'))
  
}