// Constructores
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

// realiza la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function() {
    /*
        1 = Americano 1.15
        2 = Asiatico 1.05
        3 = Europeo 1.35
    */

    var cantidad;

    const base = 2000;

    switch(this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;               
            break;
        case '3':
            cantidad = base * 1.35;
            break;
        default: 
            break;
    }

    // leer el año
    const diferencia = new Date().getFullYear() - this.year;

    // cada año que la diferencia sea mayor, se reduce uin 3%
    cantidad -= ((diferencia * 3) * cantidad) / 100;

    /*
        si el seguro es basico se multiplica p[or un 30% mas
        si el seguro es completo se multiplica p[or un 50% mas
    */

    if(this.tipo === 'basico') {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }
    
    return cantidad;
}

// funcion interfaz de usuario
function UI() {}

// Llena las opciones de los años
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
          min = max - 20;
    
    const selectYear = document.querySelector('#year');

    for(var i = max; i > min; i--) {
        var option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

// mostrar mensaje de error o exito
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement('div');

    if(tipo === 'error') {
        div.classList.add('error')
    } else (
        div.classList.add('correcto')
    )

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000);
}

// utilizar el prototype que va a cotizar
UI.prototype.mostrarResultado = (total, seguro) => {

    const { marca, year, tipo } = seguro;

    var textoMarca;

    switch(marca) {
        case '1':
            textoMarca = 'Americano';
            break;
        case '2':
            textoMarca = 'Asiatico';
            break;
        case '3':
            textoMarca = 'Europeo';
            break;
        default:
            break;
    }
    
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal"> ${textoMarca} </span></p>
        <p class="font-bold">Año: <span class="font-normal"> ${year} </span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize"> ${tipo} </span></p>
        <p class="font-bold">Total: <span class="font-normal"> $ ${total} </span></p>
    `;

    const resultadoDiv = document.querySelector('#resultado');
    const btnSubmit = document.querySelector('button[type=submit]');
    
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';
    
    setTimeout(() => {
        spinner.style.display = 'none'; // se borra el spinner 
        resultadoDiv.appendChild(div); // se muestra el resultado
        btnSubmit.classList.remove('opacity-50');
        btnSubmit.disabled = false;
    }, 3000);
}

// Instanciar UI
const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones(); // llena el select con los años
})

// llama a los eventos
eventListeners();

// funcion de eventos
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

// cotizar seguro
function cotizarSeguro(e) {
    e.preventDefault();

    const marca = document.querySelector('#marca').value;
    const year = document.querySelector('#year').value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if(marca === '' || year === '' || tipo === '') {
        ui.mostrarMensaje('Todos los campos son obligatorios.', 'error');
        return;
    } 
        
    const btnSubmit = document.querySelector('button[type=submit]');

    btnSubmit.classList.add('opacity-50');
    btnSubmit.disabled = true;

    ui.mostrarMensaje('Cotizando', 'exito');

    const resultados = document.querySelector('#resultado div');

    if(resultados != null) {
        resultados.remove();
    }

    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    ui.mostrarResultado(total, seguro);

}