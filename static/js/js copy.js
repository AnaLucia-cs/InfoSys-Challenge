const colores = [
    '#7ca3f8', // rojo
    '#006eff', // verde
    '#0000FF', // azul
    '#4218b5', // naranja
    '#800080', // morado
    '#a52f98'  // amarillo
];

//CREAR MAPA DE MTY
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [-100.3161, 25.6866],
    zoom: 12
});


// ======================================
// DESTINO
// ======================================
const destinos ={ [-100.2930, 25.6710]};
// ======================================
// MARCADOR DEL ORIGEN INEXISTENTE
// ======================================
let marcadorOrigen = null;
// ======================================
// CREAR MARCADOR DEL DESTINO
// ======================================
new maplibregl.Marker()
    .setLngLat(destino)
    .addTo(map);


// ======================================
// CUANDO EL MAPA TERMINE DE CARGAR
// ======================================
map.on('load', function () {
    // Ruta inicial
    calcularRuta([-100.3161, 25.6866], destino);
});


// ======================================
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