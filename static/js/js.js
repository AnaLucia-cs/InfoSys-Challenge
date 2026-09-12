let marcador = null;

const colores = [
    '#7ca3f8', // rojo
    '#006eff', // verde
    '#0000FF', // azul
    '#4218b5', // naranja
    '#800080', // morado
    '#a52f98'  // amarillo
];

//poner mapa en pantalla map
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [-100.3161, 25.6866],
    zoom: 12
});


//agregar marcadores en el mapa con un click

//al click, ejecutar esta función
//e= contiene info sobre el click
//async=permite usar await dentro de la función
map.on('click', async function (e) {

    const lon = e.lngLat.lng;
    const lat = e.lngLat.lat;

    const url =
        `https://router.project-osrm.org/nearest/v1/driving/${lon},${lat}`;

    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    if (datos.code === 'Ok') {
        const punto = datos.waypoints[0].location;

        // Eliminar el marcador anterior
        if (marcador) {
            marcador.remove();
        }

        // Elegir color aleatorio
        const colorAleatorio =
            colores[Math.floor(Math.random() * colores.length)];

        // Crear el nuevo marcador
        marcador = new maplibregl.Marker({
            color: colorAleatorio
        })
            .setLngLat(punto)
            .addTo(map);

        console.log("Punto seleccionado:", punto);
        
        fetch('/ubi_repartidor_inicial', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lat: lat,
                lon: lon
        })
    });

    }
});
