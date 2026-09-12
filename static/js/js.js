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




function crearPedido({

    prioridad = "#9783f0",

    tiempo = 30,

    titulo = "Pedido",

    detalles = "",

    lat,

    lng

}) {


    /* =====================================================
       VALIDAR COORDENADAS
       ===================================================== */

    if (
        typeof lat !== "number" ||
        typeof lng !== "number"
    ) {

        console.error(
            "El pedido necesita lat y lng válidos."
        );

        return;

    }


    /* =====================================================
       CONTENEDOR DE PEDIDOS
       ===================================================== */

    const contenedor =
        document.getElementById(
            "display-message"
        );


    if (!contenedor) {

        console.error(
            "No existe #display-message en el HTML."
        );

        return;

    }


    /* =====================================================
       CREAR TARJETA
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
       INDICADOR DE PRIORIDAD
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
       ARMAR BOTONES
       ===================================================== */

    buttons.appendChild(
        acceptButton
    );

    buttons.appendChild(
        rejectButton
    );


    /* =====================================================
       ARMAR CONTENIDO
       ===================================================== */

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


    /* =====================================================
       ARMAR MENSAJE COMPLETO
       ===================================================== */

    mensaje.appendChild(
        time
    );

    mensaje.appendChild(
        indicator
    );

    mensaje.appendChild(
        messageContent
    );


    /* =====================================================
       AGREGAR A LA PANTALLA
       ===================================================== */

    contenedor.appendChild(
        mensaje
    );


    /* =====================================================
       CREAR MARCADOR
       =====================================================

       IMPORTANTE:

       MapLibre utiliza:

       [longitud, latitud]

       NO:

       [latitud, longitud]

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
       GUARDAR DATOS EN LA TARJETA
       ===================================================== */

    mensaje.dataset.lat =
        lat;

    mensaje.dataset.lng =
        lng;


    /*
       Guardamos referencia al marcador
       para poder eliminarlo después.
    */

    mensaje.marcador =
        marcador;


    /* =====================================================
       OBTENER DIRECCIÓN
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
                "Error obteniendo dirección:",
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


    /*
       Barra llena
    */

    time.style.width =
        "100%";


    /*
       Animación de la barra
    */

    time.style.transition =
        `width ${tiempo}s linear`;


    /*
       Esperamos un poco antes de
       empezar la animación.
    */

    setTimeout(
        () => {

            time.style.width =
                "0%";

        },
        50
    );


    /* =====================================================
       CONTADOR
       ===================================================== */

    const timer =
        setInterval(
            () => {

                tiempoRestante--;


                /*
                   ¿Se acabó el tiempo?
                */

                if (
                    tiempoRestante <= 0
                ) {

                    eliminarPedido();

                }

            },
            1000
        );


    /* =====================================================
       FUNCIÓN ELIMINAR PEDIDO
       ===================================================== */

    function eliminarPedido() {


        /*
           Detener el contador
        */

        clearInterval(
            timer
        );


        /*
           Eliminar marcador
        */

        if (
            mensaje.marcador
        ) {

            mensaje.marcador.remove();

        }


        /*
           Eliminar tarjeta
        */

        mensaje.remove();

    }


    /* =====================================================
       BOTÓN ACEPTAR
       ===================================================== */

    acceptButton.addEventListener(
        "click",
        () => {
            console.log(
                "Pedido aceptado:",
                titulo
            );
            console.log(
                "Coordenadas:",
                lat,
                lng
            );


            eliminarPedido();

        }
    );


    /* =====================================================
       BOTÓN RECHAZAR
       ===================================================== */

    rejectButton.addEventListener(
        "click",
        () => {
            console.log(
                "Pedido rechazado:",
                titulo
            );
            eliminarPedido();
        }
    );


    /* =====================================================
       CLICK EN LA TARJETA
       =====================================================

       Al tocar el pedido podemos centrar
       el mapa en sus coordenadas.
       ===================================================== */

    mensaje.addEventListener(
        "click",
        (evento) => {


            /*
               No mover el mapa cuando se
               presionan los botones.
            */

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


    /* =====================================================
       CLICK EN EL MARCADOR
       ===================================================== */

    marcador
        .getElement()
        .addEventListener(
            "click",
            () => {

                /*
                   Llevar la tarjeta al frente
                   desplazándola dentro del contenedor.
                */

                mensaje.scrollIntoView({

                    behavior: "smooth",

                    block: "nearest"

                });

            }
        );


    /* =====================================================
       DEVOLVER TARJETA
       ===================================================== */

    return mensaje;

}


/* =========================================================
   OBTENER DIRECCIÓN DESDE COORDENADAS
   =========================================================

   Convierte:

   lat = 25.6866
   lng = -100.3161

   en una dirección legible.

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
            url,
            {
                headers: {
                    "Accept":
                        "application/json"
                }
            }
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
    /*
       display_name contiene la dirección
       completa.
    */
    return datos.display_name;

}





crearPedido({
    prioridad: "#ff0000",
    tiempo: 30,
    titulo: "Pedido #001",
    detalles:
        "Recoger paquete y entregarlo al cliente.",
    lat: 25.6866,
    lng: -100.3161
});


crearPedido({
    prioridad: "#ff9800",
    tiempo: 30,
    titulo: "Pedido #002",
    detalles:
        "Recoger comida en el restaurante.",
    lat: 25.6712,
    lng: -100.3098
});


crearPedido({
    prioridad: "#00c853",
    tiempo: 30,
    titulo: "Pedido #003",
    detalles:
        "Paquete pequeño. Dejar en recepción.",
    lat: 25.6940,
    lng: -100.3270
});