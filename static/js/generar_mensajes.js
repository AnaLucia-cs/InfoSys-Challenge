function crearMensaje(texto, prioridad = "media", tiempo = 30) {

    const contenedor = document.getElementById("display-message");

    // Crear mensaje
    const mensaje = document.createElement("div");
    mensaje.classList.add("mensaje");


    // Timer
    const time = document.createElement("div");
    time.classList.add("time");


    // Indicador de prioridad
    const indicator = document.createElement("div");
    indicator.classList.add("indicator", prioridad);


    // Contenido
    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");


    // Texto
    const message = document.createElement("div");
    message.classList.add("message");
    message.textContent = texto;


    // Botones
    const buttons = document.createElement("div");
    buttons.classList.add("buttons");


    const acceptButton = document.createElement("button");
    acceptButton.classList.add("accept-button");
    acceptButton.textContent = "Aceptar";


    const rejectButton = document.createElement("button");
    rejectButton.classList.add("reject-button");
    rejectButton.textContent = "Rechazar";


    // Armar estructura
    buttons.appendChild(acceptButton);
    buttons.appendChild(rejectButton);

    messageContent.appendChild(message);
    messageContent.appendChild(buttons);

    mensaje.appendChild(time);
    mensaje.appendChild(indicator);
    mensaje.appendChild(messageContent);

    // Agregar al contenedor
    contenedor.appendChild(mensaje);


    // Eventos
    acceptButton.addEventListener("click", () => {
        console.log("Pedido aceptado");
    });

    rejectButton.addEventListener("click", () => {
        console.log("Pedido rechazado");

        // Eliminar mensaje
        mensaje.remove();
    });
}

crearMensaje("Pedido #001", "alta");
crearMensaje("Pedido #002", "media");
crearMensaje("Pedido #003", "baja");
crearMensaje("Pedido #004", "alta");
