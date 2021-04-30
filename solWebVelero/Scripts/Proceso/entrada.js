var txh_viaje;
var txh_idcliente;
var txh_idConfirm = "";
var valRND = Math.floor(Math.random() * 100);
var arrayViaje_activ = [];
var objViaje_activ = {};
var arrayNumAsiento = [];
var arrayPasajero = [];
var montoTotal = 0;
/*Inicializar Script*/
$(function () {
    $(document).unbind("keydown");
    $("#pnl_viaje").modal({ show: false, backdrop: 'static' });
    //Fecha actual
    var fullDate = new Date();
    var primerDia = new Date(fullDate.getFullYear(), fullDate.getMonth(), 1);
    var ultimoDia = new Date(fullDate.getFullYear(), fullDate.getMonth() + 1, 0);

    $("#bus_txt_fec_ini").val(formatDate(fullDate, "yyyy-MM-dd"));
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
    listar_parametros_select("#sel_mediopago", "MEDIO_PAGO", false);
    listar_parametros_select("#sel_tiporeserva", "TIP_RESERVA", false);
    closeLoading();
}
function listar_viaje(p_sync) {
    $("#divAsiento").hide();
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
            if (!data.Activo) {
                msg_OpenDay("e", data.Mensaje)
                return;
            }

            var html = '';
            $("#body_viajes_disp").html("");
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
function listar_pais(p_sync) {
    $.ajax({
        type: "POST",
        url: "/Proceso/ListaPais",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: p_sync,
        beforeSend: function () {
            $('#sel_codPais').empty();
        },
        success: function (data) {
            if (!data.Activo) {
                msg_OpenDay("e", data.Mensaje);
                return;
            }
            $('#sel_codPais').append("<option></option>");
            for (var i = 0; i < data.Resultado.length; i++) {
                $('#sel_codPais').append("<option value='" + data.Resultado[i].id_pais + "'>" + data.Resultado[i].nombre + " (" + data.Resultado[i].cod_pais + ")</option>");
            }

            $('#sel_codPais').val(145).change();
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
        },
        complete: function () {
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

    if (arrayNumAsiento.length >= 1)
        vasientos = vasientos.substring(0, vasientos.length - 1);

    $("#num_asiento").html(vasientos);
    $("#precio_total").html("S/ " + formatoNumero(ntotal, 2, ".", ","));
}

function mapearAsiento(p_async, p_id_viaje) {
    //Obteniendo reservas del viaje
    var objE = {
        id_viaje: p_id_viaje
    }
    $.ajax({
        type: "POST",
        url: "/Proceso/ListaAsiento",
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
                        //$(this).prop("disabled", true);
                        $(this).attr("data-html", "true");
                        $(this).attr("data-toggle", "tooltip");
                        $(this).attr("data-original-title", "DNI: " + data.Resultado[i].vDocumento + "<br>Nombre: " + data.Resultado[i].vCliente);
                    }
                });
            }
            $('[data-toggle="tooltip"]').tooltip();
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

function mostrarAsientos(row) {
    openLoading();
    arrayNumAsiento = [];

    var objViaje = arrayViaje_activ[row];
    objViaje_activ = objViaje;

    //Obteniendo valores del viaje seleccionado
    var precio_real = objViaje.precio - objViaje.descuento;
    $("#titulo_asiento").html(objViaje.nombre + "(" + convertMoneda(precio_real, 2) + ")");
    $("#subtitulo_asiento").html("Salida: " + formatDate(parseDateServer(objViaje.fecha_ini), "dd-MM-yyyy") + " " + formatDate(parseDateServer(objViaje.fecha_ini), "HH:mm") + ' - ' + formatDate(parseDateServer(objViaje.fecha_fin), "HH:mm") + " | Asiento: " + objViaje.asiento_libre + " libres");
    $("#divDistribucion").html(objViaje.distribucion);

    mapearAsiento(true, objViaje_activ.id_viaje);
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
};
/*Eventos por Control*/
$(document).on('keypress', function (evt) {
    switch (evt ? evt.which : event.keyCode) {
        case 8: //BLOQUEA RETROCESO DE PAGINA
            var valor = document.activeElement.value;
            if (valor === undefined) { return false; } break;
        //case 13: //BLOQUEA ENTER
            //$("#btn_buscar").click();
            break;
    }
});

$("#btn_buscar").click(function () {
    listar_viaje(true);
});
$("#btn_reservar").click(function () {
    if (arrayNumAsiento.length == 0) {
        msg_OpenDay("a", "Seleccione almenos un asiento");
        return false;
    }
    //Get Precio 
    openLoading();

    var num_asien_selec = 0;
    arrayPasajero = [];
    var ntotal = arrayNumAsiento.length * (objViaje_activ.precio - objViaje_activ.descuento);
    $("#pnl_reserva .modal-title").html("Registro de asientos | Precio: " + formatoNumero(objViaje_activ.precio, 2, ".", ",") + " | Total: " + formatoNumero(ntotal, 2, ".", ","));

    //Creando Listado de pasajeros
    var html_body = "";
    for (var i = 0; i < arrayNumAsiento.length; i++) {
        html_body += '      <div class="card card-control-fcp" id="divAsiento_' + arrayNumAsiento[i] + '">' +
                     '           <div class="row">' +
                     '               <div class="col-md-12">' +
                     '                   <div class="form-group">' +
                     '                       <label>Pasajero ' + (i + 1) + ' | <strong>Asiento ' + arrayNumAsiento[i] + '</strong></label>' +
                     '                   </div>' +
                     '               </div>' +
                     '               <div class="col-md-4">' +
                     '                   <div class="form-group">' +
                     '                       <label>Tipo de documento</label>' +
                     '                       <select class="form-control sel_autocomplete sel_tipo_doc_asiento" style="width: 100%;"></select>' +
                     '                   </div>' +
                     '               </div>' +
                     '               <div class="col-md-4">' +
                     '                   <div class="form-group">' +
                     '                       <label>Documento de Cliente</label>' +
                     '                       <div class="input-group">' +
                     '                           <input class="form-control input-sm integerFCP txt_nro_doc_asiento" type="text" />' +
                     '                           <div class="input-group-append">' +
                     '                               <button class="btn btn-primary btn-buscar-cliente" attr-num-asiento="' + arrayNumAsiento[i] + '"><i class="fa fa-search"></i></button>' +
                     '                           </div>' +
                     '                       </div>' +
                     '                   </div>' +
                     '               </div>' +
                     '               <div class="col-md-4">' +
                     '                   <div class="form-group">' +
                     '                       <label>Fecha Nac.</label>' +
                     '                       <input class="form-control txt_fec_nac_asiento" type="date">' +
                     '                   </div>' +
                     '               </div>' +
                     '               <div class="col-md-4">' +
                     '                   <div class="form-group">' +
                     '                       <label>Nombres</label>' +
                     '                       <input class="form-control input-sm txt_nom_asiento" type="text" />' +
                     '                   </div>' +
                     '               </div>' +
                     '               <div class="col-md-3">' +
                     '                   <div class="form-group">' +
                     '                       <label>Ape. Paterno</label>' +
                     '                       <input class="form-control input-sm txt_ape_pat_asiento" type="text" />' +
                     '                   </div>' +
                     '               </div>' +
                     '               <div class="col-md-3">' +
                     '                   <div class="form-group">' +
                     '                       <label>Ape. Materno</label>' +
                     '                       <input class="form-control input-sm txt_ape_mat_asiento" type="text" />' +
                     '                   </div>' +
                     '               </div>' +
                     '               <div class="col-md-2">' +
                     '                   <div class="form-group">' +
                     '                       <label>Sexo</label>' +
                     '                       <select class="form-control sel_autocomplete sel_sexo_asiento" style="width: 100%;"></select>' +
                     '                   </div>' +
                     '               </div>' +
                     '           </div>' +
                     '       </div>';
    }

    $("#divPasajeros").html(html_body);

    //Listando combos
    listar_pais(true);
    listar_parametros_select(".sel_tipo_doc_asiento", "TIP_DOC", true);
    listar_parametros_select(".sel_sexo_asiento", "SEXO", true);
    
    $(".sel_autocomplete").select2({
        containerCssClass: "btn btn-circle green",
        placeholder: "Seleccione",
        language: "es"
    });

    $(".btn-buscar-cliente").click(function () {
        var inx_ctrl = $(this).attr("attr-num-asiento");
        //Validando controles
        $("#pnl_reserva .validator-error").remove();
        if (val_required_FCP($("#divAsiento_" + inx_ctrl + " .sel_tipo_doc_asiento"), "Tipo de documento") === false) return;
        if (val_required_FCP($("#divAsiento_" + inx_ctrl + " .txt_nro_doc_asiento"), "Número de documento") === false) return;

        openLoading();
        var objE = {
            TIPO_DOCUMENTO: $("#divAsiento_" + inx_ctrl + " .sel_tipo_doc_asiento").val(),
            NUM_DOCUMENTO: $("#divAsiento_" + inx_ctrl + " .txt_nro_doc_asiento").val()
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
                if (!data.Activo) {
                    msg_OpenDay("e", "No se encontró el número de documento. Deberá ingresar los datos");
                    return;
                }
                if (data.Resultado.NOMBRES !== "") {
                    var html = '';
                    $("#divAsiento_" + inx_ctrl + " .txt_fec_nac_asiento").val(formatDate(parseDateServer(data.Resultado.FEC_NAC), "yyyy-MM-dd"));
                    $("#divAsiento_" + inx_ctrl + " .txt_nom_asiento").val(data.Resultado.NOMBRES);
                    $("#divAsiento_" + inx_ctrl + " .txt_ape_pat_asiento").val(data.Resultado.APE_PAT);
                    $("#divAsiento_" + inx_ctrl + " .txt_ape_mat_asiento").val(data.Resultado.APE_MAT);
                    $("#divAsiento_" + inx_ctrl + " .sel_sexo_asiento").val(data.Resultado.SEXO).change();
                } else {
                    txh_idcliente = 0;
                    $("#txt_nomcliente").val('');
                    $("#txt_apecliente").val('');
                    msg_OpenDay("e", "No se encontró el documento ingresado. Verifique el número de DNI");
                }
            },
            error: function (data) {
                msg_OpenDay("e", "Inconveniente en la operación");
            },
            complete: function () {
                closeLoading();
            }
        });
    });

    $("#pnl_reserva").modal("show");
});
$("#btn_guardar").click(function () {
    $("#pnl_reserva .validator-error").remove();
    if (val_required_FCP($("#sel_mediopago"), "medio de pago") === false) return;
    if (val_required_FCP($("#sel_tiporeserva"), "medio de pago") === false) return;
    if (val_required_FCP($("#txt_adelanto"), "adelanto") === false) return;

    var ntotal = arrayNumAsiento.length * (objViaje_activ.precio - objViaje_activ.descuento);
    if (val_maxValue_FCP($("#txt_adelanto"), ntotal, "adelanto") === false) return;

    //Validando datos de los pasajeros
    for (var i = 0; i < arrayNumAsiento.length; i++) {
        if (val_required_FCP($("#divAsiento_" + arrayNumAsiento[i] + " .sel_tipo_doc_asiento"), "tipo de documento") === false) return;
        if (val_required_FCP($("#divAsiento_" + arrayNumAsiento[i] + " .txt_nro_doc_asiento"), "número de documento") === false) return;
        if (val_required_FCP($("#divAsiento_" + arrayNumAsiento[i] + " .txt_fec_nac_asiento"), "fecha de nacimiento") === false) return;
        if (val_required_FCP($("#divAsiento_" + arrayNumAsiento[i] + " .txt_nom_asiento"), "nombre") === false) return;
        if (val_required_FCP($("#divAsiento_" + arrayNumAsiento[i] + " .txt_ape_pat_asiento"), "apellido paterno") === false) return;
        if (val_required_FCP($("#divAsiento_" + arrayNumAsiento[i] + " .txt_ape_mat_asiento"), "apellido materno") === false) return;
        if (val_required_FCP($("#divAsiento_" + arrayNumAsiento[i] + " .sel_sexo_asiento"), "sexo") === false) return;

        arrayPasajero.push({
            ASIENTO: arrayNumAsiento[i],
            TIPO_DOCUMENTO: $("#divAsiento_" + arrayNumAsiento[i] + " .sel_tipo_doc_asiento").val(),
            NUM_DOCUMENTO: $("#divAsiento_" + arrayNumAsiento[i] + " .txt_nro_doc_asiento").val(),
            FEC_NAC: $("#divAsiento_" + arrayNumAsiento[i] + " .txt_fec_nac_asiento").val() === "" ? null : getDateFromFormat($("#divAsiento_" + arrayNumAsiento[i] + " .txt_fec_nac_asiento").val(), 'yyyy-MM-dd'),
            NOMBRES: $("#divAsiento_" + arrayNumAsiento[i] + " .txt_nom_asiento").val(),
            APE_PAT: $("#divAsiento_" + arrayNumAsiento[i] + " .txt_ape_pat_asiento").val(),
            APE_MAT: $("#divAsiento_" + arrayNumAsiento[i] + " .txt_ape_mat_asiento").val(),
            SEXO: $("#divAsiento_" + arrayNumAsiento[i] + " .sel_sexo_asiento").val()
        });
    }
    if (val_required_FCP($("#txt_correo"), "correo de contacto") === false) return;
    if (val_required_FCP($("#txt_celular"), "celular de contacto") === false) return;

    openLoading();

    var objE = {
        id_viaje: objViaje_activ.id_viaje,
        tipo_reserva: $("#sel_tiporeserva").val(),
        medio_pago: $("#sel_mediopago").val(),
        adelanto: $("#txt_adelanto").val(),
        correo: $("#txt_correo").val(),
        id_pais: $("#sel_codPais").val(),
        celular: $("#txt_celular").val(),
        observacion: $("#txt_observacion").val(),
        listaCliente: arrayPasajero,
        nombre_tour: objViaje_activ.nombre,
        fecha_ini: parseDateServer(objViaje_activ.fecha_ini),
        fecha_fin: parseDateServer(objViaje_activ.fecha_fin)
    }
    debugger;
    $.ajax({
        type: "POST",
        url: "/Proceso/ActualizarReserva",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: objE
        }),
        async: true,
        beforeSend: function () {
            $("#btn_guardar").attr("disabled", false);
        },
        success: function (data) {
            if (!data.Activo) {
                msg_OpenDay("e", data.Mensaje);
                return;
            }

            mapearAsiento(false, objViaje_activ.id_viaje);
            $("#pnl_reserva").modal('hide');

            msg_OpenDay("c", "Se guardó correctamente");
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
        },
        complete: function () {
            $("#btn_guardar").attr("disabled", false);
            closeLoading();
        }
    });
    
});
