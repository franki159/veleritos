function fc_listar_tipo_movimiento() {
    //Lista Data Inicial
    $.ajax({
        type: "POST",
        url: "page/operacion/movimiento.aspx/ListaInicialWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            opcion: 1
        }),
        async: true,
        beforeSend: function () {
            $('#sel_bus_movimiento').empty();
            $("#pnl_busqueda :input").attr("disabled", true);
        },
        success: function (data, status) {
            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                $("#pleaseWaitDialog").modal('hide');
                return;
            }

            $('#sel_bus_movimiento').append("<option value='0'>Todos</option>");
            $('#sel_movimiento').append("<option tipoOper='0' tipoMov='0' value='0'>Seleccione</option>");

            for (var i = 0; i < data.d.Resultado.lista.length; i++) {
                $('#sel_bus_movimiento').append("<option value='" + data.d.Resultado.lista[i].ID_TIPO_MOVIMIENTO + "'>" + data.d.Resultado.lista[i].DESCRIPCION + "</option>");
                $('#sel_movimiento').append("<option tipoOper='" + data.d.Resultado.lista[i].TIPO_OPERACION + "' tipoMov='" + data.d.Resultado.lista[i].TIPO_MOVIMIENTO +"' value='" + data.d.Resultado.lista[i].ID_TIPO_MOVIMIENTO + "'>" + data.d.Resultado.lista[i].DESCRIPCION + "</option>");
            }
            
            //Fecha actual
            var fullDate = new Date();
            var primerDia = new Date(fullDate.getFullYear(), fullDate.getMonth(), 1);
            var ultimoDia = new Date(fullDate.getFullYear(), fullDate.getMonth() + 1, 0);

            $("#txt_bus_fechainicio").val(formatDate(primerDia, "dd/MM/yyyy"));
            $("#txt_bus_fechainicio").parent().datepicker("update", $("#txt_bus_fechainicio").val());
            $("#txt_bus_fechafin").val(formatDate(ultimoDia, "dd/MM/yyyy"));
            $("#txt_bus_fechafin").parent().datepicker("update", $("#txt_bus_fechafin").val());
            $("#txt_fecha").val(formatDate(fullDate, "dd/MM/yyyy"));
            $("#txt_fecha").parent().datepicker("update", $("#txt_fecha").val());

            $("#pnl_busqueda :input").removeAttr("disabled");
            $("#pleaseWaitDialog").modal('hide');
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#pleaseWaitDialog").modal('hide');
        }
    });

    fc_listar_configuracion();
}

/*Variables Locales*/
var inputNota;

/*Inicializar Script*/
$(function () {
    $(document).unbind("keydown");

    $('.dtOp').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        orientation: "top left"
    });
    $("#pleaseWaitDialog").modal();
    fc_listar_tipo_movimiento();

    $(document).keyup(function (e) {
        if (e.keyCode === 13) {
            if ($(this).attr("id") === "pnl_busqueda") $("#btn_buscar").click();
            else $("#pnl_busqueda").focus();
        }
    });

    $("#btn_buscar").click(function () {
        fc_listar_movimiento();
    });

});

function fc_listar_movimiento() {
    $("#pleaseWaitDialog").modal();
    var fechaIni = getDateFromFormat($("#txt_bus_fechainicio").val(), 'dd/MM/yyyy');
    var fechaFin = getDateFromFormat($("#txt_bus_fechafin").val(), 'dd/MM/yyyy');

    var eMovimiento = {
        ID_TIPO_MOVIMIENTO: $("#sel_bus_movimiento").val(),
        FECHA_INI: fechaIni,
        FECHA_FIN: fechaFin,
        OPCION: 1
    };

    $.ajax({
        type: "POST",
        url: "page/operacion/movimiento.aspx/ListaMovimientosWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: eMovimiento
        }),
        async: true,
        beforeSend: function () {
            $("#btn_buscar").attr("disabled", true);
            $('#tbl_movimiento tbody').empty();
        },
        success: function (data) {
            $("#btn_buscar").removeAttr("disabled");

            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                $("#pleaseWaitDialog").modal('hide');
                return;
            }
            
            var htmlBotones = '<button name="editar" class="btn btn-primary btn-xs"><i class="icon-pencil"></i></button> ' +
                '<button name="anular" class="btn btn-danger btn-xs"><i class="icon-trash "></i></button> ';

            var html = '';
            for (var i = 0; i < data.d.Resultado.length; i++) {
                html += '<tr><td style="display:none">' + data.d.Resultado[i].ID_MOVIMIENTO + '</td>';
                html += '<td>' + htmlBotones + '</td>';
                html += '<td>' + data.d.Resultado[i].DESCRIPCION + '</td>';
                html += '<td>' + data.d.Resultado[i].MONTO + '</td>';
                html += '<td>' + formatDate(parseDateServer(data.d.Resultado[i].FECHA_INI), "dd/MM/yyyy") + '</td>';
                html += '<td>' + data.d.Resultado[i].OBSERVACION + '</td>';
                html += '<td>' + data.d.Resultado[i].NUM_DOCUMENTO + '</td></tr>';
            }

            $("#tbl_movimiento tbody").append(html);
            $("#lblTotalReg").html("Total Registros: " + data.d.Resultado.length);

            $("#tbl_movimiento button").click(function () {

                $("#txh_idmovimiento").val($(this).parent().parent().children(0).html());

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
                                $("#errorDiv").html(GenerarAlertaError(data.d.error));
                                return;
                            }

                            $("#txh_idmovimiento").val(data.d.Resultado.ID_MOVIMIENTO);
                            $("#sel_movimiento").val(data.d.Resultado.ID_TIPO_MOVIMIENTO);
                            $("#txt_fecha").val(formatDate(parseDateServer(data.d.Resultado.FECHA_INI), "dd/MM/yyyy"));
                            $("#txt_monto").val(data.d.Resultado.MONTO);
                            $("#txt_observacion").val(data.d.Resultado.OBSERVACION);
                
                            if (data.d.Resultado.ID_CLIENTE !== 0) {
                                $("#txh_idcliente").val(data.d.Resultado.ID_CLIENTE);
                                $("#divGenComprobante").show();
                                $('#chkPago').prop('checked', false);
                                $('#chkPago').change();         
                                $('#chkPago').prop('checked', true);
                                $("#btn_buscar_cliente").hide();
                                $("#btn_limpiar_cliente").show();
                                $("#btn_limpiar_cliente").prop('disabled', true);
                                $("#chkPago").prop('disabled', true);
                                $("#txt_nrocliente").val(data.d.Resultado.NUM_DOCUMENTO);
                                $("#txt_cliente").val(data.d.Resultado.CLIENTE);
                            } else {
                                $("#txh_idcliente").val("0");
                                $("#divGenComprobante").hide();
                                $('#chkPago').prop('checked', false);
                                $('#chkPago').change();
                            }

                            $("#pnl_movimiento").modal('show');
                        },
                        error: function (data) {
                            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
                            $("#tbl_movimiento button").removeAttr("disabled");
                        }
                    });
                    event.preventDefault();
                    //} else if ($(this).attr("name") === "comprobante") {                    
                    //    $("#txh_idConfirm").val("COMPROBANTE");
                    //    window.parent.fc_mostrar_confirmacion("Se generará una <strong>" + $("#cmbComprobante option:selected").text() + "</strong>");
                } else if ($(this).attr("name") === "anular") {
                    $("#txh_idConfirm").val('ANULAR');
                    window.parent.fc_mostrar_confirmacion("¿Esta seguro de <strong>ANULAR</strong> el movimiento?");
                }
            });

            $("#tbl_auto tbody tr").dblclick(function () {
                fc_editar_auto($(this).children(0).html());
                event.preventDefault();
            });

            $("#pleaseWaitDialog").modal('hide');
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#btn_buscar").removeAttr("disabled");
            $("#pleaseWaitDialog").modal('hide');
        }
    });
}

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

        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#pleaseWaitDialog").modal('hide');
        }
    });
}
/*Eventos por Control*/
$(document).keydown(function (evt) {
    switch (evt ? evt.which : event.keyCode) {
        case 8: //BLOQUEA RETROCESO DE PAGINA
            var valor = document.activeElement.value;
            if (valor === undefined) { return false; } break;
        case 13: //BLOQUEA ENTER
            return false;
        case 66: //BUSCAR
            if (evt ? evt.altKey : event.altKey) $("#btn_buscar").click();
            break;
        case 78: //NUEVO
            if (evt ? evt.altKey : event.altKey) $("#btn_nuevo").click();
            break;
        case 71: //GUARDAR
            if (evt ? evt.altKey : event.altKey) {
                if ($("#pnl_movimiento").css('display') === 'block') {
                    $("#btn_guardar").click();
                }
            }
            break;
    }
});

function aceptarConfirm() {
    switch ($("#txh_idConfirm").val()) {
        case "ANULAR":
            $("#pleaseWaitDialog").modal();
            $.ajax({
                type: "POST",
                url: "page/operacion/movimiento.aspx/AnularMovimientoWM",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ idMovimiento: $("#txh_idmovimiento").val() }),
                async: true,
                beforeSend: function () {
                    $("#tbl_movimiento button").attr("disabled", true);
                },
                success: function (data) {
                    $("#tbl_movimiento button").removeAttr("disabled");

                    if (!data.d.Activo) {
                        $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                        $("#pleaseWaitDialog").modal('hide');
                        return;
                    }

                    $("#pleaseWaitDialog").modal('hide');
                    $("#errorDiv").html(GenerarAlertaSuccess(data.d.Mensaje));
                    $("#btn_buscar").click();
                },
                error: function (data) {
                    $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
                    $("#tbl_movimiento button").removeAttr("disabled");
                    $("#pleaseWaitDialog").modal('hide');
                }
            });
            event.preventDefault();
            break;
        case "GENERAR":
            fu_guardarMovimiento('001');
            break;
        //case "COMPROBANTE":
        //    var idMovimiento = $("#txh_idmovimiento").val();

        //    $.ajax({
        //        type: "POST",
        //        url: "page/operacion/movimiento.aspx/AsignarComprobanteWM",
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        data: JSON.stringify({ idMovimiento: idMovimiento, tipoComprobante: $("#cmbComprobante").val() }),
        //        async: true,
        //        beforeSend: function () {
        //            $("#tbl_movimiento button").attr("disabled", true);
        //        },
        //        success: function (data) {
        //            $("#tbl_movimiento button").removeAttr("disabled");

        //            if (!data.d.Activo) {
        //                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
        //                return;
        //            }

        //            //Ver comprobante
        //            window.open('page/reporte/comprobante.aspx?eMov=' + idMovimiento + '&eTipo=T', '_blank');

        //            $("#errorDiv").html(GenerarAlertaSuccess(data.d.Mensaje));
        //            $("#btn_buscar").click();
        //        },
        //        error: function (data) {
        //            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
        //            $("#tbl_movimiento button").removeAttr("disabled");
        //        }
        //    });
        //    event.preventDefault();

        //    break;
        default:
            break;
    }
}

function fu_guardarMovimiento(tipoComprobante) {
    $("#errorMovimiento").html('');
    $("#btn_guardar").button('loading');

    var pBoolPago = 0;
    if ($('#chkPago').prop('checked'))
        pBoolPago = 1;
    else
        pBoolPago = 0;

    var eMovimiento = {
        ID_MOVIMIENTO: $("#txh_idmovimiento").val() === "" ? 0 : $("#txh_idmovimiento").val(),
        FECHA_INI: getDateFromFormat($("#txt_fecha").val(), "dd/MM/yyyy"),
        MONTO: $("#txt_monto").val(),
        ID_CLIENTE: $("#txh_idcliente").val(),
        ID_TIPO_MOVIMIENTO: $("#sel_movimiento").val(),
        CHK_PAGO: pBoolPago,
        TIPO_COMPROBANTE: tipoComprobante,
        OBSERVACION: $("#txt_observacion").val()
    };

    $.ajax({
        type: "POST",
        url: "page/operacion/movimiento.aspx/ActualizarMovimientosWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ eMovimiento: eMovimiento }),
        async: true,
        beforeSend: function () {
            $("#btn_guardar").attr("disabled", true);
        },
        success: function (data) {
            $("#btn_guardar").removeAttr("disabled");

            if (!data.d.Activo) {
                $("#errorMovimiento").html(GenerarAlertaError(data.d.Mensaje));
                return;
            }

            //Generando comprobantes
            if (pBoolPago === 1) {
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
                            $("#comprobanteDialog").modal('hide');
                            $("#btn_buscar").click();
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
                    $("#errorDiv").html(GenerarAlertaSuccess("Generado correctamente"));
                    $("#pnl_movimiento").modal('hide');
                    $("#comprobanteDialog").modal('hide');
                    $("#btn_guardar").button('reset');
                    $("#btn_buscar").click();
                }
            } else {
                $("#errorDiv").html(GenerarAlertaSuccess("Generado correctamente"));
                $("#pnl_movimiento").modal('hide');
                $("#btn_guardar").button('reset');
                $("#btn_buscar").click();
            }
        },
        error: function (data) {
            $("#errorMovimiento").html(GenerarAlertaError("Inconveniente  generar el movimiento"));
            $("#btn_guardar").button('reset');
        }
    });
    event.preventDefault();
}

function limpiarMovimiento() {
    $("#txh_idmovimiento").val('0');
    $("#txh_idcliente").val("0");
    $("#sel_movimiento").val("0");
    $("#txt_monto").val('');
    $("#txt_observacion").val('');
    $("#txt_nrocliente").val('');
    $("#txt_cliente").val('');
}

$("#btn_nuevo").click(function () {
    $("#errorMovimiento").html('');
    $('#pnl_movimiento .modal-title').html('Registrar Movimiento');
    $("#pnl_movimiento select").val('0');
    $('#chkPago').prop('checked', false);
    $("#chkPago").prop('disabled', false);
    $("#txt_nrocliente").prop('disabled', true);
    $("#txt_cliente").prop('disabled', true);
    $("#btn_buscar_cliente").prop('disabled', true);
    $("#btn_buscar_cliente").show();
    $("#btn_limpiar_cliente").hide();
    $("#divGenComprobante").hide();
    $("#divTipoOper").hide();

    //Limpiar Controles
    limpiarMovimiento();
    $("#pnl_movimiento").modal('show');
});
//************* EVENTOS MODAL EDITAR *******************
$("#chkPago").change(function () {
    if ($('#chkPago').prop('checked')) {
        $("#txt_nrocliente").prop('disabled', false);
        $("#btn_buscar_cliente").prop('disabled', false);
        $("#btn_buscar_cliente").show();
        $("#btn_limpiar_cliente").hide();
        $("#txt_nrocliente").focus();
    } else {
        $("#txt_nrocliente").prop('disabled', true);
        $("#txt_cliente").prop('disabled', true);
        $("#btn_buscar_cliente").prop('disabled', true);
        $("#txt_nrocliente").val('');
        $("#txt_cliente").val('');
        $("#btn_buscar_cliente").show();
        $("#btn_limpiar_cliente").hide();
    }
});

$("#sel_movimiento").change(function (e) {
    if ($("#sel_movimiento option:selected").attr("tipoMov") === "1") {
        $("#divTipoOper").show();
        $("#divGenComprobante").show();
        $("#spanTipoOper").html($("#sel_movimiento option:selected").attr("tipoOper"));
    } else {
        $('#chkPago').prop('checked', false);
        $('#chkPago').change();
        $("#spanTipoOper").html("");
        $("#divTipoOper").hide();
        $("#divGenComprobante").hide();
    }
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
                $("#errorMovimiento").html(GenerarAlertaError(data.d.Mensaje));
                $("#btn_buscar_cliente").button('reset');
                return;
            }

            if (data.d.Resultado.length > 0) {
                var html = '';
                for (var i = 0; i < data.d.Resultado.length; i++) {
                    $("#txt_nrocliente").val(data.d.Resultado[i].NUM_DOCUMENTO);
                    $("#txt_cliente").val(data.d.Resultado[i].NOMBRES + ' ' + data.d.Resultado[i].APELLIDOS);
                    $("#txh_idcliente").val(data.d.Resultado[i].ID_CLIENTE);

                    $("#txt_nrocliente").prop('disabled', true);
                    $("#txt_cliente").prop('disabled', true);

                    $("#btn_buscar_cliente").hide();
                    $('#btn_limpiar_cliente').show();
                }
                $("#btn_buscar_cliente").button('reset');
            } else {
                $("#btn_buscar_cliente").button('reset');
                $("#txh_idcliente").val('');
                $("#txt_cliente").val('');
                $("#errorMovimiento").html(GenerarAlertaError('No se encontró el documento ingresado.'));
            }
        },
        error: function (data) {
            $("#errorMovimiento").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#btn_buscar_cliente").button('reset');
        }
    });
});

$("#btn_limpiar_cliente").click(function () {
    $("#btn_limpiar_cliente").button('loading');

    $("#txt_nrocliente").val('');
    $("#txt_cliente").val('');
    $("#txh_idcliente").val('0');

    $("#txt_nrocliente").prop('disabled', false);

    $("#btn_buscar_cliente").show();
    $("#btn_limpiar_cliente").hide();

    $("#btn_limpiar_cliente").button('reset');

    $("#txt_nrocliente").focus();
});

$("#btn_guardar").click(function () {
    if ($("#sel_movimiento").val() === "0") {
        $("#errorMovimiento").html(GenerarAlertaWarning("Tipo de Movimiento: seleccionar una opción"));
        $("#sel_movimiento").focus();
        return;
    } else if (validIdInput($("#txt_monto").val())) {
        $("#errorMovimiento").html(GenerarAlertaWarning("Total: ingresar un monto válido"));
        $("#txt_monto").focus();
        return;
    } else if (isDate($("#txt_fecha").val(), "dd/MM/yyyy") === false) {
        $("#errorMovimiento").html(GenerarAlertaWarning("Fecha: campo invalido"));
        $("#txt_fecha").focus();
        return;
    } else if ($('#chkPago').prop('checked')) {
        if (validIdInput($("#txh_idcliente").val())) {
            $("#errorMovimiento").html(GenerarAlertaWarning("Cliente: Seleccione un cliente válido"));
            $("#txt_nrocliente").focus();
            return;
        }
    } 

    if ($("#txh_idcliente").val() === "") $("#txh_idcliente").val("0");

    if ($('#chkPago').prop('checked')) {
        $("#comprobanteDialog").modal();
    } else {
        $("#txh_idConfirm").val("GENERAR");

        //if ($('#chkPago').prop('checked'))
        //    window.parent.fc_mostrar_confirmacion("Seguro que desea <strong>GUARDAR</strong> el movimiento?. Se generará una <strong>" + $("#cmbComprobante option:selected").text() + "</strong>");
        //else
            window.parent.fc_mostrar_confirmacion("Seguro que desea <strong>GUARDAR</strong> el movimiento?");
    }
});