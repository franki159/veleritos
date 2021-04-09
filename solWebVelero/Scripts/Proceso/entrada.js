var txh_viaje;
var txh_idcliente;
var txh_idConfirm = "";
var valRND = Math.floor(Math.random() * 100);
var arrayViaje_activ = [];
var objViaje_activ = {};
var arrayNumAsiento = [];
var montoTotal = 0;
/*Inicializar Script*/
$(function () {
    $(document).unbind("keydown");
    $("#pnl_viaje").modal({ show: false, backdrop: 'static' });
    //Fecha actual
    var fullDate = new Date();
    var primerDia = new Date(fullDate.getFullYear(), fullDate.getMonth(), 1);
    var ultimoDia = new Date(fullDate.getFullYear(), fullDate.getMonth() + 1, 0);

    $("#bus_txt_fec_ini").val(formatDate(primerDia, "yyyy-MM-dd"));
    $("#bus_txt_fec_fin").val(formatDate(fullDate, "yyyy-MM-dd"));

    listar_inicio();
    
});

function listar_tour() {
    var objE = {
        nombre: ""
    };
    $.ajax({
        type: "POST",
        url: "/Mantenimiento/ListaTour",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: objE
        }),
        async: false,
        beforeSend: function () {
            $('#sel_tour').empty();
        },
        success: function (data) {
            if (!data.Activo) {
                msg_OpenDay("e", data.Mensaje)
                closeLoading();
                return;
            }

            $('#bus_sel_tour').append("<option value='0'>TODOS</option>");
            for (var i = 0; i < data.Resultado.length; i++) {
                $('#bus_sel_tour').append("<option value='" + data.Resultado[i].id_tour + "'>" + data.Resultado[i].nombre + "</option>");
            }
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
            closeLoading();
        }
    });
}
function listar_inicio() {
    $("#divAsiento").hide();
    listar_tour();
    listar_parametros_select("sel_mediopago", "MEDIO_PAGO", false);
    listar_parametros_select("sel_tiporeserva", "TIP_RESERVA", false);
    closeLoading();
}
function listar_viaje(p_sync) {
    openLoading();
    var objE = {
        id_tour: $("#bus_sel_tour").val(),
        fecha_ini: $("#bus_txt_fec_ini").val() === "" ? null : getDateFromFormat($("#bus_txt_fec_ini").val(), 'yyyy-MM-dd'),
        fecha_fin: $("#bus_txt_fec_fin").val() === "" ? null : getDateFromFormat($("#bus_txt_fec_fin").val(), 'yyyy-MM-dd'),
    };

    $.ajax({
        type: "POST",
        url: "/Proceso/ListaViaje",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: objE
        }),
        async: p_sync,
        beforeSend: function () {
            $("#btn_buscar").attr("disabled", true);
            $('#tbl_viaje tbody').empty();
        },
        success: function (data) {
            $("#btn_buscar").removeAttr("disabled");

            if (!data.Activo) {
                msg_OpenDay("e", data.Mensaje)
                closeLoading();
                return;
            }

            var html = '';
            $("#body_viajes_disp").append("");
            arrayViaje_activ = [];
            for (var i = 0; i < data.Resultado.length; i++) {
                arrayViaje_activ.push(data.Resultado[i]);

                var color_card = "";
                if (data.Resultado[i].asiento_libre === 0)
                    color_card = "danger";
                else if (data.Resultado[i].asiento_libre < 5)
                    color_card = "warning";
                else
                    color_card = "primary";

                html += '<div class="row" onclick="mostrarAsientos(' + i + ')">';
                html += '    <div class="col-md-12">';
                html += '        <div class="card border-left-' + color_card + ' shadow h-100 py-2 btn-3-default">';
                html += '            <div class="card-body">';
                html += '                <div class="row no-gutters align-items-center">';
                html += '                    <div class="col mr-2">';
                html += '                        <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">' + data.Resultado[i].nombre + '</div>';
                html += '                        <div class="h5 mb-0 font-weight-bold text-gray-800">S/.' + data.Resultado[i].precio + '</div>';
                html += '                    </div>';
                html += '                    <div class="col mr-2">';
                html += '                        <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Salida: ' + formatDate(parseDateServer(data.Resultado[i].fecha_ini), "dd-MM-yyyy") + '</div>';
                html += '                        <span class="h5 mb-0 font-weight-bold text-gray-800 ">' + formatDate(parseDateServer(data.Resultado[i].fecha_ini), "HH:mm") + ' - ' + formatDate(parseDateServer(data.Resultado[i].fecha_fin), "HH:mm") + '</span>';
                html += '                    </div>';
                html += '                    <div class="col mr-2">';
                html += '                        <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">Asientos</div>';
                html += '                        <span class="badge badge-' + color_card + '">' + data.Resultado[i].asiento_libre + ' libres</span>';
                html += '                    </div>';
                html += '                    <div class="col-auto">';
                html += '                        <i class="fas fa-ship fa-2x text-gray-300"></i>';
                html += '                    </div>';
                html += '                </div>';
                html += '            </div>';
                html += '        </div>';
                html += '    </div>';
                html += '</div>';
            }

            $("#body_viajes_disp").append(html);
            closeLoading();
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
            $("#btn_buscar").removeAttr("disabled");
            closeLoading();
        }
    });
}

function actualizarSeleccion() {
    var ntotal = arrayNumAsiento.length * (objViaje_activ.precio - objViaje_activ.descuento);
    var vasientos = ""
    for (var i = 0; i < arrayNumAsiento.length; i++) {
        vasientos += arrayNumAsiento[i] + ","
    }

    if (arrayNumAsiento.length === 1)
        vasientos = vasientos.substring(0, vasientos.length - 1);

    $("#num_asiento").html(vasientos);
    $("#precio_total").html(convertMoneda(ntotal,2));
}

function mostrarAsientos(row) {
    arrayNumAsiento = [];

    var objViaje = arrayViaje_activ[row];
    objViaje_activ = objViaje;
    debugger;
    //Obteniendo valores del viaje seleccionado
    var precio_real = objViaje.precio - objViaje.descuento;
    $("#titulo_asiento").html(objViaje.nombre + "(" + convertMoneda(precio_real, 2) + ")");
    $("#subtitulo_asiento").html("Salida: " + formatDate(parseDateServer(objViaje.fecha_ini), "dd-MM-yyyy") + " " + formatDate(parseDateServer(objViaje.fecha_ini), "HH:mm") + ' - ' + formatDate(parseDateServer(objViaje.fecha_fin), "HH:mm") + " | Asiento: " + objViaje.asiento_libre + " libres");
    $("#divDistribucion").html(objViaje.distribucion);
    $("#divAsiento").show();

    $("#divAsiento button").click(function () {
        if ($(this).attr("name") === "btn-asiento") {
            if ($(this).attr("est-sel-asi") === undefined || $(this).attr("est-sel-asi") === "inactive") {//Verificando si esta seleccionado
                $(this).attr('est-sel-asi', 'active');
                $(this).css("background", "#2468a2");

                var valor_boton = $(this).attr("attr-btn-value");
                if (valor_boton !== undefined) {
                    arrayNumAsiento.push(parseInt($(this).attr("attr-btn-value")));
                    actualizarSeleccion();
                }
            } else {
                $(this).attr('est-sel-asi', 'inactive');
                $(this).css("background", "");

                var valor_boton = $(this).attr("attr-btn-value");
                if (valor_boton !== undefined) {
                    arrayNumAsiento.pop(parseInt($(this).attr("attr-btn-value")));
                    actualizarSeleccion();
                }
            }
        }
    });
};
/*Eventos por Control*/
$(document).on('keypress', function (evt) {
    switch (evt ? evt.which : event.keyCode) {
        case 8: //BLOQUEA RETROCESO DE PAGINA
            var valor = document.activeElement.value;
            if (valor === undefined) { return false; } break;
        case 13: //BLOQUEA ENTER
            $("#btn_buscar").click();
            break;
    }
});

$("#btn_buscar").click(function () {
    listar_viaje(true);
});
$("#btn_reservar").click(function () {
    //Get Precio 
    var num_asien_selec = 0;
    var ntotal = num_asien_selec * (objViaje_activ.precio - objViaje_activ.descuento);
    $("txt_precio").val(convertMoneda(objViaje_activ.precio - objViaje_activ.descuento,2));
    $("txt_total").val(convertMoneda(ntotal,2));

    $("#pnl_reserva").modal("show");
});
$("#btn_limpiar_cliente").click(function () {
    openLoading();
    txh_idcliente = 0;
    $("#txt_nro_doc").val('');
    $("#txt_nomcliente").val('');
    $("#txt_apecliente").val('');

    $("#txt_nro_doc").prop('disabled', false);
    $("#txt_nomcliente").prop('disabled', false);
    $("#txt_apecliente").prop('disabled', false);

    $("#btn_buscar_cliente").show();
    $("#btn_limpiar_cliente").hide();
    
    $("#txt_nro_doc").focus();
    closeLoading();
});
$("#btn_buscar_cliente").click(function () {
    openLoading();

    var objE = {
        numero: $("#txt_nro_doc").val(),
        nombre: ''
    }

    $.ajax({
        type: "POST",
        url: "/Proceso/BuscarCliente",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: objE
        }),
        async: true,
        success: function (data) {
            if (!data.d.Activo) {
                msg_OpenDay("e", data.Mensaje);
                closeLoading();
                return;
            }

            if (data.d.Resultado.length > 0) {
                var html = '';
                for (var i = 0; i < data.d.Resultado.length; i++) {
                    $("#txt_nro_doc").val(data.Resultado[i].NUM_DOCUMENTO);
                    $("#txt_nomcliente").val(data.Resultado[i].NOMBRES);
                    $("#txt_apecliente").val(data.Resultado[i].APELLIDOS);
                    txh_idcliente = data.Resultado[i].ID_CLIENTE;

                    $("#txt_nro_doc").prop('disabled', true);
                    $("#txt_nomcliente").prop('disabled', true);
                    $("#txt_apecliente").prop('disabled', true);

                    $("#btn_buscar_cliente").hide();
                    $('#btn_limpiar_cliente').show();
                }
            } else {
                txh_idcliente = 0;
                $("#txt_nomcliente").val('');
                $("#txt_apecliente").val('');
                msg_OpenDay("e", "No se encontró el documento ingresado. Debe ingresar el Nombre");
            }
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
            closeLoading();
        }
    });
});
