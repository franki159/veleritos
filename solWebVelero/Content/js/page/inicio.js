/*Inicializar Script*/
//Variacion de la zona horaria
$(function () {
    $(document).prop("title", "::Inico");
    $(document).unbind("keydown");
    
    $('.dtOp').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        orientation: "top left"
    }).on('changeDate', function () {
        var input = $(this).find('input:text');
        if (input.attr('id') === 'txt_fechainicio' || input.attr('id') === 'txt_fechafin' || input.attr('id') === 'txt_fechafin_a') {
            var fechaInicio = getDateFromFormat($('#txt_fechainicio').val(), "dd/MM/yyyy");
            var fechaFin = getDateFromFormat($('#txt_fechafin').val(), "dd/MM/yyyy");
            var fechaFin_a = getDateFromFormat($('#txt_fechafin_a').val(), "dd/MM/yyyy");
            var fechaActual = getDateFromFormat($('#horaSistema').html(), "dd/MM/yyyy");
           
            $("#lblNoches").html("");
            $('#txt_total').val("");
            //Para la fecha de inicio
            if (input.attr('id') === 'txt_fechainicio') {
                if (fechaInicio < fechaActual) {
                    $('#txt_fechainicio').val("");
                    $("#lblNoches").html("");
                    $("#errorReserva").html(GenerarAlertaWarning("Fecha: La fecha de inicio debe ser menor a la fecha actual"));
                } else {
                    if (fechaInicio >= fechaFin) {
                        fechaFin.setDate(fechaInicio.getDate() + 1);
                        $('#txt_fechafin').val(formatDate(fechaFin, "dd/MM/yyyy"));
                        $("#txt_fechafin").parent().datepicker("update", $("#txt_fechafin").val());
                    }
                    contarNoches($("#lblNoches"), $('#txt_total'), $('#txt_fechainicio'), $('#txt_fechafin'), $("#errorReserva"));
                    $('#txt_total').val($('#txt_precio').val());
                }
            //Para la fecha de fin
            } else if (input.attr('id') === 'txt_fechafin') {
                //fechaInicio = $("#txt_horainicio").val() === "" ? getDateFromFormat($("#txt_fechainicio").val(), 'dd/MM/yyyy') : getDateFromFormat($("#txt_fechainicio").val() + ' ' + $("#txt_horainicio").val(), 'dd/MM/yyyy HH:mm');
                //fechaFin = $("#txt_horafin").val() === "" ? getDateFromFormat($("#txt_fechafin").val(), 'dd/MM/yyyy') : getDateFromFormat($("#txt_fechafin").val() + ' ' + $("#txt_horafin").val(), 'dd/MM/yyyy HH:mm');
                if (fechaFin < fechaInicio) {
                    $('#txt_fechafin').val("");
                    $("#lblNoches").html("");
                    $("#errorReserva").html(GenerarAlertaWarning("Fecha: La fecha de fin no debe ser menor a la fecha inicio"));
                } else {
                    contarNoches($("#lblNoches"), $('#txt_total'), $('#txt_fechainicio'), $('#txt_fechafin'), $("#errorReserva"));
                    fc_calcular_total($('#txt_fechainicio'), $('#txt_fechafin'), $('#txt_precio'), $('#txt_total'));
                }
            } else if (input.attr('id') === 'txt_fechafin_a') {
                if (fechaFin_a < fechaActual) {
                    $('#txt_fechafin_a').val("");
                    $("#lblNoches_a").html("");
                    $("#errorAtencion_a").html(GenerarAlertaWarning("Fecha: La fecha de fin no debe ser menor a la fecha actual"));
                } else {
                    contarNoches($("#lblNoches_a"), $('#txt_total_a'), $('#horaSistema'), $('#txt_fechafin_a'), $("#errorAtencion_a"));
                    fc_calcular_total($('#horaSistema'), $('#txt_fechafin_a'), $('#txt_precio_a'), $('#txt_total_a'));
                }
            }
        }
    });
    
    //fc_listar_configuracion();
    //$("#pleaseWaitDialog").modal();
    //setInterval('fc_listar_estadoHotel()', 3600000);
    closeLoading();
});

/* FUNCIONES */
function fc_listar_configuracion() {
    /************************ Lista de Configuraciones ****************************/
    $.ajax({
        type: "POST",
        url: "default.aspx/GetConfiguracion",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ cod_grupo: "" }),
        async: true,
        success: function (data) {
            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                $("#pleaseWaitDialog").modal('hide');
                return;
            }
            /************************ Lista de Configuraciones ****************************/
            sessionStorage.clear();
            for (var j = 0; j < data.d.Resultado.ListaConfiguracion.length; j++) {
                sessionStorage.setItem(data.d.Resultado.ListaConfiguracion[j].COD_CONFIG, data.d.Resultado.ListaConfiguracion[j].VALOR);
            }

            fc_listar_controles();
            fc_listar_estadoHotel();

        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#pleaseWaitDialog").modal('hide');
        }
    });
}
function fc_listar_controles() {
    //$("#tituloCargaBar").html("Cargando controles...");
    $("#pleaseWaitDialog").modal();
    //Lista Data Inicial Reserva
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

            $('#sel_bus_tipo').append("<option value='0'>Todos</option>");
            $('#sel_tipo').append("<option value='0'>Todos</option>");
            for (var i = 0; i < data.d.Resultado.listaTipo.length; i++) {
                $('#sel_bus_tipo').append("<option value='" + data.d.Resultado.listaTipo[i].ID_TIPO_HABITACION + "'>" + data.d.Resultado.listaTipo[i].DESCRIPCION + "</option>");
                $('#sel_tipo').append("<option value='" + data.d.Resultado.listaTipo[i].ID_TIPO_HABITACION + "'>" + data.d.Resultado.listaTipo[i].DESCRIPCION + "</option>");
            }

            $('#sel_tiporeserva').append("<option value='0'>Seleccione</option>");
            for (var i = 0; i < data.d.Resultado.listaTipoReserva.length; i++) {
                $('#sel_tiporeserva').append("<option value='" + data.d.Resultado.listaTipoReserva[i].ID_TIPO_RESERVA + "'>" + data.d.Resultado.listaTipoReserva[i].DESCRIPCION + "</option>");
            }

            $('#sel_mediopago').append("<option value='0'>Seleccione</option>");
            $('#sel_mediopago_a').append("<option value='0'>Seleccione</option>");
            $('#sel_mediopago_h').append("<option value='0'>Seleccione</option>");
            for (var i = 0; i < data.d.Resultado.listaMedioPago.length; i++) {
                $('#sel_mediopago').append("<option value='" + data.d.Resultado.listaMedioPago[i].ID_MEDIO_PAGO + "'>" + data.d.Resultado.listaMedioPago[i].DESCRIPCION + "</option>");
                $('#sel_mediopago_a').append("<option value='" + data.d.Resultado.listaMedioPago[i].ID_MEDIO_PAGO + "'>" + data.d.Resultado.listaMedioPago[i].DESCRIPCION + "</option>");
                $('#sel_mediopago_h').append("<option value='" + data.d.Resultado.listaMedioPago[i].ID_MEDIO_PAGO + "'>" + data.d.Resultado.listaMedioPago[i].DESCRIPCION + "</option>");
            }

            $("#txt_bus_fechainicio").val(data.d.Resultado.fechaInicio);
            $("#txt_bus_fechainicio").parent().datepicker("update", $("#txt_bus_fechainicio").val());
            $("#txt_bus_fechafin").val(data.d.Resultado.fechaFin);
            $("#txt_bus_fechafin").parent().datepicker("update", $("#txt_bus_fechafin").val());

            $("#txt_fechainicio").val(data.d.Resultado.fechaInicio);
            $("#txt_fechainicio").parent().datepicker("update", $("#txt_fechainicio").val());
            $("#txt_fechafin").val(data.d.Resultado.fechaFin);
            $("#txt_fechafin").parent().datepicker("update", $("#txt_fechafin").val());
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#pleaseWaitDialog").modal('hide');
        }
    });
    //Lista Data Inicial Atencion por horas
    //***************** Configuraciones ***************** 
    var bHora = sessionStorage.getItem('APH');
    if (bHora === "true") {
        $.ajax({
            type: "POST",
            url: "default.aspx/GetConfiguracion",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ cod_grupo: "CPH" }),
            async: true,
            success: function (data) {
                if (!data.d.Activo) {
                    $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                    $("#pleaseWaitDialog").modal('hide');
                    return;
                }

                $('#sel_hora_h').append("<option value='0'>Seleccione</option>");
                for (var i = 0; i < data.d.Resultado.ListaConfiguracion.length; i++) {
                    $('#sel_hora_h').append("<option value='" + data.d.Resultado.ListaConfiguracion[i].COD_CONFIG + "'>" + data.d.Resultado.ListaConfiguracion[i].DESC_CONFIG + "</option>");
                }
            },
            error: function (data) {
                $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
                $("#pleaseWaitDialog").modal('hide');
            }
        });
    } else {
        $('#sel_hora_h').empty();
    }    
    //Lista Data Inicial Movimiento
    $.ajax({
        type: "POST",
        url: "page/operacion/movimiento.aspx/ListaInicialWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            opcion: 2
        }),
        async: true,
        success: function (data, status) {
            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                $("#pleaseWaitDialog").modal('hide');
                return;
            }

            $('#sel_movimiento').append("<option tipoMov='0' value='0'>Seleccione</option>");

            for (var i = 0; i < data.d.Resultado.lista.length; i++) {
                $('#sel_movimiento').append("<option tipoMov='" + data.d.Resultado.lista[i].TIPO_MOV + "' value='" + data.d.Resultado.lista[i].ID_TIPO_MOVIMIENTO + "'>" + data.d.Resultado.lista[i].DESCRIPCION + "</option>");
            }

            $("#pnl_busqueda :input").removeAttr("disabled");

            //$("#pleaseWaitDialog").modal('hide');
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#pleaseWaitDialog").modal('hide');
        }
    });
}
function fc_listar_estadoHotel() {
    //$("#tituloCargaBar").html("Cargando habitaciones...");
    $("#pleaseWaitDialog").modal();
    //listado de indicadores
    $.ajax({
        type: "POST",
        url: "page/inicio.aspx/ListaIndicadoresHotelWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            if (data.d.error) {
                $("#errorDiv").html(GenerarAlertaError(data.d.error));
                $("#pleaseWaitDialog").modal('hide');
                return;
            }

            $("#ind_DineroCaja").html(data.d.Resultado.MONTO_CAJA + "<small> Soles</small>");
            $("#ind_PorCobrar").html(data.d.Resultado.DEUDA + "<small> Soles</small>");
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#pleaseWaitDialog").modal('hide');
        }
    });
    //estado de habitaciones

    $.ajax({
        type: "POST",
        url: "page/inicio.aspx/ListaEstadoHotelWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        beforeSend: function () {
            $('#pnl_estado').empty();
        },
        success: function (data) {
            if (data.d.error || data.d.Resultado === null) {
                $("#errorDiv").html(GenerarAlertaError(data.d.error));
                $("#pleaseWaitDialog").modal('hide');
                return;
            }

            var html = '';
            var arrayPiso = [];
            var contPiso = 0;
            var piso = 0;
            var color = '';
            var contHabLibres = 0;
            var contHabOcupadas = 0;
            
            for (var j = 0; j < data.d.Resultado.length; j++) {
                if (piso !== data.d.Resultado[j].PISO) {
                    arrayPiso[contPiso] = data.d.Resultado[j].PISO;
                    contPiso++;
                    piso = data.d.Resultado[j].PISO;
                }
            }
            //Hora Sistema
            $("#horaSistema").html(data.d.Resultado[0].FECHA_SISTEMA);

            for (var k = 0; k < arrayPiso.length; k++) {
                html += '<div class="panel panel-group panel-primary">';
                //html += '<div class="panel panel-primary">';
                html += '<div class="panel panel-primary panel-heading">PISO ' + arrayPiso[k] + '</div>';
                html += '<div class="panel-body">';
                //***************** OTORGAR PERMISOS AL CUARTO *************************
                //Reservar  ..........1
                //Alquilar ...........2
                //Liberar  ...........3
                //Anular Reserva......4
                //Asignar gasto.......5
                //Modificar reserva...6
                //Atender.............7
                //Modificar Atencion..8
                //Anular Alquiler.....9
                //Alquilar por horas.10
                //Detalle............11
                //Mantenimiento......12
                //Activar Habitacion.13
                //Facturacion antic..14**********************************************
                //Ver Factura .......15
                //Finalizar Factura Anticipada.......16
                for (var i = 0; i < data.d.Resultado.length; i++) {
                    var arrayAccion = [];
                    if (arrayPiso[k] === data.d.Resultado[i].PISO) {
                        var imgIco = '';
                        var bReserva = sessionStorage.getItem('RES');
                        var index = 0;
                        switch (data.d.Resultado[i].DSC_ESTADO) {
                            case 'OCUPADO':
                                color = 'default';
                                index = 0;
                                //if (bReserva === "true") arrayAccion[0] = "1";
                                if (data.d.Resultado[i].ID_COMPROBANTE === 0) {
                                    arrayAccion[index++] = "3";
                                    arrayAccion[index++] = "5";
                                    arrayAccion[index++] = "8";
                                    arrayAccion[index++] = "9";
                                    arrayAccion[index++] = "14";
                                    arrayAccion[index++] = "11";
                                } else {
                                    arrayAccion[index++] = "16";
                                    arrayAccion[index++] = "9";
                                    arrayAccion[index++] = "15";
                                    arrayAccion[index++] = "11";
                                }
                                contHabOcupadas++; break;
                            case 'RESERVADO':
                                color = 'info';
                                index = 0;
                                //if (bReserva === "true") arrayAccion[index++] = "1";
                                arrayAccion[index++] = "6";
                                arrayAccion[index++] = "7";
                                arrayAccion[index++] = "4";
                                arrayAccion[index++] = "11";
                                contHabLibres++; break;
                            case 'DEMORADO':
                                color = 'danger';
                                index = 0;
                                //if (bReserva === "true") arrayAccion[0] = "1";
                                if (data.d.Resultado[i].ID_COMPROBANTE === 0) {
                                    arrayAccion[index++] = "3";
                                    arrayAccion[index++] = "5";
                                    arrayAccion[index++] = "8";
                                    arrayAccion[index++] = "9";
                                    arrayAccion[index++] = "14";
                                    arrayAccion[index++] = "11";
                                } else {
                                    arrayAccion[index++] = "16";
                                    arrayAccion[index++] = "9";
                                    arrayAccion[index++] = "15";
                                    arrayAccion[index++] = "11";
                                }
                                contHabOcupadas++; break;
                            case 'POR SALIR':
                                color = 'warning';
                                index = 0;
                                //if (bReserva === "true") arrayAccion[0] = "1";
                                if (data.d.Resultado[i].ID_COMPROBANTE === 0) {
                                    arrayAccion[index++] = "3";
                                    arrayAccion[index++] = "5";
                                    arrayAccion[index++] = "8";
                                    arrayAccion[index++] = "9";
                                    arrayAccion[index++] = "14";
                                    arrayAccion[index++] = "11";
                                } else {
                                    arrayAccion[index++] = "16";
                                    arrayAccion[index++] = "9";
                                    arrayAccion[index++] = "15";
                                    arrayAccion[index++] = "11";
                                }
                                contHabOcupadas++; break;
                            case 'LIBRE':
                                color = 'success';
                                index = 0;
                                if (bReserva === "true") arrayAccion[index++] = "1";
                                arrayAccion[index++] = "2";
                                arrayAccion[index++] = "10";
                                arrayAccion[index++] = "11";
                                arrayAccion[index++] = "12";
                                contHabLibres++; break;
                            case 'MANTENIMIENTO':
                                color = 'primary';
                                imgIco = 'icon-time';
                                if (bReserva === "true") arrayAccion[0] = "1";
                                arrayAccion[1] = "13";
                                contHabOcupadas++; break;
                            default: color = 'success'; break;
                        }

                        var estHabitacion = data.d.Resultado[i].DSC_ESTADO;
                        var idHabitacion = data.d.Resultado[i].ID_HABITACION;
                        var numHabitacion = data.d.Resultado[i].NUMERO;
                        var tipHabitacion = data.d.Resultado[i].TIPOHABITACION.DESCRIPCION;
                        var preHabitacion = data.d.Resultado[i].PRECIO;
                        var ldetalle = data.d.Resultado[i].CARACTERISTICAS;
                        var pdeuda = data.d.Resultado[i].DEUDA;
                        //Listando Habitaciones en SELECT
                        $('.listaHabitaciones').append("<option value='" + idHabitacion + "'>" + numHabitacion + " " + tipHabitacion + "</option>");
                        
                        html += '<div class="dropdown notify-row" style="display: inline-block;margin: 5px;">';
                        //Deuda en la habitación
                        var strDeuda = "";
                        if (pdeuda > 0) {
                            strDeuda = "<span class='badge bg-warning badge-color-deuda'>"+pdeuda+"</span>";
                        }
                        
                        html += '<button  id="H' + idHabitacion + '" class="btn btn-' + color + ' btn-sm dropdown-toggle" data-loading-text="<i class=\'icon-spinner icon-spin icon-large\'></i> Cargando" style="font-weight:bold;" type="button" data-toggle="dropdown"><span style ="color:#000;font-size:20px;">' + numHabitacion + '</span>&nbsp;<i style ="font-size:20px;" class="' + imgIco + '"></i><br>' + tipHabitacion + strDeuda +'</button>&nbsp;&nbsp;';
                        html += '';
                        html += '<ul class="dropdown-menu"><div class="log-arrow-up arrow-left-menu"></div>';
                        for (var m = 0; m < arrayAccion.length; m++) {
                            switch (arrayAccion[m]) {
                                case "1":
                                    var bReserva2 = sessionStorage.getItem('RES');
                                    if (bReserva2 === "true")
                                        html += '<li><a style="cursor:pointer;" onclick="nuevaReserva(' + idHabitacion + ',\'' + numHabitacion + '\',\'' + tipHabitacion + '\',\'' + preHabitacion + '\');"><i class="icon-book"></i> Reservar</a></li>';
                                    break;
                                case "2":
                                    html += '<li><a style="cursor:pointer;" onclick="nuevaAtencion(' + idHabitacion + ',\'' + numHabitacion + '\',\'' + tipHabitacion + '\',\'' + preHabitacion + '\');"><i class="icon-suitcase"></i> Alquilar</a></li>';
                                    break;
                                case "3":
                                    html += '<li><a style="cursor:pointer;" onclick="liberarHabitacion(' + data.d.Resultado[i].ID_ATENCION + ',6)"><i class="icon-tag"></i> Check-out</a></li>';
                                    break;
                                case "4":
                                    html += '<li><a style="cursor:pointer;" onclick="anularReserva(' + data.d.Resultado[i].ID_RESERVA + ')"><i class="icon-remove"></i> Anular Reserva</a></li>';
                                    break;
                                case "5":
                                    html += '<li><a style="cursor:pointer;" onclick="nuevoMovimiento(' + data.d.Resultado[i].ID_ATENCION + ',\'' + numHabitacion + '\',\'' + tipHabitacion + '\')"><i class="icon-money"></i> Pagos/Consumos</a></li>';
                                    break;
                                case "6":
                                    html += '<li><a style="cursor:pointer;" onclick="modificarReserva(' + data.d.Resultado[i].ID_RESERVA + ',' + idHabitacion + ',\'' + numHabitacion + '\',\'' + tipHabitacion + '\')"><i class="icon-pencil"></i> Modificar Reserva</a></li>';
                                    break;
                                case "7":
                                    html += '<li><a style="cursor:pointer;" onclick="atenderReserva(' + data.d.Resultado[i].ID_RESERVA + ')"><i class="icon-tags"></i> Atender</a></li>';
                                    break;
                                case "8":
                                    html += '<li><a style="cursor:pointer;" onclick="modificarAtencion(' + data.d.Resultado[i].ID_ATENCION + ',' + idHabitacion + ',\'' + numHabitacion + '\',\'' + tipHabitacion + '\',\'' + preHabitacion + '\')"><i class="icon-pencil"></i> Modificar Atencion</a></li>';
                                    break;
                                case "9":
                                    html += '<li><a style="cursor:pointer;" onclick="anularAtencion(' + data.d.Resultado[i].ID_ATENCION + ')"><i class="icon-remove"></i> Anular Atencion</a></li>';
                                    break;
                                case "10":
                                    var bPorHora = sessionStorage.getItem('APH');
                                    if (bPorHora === "true")
                                        html += '<li><a style="cursor:pointer;" onclick="nuevaAtencionHora(' + idHabitacion + ',\'' + numHabitacion + '\',\'' + tipHabitacion + '\',\'' + preHabitacion + '\')"><i class="icon-time"></i> Alquilar por horas</a></li>';
                                    break;
                                case "11":
                                    html += '<li role="separator" class="divider"></li><li><a style="cursor:pointer;" onclick="verDetalle(' + idHabitacion + ',\'' + estHabitacion + '\',\'' + color + '\',\'' + numHabitacion + '\',\'' + tipHabitacion + '\',\'' + ldetalle + '\')"><i class="icon-list"></i> Ver Detalles</a></li>';
                                    break;
                                case "12":
                                    html += '<li><a style="cursor:pointer;" onclick="setMantenimiento(' + idHabitacion +')"><i class="icon-wrench"></i> En Mantenimiento</a></li>';
                                    break;
                                case "13":
                                    html += '<li><a style="cursor:pointer;" onclick="activarHab(' + idHabitacion +')"><i class="icon-bolt"></i> Activar</a></li>';
                                    break;
                                case "14":
                                    var bFactAnt = sessionStorage.getItem('FACANT');
                                    if (bFactAnt === "true")
                                        html += '<li><a style="cursor:pointer;" onclick="liberarHabitacion(' + data.d.Resultado[i].ID_ATENCION + ',9)"><i class="icon-file"></i> Emitir Comprobante</a></li>';
                                    break;
                                case "15":
                                    html += '<li><a style="cursor:pointer;" onclick="verComprobante(' + data.d.Resultado[i].ID_COMPROBANTE + ',9)"><i class="icon-print"></i> Ver Comprobante</a></li>';
                                    break;
                                case "16":
                                    html += '<li><a style="cursor:pointer;" onclick="finalizarAtencion(' + data.d.Resultado[i].ID_ATENCION + ',6)"><i class="icon-tag"></i> Check-out</a></li>';
                                    break;
                                default:
                                    break;
                            }
                        }
                        html += '</ul>';
                        html += '</div>';
                    }
                }
                
                html += '</div>';

                html += '</div>';
            }

            $("#ind_HabLibres").html(contHabLibres);
            $("#ind_HabOcupadas").html(contHabOcupadas);

            $("#pnl_estado").html(html);
            $("#pleaseWaitDialog").modal('hide');
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#pleaseWaitDialog").modal('hide');
        }
    });
}
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
    }

    noches.html(dias + " NOCHES");
}
function contarNochesA(noches, total, c_fechaInicio, c_fechaFin, error) {
    var fechaInicio = getDateFromFormat(c_fechaInicio, "dd/MM/yyyy");
    var fechaFin = getDateFromFormat(c_fechaFin.val(), "dd/MM/yyyy");
    var dias = Math.floor((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));

    if (dias < 0) {
        noches.html("");
        total.val("");
        c_fechaFin.val("");
        error.html(GenerarAlertaWarning("Fecha: Seleccione las fechas correctamente"));
        return false;
    }

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
//*************************************************************************************************
//******************************************* MANTENIMIENTO ***************************************
//*************************************************************************************************
function setMantenimiento(id) {
    $("#txh_idhabitacion").val(id);
    $("#txh_idConfirm").val("MANTENIMIENTO");
    window.parent.fc_mostrar_confirmacion("Seguro que desea poner en <strong>MANTENIMIENTO</strong> la habitación?");
}
function activarHab(id) {
    $("#txh_idhabitacion").val(id);
    $("#txh_idConfirm").val("ACTIVAR");
    window.parent.fc_mostrar_confirmacion("Seguro que desea poner en <strong>ACTIVAR</strong> la habitación?");
}
function fc_cambiar_estado(tipoCambio) {
    if ($("#txh_idhabitacion").val() === "" || $("#txh_idhabitacion").val() === "0") {
        $("#modalConfirm").modal('hide');
        $("#errorDiv").html(GenerarAlertaWarning("Mantenimiento: no se ha seleccionado ninguna habitación"));
        return;
    }

    $("#pleaseWaitDialog").modal();
 
    $.ajax({
        type: "POST",
        url: "page/mantenimiento/habitacion.aspx/CambiarEstadoHabitacionWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            idHabitacion: $("#txh_idhabitacion").val(),
            estado: tipoCambio
        }),
        async: true,
        success: function (data) {

            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                $("#pleaseWaitDialog").modal('hide');
                return;
            }
            if (tipoCambio === 1)
                $("#errorDiv").html(GenerarAlertaSuccess("Se Activó satisfactoriamente la habitación"));
            else if (tipoCambio === 2)
                $("#errorDiv").html(GenerarAlertaSuccess("Se Anuló satisfactoriamente la habitación"));
            
            $("#txh_idhabitacion").val("");
            $("#modalConfirm").modal('hide');
            fc_listar_estadoHotel();
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
        }
    });
}
//*************************************************************************************************
//******************************************* DETALLES ********************************************
//*************************************************************************************************
function verDetalle(id, estado, color, num, tipo, detalle) {
    $('#pnl_detalle .modal-title').html('<i class="icon-list"></i> Habitación ' + tipo + ' <b>' + num + '</b> <div class="btn-group disabled" style="float: right; margin-right: 50px;"><div class="btn btn-'+color+' btn-sm">'+estado+'</div></div>');
    var list_detalles = detalle.split("|");
    var ldetalle = "";
    list_detalles.forEach(function (element) {
        //ldetalle += "<span class='label label-info'>" + element+"</span></br>";
        if (element !== "") {
            ldetalle += "<p><i class='icon-check'></i> " + element + "</p>";
        }
    });
    $("#bodyDetalle").html("<ul class='list-group'>" + ldetalle + "</ul>");
    $("#pnl_detalle").modal('show');
}
function verComprobante(idComprobante) {
    var bFactElec = sessionStorage.getItem('FACELEC');
    if (bFactElec === "true") {
        //Generando Comprobante Factura Electronica
        $.ajax({
            type: "POST",
            url: "page/mantenimiento/comprobante.aspx/ObtenerComprobanteWM",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ idComprobante: idComprobante }),
            async: true,
            beforeSend: function () {
                $("#errorComprobante").html('');
                $("#pnl_comprobante button").attr("disabled", true);
            },
            success: function (data) {
                $("#pnl_comprobante button").removeAttr("disabled");

                if (data.d.error) {
                    $("#errorComprobante").html(GenerarAlertaError(data.d.error));
                    return;
                }

                window.open('COMPROBANTES/' + data.d.Resultado[0].SERIE + '_' + data.d.Resultado[0].NUMERO + ".pdf", '_blank');
            },
            error: function (data) {
                $("#errorComprobante").html(GenerarAlertaError("Inconveniente en la operación"));
                $("#tbl_comprobante button").removeAttr("disabled");
            }
        });
        event.preventDefault();
    } else {
        //Mostrando comprobante generado Normal
        var strImpresora = sessionStorage.getItem('IMPRESION');
        window.open('page/reporte/comprobante.aspx?eComp=' + idComprobante + '&eAten=0&eTipo=' + strImpresora, '_blank');
    }
}
//*************************************************************************************************
//******************************************* RESERVAS ********************************************
//*************************************************************************************************
function nuevaReserva(id, num, tipo, precio) {
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
    $("#btn_limpiar_cliente").hide();
    
    $("#pnl_reserva").modal('show');
    //***************** Configuraciones ***************** 
    var bHora = sessionStorage.getItem('CPH');
    if (bHora === "true") {
        $(".horaConfig").show();
        $("#txt_horafin").val(sessionStorage.getItem('HP'));
    } else {
        $(".horaConfig").hide();
        $("#txt_horafin").val("");
    }
    //***************** HABITACION SELECCIONADA ***************** 
    $("#txh_idhabitacion").val(id);
    $('#pnl_reserva .modal-title').html('<i class="icon-book"></i> Reservar Habitación: ' + num + " - " + tipo);
    $("#txt_precioIni").val(precio);
    $("#txt_precio").val(precio);
    $("#txt_total").val(precio);
    $("#txt_precioIni").prop('disabled', true);

    var fechaIni = getDateFromFormat($('#horaSistema').html(), 'dd/MM/yyyy');
    var fechaFin = new Date();
    fechaFin.setDate(fechaIni.getDate() + 1);

    $('#txt_fechainicio').val($('#horaSistema').html());
    $("#txt_fechainicio").parent().datepicker("update", $("#txt_fechainicio").val());
    $('#txt_fechafin').val(formatDate(fechaFin, "dd/MM/yyyy"));
    $("#txt_fechafin").parent().datepicker("update", $("#txt_fechafin").val());
    contarNoches($("#lblNoches"), $('#txt_total'), $('#txt_fechainicio'), $('#txt_fechafin'), $("#errorReserva"));
    //fc_calcular_total($('#txt_fechainicio'), $('#txt_fechafin'), $('#txt_precio'), $('#txt_total'));
}
function modificarReserva(idReserva, id, num, tipo) {
    $("#H" + id).button('loading');

    $('#pnl_reserva .modal-title').html('<i class="icon-edit"></i> Editar Reserva: ' + num + " - " + tipo);
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
                $("#H" + id).button('reset');
                return;
            }
            $("#H" + id).button('reset');

            $("#txh_idreserva").val(data.d.Resultado.ID_RESERVA);
            $("#txh_idhabitacion").val(data.d.Resultado.ID_HABITACION);
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
            
            contarNoches($("#lblNoches"), $('#txt_total'), $('#txt_fechainicio'), $('#txt_fechafin'), $("#errorReserva"));

            $("#pnl_reserva").modal('show');
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#H" + id).button('reset');
        }
    });
}
function anularReserva(idReserva) {
    $("#txh_idreserva").val(idReserva);
    $("#txh_idConfirm").val("ANULAR");
    window.parent.fc_mostrar_confirmacion("Seguro que desea <strong>Anular</strong> la reserva?");
}
function atenderReserva(idReserva) {
    $("#txh_idreserva").val(idReserva);
    $("#txh_idConfirm").val("ATENDER");
    window.parent.fc_mostrar_confirmacion("Seguro que desea atender la reserva?");
}
function fc_anular_reserva() {
    $("#errorReserva").html('');

    if ($("#txh_idreserva").val() === "" || $("#txh_idreserva").val() === "0") {
        $("#modalConfirm").modal('hide');
        $("#errorDiv").html(GenerarAlertaWarning("Reserva: no se ha seleccionado ninguna habitación"));
        return;
    }

    $("#pleaseWaitDialog").modal();

    $.ajax({
        type: "POST",
        url: "page/operacion/reserva.aspx/AnularReservaWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ idReserva: $("#txh_idreserva").val() }),
        async: true,
        success: function (data) {

            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                $("#pleaseWaitDialog").modal('hide');
                return;
            }

            $("#errorDiv").html(GenerarAlertaSuccess(data.d.Mensaje));
            $("#txh_idreserva").val("");
            $("#modalConfirm").modal('hide');
            fc_listar_estadoHotel();
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#pleaseWaitDialog").modal('hide');
        }
    });
    event.preventDefault();
}
function fc_atender_reserva() {
    $("#errorReserva").html('');

    if ($("#txh_idreserva").val() === "" || $("#txh_idreserva").val() === "0") {
        $("#modalConfirm").modal('hide');
        $("#errorDiv").html(GenerarAlertaWarning("Reserva: no se ha seleccionado ninguna habitación"));
        return;
    }

    $("#pleaseWaitDialog").modal();

    $.ajax({
        type: "POST",
        url: "page/inicio.aspx/AtenderReservaWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ idReserva: $("#txh_idreserva").val() }),
        async: true,
        success: function (data) {

            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                $("#pleaseWaitDialog").modal('hide');
                return;
            }

            $("#errorDiv").html(GenerarAlertaSuccess(data.d.Mensaje));
            $("#txh_idreserva").val("");
            $("#modalConfirm").modal('hide');
            fc_listar_estadoHotel();
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#pleaseWaitDialog").modal('hide');
        }
    });
    event.preventDefault();
}
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

    if (validIdInput($("#txh_idhabitacion").val())) {
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
    
    if ($("#txt_adelanto").val() === "" || isNaN($("#txt_adelanto").val()))  $("#txt_adelanto").val("0");
    if ($("#txh_idcliente").val() === "") $("#txh_idcliente").val("0");

    var ifecInicio = $("#txt_horainicio").val() === "" ? getDateFromFormat($("#txt_fechainicio").val(), 'dd/MM/yyyy') : getDateFromFormat($("#txt_fechainicio").val() + ' ' + $("#txt_horainicio").val(), 'dd/MM/yyyy HH:mm');
    var ifecFin = $("#txt_horafin").val() === "" ? getDateFromFormat($("#txt_fechafin").val(), 'dd/MM/yyyy') : getDateFromFormat($("#txt_fechafin").val() + ' ' + $("#txt_horafin").val(), 'dd/MM/yyyy HH:mm');

    if (ifecInicio >= ifecFin) {
        $("#errorReserva").html(GenerarAlertaWarning("Fecha: La fecha de fin no puede ser menor a la fecha de inicio"));
        $("#btn_guardar").button('reset');
        $("#txt_horafin").focus();
        return;
    }

    ifecInicio = new Date(ifecInicio.getTime() + currentHelsinkiHoursOffset); 
    ifecFin = new Date(ifecFin.getTime() + currentHelsinkiHoursOffset ); 
      
    var eReserva = {
        ID_RESERVA: $("#txh_idreserva").val() === "" ? 0 : $("#txh_idreserva").val(),
        ID_CLIENTE: $("#txh_idcliente").val(),
        NOM_CLIENTE: $("#txt_nomcliente").val(),
        APE_CLIENTE: $("#txt_apecliente").val(),
        NUM_CLIENTE: $("#txt_nrocliente").val(),
        ID_HABITACION: $("#txh_idhabitacion").val(),
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
            fc_listar_estadoHotel();
        },
        error: function (data) {
            $("#errorReserva").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#btn_guardar").button('reset');
        }
    });

    event.preventDefault();
});
//*************************************************************************************************
//******************************************* ATENCION ********************************************
//*************************************************************************************************
function limpiarAtencion() {
    $("#errorDiv").html('');
    $("#errorAtencion_a").html('');
    $("#txh_idatencion_a").val('')
    $("#txh_idreserva_a").val('0');
    $("#txh_idcliente_a").val('0');
    $("#txt_nrocliente_a").val('');
    $("#txt_nomcliente_a").val('');
    $("#txt_apecliente_a").val('');
    $("#txt_precio_a").val('');
    $("#txt_adelanto_a").val('');
    $("#txt_observacion_a").val('');

    $("#txt_nrocliente_a").prop('disabled', false);
    $("#txt_nomcliente_a").prop('disabled', false);
    $("#txt_apecliente_a").prop('disabled', false);
    $("#txt_precio_a").prop('disabled', false);
    $("#txt_total_a").prop('disabled', false);
    $("#txt_adelanto_a").prop('disabled', false);
    $("#txt_precioIni_a").prop('disabled', true);
    $("#sel_mediopago_a").prop('disabled', false);
    //$("#btn_buscar_cliente_a").prop('disabled', true);
    
    $("#btn_buscar_cliente_a").show();
    $("#btn_limpiar_cliente_a").hide();
    $("#pnl_reserva_info").hide();
    $("#pnl_movimientos_a").hide();
    
    $("#pnl_atencion_a").modal('show');
    //***************** Configuraciones ***************** 
    var bHora = sessionStorage.getItem('CPH');
    if (bHora === "true") {
        $(".horaConfig").show();
        $("#txt_horafin_a").val(sessionStorage.getItem('HP'));
    } else {
        $(".horaConfig").hide();
        $("#txt_horafin_a").val("");
    }
    //***************** HABITACION SELECCIONADA ***************** 
    $("#sel_mediopago_a").val('1');
    $("#txt_precioIni_a").val('');
    $("#txt_precio_a").val('');
    $("#txt_total_a").val('');
    $("#txt_adelanto_a").val('');

    var fechaIni = getDateFromFormat($('#horaSistema').html(), 'dd/MM/yyyy');
    var fechaFin = new Date();
    fechaFin.setDate(fechaIni.getDate() + 1);

    $('#txt_fechafin_a').val(formatDate(fechaFin, "dd/MM/yyyy"));
    $("#txt_fechafin_a").parent().datepicker("update", $("#txt_fechafin_a").val());
    
    contarNoches($("#lblNoches_a"), $('#txt_total_a'), $('#horaSistema'), $('#txt_fechafin_a'), $("#errorAtencion_a"));
}
function nuevaAtencion(id, num, tipo, precio) {
    limpiarAtencion();
    //***************** HABITACION SELECCIONADA ***************** 
    $("#sel_habitaciones_a").val(id);
    $("#btn_buscar_cliente_a").prop('disabled', false);
    $("#pnl_atencion_a .modal-title").html('<i class="icon-suitcase"></i> Alquilar Habitación: ' + num + " - " + tipo);
    $("#txt_precioIni_a").val(precio);
    $("#txt_precio_a").val(precio);
    $("#txt_total_a").val(precio);
    $("#txt_adelanto_a").val(precio);
    $("#txt_nrocliente_a").focus();
};
function modificarAtencion(idAtencion, id, num, tipo, precio) {
    $("#H" + id).button('loading');

    //Obtener informacion de la atencion
    $.ajax({
        type: "POST",
        url: "page//operacion/atencion.aspx/ObtenerAtencionWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ idAtencion: idAtencion }),
        async: true,
        beforeSend: function () {
            $("#errorAtencion_a").html('');
        },
        success: function (data) {
            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                $("#H" + id).button('reset');
                return;
            }

            if (data.d.Resultado.TIPO_ATENCION === '001') {//NORMAL
                limpiarAtencion();

                var fec_fin_a = new Date(parseDateServer(data.d.Resultado.FEC_FIN).getTime() - currentHelsinkiHoursOffset);
                
                //phabitaciones += '</ul>';
                //$(".listaHabitaciones").html(phabitaciones);
                //$('#sel_mediopago_a').append("<option value='" + data.d.Resultado.listaMedioPago[i].ID_MEDIO_PAGO + "'>" + data.d.Resultado.listaMedioPago[i].DESCRIPCION + "</option>");

                $('#pnl_atencion_a .modal-title').html('<i class="icon-edit"></i> Editar Atención: ' + num + " " + tipo);
                $("#txt_fechafin_a").val(formatDate(fec_fin_a, "dd/MM/yyyy"));
                $("#txt_fechafin_a").parent().datepicker("update", $("#txt_fechafin_a").val());
                $("#txt_horafin_a").val(formatDate(fec_fin_a, "HH:mm"));
                $("#txt_precioIni_a").val(precio);
                $("#txt_nrocliente_a").val(data.d.Resultado.NUM_CLIENTE);
                $("#txt_nomcliente_a").val(data.d.Resultado.NOM_CLIENTE);
                $("#txt_apecliente_a").val(data.d.Resultado.APE_CLIENTE);
                $("#txt_precio_a").val(data.d.Resultado.PRECIO_HAB);
                $("#txt_total_a").val(data.d.Resultado.TOTAL_HAB);
                $("#txt_adelanto_a").val(data.d.Resultado.ADELANTO);
                $("#sel_mediopago_a").val(data.d.Resultado.ID_MEDIO_PAGO);
                $("#txt_observacion_a").val(data.d.Resultado.OBSERVACION);

                $("#txh_idreserva").val(data.d.Resultado.ID_RESERVA);
                $("#txh_idatencion_a").val(data.d.Resultado.ID_ATENCION);
                $("#sel_habitaciones_a").val(data.d.Resultado.ID_HABITACION);
                $("#txh_idcliente_a").val(data.d.Resultado.ID_CLIENTE);

                $('#pnl_movimientos_a').show();

                $("#txt_precioIni_a").prop('disabled', true);
                $("#txt_nrocliente_a").prop('disabled', true);
                $("#txt_nomcliente_a").prop('disabled', true);
                $("#txt_apecliente_a").prop('disabled', true);
                $("#txt_adelanto_a").prop('disabled', true);
                $("#txt_precio_a").prop('disabled', true);
                //$("#txt_total_a").prop('disabled', true);

                contarNochesA($("#lblNoches_a"), $('#txt_total_a'), formatDate(parseDateServer(data.d.Resultado.FEC_INI), "dd/MM/yyyy"), $('#txt_fechafin_a'), $("#errorAtencion_a"));
                
                $("#btn_buscar_cliente_a").hide();
                $("#btn_limpiar_cliente_a").show();
                
                $("#sel_mediopago_a").prop('disabled', true);

                //****************** CONSUMOS **********************
                var lconsumos = data.d.Resultado.CONSUMOS.split('|');

                var tbodyConsumo = '';
                for (var i = 0; i < lconsumos.length; i++) {
                    tbodyConsumo += '<tr>';
                    var ldescripConsumo = lconsumos[i].split(',');
                    for (var j = 0; j < ldescripConsumo.length; j++) {
                        tbodyConsumo += '<td>' + ldescripConsumo[j] + '</td>';
                    }
                    tbodyConsumo += '</tr>';
                }

                $("#bodyConsumo_a").html(tbodyConsumo);

                //****************** TOTALES **********************
                var ltotales = data.d.Resultado.TOTALES.split(',');
                if (ltotales.length > 0) {
                    $("#tdGastos_a").html(ltotales[0]);
                    $("#tdAdelanto_a").html(ltotales[1]);
                    $("#tdDeuda_a").html(ltotales[2]);
                }

                $("#H" + id).button('reset');
                $("#pnl_atencion_a").modal('show');
            } else if (data.d.Resultado.TIPO_ATENCION === '002') {//POR HORAS
                limpiarAtencionHora();

                $('#pnl_atencion_h .modal-title').html('<i class="icon-edit"></i> Editar Atención por hora: ' + num + " - " + tipo);
               
                $("#txt_precioIni_h").val(precio);
                $("#sel_hora_h").val(data.d.Resultado.HORA_ALQUILER);
                $("#txt_nrocliente_h").val(data.d.Resultado.NUM_CLIENTE);
                $("#txt_nomcliente_h").val(data.d.Resultado.NOM_CLIENTE);
                $("#txt_apecliente_h").val(data.d.Resultado.APE_CLIENTE);
                $("#txt_total_h").val(data.d.Resultado.TOTAL_HAB);
                $("#txt_adelanto_h").val(data.d.Resultado.ADELANTO);
                $("#sel_mediopago_h").val(data.d.Resultado.ID_MEDIO_PAGO);
                $("#txt_observacion_h").val(data.d.Resultado.OBSERVACION);
                
                $("#txh_idatencion_h").val(data.d.Resultado.ID_ATENCION);
                $("#txh_idhabitacion_h").val(data.d.Resultado.ID_HABITACION);
                $("#txh_idcliente_h").val(data.d.Resultado.ID_CLIENTE);

                $('#pnl_movimientos_h').show();

                $("#txt_precioIni_h").prop('disabled', true);
                $("#txt_nrocliente_h").prop('disabled', true);
                $("#txt_nomcliente_h").prop('disabled', true);
                $("#txt_apecliente_h").prop('disabled', true);
                $("#txt_adelanto_h").prop('disabled', true);

                $("#btn_buscar_cliente_h").hide();
                $("#btn_limpiar_cliente_h").show();

                $("#sel_mediopago_h").prop('disabled', true);

                //****************** CONSUMOS **********************
                var lconsumos = data.d.Resultado.CONSUMOS.split('|');

                var tbodyConsumo = '';
                for (var i = 0; i < lconsumos.length; i++) {
                    tbodyConsumo += '<tr>';
                    var ldescripConsumo = lconsumos[i].split(',');
                    for (var j = 0; j < ldescripConsumo.length; j++) {
                        tbodyConsumo += '<td>' + ldescripConsumo[j] + '</td>';
                    }
                    tbodyConsumo += '</tr>';
                }

                $("#bodyConsumo_h").html(tbodyConsumo);

                //****************** TOTALES **********************
                var ltotales = data.d.Resultado.TOTALES.split(',');
                if (ltotales.length > 0) {
                    $("#tdGastos_h").html(ltotales[0]);
                    $("#tdAdelanto_h").html(ltotales[1]);
                    $("#tdDeuda_h").html(ltotales[2]);
                }

                $("#H" + id).button('reset');
                $("#pnl_atencion_h").modal('show');
            }
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#H" + id).button('reset');
        }
    });
}
function anularAtencion(idAtencion) {
    $("#txh_idatencion").val(idAtencion);
    $("#txh_idConfirm").val("ANULAR_A");
    window.parent.fc_mostrar_confirmacion("Seguro que desea <strong>Anular</strong> el alquiler?");
}
function liberarHabitacion(idAtencion, pOpcion) {
    $("#txh_idatencion").val(idAtencion);
    $("#txh_fact_ant").val(pOpcion);
    $("#comprobanteDialog").modal();
}
function finalizarAtencion(idAtencion, pOpcion) {
    $("#txh_idatencion").val(idAtencion);
    $("#txh_fact_ant").val(pOpcion);
    $("#txh_idConfirm").val("LIBERAR");
    window.parent.fc_mostrar_confirmacion("Seguro que desea <strong>Finalizar</strong> la atención?.</strong>");
}
function fc_anular_atencion() {
    $("#pleaseWaitDialog").modal();
    $("#errorReserva").html('');

    if (validIdInput($("#txh_idatencion").val())) {
        $("#modalConfirm").modal('hide');
        $("#errorDiv").html(GenerarAlertaWarning("Alquiler: no se ha seleccionado ninguna habitación"));
        return;
    }

    $.ajax({
        type: "POST",
        url: "page/operacion/atencion.aspx/AnularAtencionWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ idAtencion: $("#txh_idatencion").val() }),
        async: true,
        success: function (data) {

            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                $("#txh_idatencion").val("");
                $("#modalConfirm").modal('hide');
                $("#pleaseWaitDialog").modal('hide');
                $("#pleaseWaitDialog").modal('hide');
                return;
            }
            $("#errorDiv").html(GenerarAlertaSuccess("Se Anuló la atención satisfactoriamente"));
            $("#txh_idatencion").val("");
            $("#modalConfirm").modal('hide');
            fc_listar_estadoHotel();
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#pleaseWaitDialog").modal('hide');
        }
    });
    event.preventDefault();
}
function fc_liberar_habitacion(tipoComprobante) {
    $("#comprobanteDialog").modal('hide');
    $("#pleaseWaitDialog").modal('show');

    $("#errorReserva").html('');

    if ($("#txh_idatencion").val() === "" || $("#txh_idatencion").val() === "0") {
        $("#modalConfirm").modal('hide');
        $("#errorDiv").html(GenerarAlertaWarning("Atención: no se ha seleccionado ninguna habitación"));
        return;
    }

    var idAtencion = $("#txh_idatencion").val();
    var pOpcion = $("#txh_fact_ant").val();

    $.ajax({
        type: "POST",
        url: "page/operacion/atencion.aspx/TerminarAtencionWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ idAtencion: idAtencion, tipoComprobante: tipoComprobante, opcion: pOpcion }),
        async: true,
        success: function (data) {
            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                $("#txh_idatencion").val("");
                $("#modalConfirm").modal('hide');
                $("#pleaseWaitDialog").modal('hide');
                return;
            }

            $("#errorDiv").html(GenerarAlertaSuccess(data.d.Mensaje));
            $("#txh_idatencion").val("");
            $("#txh_idreserva").val("");
            
            var bFactElec = sessionStorage.getItem('FACELEC');
            if (bFactElec === "true") {
                //Generando Comprobante Factura Electronica
                $.ajax({
                    type: "POST",
                    url: "page/mantenimiento/comprobante.aspx/generarFacturacionElectronicaWS",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ idComprobante: data.d.Resultado }),
                    async: true,
                    success: function (dataC) {
                        //Control de Errores
                        if (dataC.d.TipoMensaje === "OK") {
                            $("#errorDiv").html(GenerarAlertaSuccess("Generado correctamente"));
                            window.open('COMPROBANTES/' + dataC.d.Resultado, '_blank');
                        } else {
                            $("#errorDiv").html(GenerarAlertaError("Error: " + dataC.d.Resultado));
                        }
                        
                        $("#pnl_movimiento").modal('hide');
                        $("#btn_guardar").button('reset');
                        $("#btn_buscar").click();

                        fc_listar_estadoHotel();
                    },
                    error: function (data) {
                        $("#errorMovimiento").html(GenerarAlertaError("Inconveniente al generar el comprobante"));
                        $("#btn_guardar").button('reset');
                    }
                });
            } else {
                //Mostrando comprobante generado Normal
                var strImpresora = sessionStorage.getItem('IMPRESION');
                window.open('page/reporte/comprobante.aspx?eComp=' + data.d.Resultado + '&eAten=0&eTipo=' + strImpresora, '_blank');
                fc_listar_estadoHotel();
            }  
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#pleaseWaitDialog").modal('hide');
        }
    });
    event.preventDefault();
}
function fc_finalizar_atencion() {
    $("#modalConfirm").modal('hide');
    $("#pleaseWaitDialog").modal();

    $("#errorReserva").html('');

    if ($("#txh_idatencion").val() === "" || $("#txh_idatencion").val() === "0") {
        $("#modalConfirm").modal('hide');
        $("#errorDiv").html(GenerarAlertaWarning("Atención: no se ha seleccionado ninguna habitación"));
        return;
    }

    var idAtencion = $("#txh_idatencion").val();
    var pOpcion = $("#txh_fact_ant").val();

    $.ajax({
        type: "POST",
        url: "page/operacion/atencion.aspx/TerminarAtencionWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ idAtencion: idAtencion, tipoComprobante: "001", opcion: pOpcion }),
        async: true,
        success: function (data) {
            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                $("#txh_idatencion").val("");
                $("#modalConfirm").modal('hide');
                $("#pleaseWaitDialog").modal('hide');
                return;
            }

            $("#errorDiv").html(GenerarAlertaSuccess(data.d.Mensaje));
            $("#txh_idatencion").val("");
            $("#txh_idreserva").val("");

            $("#pnl_movimiento").modal('hide');
            
            fc_listar_estadoHotel();
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#pleaseWaitDialog").modal('hide');
        }
    });
    event.preventDefault();
}

$("#btn_limpiar_cliente_a").click(function () {
    $("#btn_limpiar_cliente_a").button('loading');

    $("#txt_nrocliente_a").val('');
    $("#txt_nomcliente_a").val('');
    $("#txt_apecliente_a").val('');
    $("#txh_idcliente_a").val('0');

    $("#txt_nrocliente_a").prop('disabled', false);
    $("#txt_nomcliente_a").prop('disabled', false);
    $("#txt_apecliente_a").prop('disabled', false);

    $("#btn_buscar_cliente_a").show();
    $("#btn_limpiar_cliente_a").hide();

    $("#btn_limpiar_cliente_a").button('reset');

    $("#txt_nrocliente_a").focus();
});
$("#btn_buscar_cliente_a").click(function () {
    $("#btn_buscar_cliente_a").button('loading');
    $.ajax({
        type: "POST",
        url: "page/operacion/reserva.aspx/BuscarClienteWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            numero: $("#txt_nrocliente_a").val(), nombre: ''
        }),
        async: true,
        success: function (data) {
            if (!data.d.Activo) {
                $("#errorAtencion_a").html(GenerarAlertaError(data.d.Mensaje));
                $("#btn_buscar_cliente_a").button('reset');
                return;
            }

            if (data.d.Resultado.length > 0) {
                var html = '';
                for (var i = 0; i < data.d.Resultado.length; i++) {
                    $("#txt_nrocliente_a").val(data.d.Resultado[i].NUM_DOCUMENTO);
                    $("#txt_nomcliente_a").val(data.d.Resultado[i].NOMBRES);
                    $("#txt_apecliente_a").val(data.d.Resultado[i].APELLIDOS);
                    $("#txh_idcliente_a").val(data.d.Resultado[i].ID_CLIENTE);

                    $("#txt_nrocliente_a").prop('disabled', true);
                    $("#txt_nomcliente_a").prop('disabled', true);
                    $("#txt_apecliente_a").prop('disabled', true);

                    $("#btn_buscar_cliente_a").hide();
                    $('#btn_limpiar_cliente_a').show();
                }
                $("#btn_buscar_cliente_a").button('reset');
            } else {
                $("#btn_buscar_cliente_a").button('reset');
                $("#txh_idcliente_a").val('');
                $("#txt_nomcliente_a").val('');
                $("#txt_apecliente_a").val('');
                $("#errorAtencion_a").html(GenerarAlertaError('No se encontró el documento ingresado. Debe ingresar el Nombre'));
                $("#txt_nomcliente_a").focus();
            }
        },
        error: function (data) {
            $("#errorAtencion_a").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#btn_buscar_cliente_a").button('reset');
        }
    });
});
$("#txt_precio_a").keyup(function () {
    fc_calcular_total($('#horaSistema'), $('#txt_fechafin_a'), $('#txt_precio_a'), $('#txt_total_a'));
    $("#txt_adelanto_a").val($("#txt_total_a").val());
});
$("#btn_guardar_a").click(function () {
    $("#btn_guardar_a").button('loading');
    $("#errorAtencion_a").html('');

    if (validIdInput($("#sel_habitaciones_a").val())) {
        $("#errorAtencion_a").html(GenerarAlertaWarning("Habitacion: vuelva a seleccionar la habitación"));
        $("#btn_guardar_a").button('reset');
        return;
    } else if (validIdInput($("#txt_fechafin_a").val())) {
        $("#errorAtencion_a").html(GenerarAlertaWarning("Fecha Fin: ingresar una fecha válida"));
        $("#btn_guardar_a").button('reset');
        $("#txt_fechafin_a").focus();
        return;
    } else if (validate_hour($("#txt_horafin_a").val())) {
        $("#errorAtencion_a").html(GenerarAlertaWarning("Hora fin: ingrese una hora válida 23:59 máximo"));
        $("#btn_guardar_a").button('reset');
        $("#txt_horafin_a").focus();
        return;
    } else if (validIdInput($("#txh_idcliente_a").val())) {
        if ($("#txt_nrocliente_a").val() === "" || $("#txt_nomcliente_a").val() === "") {
            $("#errorAtencion_a").html(GenerarAlertaWarning("Cliente: Ingrese documento y nombre del cliente"));
            $("#txt_nrocliente_a").focus();
            $("#btn_guardar_a").button('reset');
            return;
        } 
    } else if (validIdInput($("#txt_precio_a").val())) {
        $("#errorAtencion_a").html(GenerarAlertaWarning("Precio: ingresar monto válido"));
        $("#btn_guardar_a").button('reset');
        $("#txt_precio").focus();
        return;
    } else if (validIdInput($("#txt_total_a").val())) {
        $("#errorAtencion_a").html(GenerarAlertaWarning("Total: ingresar un total válido"));
        $("#btn_guardar_a").button('reset');
        $("#txt_total_a").focus();
        return;
    //} else if (validIdInput($("#sel_mediopago_a").val())) {
    //    $("#errorAtencion_a").html(GenerarAlertaWarning("Medio Pago: seleccione una opción"));
    //    $("#sel_mediopago_a").focus();
    //    $("#btn_guardar_a").button('reset');
    //    return;
    }

    if ($("#txt_adelanto_a").val() === "" || isNaN($("#txt_adelanto_a").val()))  $("#txt_adelanto_a").val("0");
    if ($("#txh_idcliente_a").val() === "") $("#txh_idcliente_a").val("0");

    var ifecFin = $("#txt_horafin_a").val() === "" ? getDateFromFormat($("#txt_fechafin_a").val(), 'dd/MM/yyyy') : getDateFromFormat($("#txt_fechafin_a").val() + ' ' + $("#txt_horafin_a").val(), 'dd/MM/yyyy HH:mm');
  
    ifecFin = new Date(ifecFin.getTime() + currentHelsinkiHoursOffset);

    var eAtencion = {
        ID_ATENCION: $("#txh_idatencion_a").val() === "" ? 0 : $("#txh_idatencion_a").val(),
        ID_CLIENTE: $("#txh_idcliente_a").val(),
        HORA_ALQUILER: $("#sel_hora_a").val(),
        TIPO_ATENCION: "001",
        FEC_FIN: ifecFin,
        NOM_CLIENTE: $("#txt_nomcliente_a").val(),
        APE_CLIENTE: $("#txt_apecliente_a").val(),
        NUM_CLIENTE: $("#txt_nrocliente_a").val(),
        ID_HABITACION: $("#sel_habitaciones_a").val(),
        ADELANTO: $("#txt_adelanto_a").val() === "" ? 0 : $("#txt_adelanto_a").val(),
        PRECIO_HAB: $("#txt_precio_a").val() === "" ? 0 : $("#txt_precio_a").val(),
        TOTAL_HAB: $("#txt_total_a").val() === "" ? 0 : $("#txt_total_a").val(),
        ID_MEDIO_PAGO: $("#sel_mediopago_a").val(),
        OBSERVACION: $("#txt_observacion_a").val(),
        OPCION: $("#txh_idatencion_a").val() === "" ? "3" : "4"
    };
    
    $.ajax({
        type: "POST",
        url: "page/operacion/atencion.aspx/GuardarAtencionWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ eAtencion: eAtencion }),
        async: true,
        success: function (data) {

            if (!data.d.Activo) {
                $("#errorAtencion_a").html(GenerarAlertaError(data.d.Mensaje));
                $("#btn_guardar_a").button('reset');
                return;
            }

            $("#errorDiv").html(GenerarAlertaSuccess(data.d.Mensaje));
            $("#pnl_atencion_a").modal('hide');
            $("#btn_guardar_a").button('reset');
            fc_listar_estadoHotel();
        },
        error: function (data) {
            $("#errorAtencion_a").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#btn_guardar_a").button('reset');
        }
    });

    event.preventDefault();
});
//*************************************************************************************************
//******************************************* ATENCION POR HORA ***********************************
//*************************************************************************************************
function limpiarAtencionHora() {
    $("#errorDiv").html('');
    $("#errorAtencion_h").html('');
    $("#txh_idatencion_h").val('');
    $("#txh_idreserva_h").val('0');
    $("#txh_idcliente_h").val('0');
    $("#txt_nrocliente_h").val('');
    $("#txt_nomcliente_h").val('');
    $("#txt_apecliente_h").val('');
    $("#txt_total_h").val('');
    $("#txt_adelanto_h").val('');
    $("#txt_observacion_h").val('');

    $("#txt_nrocliente_h").prop('disabled', false);
    $("#txt_nomcliente_h").prop('disabled', false);
    $("#txt_apecliente_h").prop('disabled', false);
    $("#txt_adelanto_h").prop('disabled', false);
    $("#txt_precioIni_h").prop('disabled', true);
    $("#sel_mediopago_h").prop('disabled', false);

    $("#btn_buscar_cliente_h").show();
    $("#btn_limpiar_cliente_h").hide();
    $("#pnl_movimientos_h").hide();
    //***************** Configuraciones ***************** 
    var bHora = sessionStorage.getItem('CPH');
    if (bHora === "true") {
        $(".horaConfig").show();
        $("#txt_horafin_h").val(sessionStorage.getItem('HP'));
    } else {
        $(".horaConfig").hide();
        $("#txt_horafin_h").val("");
    }
}
function nuevaAtencionHora(id, num, tipo, precio) {
    limpiarAtencionHora();
    //***************** HABITACION SELECCIONADA ***************** 
    $("#sel_mediopago_h").val('1');
    $("#sel_hora_h").val('0');
    $("#txh_idhabitacion_h").val(id);
    $('#pnl_atencion_h .modal-title').html('<i class="icon-time"></i> Alquilar Habitación por hora: ' + num + " - " + tipo);
    $("#txt_precioIni_h").val(precio);
    $("#txt_total_h").val(precio);
    $("#txt_adelanto_h").val(precio);
    $("#sel_hora_h").focus();
    $("#pnl_atencion_h").modal('show');
};

$("#btn_limpiar_cliente_h").click(function () {
    $("#btn_limpiar_cliente_h").button('loading');

    $("#txt_nrocliente_h").val('');
    $("#txt_nomcliente_h").val('');
    $("#txt_apecliente_h").val('');
    $("#txh_idcliente_h").val('0');

    $("#txt_nrocliente_h").prop('disabled', false);
    $("#txt_nomcliente_h").prop('disabled', false);
    $("#txt_apecliente_h").prop('disabled', false);

    $("#btn_buscar_cliente_h").show();
    $("#btn_limpiar_cliente_h").hide();

    $("#btn_limpiar_cliente_h").button('reset');

    $("#txt_nrocliente_h").focus();
});
$("#btn_buscar_cliente_h").click(function () {
    $("#btn_buscar_cliente_h").button('loading');
    $.ajax({
        type: "POST",
        url: "page/operacion/reserva.aspx/BuscarClienteWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            numero: $("#txt_nrocliente_h").val(), nombre: ''
        }),
        async: true,
        success: function (data) {
            if (!data.d.Activo) {
                $("#errorAtencion_h").html(GenerarAlertaError(data.d.Mensaje));
                $("#btn_buscar_cliente_h").button('reset');
                return;
            }

            if (data.d.Resultado.length > 0) {
                var html = '';
                for (var i = 0; i < data.d.Resultado.length; i++) {
                    $("#txt_nrocliente_h").val(data.d.Resultado[i].NUM_DOCUMENTO);
                    $("#txt_nomcliente_h").val(data.d.Resultado[i].NOMBRES);
                    $("#txt_apecliente_h").val(data.d.Resultado[i].APELLIDOS);
                    $("#txh_idcliente_h").val(data.d.Resultado[i].ID_CLIENTE);

                    $("#txt_nrocliente_h").prop('disabled', true);
                    $("#txt_nomcliente_h").prop('disabled', true);
                    $("#txt_apecliente_h").prop('disabled', true);

                    $("#btn_buscar_cliente_h").hide();
                    $('#btn_limpiar_cliente_h').show();
                }
                $("#btn_buscar_cliente_h").button('reset');
            } else {
                $("#btn_buscar_cliente_h").button('reset');
                $("#txh_idcliente_h").val('');
                $("#txt_nomcliente_h").val('');
                $("#txt_apecliente_h").val('');
                $("#errorAtencion_h").html(GenerarAlertaError('No se encontró el documento ingresado. Debe ingresar el Nombre'));
                $("#txt_nomcliente_h").focus();
            }
        },
        error: function (data) {
            $("#errorAtencion_h").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#btn_buscar_cliente_h").button('reset');
        }
    });
});
$("#sel_hora_h").on('change', function () {
    $("#txt_precioIni_h").val(this.value);
    $("#txt_total_h").val(this.value);
    $("#txt_adelanto_h").val(this.value);
});
$("#txt_total_h").keyup(function () {
    $("#txt_adelanto_h").val($("#txt_total_h").val());
});
$("#btn_guardar_h").click(function () {
    $("#btn_guardar_h").button('loading');
    $("#errorAtencion_h").html('');

    if (validIdInput($("#txh_idhabitacion_h").val())) {
        $("#errorAtencion_h").html(GenerarAlertaWarning("Habitacion: vuelva a seleccionar la habitación"));
        $("#btn_guardar_h").button('reset');
        return;
    } else if (validIdInput($("#sel_hora_h").val())) {
        $("#errorAtencion_h").html(GenerarAlertaWarning("Horas de alquiler: Seleccione una hora válida"));
        $("#btn_guardar_h").button('reset');
        $("#sel_hora_h").focus();
        return;
    } else if (validIdInput($("#txh_idcliente_h").val())) {
        if ($("#txt_nrocliente_h").val() === "" || $("#txt_nomcliente_h").val() === "") {
            $("#errorAtencion_h").html(GenerarAlertaWarning("Cliente: Ingrese documento y nombre del cliente"));
            $("#txt_nrocliente_h").focus();
            $("#btn_guardar_h").button('reset');
            return;
        } 
    } else if (validIdInput($("#txt_total_h").val())) {
        $("#errorAtencion_h").html(GenerarAlertaWarning("Precio: ingresar monto valido"));
        $("#btn_guardar_h").button('reset');
        $("#txt_precio").focus();
        return;
    }
    //else if (validIdInput($("#sel_mediopago_h").val())) {
    //    $("#errorAtencion_h").html(GenerarAlertaWarning("Medio Pago: seleccione una opción"));
    //    $("#sel_mediopago_h").focus();
    //    $("#btn_guardar_h").button('reset');
    //    return;
    //}

    if ($("#txh_idcliente_h").val() === "") $("#txh_idcliente_h").val("0");

    var eAtencion = {
        ID_ATENCION: $("#txh_idatencion_h").val() === "" ? 0 : $("#txh_idatencion_h").val(),
        ID_CLIENTE: $("#txh_idcliente_h").val(),
        HORA_ALQUILER: $("#sel_hora_h").val(),
        TIPO_ATENCION: "002",
        NOM_CLIENTE: $("#txt_nomcliente_h").val(),
        APE_CLIENTE: $("#txt_apecliente_h").val(),
        NUM_CLIENTE: $("#txt_nrocliente_h").val(),
        ID_HABITACION: $("#txh_idhabitacion_h").val(),
        ADELANTO: ($("#txt_adelanto_h").val() === "" ? 0 : $("#txt_adelanto_h").val()),
        PRECIO_HAB: ($("#txt_total_h").val() === "" ? 0 : $("#txt_total_h").val()),
        ID_MEDIO_PAGO: $("#sel_mediopago_h").val(),
        OBSERVACION: $("#txt_observacion_h").val(),
        OPCION: $("#txh_idatencion_h").val() === "" ? "7" : "8"
    };
    
    $.ajax({
        type: "POST",
        url: "page/operacion/atencion.aspx/GuardarAtencionWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ eAtencion: eAtencion }),
        async: true,
        success: function (data) {

            if (!data.d.Activo) {
                $("#errorAtencion_h").html(GenerarAlertaError(data.d.Mensaje));
                $("#btn_guardar_h").button('reset');
                return;
            }

            $("#errorDiv").html(GenerarAlertaSuccess(data.d.Mensaje));
            $("#pnl_atencion_h").modal('hide');
            $("#btn_guardar_h").button('reset');
            fc_listar_estadoHotel();
        },
        error: function (data) {
            $("#errorAtencion_h").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#btn_guardar_h").button('reset');
        }
    });

    event.preventDefault();
});
//*************************************************************************************************
//******************************************* MOVIMIENTO ******************************************
//*************************************************************************************************
function limpiarMovimiento() {
    $("#errorDiv").html('');
    //$("#errorMovimiento").html('');

    $('#chkPago').prop('checked', false);
    $("#divClientePago").hide();
    $("#sel_movimiento").val('5').change();
    $("#txt_monto").val('');
    $("#txt_observacion_mov").val('');
}
function movimiento_changed() {
    $("#txt_monto").focus();

    var pTipoMov = $("#sel_movimiento").find(':selected').attr('tipoMov');

    if (pTipoMov === "2") {
        $("#divClientePago").show();
    }
    else {
        $("#divClientePago").hide();
        $('#chkPago').prop('checked', false);
    }
}
function nuevoMovimiento(idAtencion, num, tipo) {
    $("#txh_idatencion").val(idAtencion);
    fc_listar_movimiento(idAtencion);
    limpiarMovimiento();
    
    $("#pnl_movimiento .modal-title").html("<i class='icon-money'></i> Pagos y consumos Habitación " + num);
    $("#pnl_movimiento").modal("show");
};
function fc_listar_movimiento(idAtencion) {
    $("#pleaseWaitDialog").modal("hide");
    
    $.ajax({
        type: "POST",
        url: "page/inicio.aspx/ListaMovimientosClienteWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            idAtencion: idAtencion
        }),
        async: true,
        beforeSend: function () {
            $("#btn_buscar_mov").attr("disabled", true);
            $("#tbl_movimiento tbody").empty();
        },
        success: function (data) {
            $("#btn_buscar_mov").removeAttr("disabled");

            if (data.d.error) {
                $("#errorMovimiento").html(GenerarAlertaError(data.d.error));
                $("#pleaseWaitDialog").modal('hide');
                return;
            }

            var htmlBotones = '<button name="editar" class="btn btn-primary btn-xs"><i class="icon-pencil"></i></button> ' +
                '<button name="anular" class="btn btn-danger btn-xs"><i class="icon-trash "></i></button> ';

            var html = '';

            if (data.d.Resultado === null) return;

            //Deuda de la habitación
            if (data.d.Resultado[0].DEUDA > 0) {
                $("#movDeuda").html('DEUDA: ' + data.d.Resultado[0].DEUDA);
                $("#divMovDeuda").show();
            } else {
                $("#movDeuda").html('');
                $("#divMovDeuda").hide();
            }

            for (var i = 0; i < data.d.Resultado.length; i++) {
                html += '<tr><td style="display:none">' + data.d.Resultado[i].ID_MOVIMIENTO + '</td>';
                html += '<td>' + htmlBotones + '</td>';
                html += '<td>' + data.d.Resultado[i].DESCRIPCION + '</td>';
                html += '<td>' + data.d.Resultado[i].MONTO + '</td>';
                html += '<td>' + formatDate(parseDateServer(data.d.Resultado[i].FECHA_INI), "dd/MM/yyyy") + '</td>';
                html += '<td>' + data.d.Resultado[i].OBSERVACION + '</td></tr>';
            }

            $("#tbl_movimiento tbody").append(html);

            $("#tbl_movimiento button").click(function () {
                if ($(this).attr("name") === "editar") {
                    $('#pnl_movimiento .modal-title').html('Editar Movimiento');

                    $.ajax({
                        type: "POST",
                        url: "page/operacion/movimiento.aspx/ObtenerMovimientoWM",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data: JSON.stringify({ idMovimiento: $(this).parent().parent().find("td").eq(0).html() }),
                        async: true,
                        beforeSend: function () {
                            $("#errorMovimiento").html('');
                            $("#tbl_movimiento button").attr("disabled", true);
                        },
                        success: function (data) {
                            $("#tbl_movimiento button").removeAttr("disabled");

                            if (data.d.error) {
                                $("#errorMovimiento").html(GenerarAlertaError(data.d.error));
                                return;
                            }

                            $("#txh_idmovimiento").val(data.d.Resultado[0].ID_MOVIMIENTO);
                            $("#sel_movimiento").val(data.d.Resultado[0].ID_TIPO_MOVIMIENTO);
                            $("#txt_fecha").val(formatDate(parseDateServer(data.d.Resultado[0].FECHA_INI), "dd/MM/yyyy"));
                            $("#txt_monto").val(data.d.Resultado[0].MONTO);
                            $("#txt_observacion_mov").val(data.d.Resultado[0].OBSERVACION);

                            $("#pnl_movimiento").modal('show');
                        },
                        error: function (data) {
                            $("#errorMovimiento").html(GenerarAlertaError("Inconveniente en la operación"));
                            $("#tbl_movimiento button").removeAttr("disabled");
                        }
                    });
                    event.preventDefault();
                } else if ($(this).attr("name") === "anular") {
                    if (confirm("¿Esta seguro de anular movimiento?")) {
                        $.ajax({
                            type: "POST",
                            url: "page/operacion/movimiento.aspx/AnularMovimientoWM",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            data: JSON.stringify({ idMovimiento: $(this).parent().parent().find("td").eq(0).html() }),
                            async: true,
                            beforeSend: function () {
                                $("#tbl_movimiento button").attr("disabled", true);
                            },
                            success: function (data) {
                                $("#tbl_movimiento button").removeAttr("disabled");

                                if (!data.d.Activo) {
                                    $("#errorMovimiento").html(GenerarAlertaError(data.d.Mensaje));
                                    return;
                                }

                                $("#errorMovimiento").html(GenerarAlertaSuccess(data.d.Mensaje));
                                fc_listar_movimiento($("#txh_idatencion").val());
                            },
                            error: function (data) {
                                $("#errorMovimiento").html(GenerarAlertaError("Inconveniente en la operación"));
                                $("#tbl_movimiento button").removeAttr("disabled");
                            }
                        });
                        event.preventDefault();
                    }
                }
            });

            $("#tbl_auto tbody tr").dblclick(function () {
                fc_editar_auto($(this).children(0).html());
                event.preventDefault();
            });

            $("#pleaseWaitDialog").modal('hide');
        },
        error: function (data) {
            $("#errorMovimiento").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#pleaseWaitDialog").modal('hide');
        }
    });
}

$("#btn_nuevo_mov").click(function () {
    limpiarMovimiento();
});
$("#btn_guardar_mov").click(function () {
    $("#btn_guardar_mov").button('loading');

    $("#errorMovimiento").html('');

    if ($("#txh_idatencion").val() === "" || $("#txh_idatencion").val() === "0") {
        $("#errorMovimiento").html(GenerarAlertaWarning("Movimiento: seleccione una habitación"));
        $("#btn_guardar_mov").button('reset');
        return;
    } else if ($("#sel_movimiento").val() === null || $("#sel_movimiento").val() === "0") {
        $("#errorMovimiento").html(GenerarAlertaWarning("Tipo Movimiento: seleccione una opción"));
        $("#btn_guardar_mov").button('reset');
        $("#sel_movimiento").focus();
        return;
    } else if ($("#txt_monto").val() === "" || isNaN($("#txt_monto").val())) {
        $("#errorMovimiento").html(GenerarAlertaWarning("Monto: ingresar monto válido"));
        $("#btn_guardar_mov").button('reset');
        $("#txt_monto").focus();
        return;
    } 

    var pBoolPago = 0;

    if ($('#chkPago').prop('checked')) pBoolPago = 1;
    else pBoolPago = 0;

    pmontoPago = $("#txt_monto").val();

    var eMovimiento = {
        ID_MOVIMIENTO: $("#txh_idmovimiento").val() === "" ? 0 : $("#txh_idmovimiento").val(),
        MONTO: $("#txt_monto").val(),
        ID_ATENCION: $("#txh_idatencion").val(),
        ID_TIPO_MOVIMIENTO: $("#sel_movimiento").val(),
        CHK_PAGO: pBoolPago,
        OBSERVACION: $("#txt_observacion_mov").val()
    };

    $.ajax({
        type: "POST",
        url: "page/inicio.aspx/ActualizarMovimientosWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ eMovimiento: eMovimiento }),
        async: true,
        success: function (data) {

            if (!data.d.Activo) {
                $("#errorMovimiento").html(GenerarAlertaError(data.d.Mensaje));
                $("#btn_guardar_mov").button('reset');
                return;
            }
         
            $("#errorMovimiento").html(GenerarAlertaSuccess(data.d.Mensaje));
            $("#txh_idmovimiento").val('');

            $("#btn_nuevo_mov").click();
            fc_listar_movimiento($("#txh_idatencion").val());
            $("#btn_guardar_mov").button('reset');
        },
        error: function (data) {
            $("#errorMovimiento").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#btn_guardar_mov").button('reset');
        }
    });

    event.preventDefault();
});
//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************

function aceptarConfirm() {
    switch ($("#txh_idConfirm").val()) {
        case "ANULAR":
            fc_anular_reserva();
            break;
        case "ATENDER":
            fc_atender_reserva();
            break;
        case "LIBERAR":
            //fc_liberar_habitacion('001');
            fc_finalizar_atencion();
            break;
        case "ANULAR_A":
            fc_anular_atencion();
            break;
        case "MANTENIMIENTO":
            fc_cambiar_estado(2);
            break;
        case "ACTIVAR":
            fc_cambiar_estado(1);
            break;
        default:
    }
}
/*Eventos por Control*/
$(document).keydown(function (evt) {
    switch (evt ? evt.which : event.keyCode) {
        case 8: //BLOQUEA RETROCESO DE PAGINA
            var valor = document.activeElement.value;
            if (valor === undefined) {
                return false;
            }
            break;
        case 13: //BLOQUEA ENTER
            if ($("#modalConfirm").css('display') === 'block') 
                $("#btnAceptar").click();
            if ($("#pnl_reserva").css('display') === 'block') 
                $("#btn_guardar").click();
            if ($("#pnl_atencion_a").css('display') === 'block')
                $("#btn_guardar_a").click();
            if ($("#pnl_atencion_h").css('display') === 'block')
                $("#btn_guardar_h").click();
            break;
    }
});






