const pedidosActivos = new Set();
//CREAR MAPA DE MTY
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [-100.3161, 25.6866],
    zoom: 12
});


// ======================================
// MARCADOR DEL ORIGEN INEXISTENTE
// ======================================
let marcadorOrigen = null;
// HACER CLICK EN EL MAPA
// ======================================
map.on('click', async function (e) {
    const lon = e.lngLat.lng;
    const lat = e.lngLat.lat;
    // ==================================
    // BUSCAR LA CALLE MÁS CERCANA
    // ==================================
    const url =
        `https://router.project-osrm.org/nearest/v1/driving/` +
        `${lon},${lat}`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.code !== "Ok") {
            console.error("No se encontró una calle cercana.");
            return;
        }


        // Coordenadas corregidas sobre la calle
        const nuevoOrigen =
            datos.waypoints[0].location;

        console.log(
            "Nuevo origen:",
            nuevoOrigen
        );


        // ==================================
        // ACTUALIZAR MARCADOR
        // ==================================

        if (marcadorOrigen !== null) {

            marcadorOrigen
                .setLngLat(nuevoOrigen);

        } else {

            marcadorOrigen =
                new maplibregl.Marker()
                    .setLngLat(nuevoOrigen)
                    .addTo(map);

        }


        // ==================================
        // REGENERAR RUTA
        // ==================================

        calcularRuta(
            nuevoOrigen,
            destino
        );


    } catch (error) {

        console.error(
            "Error al buscar la calle:",
            error
        );

    }

});


// ======================================
// CALCULAR RUTA
// ======================================

async function calcularRuta(origen, destino) {

    const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${origen[0]},${origen[1]};` +
        `${destino[0]},${destino[1]}` +
        `?steps=true&geometries=geojson&overview=full`;


    try {

        const respuesta = await fetch(url);
        const datos = await respuesta.json();


        if (datos.code !== "Ok") {

            console.error(
                "No se encontró una ruta."
            );

            return;

        }


        const ruta = datos.routes[0];


        // ==================================
        // INFORMACIÓN DE LA RUTA
        // ==================================

        console.log("==============================");
        console.log("RUTA ENCONTRADA");
        console.log("==============================");

        console.log(
            "Distancia:",
            ruta.distance,
            "metros"
        );

        console.log(
            "Duración:",
            ruta.duration,
            "segundos"
        );


        // ==================================
        // CALLES Y MANIOBRAS
        // ==================================

        console.log("==============================");
        console.log("INSTRUCCIONES");
        console.log("==============================");


        ruta.legs[0].steps.forEach(
            (step, indice) => {

                console.log(
                    indice,
                    "Calle:",
                    step.name,
                    "| Distancia:",
                    step.distance,
                    "| Maniobra:",
                    step.maneuver.type,
                    "| Dirección:",
                    step.maneuver.modifier
                );

            }
        );


        // ==================================
        // ACTUALIZAR RUTA EN EL MAPA
        // ==================================

        const geojson = {

            type: 'Feature',

            geometry: ruta.geometry

        };


        // Si la ruta ya existe,
        // solamente la actualizamos

        if (map.getSource('ruta')) {

            map.getSource('ruta')
                .setData(geojson);

        }

        // Si todavía no existe,
        // la creamos

        else {

            map.addSource('ruta', {

                type: 'geojson',

                data: geojson

            });


            map.addLayer({

                id: 'ruta',

                type: 'line',

                source: 'ruta',

                paint: {

                    'line-color': '#30a98d',

                    'line-width': 6

                }

            });

        }


    } catch (error) {

        console.error(
            "Error al calcular la ruta:",
            error
        );

    }

}



/* =========================================================
   CREAR PEDIDO
   ========================================================= */

function crearPedido({

    id = null,

    prioridad = "#9783f0",

    tiempo = 30,

    titulo = "Pedido",

    detalles = "",

    lat,

    lng

}) {

    /* =====================================================
       VALIDAR DATOS
       ===================================================== */

    if (
        typeof lat !== "number" ||
        typeof lng !== "number"
    ) {

        console.error(
            "El pedido necesita coordenadas válidas."
        );

        return;

    }


    /* =====================================================
       CONTENEDOR
       ===================================================== */

    const contenedor =
        document.getElementById(
            "display-message"
        );


    /* =====================================================
       TARJETA
       ===================================================== */

    const mensaje =
        document.createElement("div");

    mensaje.classList.add(
        "mensaje"
    );


    /* =====================================================
       TIMER
       ===================================================== */

    const time =
        document.createElement("div");

    time.classList.add(
        "time"
    );


    /* =====================================================
       PRIORIDAD
       ===================================================== */

    const indicator =
        document.createElement("div");

    indicator.classList.add(
        "indicator"
    );

    indicator.style.backgroundColor =
        prioridad;


    /* =====================================================
       CONTENIDO
       ===================================================== */

    const messageContent =
        document.createElement("div");

    messageContent.classList.add(
        "message-content"
    );


    /* =====================================================
       TÍTULO
       ===================================================== */

    const message =
        document.createElement("div");

    message.classList.add(
        "message"
    );

    message.textContent =
        titulo;


    /* =====================================================
       DETALLES
       ===================================================== */

    const details =
        document.createElement("div");

    details.classList.add(
        "details"
    );

    details.textContent =
        detalles;


    /* =====================================================
       DIRECCIÓN
       ===================================================== */

    const address =
        document.createElement("div");

    address.classList.add(
        "address"
    );

    address.textContent =
        "📍 Buscando dirección...";


    /* =====================================================
       BOTONES
       ===================================================== */

    const buttons =
        document.createElement("div");

    buttons.classList.add(
        "buttons"
    );


    const acceptButton =
        document.createElement("button");

    acceptButton.classList.add(
        "accept-button"
    );

    acceptButton.textContent =
        "Aceptar";


    const rejectButton =
        document.createElement("button");

    rejectButton.classList.add(
        "reject-button"
    );

    rejectButton.textContent =
        "Rechazar";


    /* =====================================================
       ARMAR TARJETA
       ===================================================== */

    buttons.appendChild(
        acceptButton
    );

    buttons.appendChild(
        rejectButton
    );


    messageContent.appendChild(
        message
    );

    messageContent.appendChild(
        details
    );

    messageContent.appendChild(
        address
    );

    messageContent.appendChild(
        buttons
    );


    mensaje.appendChild(
        time
    );

    mensaje.appendChild(
        indicator
    );

    mensaje.appendChild(
        messageContent
    );


    contenedor.appendChild(
        mensaje
    );


    /* =====================================================
       MARCADOR
       ===================================================== */

    const marcador =
        new maplibregl.Marker({

            color: prioridad

        })

        .setLngLat([
            lng,
            lat
        ])

        .addTo(map);


    /* =====================================================
       OBJETO PEDIDO
       ===================================================== */

    const pedido = {

        id: id,

        titulo: titulo,

        detalles: detalles,

        prioridad: prioridad,

        tiempo: tiempo,

        lat: lat,

        lng: lng,

        mensaje: mensaje,

        marcador: marcador,

        timer: null,

        aceptado: false

    };


    /* =====================================================
       GUARDAR PEDIDO
       ===================================================== */

    pedidosActivos.add(
        pedido
    );


    /* =====================================================
       GUARDAR REFERENCIA
       ===================================================== */

    mensaje.pedido =
        pedido;


    /* =====================================================
       DIRECCIÓN
       ===================================================== */

    obtenerDireccion(
        lat,
        lng
    )

    .then(
        direccion => {

            address.textContent =
                "📍 " + direccion;

        }
    )

    .catch(
        error => {

            console.error(
                error
            );

            address.textContent =
                "📍 Dirección no disponible";

        }
    );


    /* =====================================================
       TIMER
       ===================================================== */

    let tiempoRestante =
        tiempo;


    time.style.width =
        "100%";


    time.style.transition =
        `width ${tiempo}s linear`;


    setTimeout(
        () => {

            time.style.width =
                "0%";

        },
        50
    );


    pedido.timer =
        setInterval(
            () => {

                tiempoRestante--;


                if (
                    tiempoRestante <= 0
                ) {

                    eliminarPedido(
                        pedido
                    );

                }

            },
            1000
        );


    /* =====================================================
       ACEPTAR
       ===================================================== */

    acceptButton.addEventListener(
        "click",
        () => {

            aceptarPedido(
                pedido
            );

        }
    );


    /* =====================================================
       RECHAZAR
       ===================================================== */

    rejectButton.addEventListener(
        "click",
        () => {

            rechazarPedido(
                pedido
            );

        }
    );


    /* =====================================================
       CLICK EN TARJETA
       ===================================================== */

    mensaje.addEventListener(
        "click",
        evento => {

            if (
                evento.target.tagName ===
                "BUTTON"
            ) {

                return;

            }


            map.flyTo({

                center: [
                    lng,
                    lat
                ],

                zoom: 16,

                duration: 1000

            });

        }
    );


    return mensaje;

}


/* =========================================================
   ACEPTAR PEDIDO
   ========================================================= */

async function aceptarPedido(
    pedidoAceptado
) {

    console.log(
        "Pedido aceptado:",
        pedidoAceptado
    );


    /* =====================================================
       ENVIAR COORDENADAS A FLASK
       ===================================================== */

    try {

        const respuesta =
            await fetch(
                "/api/pedido/aceptar",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        pedido_id:
                            pedidoAceptado.id,

                        lat:
                            pedidoAceptado.lat,

                        lng:
                            pedidoAceptado.lng

                    })

                }
            );


        if (
            !respuesta.ok
        ) {

            throw new Error(
                "Error enviando pedido al servidor."
            );

        }


        const datos =
            await respuesta.json();


        console.log(
            "Respuesta de Flask:",
            datos
        );


    }
    catch (error) {

        console.error(
            "No se pudo aceptar el pedido:",
            error
        );

        /*
           Si Flask rechaza la petición,
           NO eliminamos los pedidos.
        */

        return;

    }


    /* =====================================================
       ELIMINAR LOS DEMÁS PEDIDOS
       ===================================================== */

    pedidosActivos.forEach(
        pedido => {

            if (
                pedido !==
                pedidoAceptado
            ) {

                eliminarPedido(
                    pedido
                );

            }

        }
    );


    /* =====================================================
       MARCAR COMO ACEPTADO
       ===================================================== */

    pedidoAceptado.aceptado =
        true;


    /* =====================================================
       DETENER TIMER
       ===================================================== */

    if (
        pedidoAceptado.timer
    ) {

        clearInterval(
            pedidoAceptado.timer
        );

        pedidoAceptado.timer =
            null;

    }


    /* =====================================================
       ELIMINAR TARJETA
       ===================================================== */

    pedidoAceptado.mensaje.remove();


    /* =====================================================
       LIMPIAR LISTA
       ===================================================== */

    pedidosActivos.clear();

    pedidosActivos.add(
        pedidoAceptado
    );


    /* =====================================================
       CENTRAR MAPA EN DESTINO
       ===================================================== */

    map.flyTo({

        center: [

            pedidoAceptado.lng,

            pedidoAceptado.lat

        ],

        zoom: 16,

        duration: 1000

    });


    console.log(
        "Destino:",
        pedidoAceptado.lat,
        pedidoAceptado.lng
    );

}


/* =========================================================
   RECHAZAR
   ========================================================= */

function rechazarPedido(
    pedido
) {

    console.log(
        "Pedido rechazado:",
        pedido.id
    );


    eliminarPedido(
        pedido
    );

}


/* =========================================================
   ELIMINAR PEDIDO
   ========================================================= */

function eliminarPedido(
    pedido
) {

    /* Detener timer */

    if (
        pedido.timer
    ) {

        clearInterval(
            pedido.timer
        );

        pedido.timer =
            null;

    }


    /* Eliminar marcador */

    if (
        pedido.marcador
    ) {

        pedido.marcador.remove();

        pedido.marcador =
            null;

    }


    /* Eliminar tarjeta */

    if (
        pedido.mensaje
    ) {

        pedido.mensaje.remove();

        pedido.mensaje =
            null;

    }


    /* Quitar de pedidos activos */

    pedidosActivos.delete(
        pedido
    );

}


/* =========================================================
   OBTENER DIRECCIÓN
   ========================================================= */

async function obtenerDireccion(
    lat,
    lng
) {

    const url =
        `https://nominatim.openstreetmap.org/reverse` +
        `?format=json` +
        `&lat=${lat}` +
        `&lon=${lng}` +
        `&zoom=18` +
        `&addressdetails=1`;


    const respuesta =
        await fetch(
            url
        );


    if (
        !respuesta.ok
    ) {

        throw new Error(
            "No se pudo obtener la dirección."
        );

    }


    const datos =
        await respuesta.json();


    return datos.display_name;

}




/////////// CREACIÓN DE PEDIDOS DE PRUEBA ///////////
crearPedido({
    id: 123,
    prioridad: "#ff0000",
    tiempo: 30,
    titulo: "Pedido #123",
    detalles: "Entregar paquete.",
    lat: 25.6866,
    lng: -100.3161
});


crearPedido({
    id: 123,
    prioridad: "#d4ff00",
    tiempo: 30,
    titulo: "Pedido #123",
    detalles: "Entregar paquete.",
    lat: 35.6866,
    lng: -110.3161
});