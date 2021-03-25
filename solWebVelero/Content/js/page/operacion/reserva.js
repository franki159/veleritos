/*Inicializar Script*/
$(function () {
    $(document).unbind("keydown");

    $('.dtOp').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        orientation: "top left"
    }).on('changeDate', function () {
        var input = $(this).find('input:text');
        if (input.attr('id') === 'txt_fechainicio' || input.attr('id') === 'txt_fechafin') {
            $('#pnl_habitacion').hide();
        }
    });

    $('.dtOp').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        orientation: "top left"
    }).on('changeDate', function () {
        var input = $(this).find('input:text');
        if (input.attr('id') === 'txt_fechainicio' || input.attr('id') === 'txt_fechafin') {
            var fechaInicio = getDateFromFormat($('#txt_fechainicio').val(), "dd/MM/yyyy");
            var fechaFin = getDateFromFormat($('#txt_fechafin').val(), "dd/MM/yyyy");
            var fechaActual = getDateFromFormat($('#horaSistema').html(), "dd/MM/yyyy");

            $("#lblNoches").html("");
            $('#txt_total').val("");

            var eReserva = {
                FEC_INI: fechaInicio,
                FEC_FIN: fechaFin
            };

            //Para la fecha de inicio
            if (input.attr('id') === 'txt_fechainicio') {
                var dias = Math.floor((fechaInicio - fechaActual) / (1000 * 60 * 60 * 24));
                if (fechaInicio < fechaActual) {
                    $('#txt_fechainicio').val("");
                    $("#lblNoches").html("");
                    $("#errorReserva").html(GenerarAlertaWarning("Fecha: La fecha de inicio no puede ser menor a la fecha actual"));
                } else {
                    if (fechaInicio > fechaFin) {
                        fechaFin.setDate(fechaInicio.getDate() + 1);
                        $('#txt_fechafin').val(formatDate(fechaFin, "dd/MM/yyyy"));
                        $("#txt_fechafin").parent().datepicker("update", $("#txt_fechafin").val());
                    }
                    //******** Obtener habitaciones segun fecha ********* 
                    if ($('#txh_idreserva').val() === '0') {
                        habitacionesDisponibles(eReserva, "N", 0);//Nuevo
                    } else {
                        eReserva.ID_RESERVA = $('#txh_idreserva').val();
                        habitacionesDisponibles(eReserva, "M", $("#sel_habitaciones").val());//Modificado
                    }

                    contarNoches($("#lblNoches"), $('#txt_total'), $('#txt_fechainicio'), $('#txt_fechafin'), $("#errorReserva"));
                    $('#txt_total').val($('#txt_precio').val());
                }
            } else if (input.attr('id') === 'txt_fechafin') {
                if (fechaFin < fechaInicio) {
                    $('#txt_fechafin').val("");
                    $("#lblNoches").html("");
                    $("#errorReserva").html(GenerarAlertaWarning("Fecha: La fecha de fin no debe ser menor a la fecha inicio"));
                } else {
                    //******** Obtener habitaciones segun fecha *********
                    if ($('#txh_idreserva').val() === '0') {
                        habitacionesDisponibles(eReserva, "N", 0);//Nuevo
                    } else {
                        eReserva.ID_RESERVA = $('#txh_idreserva').val();
                        habitacionesDisponibles(eReserva, "M", $("#sel_habitaciones").val());//Modificado
                    }

                    contarNoches($("#lblNoches"), $('#txt_total'), $('#txt_fechainicio'), $('#txt_fechafin'), $("#errorReserva"));
                    fc_calcular_total($('#txt_fechainicio'), $('#txt_fechafin'), $('#txt_precio'), $('#txt_total'));
                }
            }
        }
    });

    $("#pleaseWaitDialog").modal();
    //Lista Data Inicial
    $.ajax({
        type: "POST",
        url: "page/operacion/reserva.aspx/ListaInicialWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        beforeSend: function () {
            $('#sel_bus_tipo').empty();
            $('#sel_tipo').empty();
        },
        success: function (data) {
            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                $("#pleaseWaitDialog").modal('hide');
                return;
            }

            //Hora Sistema
            $("#horaSistema").html(data.d.Resultado.fechaInicio);

            $('#sel_bus_tipo').append("<option value='0'>Todos</option>");
            $('#sel_tipo').append("<option value='0'>Todos</option>");
            for (var i = 0; i < data.d.Resultado.listaTipo.length; i++) {
                $('#sel_bus_tipo').append("<option value='" + data.d.Resultado.listaTipo[i].ID_TIPO_HABITACION + "'>" + data.d.Resultado.listaTipo[i].DESCRIPCION + "</option>");
                $('#sel_tipo').append("<option value='" + data.d.Resultado.listaTipo[i].ID_TIPO_HABITACION + "'>" + data.d.Resultado.listaTipo[i].DESCRIPCION + "</option>");
            }

            $('#sel_tiporeserva').append("<option value='0'>Seleccione</option>");
            for (var j = 0; j < data.d.Resultado.listaTipoReserva.length; j++) {
                $('#sel_tiporeserva').append("<option value='" + data.d.Resultado.listaTipoReserva[j].ID_TIPO_RESERVA + "'>" + data.d.Resultado.listaTipoReserva[j].DESCRIPCION + "</option>");
            }

            $('#sel_mediopago').append("<option value='0'>Seleccione</option>");
            for (var k = 0; k < data.d.Resultado.listaMedioPago.length; k++) {
                $('#sel_mediopago').append("<option value='" + data.d.Resultado.listaMedioPago[k].ID_MEDIO_PAGO + "'>" + data.d.Resultado.listaMedioPago[k].DESCRIPCION + "</option>");
            }

            //Fecha actual
            var fullDate = new Date();
            var primerDia = new Date(fullDate.getFullYear(), fullDate.getMonth(), 1);
            var ultimoDia = new Date(fullDate.getFullYear(), fullDate.getMonth() + 1, 0);

            $("#txt_bus_fechainicio").val(formatDate(primerDia, "dd/MM/yyyy"));
            $("#txt_bus_fechainicio").parent().datepicker("update", $("#txt_bus_fechainicio").val());
            $("#txt_bus_fechafin").val(formatDate(ultimoDia, "dd/MM/yyyy"));
            $("#txt_bus_fechafin").parent().datepicker("update", $("#txt_bus_fechafin").val());

            $("#txt_fechainicio").val(formatDate(ultimoDia, "dd/MM/yyyy"));
            $("#txt_fechainicio").parent().datepicker("update", $("#txt_fechainicio").val());
            $("#txt_fechafin").val(formatDate(ultimoDia, "dd/MM/yyyy"));
            $("#txt_fechafin").parent().datepicker("update", $("#txt_fechafin").val());
            $("#pleaseWaitDialog").modal('hide');
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#pleaseWaitDialog").modal('hide');
        }
    });
});
//Funciones
function contarNoches(noches, total, c_fechaInicio, c_fechaFin, error) {
    var fechaInicio = getDateFromFormat(c_fechaInicio.html() === "" ? c_fechaInicio.val() : c_fechaInicio.html(), "dd/MM/yyyy");
    var fechaFin = getDateFromFormat(c_fechaFin.val(), "dd/MM/yyyy");
    var dias = Math.floor((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));

    if (dias < 0) {
        noches.html("");
        total.val("");
        c_fechaInicio.val("");
        c_fechaFin.val("");
        error.html(GenerarAlertaWarning("Fecha: Seleccione las fechas correctamente"));
        return false;
    };

    noches.html(dias + " NOCHES");
}
function fc_calcular_total(c_fechaInicio, c_fechaFin, c_precio, total) {
    var fechaInicio = getDateFromFormat(c_fechaInicio.html() === "" ? c_fechaInicio.val() : c_fechaInicio.html(), "dd/MM/yyyy");
    var fechaFin = getDateFromFormat(c_fechaFin.val(), "dd/MM/yyyy");
    var dias = Math.floor((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
    if (dias === 0) dias = 1;
    var precio = parseFloat(c_precio.val() === "" || isNaN(c_precio.val()) ? "0" : c_precio.val());
    total.val(toDecimal(precio * dias, 2));
}
/*Eventos por Control*/
function aceptarConfirm() {
    switch ($("#txh_idConfirm").val()) {
        case "ANULAR":
            fc_anular_reserva();
            break;
        default:
    }
}
$(document).keydown(function (evt) {
    switch (evt ? evt.which : event.keyCode) {
        case 8: //BLOQUEA RETROCESO DE PAGINA
            var valor = document.activeElement.value;
            if (valor === undefined) { return false; } break;
        case 13: //BLOQUEA ENTER
            break;
        case 66: //BUSCAR
            if (evt ? evt.altKey : event.altKey) $("#btn_buscar").click();
            break;
        case 76: //LIMPIAR
            if (evt ? evt.altKey : event.altKey) $("#btn_limpiar").click();
            break;
        case 78: //NUEVO
            if (evt ? evt.altKey : event.altKey) $("#btn_nuevo").click();
            break;
        case 71: //GUARDAR
            if (evt ? evt.altKey : event.altKey) {
                if ($("#pnl_reserva").css('display') === 'block') {
                    $("#btn_guardar").click();
                }
            }
            break;
    }
});

$("#btn_limpiar").click(function () {
    $("#errorDiv").html('');
    $("#sel_bus_tipo").val('0');
    $("#txt_bus_nocliente").val('');
    $("#txt_bus_habitacion").val('');
});
$("#btn_nuevo").click(function () {
    nuevaReserva();
});
$("#sel_bus_tipo").change(function () {
    $("#btn_buscar").click();
});
$("#pnl_busqueda input:text").keyup(function (e) {
    if (e.keyCode === 13) {
        $("#btn_buscar").click();
    }
});
$("#btn_buscar").click(function () {
    $("#pleaseWaitDialog").modal();
    var fechaIni = getDateFromFormat($("#txt_bus_fechainicio").val(), 'dd/MM/yyyy');
    var fechaFin = getDateFromFormat($("#txt_bus_fechafin").val(), 'dd/MM/yyyy');

    var eReserva = {
        FEC_INI: fechaIni,
        FEC_FIN: fechaFin,
        ID_TIPO_HABITACION: $("#sel_bus_tipo").val(),
        NOM_CLIENTE: $("#txt_bus_nocliente").val(),
        NUM_HABITACION: $("#txt_bus_habitacion").val()
    };

    $.ajax({
        type: "POST",
        url: "page/operacion/reserva.aspx/BuscarReservaWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: eReserva
        }),
        async: true,
        beforeSend: function () {
            $("#btn_buscar").attr("disabled", true);
        },
        success: function (data) {
            $("#btn_buscar").removeAttr("disabled");

            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                $("#pleaseWaitDialog").modal('hide');
                return;
            }
            var html = '';
            var arrayTemp = [];

            for (var i = 0; i < data.d.Resultado.length; i++) {
                var jsonObj = {};

                var fec_ini_r = new Date(parseDateServer(data.d.Resultado[i].FEC_INI).getTime() - currentHelsinkiHoursOffset);
                var fec_fin_r = new Date(parseDateServer(data.d.Resultado[i].FEC_FIN).getTime() - currentHelsinkiHoursOffset);

                jsonObj.id = data.d.Resultado[i].ID_RESERVA;
                jsonObj.title = data.d.Resultado[i].NUM_HABITACION + " " + data.d.Resultado[i].TIPO_HABITACION;
                jsonObj.start = formatDate(fec_ini_r, "yyyy-MM-ddTHH:mm:ss");
                jsonObj.end = formatDate(fec_fin_r, "yyyy-MM-ddTHH:mm:ss");
                switch (data.d.Resultado[i].TIPO_HABITACION) {
                    case "SIMPLE":
                        jsonObj.className = "event-azure";
                        break;
                    case "DOBLE":
                        jsonObj.className = "event-red";
                        break;
                    case "TRIPLE":
                        jsonObj.className = "event-green";
                        break;
                    case "MATRIMONIAL":
                        jsonObj.className = "event-rose";
                        break;
                    case "CUADRUPLE":
                        jsonObj.className = "event-default";
                        break;
                    case "QUINTUPLE":
                        jsonObj.className = "event-oranges";
                        break;
                    default:
                        jsonObj.className = "event-oranges";
                        break;
                }
                jsonObj.description = "<h5><strong>Cliente:</strong> " + data.d.Resultado[i].NOM_CLIENTE + "</h5>";
                jsonObj.description += "<h5><strong>Precio:</strong> " + data.d.Resultado[i].PRECIO_HAB + "&nbsp;&nbsp;&nbsp;&nbsp;<strong>Adelanto:</strong> " + data.d.Resultado[i].ADELANTO + "</h5>";
                jsonObj.description += "<h5><strong>Inicio:</strong> " + formatDate(fec_ini_r, "dd/MM/yyyy HH:mm") + "&nbsp;&nbsp;&nbsp;&nbsp;<strong>Fin:</strong> " + formatDate(fec_fin_r, "dd/MM/yyyy HH:mm") + "</h5>";

                arrayTemp.push(jsonObj);

                /* html += '<tr><td style="display:none">' + data.d.Resultado[i].ID_RESERVA + '</td>';
                 html += '<td>' + (data.d.Resultado[i].ESTADO===1 ? htmlBotones : '') + '</td>';
                 html += '<td>' + data.d.Resultado[i].NUM_HABITACION + '</td>';
                 html += '<td>' + data.d.Resultado[i].TIPO_HABITACION + '</td>';
                 html += '<td>' + formatDate(parseDateServer(data.d.Resultado[i].FEC_INI), "dd/MM/yyyy") + '</td>';
                 html += '<td>' + formatDate(parseDateServer(data.d.Resultado[i].FEC_FIN), "dd/MM/yyyy") + '</td>';
                 html += '<td>' + data.d.Resultado[i].NOM_CLIENTE + '</td>';
                 html += '<td>' + data.d.Resultado[i].PRECIO_HAB + '</td>';
                 html += '<td>' + data.d.Resultado[i].ADELANTO + '</td>';
                 html += '<td>' + data.d.Resultado[i].DSC_ESTADO + '</td></tr>';*/
            }
            var myJsonString = JSON.stringify(arrayTemp);
            //MOSTRAR COMPROBANTE
            var ifr = window.document.getElementById("frameCalendario");
            ifr.dialogArgs = myJsonString;
            ifr.src = "page/operacion/frmCalendario.aspx";

            //$("#frameCalendario").attr({
            //    'src': 'page/operacion/frmCalendario.aspx?eAten=' + myJsonString
            //});

        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#btn_buscar").removeAttr("disabled");
            $("#pleaseWaitDialog").modal('hide');
        }
    });
});
$("#sel_tipo").change(function () {
    $('#pnl_habitacion').hide();
});
//*************************************************************************************************
//******************************************* RESERVAS ********************************************
//*************************************************************************************************
function habitacionesDisponibles(eReserva, tipo, idHabitacion) {
    //******** Obtener habitaciones segun fecha ********* 
    $.ajax({
        type: "POST",
        url: "page/operacion/reserva.aspx/BuscarHabitacionLibreWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: eReserva
        }),
        beforeSend: function () {
            $("#txt_precioIni").val('');
            $("#txt_precio").val('');
            $("#txt_total").val('');
            $("#txt_adelanto").val('');
            $("#txt_precioIni").prop('disabled', true);
        },
        async: true,
        success: function (data) {
            if (!data.d.Activo) {
                $("#errorReserva").html(GenerarAlertaError(data.d.Mensaje));
                return;
            }

            $('#sel_habitaciones').empty();
            $('#sel_habitaciones').append("<option value='0'>Seleccione</option>");
            for (var i = 0; i < data.d.Resultado.length; i++) {
                $('#sel_habitaciones').append("<option dir='" + data.d.Resultado[i].PRECIO_HAB + "' value='" + data.d.Resultado[i].ID_HABITACION + "'>" + data.d.Resultado[i].NUM_HABITACION + " " + data.d.Resultado[i].TIPO_HABITACION + "</option>");
            }
            if (idHabitacion !== 0) {
                $("#sel_habitaciones").val(idHabitacion);
            }
        },
        error: function (data) {
            $("#errorReserva").html(GenerarAlertaError("Inconveniente en la operación"));
        }
    });
}
function ocultarLoading() {
    $("#pleaseWaitDialog").modal('hide');
}
function nuevaReserva() {
    $("#errorDiv").html('');
    $("#errorReserva").html('');
    $("#txh_idreserva").val('0');
    $("#txh_idcliente").val('0');
    $("#txt_nrocliente").val('');
    $("#txt_nomcliente").val('');
    $("#txt_apecliente").val('');
    $("#txt_precio").val('');
    $("#sel_tiporeserva").val('1');
    $("#txt_adelanto").val('');
    $("#txt_total").val('');
    $("#sel_mediopago").val('0');
    $("#txt_observacion").val('');
    $("#txt_horainicio").val('');

    $("#txt_nrocliente").prop('disabled', false);
    $("#txt_nomcliente").prop('disabled', false);
    $("#txt_apecliente").prop('disabled', false);
    $("#txt_adelanto").prop('disabled', false);
    $("#sel_tiporeserva").prop('disabled', false);
    $("#sel_mediopago").prop('disabled', false);

    $("#btn_buscar_cliente").show();
    $("#btn_anular").hide();
    $("#btn_limpiar_cliente").hide();
    //***************** Configuraciones ***************** 
    var bHora = sessionStorage.getItem('CPH');
    if (bHora === "true") {
        $(".horaConfig").show();
        $("#txt_horafin").val(sessionStorage.getItem('HP'));
    } else {
        $(".horaConfig").hide();
        $("#txt_horafin").val("");
    }

    $('#pnl_reserva .modal-title').html('<i class="icon-book"></i> Reservar Habitación');

    var fechaIni = getDateFromFormat($('#horaSistema').html(), 'dd/MM/yyyy');
    var fechaFin = new Date();
    fechaFin.setDate(fechaIni.getDate() + 1);

    $('#txt_fechainicio').val($('#horaSistema').html());
    $("#txt_fechainicio").parent().datepicker("update", $("#txt_fechainicio").val());
    $('#txt_fechafin').val(formatDate(fechaFin, "dd/MM/yyyy"));
    $("#txt_fechafin").parent().datepicker("update", $("#txt_fechafin").val());
    //******** Obtener habitaciones segun fecha *********


    var eReserva = {
        FEC_INI: fechaIni,
        FEC_FIN: fechaFin
    };

    $("#sel_habitaciones").val('0');
    $("#txt_precioIni").val('');
    $("#txt_precio").val('');
    $("#txt_total").val('');
    $("#txt_adelanto").val('');
    $("#txt_precioIni").prop('disabled', true);

    habitacionesDisponibles(eReserva, "N", 0);

    contarNoches($("#lblNoches"), $('#txt_total'), $('#txt_fechainicio'), $('#txt_fechafin'), $("#errorReserva"));

    $("#pnl_reserva").modal('show');
}
function modificarReserva(idReserva, tipo) {
    $('#pnl_reserva .modal-title').html('<i class="icon-edit"></i> Editar Reserva: ' + tipo);
    $('#pnl_movimientos').hide();
    $('#pnl_totales').hide();
    $("#txt_precioIni").prop('disabled', true);
    $("#txt_adelanto").prop('disabled', false);
    $("#sel_tiporeserva").prop('disabled', false);
    $("#sel_mediopago").prop('disabled', false);
    $("#txt_nrocliente").prop('disabled', true);
    $("#txt_nomcliente").prop('disabled', true);
    $("#txt_apecliente").prop('disabled', true);
    $("#btn_buscar_cliente").hide();
    $("#btn_limpiar_cliente").show();
    $("#btn_anular").show();

    $.ajax({
        type: "POST",
        url: "page/operacion/reserva.aspx/ObtenerReservaWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ idReserva: idReserva }),
        async: true,
        beforeSend: function () {
            $("#errorReserva").html('');
        },
        success: function (data) {
            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                return;
            }
            debugger;
            $("#txh_idreserva").val(data.d.Resultado.ID_RESERVA);
            $("#txh_idcliente").val(data.d.Resultado.ID_CLIENTE);

            var fec_ini_r = new Date(parseDateServer(data.d.Resultado.FEC_INI).getTime() - currentHelsinkiHoursOffset);
            var fec_fin_r = new Date(parseDateServer(data.d.Resultado.FEC_FIN).getTime() - currentHelsinkiHoursOffset);

            $("#txt_fechainicio").val(formatDate(fec_ini_r, "dd/MM/yyyy"));
            $("#txt_fechainicio").parent().datepicker("update", $("#txt_fechainicio").val());
            $("#txt_horainicio").val(formatDate(fec_ini_r, "HH:mm"));

            $("#txt_fechafin").val(formatDate(fec_fin_r, "dd/MM/yyyy"));
            $("#txt_fechafin").parent().datepicker("update", $("#txt_fechafin").val());
            $("#txt_horafin").val(formatDate(fec_fin_r, "HH:mm"));

            $("#txt_nrocliente").val(data.d.Resultado.NUM_CLIENTE);
            $("#txt_nomcliente").val(data.d.Resultado.NOM_CLIENTE);
            $("#txt_apecliente").val(data.d.Resultado.APE_CLIENTE);
            $("#txt_precioIni").val(data.d.Resultado.PRECIO_INI);
            $("#txt_precio").val(data.d.Resultado.PRECIO_HAB);
            $("#txt_total").val(data.d.Resultado.TOTAL_HAB);
            $("#sel_tiporeserva").val(data.d.Resultado.ID_TIPO_RESERVA);
            $("#txt_adelanto").val(data.d.Resultado.ADELANTO);
            $("#sel_mediopago").val(data.d.Resultado.ID_MEDIO_PAGO);
            $("#txt_observacion").val(data.d.Resultado.OBSERVACION);
            //******** Obtener habitaciones segun fecha **********
            var fechaIni = getDateFromFormat($("#txt_fechainicio").val(), 'dd/MM/yyyy');
            var fechaFin = getDateFromFormat($("#txt_fechafin").val(), 'dd/MM/yyyy');

            var eReserva = {
                FEC_INI: fechaIni,
                FEC_FIN: fechaFin,
                ID_RESERVA: data.d.Resultado.ID_RESERVA
            };
            habitacionesDisponibles(eReserva, "M", data.d.Resultado.ID_HABITACION);//Modificado

            contarNoches($("#lblNoches"), $('#txt_total'), $('#txt_fechainicio'), $('#txt_fechafin'), $("#errorReserva"));

            $("#pnl_reserva").modal('show');
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
        }
    });
}
function anularReserva() {
    $("#txh_idConfirm").val("ANULAR");
    window.parent.fc_mostrar_confirmacion("Seguro que desea <strong>Anular</strong> la reserva?");
}
function fc_anular_reserva() {
    $("#btn_anular").button('loading');
    $("#errorReserva").html('');

    if (validIdInput($("#txh_idreserva").val())) {
        $("#errorAtencion_a").html(GenerarAlertaWarning("Reserva: No ha seleccionado ninguna reserva."));
        $("#btn_anular").button('reset');
        return;
    }

    $.ajax({
        type: "POST",
        url: "page/operacion/reserva.aspx/AnularReservaWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ idReserva: $("#txh_idreserva").val() }),
        async: true,
        success: function (data) {

            if (!data.d.Activo) {
                $("#errorReserva").html(GenerarAlertaError(data.d.Mensaje));
                $("#btn_anular").button('reset');
                return;
            }

            $("#errorDiv").html(GenerarAlertaSuccess(data.d.Mensaje));
            $("#pnl_reserva").modal('hide');
            $("#btn_anular").button('reset');
            $("#btn_buscar").click();
        },
        error: function (data) {
            $("#errorReserva").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#btn_anular").button('reset');
        }
    });
    event.preventDefault();
}

$("#sel_habitaciones").change(function (param, valor) {
    $("#txt_precioIni").val($('option:selected', this).attr('dir'));
    $("#txt_precio").val($('option:selected', this).attr('dir'));
    $("#txt_adelanto").val($('option:selected', this).attr('dir'));
    fc_calcular_total($('#txt_fechainicio'), $('#txt_fechafin'), $('#txt_precio'), $('#txt_total'));
});
$("#btn_limpiar_cliente").click(function () {
    $("#btn_limpiar_cliente").button('loading');

    $("#txt_nrocliente").val('');
    $("#txt_nomcliente").val('');
    $("#txt_apecliente").val('');
    $("#txh_idcliente").val('0');

    $("#txt_nrocliente").prop('disabled', false);
    $("#txt_nomcliente").prop('disabled', false);
    $("#txt_apecliente").prop('disabled', false);

    $("#btn_buscar_cliente").show();
    $("#btn_limpiar_cliente").hide();

    $("#btn_limpiar_cliente").button('reset');

    $("#txt_nrocliente").focus();
});
$("#btn_buscar_cliente").click(function () {
    $("#btn_buscar_cliente").button('loading');
    $.ajax({
        type: "POST",
        url: "page/operacion/reserva.aspx/BuscarClienteWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            numero: $("#txt_nrocliente").val(), nombre: ''
        }),
        async: true,
        success: function (data) {
            if (!data.d.Activo) {
                $("#errorReserva").html(GenerarAlertaError(data.d.Mensaje));
                $("#btn_buscar_cliente").button('reset');
                return;
            }

            if (data.d.Resultado.length > 0) {
                var html = '';
                for (var i = 0; i < data.d.Resultado.length; i++) {
                    $("#txt_nrocliente").val(data.d.Resultado[i].NUM_DOCUMENTO);
                    $("#txt_nomcliente").val(data.d.Resultado[i].NOMBRES);
                    $("#txt_apecliente").val(data.d.Resultado[i].APELLIDOS);
                    $("#txh_idcliente").val(data.d.Resultado[i].ID_CLIENTE);

                    $("#txt_nrocliente").prop('disabled', true);
                    $("#txt_nomcliente").prop('disabled', true);
                    $("#txt_apecliente").prop('disabled', true);

                    $("#btn_buscar_cliente").hide();
                    $('#btn_limpiar_cliente').show();
                }
                $("#btn_buscar_cliente").button('reset');
            } else {
                $("#btn_buscar_cliente").button('reset');
                $("#txh_idcliente").val('');
                $("#txt_nomcliente").val('');
                $("#txt_apecliente").val('');
                $("#errorReserva").html(GenerarAlertaError('No se encontró el documento ingresado. Debe ingresar el Nombre'));
            }
        },
        error: function (data) {
            $("#errorReserva").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#btn_buscar_cliente").button('reset');
        }
    });
});
$("#txt_precio").keyup(function () {
    fc_calcular_total($('#txt_fechainicio'), $('#txt_fechafin'), $('#txt_precio'), $('#txt_total'));
    $("#txt_adelanto").val($("#txt_total").val());
});
$("#btn_guardar").click(function () {
    $("#btn_guardar").button('loading');
    $("#errorReserva").html('');

    if (validIdInput($("#sel_habitaciones").val())) {
        $("#errorReserva").html(GenerarAlertaWarning("Habitacion: seleccione un registro"));
        $("#btn_guardar").button('reset');
        return;
    } else if (validIdInput($("#txt_fechainicio").val())) {
        $("#errorReserva").html(GenerarAlertaWarning("Fecha de Inicio: ingresar una fecha válida"));
        $("#btn_guardar").button('reset');
        $("#txt_fechainicio").focus();
        return;
    } else if (validate_hour($("#txt_horainicio").val())) {
        $("#errorReserva").html(GenerarAlertaWarning("Hora inicio: ingrese una hora válida 23:59 máximo"));
        $("#btn_guardar").button('reset');
        $("#txt_horainicio").focus();
        return;
    } else if (validIdInput($("#txt_fechafin").val())) {
        $("#errorReserva").html(GenerarAlertaWarning("Fecha Fin: ingresar una fecha válida"));
        $("#btn_guardar").button('reset');
        $("#txt_fechafin").focus();
        return;
    } else if (validate_hour($("#txt_horafin").val())) {
        $("#errorReserva").html(GenerarAlertaWarning("Hora fin: ingrese una hora válida 23:59 máximo"));
        $("#btn_guardar").button('reset');
        $("#txt_horafin").focus();
        return;
    } else if (validIdInput($("#txh_idcliente").val())) {
        if ($("#txt_nrocliente").val() === "" || $("#txt_nomcliente").val() === "") {
            $("#errorReserva").html(GenerarAlertaWarning("Cliente: Ingrese documento y nombre del cliente"));
            $("#txt_nrocliente").focus();
            $("#btn_guardar").button('reset');
            return;
        }
    } else if (validIdInput($("#txt_precio").val())) {
        $("#errorReserva").html(GenerarAlertaWarning("Precio: ingresar monto válido"));
        $("#btn_guardar").button('reset');
        $("#txt_precio").focus();
        return;
    } else if (validIdInput($("#txt_total").val())) {
        $("#errorReserva").html(GenerarAlertaWarning("Total: ingresar un total válido"));
        $("#btn_guardar").button('reset');
        $("#txt_total").focus();
        return;
        //} else if (validIdInput($("#sel_mediopago").val() )) {
        //    $("#errorReserva").html(GenerarAlertaWarning("Medio Pago: seleccione una opción"));
        //    $("#sel_mediopago").focus();
        //    $("#btn_guardar").button('reset');
        //    return;
    } else if (validIdInput($("#sel_tiporeserva").val())) {
        $("#errorReserva").html(GenerarAlertaWarning("Tipo Reserva: seleccione una opción"));
        $("#btn_guardar").button('reset');
        $("#sel_tiporeserva").focus();
        return;
    }

    if ($("#txt_adelanto").val() === "" || isNaN($("#txt_adelanto").val())) $("#txt_adelanto").val("0");
    if ($("#txh_idcliente").val() === "") $("#txh_idcliente").val("0");

    var ifecInicio = $("#txt_horainicio").val() === "" ? getDateFromFormat($("#txt_fechainicio").val(), 'dd/MM/yyyy') : getDateFromFormat($("#txt_fechainicio").val() + ' ' + $("#txt_horainicio").val(), 'dd/MM/yyyy HH:mm');
    var ifecFin = $("#txt_horafin").val() === "" ? getDateFromFormat($("#txt_fechafin").val(), 'dd/MM/yyyy') : getDateFromFormat($("#txt_fechafin").val() + ' ' + $("#txt_horafin").val(), 'dd/MM/yyyy HH:mm');

    ifecInicio = new Date(ifecInicio.getTime() + currentHelsinkiHoursOffset);
    ifecFin = new Date(ifecFin.getTime() + currentHelsinkiHoursOffset);

    var eReserva = {
        ID_RESERVA: $("#txh_idreserva").val() === "" ? 0 : $("#txh_idreserva").val(),
        ID_CLIENTE: $("#txh_idcliente").val(),
        NOM_CLIENTE: $("#txt_nomcliente").val(),
        APE_CLIENTE: $("#txt_apecliente").val(),
        NUM_CLIENTE: $("#txt_nrocliente").val(),
        ID_HABITACION: $("#sel_habitaciones").val(),
        FEC_INI: ifecInicio,
        FEC_FIN: ifecFin,
        ID_TIPO_RESERVA: $("#sel_tiporeserva").val(),
        ADELANTO: $("#txt_adelanto").val() === "" ? 0 : $("#txt_adelanto").val(),
        PRECIO_HAB: $("#txt_precio").val() === "" ? 0 : $("#txt_precio").val(),
        TOTAL_HAB: $("#txt_total").val() === "" ? 0 : $("#txt_total").val(),
        ID_MEDIO_PAGO: $("#sel_mediopago").val(),
        OBSERVACION: $("#txt_observacion").val()
    };

    $.ajax({
        type: "POST",
        url: "page/operacion/reserva.aspx/GuardarReservaWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ eReserva: eReserva }),
        async: true,
        success: function (data) {

            if (!data.d.Activo) {
                $("#errorReserva").html(GenerarAlertaError(data.d.Mensaje));
                $("#btn_guardar").button('reset');
                return;
            }

            $("#errorDiv").html(GenerarAlertaSuccess(data.d.Mensaje));
            $("#pnl_reserva").modal('hide');
            $("#btn_guardar").button('reset');
            $("#btn_buscar").click();
        },
        error: function (data) {
            $("#errorReserva").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#btn_guardar").button('reset');
        }
    });

    event.preventDefault();
});
$("#btn_anular").click(function () {
    anularReserva();
});