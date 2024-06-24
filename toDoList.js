/*
// VARIABLES
const formulario = document.querySelector("#formulario");
const tareas = document.querySelector("#tareas");
const total = document.querySelector("#total");
const completadas = document.querySelector("#completadas");
let task = [];

// EVENTOS
(() => {
    formulario.addEventListener('submit', validarFormulario);
    tareas.addEventListener("click", eliminarTarea);
    tareas.addEventListener("click", completarTarea);
    document.addEventListener("DOMContentLoaded", () => {
        let datosLS = JSON.parse(localStorage.getItem("tareas")) || [];
        task = datosLS;
        agregarHTML();
    })
})()

// FUNCIONES
function validarFormulario(e) {
    e.preventDefault();
    //validar los campos
    const tarea = document.querySelector("#tarea").value;
    if (tarea.trim().length === 0) {
        console.log('vacio');
        return
    }

    //creamos el objeto tarea
    const objTarea = { id: Date.now(), tarea: tarea, estado: false };
    //agregamos al array sin mutar dicho arreglo
    task = [...task, objTarea];
    formulario.reset();

    //agregamos al HTML
    agregarHTML();

}


function agregarHTML() {

    //limpiar el HTML
    while (tareas.firstChild) {
        tareas.removeChild(tareas.firstChild)
    }

    if (task.length > 0) {
        task.forEach(item => {
            const elemento = document.createElement('div');
            elemento.classList.add('item-tarea');
            elemento.innerHTML = `
                <p>${item.estado ? (
                    `<span class='completa'>${item.tarea}</span>`
                ) : (
                    `<span>${item.tarea}</span>`
                )}</p>
                <div class="botones">
                    <button class="eliminar" data-id="${item.id}">Eliminar</button>
                    <button class="completada" data-id="${item.id}">Completada</button>
                </div>
            `
            tareas.appendChild(elemento)
        });

    } else {
        const mensaje = document.createElement("h5");
        mensaje.textContent = "~SIN TAREAS~"
        tareas.appendChild(mensaje)
    }

    let totalTareas = task.length;
    let tareasCompletas = task.filter(item => item.estado === true).length;

    total.textContent = `Total tareas: ${totalTareas}`;
    completadas.textContent = `Tareas Completadas: ${tareasCompletas}`;

    //persistir los datos con localStorage
    localStorage.setItem("tareas", JSON.stringify(task))

}

function eliminarTarea(e) {
    if (e.target.classList.contains("eliminar")) {
        const tareaID = Number(e.target.getAttribute("data-id"));
        //eliminamos con el array method filter
        const nuevasTareas = task.filter((item) => item.id !== tareaID);
        task = nuevasTareas;
        agregarHTML();
    }
}


//completar tarea
function completarTarea(e) {
    if (e.target.classList.contains("completada")) {
        const tareaID = Number(e.target.getAttribute("data-id"));
        const nuevasTareas = task.map(item => {
            if (item.id === tareaID) {
                item.estado = !item.estado;
                return item;
            } else {
                return item
            }
        })

        //editamos el arreglo
        task = nuevasTareas;
        agregarHTML();
    }
}
*/


class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    add(data) {
        const newNode = new Node(data);
        if (this.size === 0) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        this.size++;
    }

    remove(node) {
        if (!node) return;

        if (node.prev) {
            node.prev.next = node.next;
        } else {
            this.head = node.next;
        }

        if (node.next) {
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev;
        }

        this.size--;
    }

    toArray() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        return result;
    }

    static fromArray(arr) {
        const list = new DoublyLinkedList();
        arr.forEach(data => list.add(data));
        return list;
    }

    find(callback) {
        let current = this.head;
        while (current) {
            if (callback(current.data)) {
                return current;
            }
            current = current.next;
        }
        return null;
    }
}


/* VARIABLES */
const formulario = document.querySelector("#formulario");
const tareas = document.querySelector("#tareas");
const total = document.querySelector("#total");
const completadas = document.querySelector("#completadas");
const taskList = new DoublyLinkedList();

/* EVENTOS */
(() => {
    formulario.addEventListener('submit', validarFormulario);
    tareas.addEventListener("click", manejarClicks);
    document.addEventListener("DOMContentLoaded", () => {
        let datosLS = JSON.parse(localStorage.getItem("tareas")) || [];
        const loadedList = DoublyLinkedList.fromArray(datosLS);
        let current = loadedList.head;
        while (current) {
            taskList.add(current.data);
            current = current.next;
        }
        agregarHTML();
    });
})();

/* FUNCIONES */
function validarFormulario(e) {
    e.preventDefault();
    const tarea = document.querySelector("#tarea").value;
    if (tarea.trim().length === 0) {
        console.log('vacio');
        return;
    }

    const objTarea = { id: Date.now(), tarea: tarea, estado: false };
    taskList.add(objTarea);
    formulario.reset();
    agregarHTML();
}

function agregarHTML() {
    while (tareas.firstChild) {
        tareas.removeChild(tareas.firstChild);
    }

    if (taskList.size > 0) {
        let current = taskList.head;
        while (current) {
            const item = current.data;
            const elemento = document.createElement('div');
            elemento.classList.add('item-tarea');
            elemento.innerHTML = `
                <p>${item.estado ? (
                    `<span class='completa'>${item.tarea}</span>`
                ) : (
                    `<span>${item.tarea}</span>`
                )}</p>
                <div class="botones">
                    <button class="eliminar" data-id="${item.id}">Eliminar</button>
                    <button class="completada" data-id="${item.id}">Completada</button>
                </div>
            `;
            tareas.appendChild(elemento);
            current = current.next;
        }
    } else {
        const mensaje = document.createElement("h5");
        mensaje.textContent = "~SIN TAREAS~";
        tareas.appendChild(mensaje);
    }

    let totalTareas = taskList.size;
    let tareasCompletas = taskList.toArray().filter(item => item.estado === true).length;

    total.textContent = `Total tareas: ${totalTareas}`;
    completadas.textContent = `Tareas Completadas: ${tareasCompletas}`;

    localStorage.setItem("tareas", JSON.stringify(taskList.toArray()));
}

function manejarClicks(e) {
    if (e.target.classList.contains("eliminar")) {
        eliminarTarea(e.target.getAttribute("data-id"));
    } else if (e.target.classList.contains("completada")) {
        completarTarea(e.target.getAttribute("data-id"));
    }
}

function eliminarTarea(tareaID) {
    const node = taskList.find(item => item.id === Number(tareaID));
    taskList.remove(node);
    agregarHTML();
}

function completarTarea(tareaID) {
    const node = taskList.find(item => item.id === Number(tareaID));
    if (node) {
        node.data.estado = !node.data.estado;
        agregarHTML();
    }
}
