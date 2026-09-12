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
    //obtener coordenadas del lugar donde hiciste click
    const lon = e.lngLat.lng;
    const lat = e.lngLat.lat;

    //da el punto más cercano a las coordenadas
    const url =
        `https://router.project-osrm.org/nearest/v1/driving/${lon},${lat}`;

    //espera a que responda
    const respuesta = await fetch(url);
    //devuelve respuesta en JSON
    const datos = await respuesta.json();

    if (datos.code === 'Ok') {

        const punto = datos.waypoints[0].location;

        // Elegir un color aleatorio
        const colorAleatorio =
            colores[Math.floor(Math.random() * colores.length)];

        new maplibregl.Marker({ color: colorAleatorio })
            .setLngLat(punto)
            .addTo(map);

        console.log("Punto:", punto);
        console.log("Color:", colorAleatorio);
    }

});