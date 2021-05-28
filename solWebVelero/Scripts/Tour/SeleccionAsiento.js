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
            $("#spn-fec-sal").html(formatDate(parseDateServer(data.Resultado.fecha_ini), "dd-MM-yyyy"));
            $("#spn-hor-sal").html(formatDate(parseDateServer(data.Resultado.fecha_ini), "HH:mm") + ' - ' + formatDate(parseDateServer(data.Resultado.fecha_fin), "HH:mm"));

            $("#divDistribucion").html(data.Resultado.distribucion);
            setFormHeight();

            mapearAsiento(true, data.Resultado.id_viaje);
            //Estado de los asientos
            $("#divDistribucion button").click(function () {
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
                return;
            }
            $('#sel_codPais').append("<option></option>");
            for (var i = 0; i < data.Resultado.length; i++) {
                $('#sel_codPais').append("<option value='" + data.Resultado[i].id_pais + "'>" + data.Resultado[i].nombre + " (" + data.Resultado[i].cod_pais + ")</option>");
            }

            $('#sel_codPais').val(145).change();
        },
        complete: function () {
            closeLoading();
        }
    });
}
function actualizarSeleccion() {
    arrayNumAsiento = arrayNumAsiento.sort(function (a, b) { return a - b });
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
    $("#precio_total").html("S/ " + formatoNumero(ntotal, 2, ".", ","));
}
function guardarReservacion() {
    $("#pnl_reserva .validator-error").remove();
    var arrayPasajero = [];
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
        correo: $("#txt_correo").val(),
        id_pais: $("#sel_codPais").val(),
        celular: $("#txt_celular").val(),
        observacion: $("#txt_observacion").val(),
        listaCliente: arrayPasajero,
        nombre_tour: objViaje_activ.nombre,
        fecha_ini: parseDateServer(objViaje_activ.fecha_ini),
        fecha_fin: parseDateServer(objViaje_activ.fecha_fin)
    }

    $.ajax({
        type: "POST",
        url: "/Tour/ActualizarReserva",
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

            window.location = "paymentGen";
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
        },
        complete: function () {
            $("#btn_guardar").attr("disabled", false);
            closeLoading();
        }
    });
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
$("#btn_reservar").click(function () {
    if (arrayNumAsiento.length == 0) {
        //alert("Seleccione almenos un asiento");
        msg_OpenDay("a", "Seleccione almenos un asiento");
        return false;
    }
    //Get Precio 
    openLoading();

    var num_asien_selec = 0;
    var ntotal = arrayNumAsiento.length * (objViaje_activ.precio - objViaje_activ.descuento);
    $("#pnl_reserva .modal-title").html("Registro de asientos | Precio: " + formatoNumero(objViaje_activ.precio, 2, ".", ",") + " | Total: " + formatoNumero(ntotal, 2, ".", ","));

    //Creando Listado de pasajeros
    var html_body = "";
    for (var i = 0; i < arrayNumAsiento.length; i++) {
        html_body += '      <div id="divAsiento_' + arrayNumAsiento[i] + '">' +
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
                     '                           <input style="height: auto!important;" class="form-control input-sm integerFCP txt_nro_doc_asiento" type="text" />' +
                     '                           <div class="input-group-append">' +
                     '                               <button class="btn btn-primary btn-buscar-cliente" attr-num-asiento="' + arrayNumAsiento[i] + '"><i class="fa fa-search"></i></button>' +
                     '                           </div>' +
                     '                       </div>' +
                     '                   </div>' +
                     '               </div>' +
                     '               <div class="col-md-4">' +
                     '                   <div class="form-group">' +
                     '                       <label>Fecha Nac.</label>' +
                     '                       <input style="height: auto!important;" class="form-control txt_fec_nac_asiento" type="date">' +
                     '                   </div>' +
                     '               </div>' +
                     '               <div class="col-md-4">' +
                     '                   <div class="form-group">' +
                     '                       <label>Nombres</label>' +
                     '                       <input style="height: auto!important;" class="form-control input-sm txt_nom_asiento" type="text" />' +
                     '                   </div>' +
                     '               </div>' +
                     '               <div class="col-md-3">' +
                     '                   <div class="form-group">' +
                     '                       <label>Ape. Paterno</label>' +
                     '                       <input style="height: auto!important;" class="form-control input-sm txt_ape_pat_asiento" type="text" />' +
                     '                   </div>' +
                     '               </div>' +
                     '               <div class="col-md-3">' +
                     '                   <div class="form-group">' +
                     '                       <label>Ape. Materno</label>' +
                     '                       <input style="height: auto!important;" class="form-control input-sm txt_ape_mat_asiento" type="text" />' +
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
        if (i < arrayNumAsiento.length - 1) {
            html_body += '<hr>';
        }
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

        var objE = {
            TIPO_DOCUMENTO: $("#divAsiento_" + inx_ctrl + " .sel_tipo_doc_asiento").val(),
            NUM_DOCUMENTO: $("#divAsiento_" + inx_ctrl + " .txt_nro_doc_asiento").val()
        }
        $.ajax({
            type: "POST",
            url: "/Tour/wsSearchIdentityFromSystem",
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
$("#btn_siguiente").click(function () {
    var arrayPasajero = [];
    //Validando datos de los pasajeros
    for (var i = 0; i < arrayNumAsiento.length; i++) {
        if (val_required_FCP($("#divAsiento_" + arrayNumAsiento[i] + " .sel_tipo_doc_asiento"), "tipo de documento") === false) return false;
        if (val_required_FCP($("#divAsiento_" + arrayNumAsiento[i] + " .txt_nro_doc_asiento"), "número de documento") === false) return false;
        if (val_required_FCP($("#divAsiento_" + arrayNumAsiento[i] + " .txt_fec_nac_asiento"), "fecha de nacimiento") === false) return false;
        if (val_required_FCP($("#divAsiento_" + arrayNumAsiento[i] + " .txt_nom_asiento"), "nombre") === false) return false;
        if (val_required_FCP($("#divAsiento_" + arrayNumAsiento[i] + " .txt_ape_pat_asiento"), "apellido paterno") === false) return false;
        if (val_required_FCP($("#divAsiento_" + arrayNumAsiento[i] + " .txt_ape_mat_asiento"), "apellido materno") === false) return false;
        if (val_required_FCP($("#divAsiento_" + arrayNumAsiento[i] + " .sel_sexo_asiento"), "sexo") === false) return false;

    }
    if (val_required_FCP($("#txt_correo"), "correo de contacto") === false) return false;
    if (val_required_FCP($("#txt_celular"), "celular de contacto") === false) return false;
});
$("#btn-continuar").click(function (e) {
    const eventTarget = e.target;
    debugger;
    //find active panel
    const activePanel = getActivePanel();
    let activePanelNum = Array.from(DOMstrings.stepFormPanels).indexOf(activePanel);
    
    if (activePanelNum === 0)
        $("#btn_reservar").click();
    else if (activePanelNum === 1) {
        $("#btn_siguiente").click();
        $(this).val("Pagar");
    }
    else if (activePanelNum === 2)
        guardarReservacion();
    
});
function openLoading() {
    $("#page-loader").show();
}
function closeLoading() {
    $("#page-loader").hide();
}