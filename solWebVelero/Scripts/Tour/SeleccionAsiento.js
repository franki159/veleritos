var txh_tour;
var txh_idConfirm = "";
var valRND = Math.floor(Math.random() * 100);
var arrayViaje_activ = [];
var objViaje_activ = {};
var arrayNumAsiento = [];
/*Inicializar Script*/
$(function () {
    if (toURLParam("fromViajeId") === null) {
        msg_OpenDay("e", "No se ha seleccionado ningún Tour");
        return false;
    }
    $(document).unbind("keydown");
    listar_inicio();
});
function listar_viaje(p_sync) {
    openLoading();
    var objE = {
        ID_ENCRIP: getUrlParameter("fromViajeId")
    };
 
    $.ajax({
        type: "POST",
        url: "/Tour/MapearViaje",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: objE
        }),
        async: p_sync,
        beforeSend: function () {
            $("#btn_buscar").attr("disabled", true);
        },
        success: function (data) {
            if (!data.Activo) {
                msg_OpenDay("e", data.Mensaje);
                return;
            }

            arrayNumAsiento = [];
            objViaje_activ = data.Resultado;
            //Obteniendo valores del viaje seleccionado
            var precio_real = data.Resultado.precio - data.Resultado.descuento;
            $("#titulo_asiento").html(data.Resultado.nombre + "(" + convertMoneda(precio_real, 2) + ")");
            $("#subtitulo_asiento").html("Salida: " + formatDate(parseDateServer(data.Resultado.fecha_ini), "dd-MM-yyyy") + " " + formatDate(parseDateServer(data.Resultado.fecha_ini), "HH:mm") + ' - ' + formatDate(parseDateServer(data.Resultado.fecha_fin), "HH:mm") + " | Asiento: " + data.Resultado.asiento_libre + " libres");
            $("#divDistribucion").html(data.Resultado.distribucion);

            mapearAsiento(true, data.Resultado.id_viaje);
            //Estado de los asientos
            $("#divAsiento button").click(function () {
                if ($(this).attr("name") === "btn-asiento") {
                    if ($(this).attr("est-sel-asi") === undefined || $(this).attr("est-sel-asi") === "inactive") {//Verificando si esta seleccionado
                        $(this).attr('est-sel-asi', 'active');
                        $(this).css("background", "#2468a2");

                        var valor_boton = $(this).attr("attr-btn-value");
                        if (valor_boton !== undefined) {
                            arrayNumAsiento.push(parseInt(valor_boton));
                            actualizarSeleccion();
                        }
                    } else if ($(this).attr("est-sel-asi") === "active") {
                        $(this).attr('est-sel-asi', 'inactive');
                        $(this).css("background", "");

                        var valor_boton = $(this).attr("attr-btn-value");
                        if (valor_boton !== undefined) {
                            arrayNumAsiento = arrayNumAsiento.filter(item => item !== parseInt(valor_boton));
                            actualizarSeleccion();
                        }
                    }
                }
            });
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
        },
        complete: function (respuesta) {
            $("#btn_buscar").removeAttr("disabled");
            closeLoading();
        }
    });
}
function listar_inicio() {
    listar_viaje(true);
}

function actualizarSeleccion() {
    var ntotal = arrayNumAsiento.length * (objViaje_activ.precio - objViaje_activ.descuento);
    var vasientos = ""
    for (var i = 0; i < arrayNumAsiento.length; i++) {
        vasientos += arrayNumAsiento[i] + ","
    }

    if (arrayNumAsiento.length >= 1 && arrayNumAsiento.length < 6)
        vasientos = vasientos.substring(0, vasientos.length - 1);
    else if (arrayNumAsiento.length >= 6)
        vasientos = vasientos.substring(0, 15) + "...";

    $("#num_asiento").html(vasientos);
    $("#precio_total").html(convertMoneda(ntotal, 2));
}

function mapearAsiento(p_async, p_id_viaje) {
    //Obteniendo reservas del viaje
    var objE = {
        id_viaje: p_id_viaje
    }
    $.ajax({
        type: "POST",
        url: "/Tour/ListaAsiento",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: objE
        }),
        async: p_async,
        success: function (data) {
            if (!data.Activo) {
                msg_OpenDay("e", data.Mensaje);
                return;
            }
            for (var i = 0; i < data.Resultado.length; i++) {
                $("#divDistribucion").find(':button').each(function () {
                    if ($(this).attr("name") === "btn-asiento" && parseInt($(this).attr("attr-btn-value")) === data.Resultado[i].asiento) {
                        $(this).attr('est-sel-asi', 'reservado');
                        $(this).css("background", "#8a8a8a");
                        $(this).prop("disabled", true);
                    }
                });
            }
           
            $("#divAsiento").show();
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
        },
        complete: function () {
            closeLoading();
        }
    });
}
/*Eventos por Control*/
$(document).on('keypress', function (evt) {
    switch (evt ? evt.which : event.keyCode) {
        case 8: //BLOQUEA RETROCESO DE PAGINA 
            var valor = document.activeElement.value;
            if (valor === undefined) { return false; } break;
        //case 13: //BLOQUEA ENTER
        //    $("#btn_buscar").click();
            break;
    }
});
$("#btn_buscar").click(function () {
    listar_viaje(true);
});
function openLoading() {
    $("#page-loader").show();
}
function closeLoading() {
    $("#page-loader").hide();
}