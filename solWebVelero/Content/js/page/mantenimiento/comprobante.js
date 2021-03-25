/*Inicializar Script*/
$(function () {
    $(document).unbind("keydown");

    $('.dtOp').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        orientation: "top left",
        setdate: new Date()
    }).on('changeDate', function () {
        var input = $(this).find('input:text');
    });
    //Fecha actual
    var fullDate = new Date();
    var primerDia = new Date(fullDate.getFullYear(), fullDate.getMonth(), 1);
    var ultimoDia = new Date(fullDate.getFullYear(), fullDate.getMonth() + 1, 0);

    $("#txt_bus_fechainicio").val(formatDate(primerDia, "dd/MM/yyyy"));
    $("#txt_bus_fechainicio").parent().datepicker("update", $("#txt_bus_fechainicio").val());
    $("#txt_bus_fechafin").val(formatDate(ultimoDia, "dd/MM/yyyy"));
    $("#txt_bus_fechafin").parent().datepicker("update", $("#txt_bus_fechafin").val());
    //Lista Configuracion
    $("#pleaseWaitDialog").modal();
    fc_listar_configuracion();
    //Listar Configuracion
    $.ajax({
        type: "POST",
        url: "default.aspx/GetParametros",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ opcion: "COMPROBANTE" }),
        async: true,
        success: function (data) {
            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                $("#pleaseWaitDialog").modal('hide');
                return;
            }

            $('#sel_bus_tipo').append("<option value='0'>Todos</option>");
            for (var i = 0; i < data.d.Resultado.ListaParametro.length; i++) {
                $('#sel_bus_tipo').append("<option value='" + data.d.Resultado.ListaParametro[i].CODIGO + "'>" + data.d.Resultado.ListaParametro[i].DESCRIPCION + "</option>");
                $('#sel_tipo').append("<option value='" + data.d.Resultado.ListaParametro[i].CODIGO + "'>" + data.d.Resultado.ListaParametro[i].DESCRIPCION + "</option>");
            }

            $("#pleaseWaitDialog").modal('hide');
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#pleaseWaitDialog").modal('hide');
        }
    });
});
/*Eventos por Control*/
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
                if ($("#pnl_habitacion").css('display') === 'block') {
                    $("#btn_guardar").click();
                }
            }
            break;
    }
});
//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************
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
function aceptarConfirm() {
    switch ($("#txh_idConfirm").val()) {
        case "ANULAR":
            $("#pleaseWaitDialog").modal();

            $.ajax({
                type: "POST",
                url: "page/mantenimiento/comprobante.aspx/AnularCoprobanteWM",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({
                    idComprobante: $("#txh_idComprobante").val()
                }),
                async: true,
                beforeSend: function () {
                    $("#tbl_comprobante button").attr("disabled", true);
                },
                success: function (data) {
                    $("#tbl_comprobante button").removeAttr("disabled");

                    if (!data.d.Activo) {
                        $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                        return;
                    }
                    
                    var bFactElec = sessionStorage.getItem('FACELEC');
                    if (bFactElec === "true") {
                        //Generando Comprobante Factura Electronica
                        $.ajax({
                            type: "POST",
                            url: "page/mantenimiento/comprobante.aspx/anularFacturacionElectronicaWS",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            data: JSON.stringify({ idComprobante: $("#txh_idComprobante").val() }),
                            async: true,
                            success: function (dataC) {
                                //Control de Errores
                                if (dataC.d.TipoMensaje === "OK") {
                                    $("#errorDiv").html(GenerarAlertaSuccess("Anulado correctamente"));
                                } else {
                                    $("#errorDiv").html(GenerarAlertaError("Error: " + dataC.d.Resultado));
                                }

                                $("#pleaseWaitDialog").modal('hide');
                                $("#txh_idConfirm").val("");
                                $("#modalConfirm").modal('hide');
                                $("#btn_buscar").click();
                            },
                            error: function (data) {
                                $("#errorMovimiento").html(GenerarAlertaError("Inconveniente al generar el comprobante"));
                                $("#txh_idConfirm").val("");
                                $("#pleaseWaitDialog").modal('hide');
                                $("#modalConfirm").modal('hide');
                            }
                        });
                    } else {
                        $("#errorDiv").html(GenerarAlertaSuccess(data.d.Mensaje));
                        $("#txh_idConfirm").val("");
                        $("#pleaseWaitDialog").modal('hide');
                        $("#modalConfirm").modal('hide');
                        $("#btn_buscar").click();
                    }               
                },
                error: function (data) {
                    $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
                    $("#tbl_comprobante button").removeAttr("disabled");
                    $("#pleaseWaitDialog").modal('hide');
                }
            });
            event.preventDefault();
            break;

        default:
    }
}
function limpiar() {
    $("#txt_bus_numero").val('');
    $("#txt_bus_cliente").val('');
    $("#sel_bus_tipo").val('0');
}
//************* EVENTOS MANTENIMIENTO ********************
$("#btn_buscar").click(function () {
    var p_piso = 0;

    if ($("#txt_bus_piso").val() !== "")
        p_piso = $("#txt_bus_piso").val();

    var fechaIni = getDateFromFormat($("#txt_bus_fechainicio").val(), 'dd/MM/yyyy');
    var fechaFin = getDateFromFormat($("#txt_bus_fechafin").val(), 'dd/MM/yyyy');

    var eComprobante = {
        NUMERO: $("#txt_bus_numero").val(),
        TIPO_COMPROBANTE: $("#sel_bus_tipo").val(),
        FECHA: $("#txt_bus_fecha").val(),
        FEC_INI: fechaIni,
        FEC_FIN: fechaFin,
        CLIENTE: $("#txt_bus_cliente").val(),
        OPCION: 3
    };

    $.ajax({
        type: "POST",
        url: "page/mantenimiento/comprobante.aspx/ListaComprobanteWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: eComprobante
        }),
        async: true,
        beforeSend: function () {
            $("#btn_buscar").attr("disabled", true);
            $('#tbl_comprobante tbody').empty();
        },
        success: function (data) {
            $("#btn_buscar").removeAttr("disabled");
            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                return;
            }

            var btnEditar = '<button name="editar" title="Editar" class="btn btn-primary btn-xs"><i class="icon-pencil"></i></button>';
            var btnReenviar = '<button name="enviar" title="Enviar" class="btn btn-sucess btn-xs"><i class="icon-share-alt"></i></button>';
            var btnImprimir = '<button name="imprimir" title="Imprimir" class="btn btn-default btn-xs"><i class="icon-print"></i></button>';
            var btnAnular = '<button name="anular" title="Anular" class="btn btn-danger btn-xs"><i class="icon-trash"></i></button>';
            
            var html = '';
            for (var i = 0; i < data.d.Resultado.length; i++) {
                html += '<tr><td style="display:none">' + data.d.Resultado[i].ID_COMPROBANTE + '</td>';
                html += '<td class="clsidCliente" style="display:none">' + data.d.Resultado[i].ID_CLIENTE + '</td>';
                html += '<td class="clsidAtencion" style="display:none">' + data.d.Resultado[i].ID_ATENCION + '</td>';
                var bFactElec = sessionStorage.getItem('FACELEC');
                if (bFactElec === "true") {
                    if (data.d.Resultado[i].VESTADO === "CORRECTO") {
                        html += '<td>' + btnImprimir + btnAnular + '</td>';
                    } else if (data.d.Resultado[i].VESTADO === "PENDIENTE EMISION") {
                        html += '<td>' + btnReenviar + btnEditar + '</td>';
                    }
                    else if (data.d.Resultado[i].VESTADO === "ANULADO") {
                        html += '<td>' + btnImprimir + '</td>';
                    } else if (data.d.Resultado[i].VESTADO === "PENDIENTE ANULACION") {
                        html += '<td>' + btnImprimir + btnAnular + '</td>';
                    } else
                        html += '<td></td>';
                } else {
                    html += '<td>' + btnEditar + btnImprimir + btnAnular + '</td>';
                }

                html += '<td>' + data.d.Resultado[i].TIPO_COMPROBANTE + '</td>';
                html += '<td>' + data.d.Resultado[i].SERIE + '-' + data.d.Resultado[i].NUMERO + '</td>';
                html += '<td>' + data.d.Resultado[i].FECHA + '</td>';
                html += '<td>' + data.d.Resultado[i].DOCUMENTO + '</td>';
                html += '<td>' + data.d.Resultado[i].CLIENTE + '</td>';
                html += '<td>' + data.d.Resultado[i].TOTAL + '</td>';
                html += '<td>' + data.d.Resultado[i].VESTADO + '</td></tr>';
            }

            $("#lblTotalReg").html("Total Registros: " + data.d.Resultado.length);
            $("#tbl_comprobante tbody").append(html);

            $("#tbl_comprobante button").click(function () {

                $("#txh_idComprobante").val($(this).parent().parent().children(0).html());
                $("#txh_idcliente").val($(this).parent().parent().children(".clsidCliente").html());

                if ($(this).attr("name") === "editar") {
                    //$('#pnl_comprobante .modal-title').html('Editar Movimiento');
                    var p_IdComprobante = 0;
                    p_IdComprobante = $(this).parent().parent().find("td").eq(0).html();

                    $.ajax({
                        type: "POST",
                        url: "page/mantenimiento/comprobante.aspx/ObtenerComprobanteWM",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data: JSON.stringify({ idComprobante: p_IdComprobante }),
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
                            //Limpiando controles
                            $("#btn_buscar_cliente").hide();
                            $("#btn_limpiar_cliente").show();
                            $("#sel_tipo").prop('disabled', true);
                            $("#txt_numero").prop('disabled', true);
                            $("#txt_cliente").prop('disabled', true);
                            $("#txt_direccion").prop('disabled', true);
                            $("#txt_fecha").prop('disabled', true);
                            $("#txt_nrocliente").prop('disabled', true);
                            $("#txt_subtotal").prop('disabled', true);
                            $("#txt_igv").prop('disabled', true);
                            $("#txt_total").prop('disabled', true);
                            $("#bodyDetalle").html("");
                            //Cabecera
                            $("#sel_tipo option").filter(function () {
                                return this.text === data.d.Resultado[0].TIPO_COMPROBANTE;
                            }).attr('selected', true);
                            $("#txt_numero").val(data.d.Resultado[0].SERIE + '-' + data.d.Resultado[0].NUMERO);
                            $("#txt_fecha").val(data.d.Resultado[0].FECHA);

                            $("#txt_nrocliente").val(data.d.Resultado[0].DOCUMENTO);
                            $("#txt_cliente").val(data.d.Resultado[0].CLIENTE);
                            $("#txt_direccion").val(data.d.Resultado[0].C_DIRECCION);

                            $("#txt_subtotal").val(data.d.Resultado[0].SUBTOTAL);
                            $("#txt_igv").val(data.d.Resultado[0].IGV);
                            $("#txt_total").val(data.d.Resultado[0].TOTAL);
                            $("#txt_observacion").val(data.d.Resultado[0].OBSERVACION);

                            //Detalle
                            var str_body = "";
                            for (var i = 0; i < data.d.Resultado.length; i++) {
                                str_body += "<tr><td>" + data.d.Resultado[i].CANTIDAD + "</td>";
                                str_body += "<td>" + data.d.Resultado[i].DESCRIPCION + "</td>";
                                str_body += "<td>" + data.d.Resultado[i].IMPORTE + "</td>";
                                str_body += "<td>" + data.d.Resultado[i].IMPORTE + "</td></tr>";
                            }

                            $("#bodyDetalle").html(str_body);

                            $("#pnl_comprobante").modal('show');
                        },
                        error: function (data) {
                            $("#errorComprobante").html(GenerarAlertaError("Inconveniente en la operación"));
                            $("#tbl_comprobante button").removeAttr("disabled");
                        }
                    });
                    event.preventDefault();
                } else if ($(this).attr("name") === "imprimir") {

                    var bFactElec = sessionStorage.getItem('FACELEC');
                    if (bFactElec === "true") {
                        //Generando Comprobante Factura Electronica
                        $.ajax({
                            type: "POST",
                            url: "page/mantenimiento/comprobante.aspx/ObtenerComprobanteWM",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            data: JSON.stringify({ idComprobante: $("#txh_idComprobante").val() }),
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
                        window.open('page/reporte/comprobante.aspx?eComp=' + $("#txh_idComprobante").val() + '&eAten=0&eTipo=' + strImpresora, '_blank');
                    }
                } else if ($(this).attr("name") === "anular") {
                    $("#txh_idConfirm").val('ANULAR');
                    window.parent.fc_mostrar_confirmacion("¿Esta seguro de <strong>ANULAR</strong> el comprobante?");
                } else if ($(this).attr("name") === "enviar") {
                    //Generando Comprobante Factura Electronica
                    $("#pleaseWaitDialog").modal();
                    $.ajax({
                        type: "POST",
                        url: "page/mantenimiento/comprobante.aspx/generarFacturacionElectronicaWS",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data: JSON.stringify({ idComprobante: $("#txh_idComprobante").val() }),
                        async: true,
                        success: function (dataC) {
                            //Control de Errores
                            if (dataC.d.TipoMensaje === "OK") {
                                //Actualizando el estado de la factura
                                var eComprobante = {
                                    ID_COMPROBANTE: $("#txh_idComprobante").val(),
                                    OBSERVACION: "",
                                    ESTADO: 1,
                                    OPCION: 4
                                };
                                //Actualizando estado de la factura
                                $.ajax({
                                    type: "POST",
                                    url: "page/mantenimiento/comprobante.aspx/ActualizarCoprobanteWM",
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "json",
                                    data: JSON.stringify({
                                        objE: eComprobante
                                    }),
                                    async: true,
                                    beforeSend: function () {
                                        $("#tbl_comprobante button").attr("disabled", true);
                                    },
                                    success: function (data) {
                                        $("#tbl_comprobante button").removeAttr("disabled");

                                        if (!data.d.Activo) {
                                            $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                                            return;
                                        }

                                        $("#errorDiv").html(GenerarAlertaSuccess(data.d.Mensaje));
                                        $("#pleaseWaitDialog").modal('hide');
                                        $("#btn_buscar").click();
                                    },
                                    error: function (data) {
                                        $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
                                        $("#pleaseWaitDialog").modal('hide');
                                    }
                                });
                                //Imprimiendo comprobante
                                //Generando Comprobante Factura Electronica
                                $.ajax({
                                    type: "POST",
                                    url: "page/mantenimiento/comprobante.aspx/ObtenerComprobanteWM",
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "json",
                                    data: JSON.stringify({ idComprobante: $("#txh_idComprobante").val() }),
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
                            } else {
                                $("#errorDiv").html(GenerarAlertaError("Error: " + dataC.d.Resultado));
                                $("#pleaseWaitDialog").modal('hide');
                            }
                        },
                        error: function (data) {
                            $("#errorMovimiento").html(GenerarAlertaError("Inconveniente al generar el comprobante"));
                            $("#btn_guardar").button('reset');
                            $("#pleaseWaitDialog").modal('hide');
                        }
                    });
                }
            });

            //$("#tbl_comprobante tbody tr").dblclick(function () {
            //   fc_editar_habitacion($(this).children(0).html());
            //    event.preventDefault();
            //});
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#btn_buscar").removeAttr("disabled");
        }
    });
});
$("#btn_limpiar").click(function () {
    $("#errorDiv").html('');
    limpiar();
});
$("#sel_bus_tipo").change(function () {
    $("#btn_buscar").click();
});
$("#pnl_busqueda input:text").keyup(function (e) {
    if (e.keyCode === 13) {
        $("#btn_buscar").click();
    }
});
//************* EVENTOS MODAL EDITAR *******************
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
                $("#errorComprobante").html(GenerarAlertaError(data.d.Mensaje));
                $("#btn_buscar_cliente").button('reset');
                return;
            }

            if (data.d.Resultado.length > 0) {
                var html = '';
                for (var i = 0; i < data.d.Resultado.length; i++) {
                    $("#txt_nrocliente").val(data.d.Resultado[i].NUM_DOCUMENTO);
                    $("#txt_cliente").val(data.d.Resultado[i].NOMBRES + ' ' + data.d.Resultado[i].APELLIDOS);
                    $("#txt_direccion").val(data.d.Resultado[i].DIRECCION);
                    $("#txh_idcliente").val(data.d.Resultado[i].ID_CLIENTE);

                    $("#txt_nrocliente").prop('disabled', true);
                    $("#txt_cliente").prop('disabled', true);
                    $("#txt_direccion").prop('disabled', true);

                    $("#btn_buscar_cliente").hide();
                    $('#btn_limpiar_cliente').show();
                }
                $("#btn_buscar_cliente").button('reset');
            } else {
                $("#btn_buscar_cliente").button('reset');
                $("#txh_idcliente").val('');
                $("#txt_cliente").val('');
                $("#txt_direccion").val('');
                $("#errorComprobante").html(GenerarAlertaError('No se encontró el documento ingresado.'));
            }
        },
        error: function (data) {
            $("#errorComprobante").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#btn_buscar_cliente").button('reset');
        }
    });
});
$("#btn_limpiar_cliente").click(function () {
    $("#btn_limpiar_cliente").button('loading');

    $("#txt_nrocliente").val('');
    $("#txt_cliente").val('');
    $("#txt_direccion").val('');
    $("#txh_idcliente").val('0');

    $("#txt_nrocliente").prop('disabled', false);

    $("#btn_buscar_cliente").show();
    $("#btn_limpiar_cliente").hide();

    $("#btn_limpiar_cliente").button('reset');

    $("#txt_nrocliente").focus();
});
$("#btn_guardar").click(function () {
    if (validIdInput($("#sel_tipo").val())) {
        $("#errorComprobante").html(GenerarAlertaWarning("Tipo de Comprobante: seleccione una opción"));
        $("#btn_guardar").button('reset');
        $("#sel_tipo").focus();
        return;
    } else if (validIdInput($("#txh_idcliente").val())) {
        $("#errorComprobante").html(GenerarAlertaWarning("Cliente: Seleccione un cliente válido"));
        $("#txt_nrocliente").focus();
        $("#btn_guardar").button('reset');
        return;
    }

    if ($("#txh_idcliente").val() === "") $("#txh_idcliente").val("0");

    var eComprobante = {
        ID_COMPROBANTE: $("#txh_idComprobante").val(),
        ID_CLIENTE: $("#txh_idcliente").val(),
        TIPO_COMPROBANTE: $("#sel_tipo").val(),
        OBSERVACION: $("#txt_observacion").val(),
        OPCION: 5
    };

    $.ajax({
        type: "POST",
        url: "page/mantenimiento/comprobante.aspx/ActualizarCoprobanteWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: eComprobante
        }),
        async: true,
        beforeSend: function () {
            $("#tbl_comprobante button").attr("disabled", true);
        },
        success: function (data) {
            $("#tbl_comprobante button").removeAttr("disabled");

            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                return;
            }

            $("#errorDiv").html(GenerarAlertaSuccess(data.d.Mensaje));
            $("#txh_idConfirm").val("");
            $("#pnl_comprobante").modal('hide');
            $("#btn_buscar").click();
        },
        error: function (data) {
            $("#pnl_comprobante").modal('hide');
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#tbl_comprobante button").removeAttr("disabled");
        }
    });
});
$("#btn_exportar").click(function () {
    $("#btn_exportar").button('loading');
    var total_reg = $('#tbl_comprobante tr').length;

    if (total_reg < 2) {
        $("#errorDiv").html(GenerarAlertaWarning("Cantidad de Registros: No hay registros para exportar"));
        $("#btn_exportar").button('reset');
        return;
    }
    exportGridToExcel("tbl_comprobante", "Comprobantes_hotel");
    $("#btn_exportar").button('reset');
});