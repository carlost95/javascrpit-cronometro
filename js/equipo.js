/*
 *Declaracion de clases
 */
class Equipo {
  constructor(nombreEquipo, localidadEquipo, provinciaEquipo) {
    this.nombreEquipo = nombreEquipo;
    this.localidadEquipo = localidadEquipo;
    this.provinciaEquipo = provinciaEquipo;
  }
}

/*
 !CARGAR EQUIPOS EXISTENTES EN LOCAL STORAGE
 */
function cargarEquiposExistentes() {
  let equiposCargados = JSON.parse(localStorage.getItem("equipos"));
  if (equiposCargados != null && equiposCargados.length != 0) {
    for (const eqp of equiposCargados) {
      agregarFila(eqp);
    }
  } else {
    equiposCargados = [];
  }
}

/*
 ? consultas API REST de Provincias y localidades
 */

const URLAPI = "http://localhost:3000/provincias";

function obtenerProvincias() {
  const provSelect = $("#provincia");
  $.getJSON(URLAPI, function (response, estado) {
    console.warn(response);
    if (estado === "success") {
      const provincias = response;
      for (const items of provincias) {
        provSelect.append(`<option value=${items.id}>${items.nombre}</option>`);
      }
    }
  });
}
/*
TODO const URLAPI = "https://apis.datos.gob.ar/georef/api/provincias";
?function obtenerProvincias() {
 ? const provSelect = $("#provincia");
  ?$.getJSON(URLAPI, function (response, estado) {
   ? if (estado == "success") {
    ?  const provincias = response.provincias;
     ? for (const items of provincias) {
      ?  provSelect.append(`<option value=${items.id}>${items.nombre}</option>`);
      ?}
    ?}
  ?});
?}
*/
/*
 *Funcion carga de municipios  al select localidad
 */
// $("#provincia").change((event) => {
//   const idProvincia = event.target.value;
//   const URLAPIMUNI = `https://apis.datos.gob.ar/georef/api/municipios?provincia=${idProvincia}&campos=id,nombre&max=100`;
//   cargarMinicipio(URLAPIMUNI);
// });

// function cargarMinicipio(URLAPIMUNI) {
//   const munSelect = $("#localidad");
//   $("#localidad").html("");
//   $.getJSON(URLAPIMUNI, function (response, estado) {
//     if (estado === "success") {
//       const localidades = response.municipios;
//       munSelect.append(`<option value=${0}>Localidad</option>`);
//       for (const local of localidades) {
//         munSelect.append(`<option value=${local.id}>${local.nombre}</option>`);
//       }
//     }
//   });
// }
$("#provincia").change((event) => {
  const idProvincia = event.target.value;
  const URLAPIMUNI = `http://localhost:3000/municipios/${idProvincia}`;
  cargarMinicipio(URLAPIMUNI);
});

function cargarMinicipio(URLAPIMUNI) {
  const munSelect = $("#localidad");
  $("#localidad").html("");
  $.get(URLAPIMUNI, function (response, estado) {
    console.warn("respuesta");
    console.log(response, estado);
    if (estado === "success") {
      const localidades = response;
      munSelect.append(`<option value=${0}>Localidad</option>`);
      for (const local of localidades) {
        munSelect.append(`<option value=${local.id}>${local.nombre}</option>`);
      }
    }
  });
}
/*
 *Funcion CREAR EQUIPO
 * newEquipo.localidadEquipo = document.getElementById("localidadEquipo").value;
 */
function agregarEquipo() {
  const newEquipo = new Equipo();
  let indexProv = document.formEquipo.provincia.selectedIndex;
  let indexLoc = document.formEquipo.localidad.selectedIndex;

  newEquipo.nombreEquipo = formulario.nombre.value;
  newEquipo.provinciaEquipo = formulario.provincia.options[indexProv].text;
  newEquipo.localidadEquipo = formulario.localidad.options[indexLoc].text;

  equipos.push(newEquipo);
  const storageEquipos = JSON.parse(localStorage.getItem("equipos")) || [];
  const todosEquipos = [...storageEquipos, newEquipo];

  agregarFila(newEquipo); //AGREGAR UNA FILA EN LA TABLA

  localStorage.setItem("equipos", JSON.stringify(todosEquipos));
}

/*
 *INSERTAR UN NUEVO REGISTO DE EQUIPO EN EL HTML
 */
function agregarFila(equipo) {
  const tablaEquipos = $("#tablaEquipos");
  tablaEquipos.fadeIn(3000).append(`<tr>
  <td>${equipo.nombreEquipo}</td>
  <td>${equipo.provinciaEquipo}</td>
  <td>${equipo.localidadEquipo}</td>
  </tr>
  `);
}
/*
 *DECLARACION DE ELEMENTOS A UTILIZAR
 */
const expresionCadena = /^[a-zA-Z0-9/ /??]{2,30}$/;
let equiposCargados = [];
let equipos = [];

// acceso para la validacion de input del formulario
const equipoValido = {
  nombre: false,
  localidad: false,
  provincia: false,
};

/*
 *obtencion del formulario e inputs de formulario
 */
const formulario = document.getElementById("formEquipo");
const inputs = document.querySelectorAll("#formEquipo input");
const selections = document.querySelectorAll("#formEquipo select");

/*
 *VALIDACION DE INPUT DEL FORMULARIO DE EQUIPO
 */
const validarInputFormulario = (evento) => {
  switch (evento.target.name) {
    case "nombre":
      validarInputForm(expresionCadena, evento.target, "nombre");
      break;
    case "provincia":
      validarInputFormSelect("provincia");
      break;
    case "localidad":
      validarInputFormSelect("localidad");
      break;
  }
};

/*
 *VALIDACION DE SELECT EN LOS FORMULARIOS CON FUNCIONES
 */
const validarInputFormSelect = (idForm) => {
  let provForm = document.forms["formEquipo"][idForm].selectedIndex;
  if (provForm != 0) {
    document
      .querySelector(`#equipo__${idForm} .error__formulario`)
      .classList.remove("error__formulario--activo");
    equipoValido[idForm] = true;
  } else {
    document
      .querySelector(`#equipo__${idForm} .error__formulario`)
      .classList.add("error__formulario--activo");
    equipoValido[idForm] = false;
  }
};
/*
 *VALIDACION DE INPUT EN LOS FORMULARIOS CON FUNCIONES
 */
const validarInputForm = (expresion, input, idForm) => {
  if (expresion.test(input.value)) {
    document
      .querySelector(`#equipo__${idForm} .error__formulario`)
      .classList.remove("error__formulario--activo");
    equipoValido[idForm] = true;
  } else {
    document
      .querySelector(`#equipo__${idForm} .error__formulario`)
      .classList.add("error__formulario--activo");
    equipoValido[idForm] = false;
  }
};
/*
 *CONTROL DE EVENTOS EN LOS INPUT DEL FORMULARIO
 */
inputs.forEach((input) => {
  input.addEventListener("keyup", validarInputFormulario);
  input.addEventListener("blur", validarInputFormulario);
});
selections.forEach((select) => {
  select.addEventListener("click", validarInputFormulario);
  select.addEventListener("keyup", validarInputFormulario);
});
/*
 *AGREGADO DE EVENTLISTENER
 */
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (equipoValido.nombre && equipoValido.provincia && equipoValido.localidad) {
    agregarEquipo();
    formulario.reset();
  }
});

// cargarEquiposExistentes();
obtenerProvincias();