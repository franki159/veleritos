var txh_viaje;
var txh_idConfirm = "";
var valRND = Math.floor(Math.random() * 100);
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
    $("#sel_tour").on('change', function () {
        var precio_tour = $('option:selected', this).attr("att-precio");
        $("#txt_precio").val(precio_tour);
        $("#txt_precio_real").val(precio_tour);
    });
    listar_inicio();
    
    $("#bus_txt_nombre").focus();
});
function aceptarConfirm() {
    switch (txh_idConfirm) {
        case "ANULAR":
            openLoading();

            var objE = {
                ID_ENCRIP: txh_viaje
            };

            $.ajax({
                type: "POST",
                url: "/Mantenimiento/AnularViaje",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ objE: objE }),
                async: true,
                beforeSend: function () {
                    $("#tbl_viaje button").attr("disabled", true);
                },
                success: function (data) {
                    $("#tbl_viaje button").removeAttr("disabled");

                    if (!data.Activo) {
                        msg_OpenDay("e", data.Mensaje)
                        closeLoading();
                        return;
                    }
                    
                    listar_viaje(false);
                    msg_OpenDay("c", "Se anuló correctamente");
                },
                error: function (data) {
                    msg_OpenDay("e", "Inconveniente en la operación");
                    $("#tbl_viaje button").removeAttr("disabled");
                    $("#pleaseWaitDialog").modal('hide');
                }
            });
            event.preventDefault();
            break;
        default:
            break;
    }
}
function listar_embarcacion() {
    var objE = {
        nombre: ""
    };

    $.ajax({
        type: "POST",
        url: "/Mantenimiento/ListaEmbarcacion",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: objE
        }),
        async: false,
        beforeSend: function () {
            $('#sel_embarcacion').empty();
        },
        success: function (data) {
            if (!data.Activo) {
                msg_OpenDay("e", data.Mensaje)
                closeLoading();
                return;
            }

            $('#sel_embarcacion').append("<option></option>");
            for (var i = 0; i < data.Resultado.length; i++) {
                $('#sel_embarcacion').append("<option value='" + data.Resultado[i].id_embarcacion + "'>" + data.Resultado[i].nombre + "</option>");
            }
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
            closeLoading();
        }
    });
}
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
            $('#sel_tour').append("<option></option>");
            for (var i = 0; i < data.Resultado.length; i++) {
                $('#bus_sel_tour').append("<option value='" + data.Resultado[i].id_tour + "'>" + data.Resultado[i].nombre + "</option>");
                $('#sel_tour').append("<option value='" + data.Resultado[i].id_tour + "' att-precio='" + data.Resultado[i].precio +"'>" + data.Resultado[i].nombre + "</option>");
            }
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
            closeLoading();
        }
    });
}
function listar_empleado(cargo, nom_control) {
    var objE = {
        CARGO: cargo,
        NOMBRES: ""
    };
    
    $.ajax({
        type: "POST",
        url: "/Mantenimiento/ListaEmpleados",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: objE
        }),
        async: false,
        beforeSend: function () {
            $("#btn_buscar").attr("disabled", true);
            $('#tbl_empleado tbody').empty();
        },
        success: function (data) {
            $("#btn_buscar").removeAttr("disabled");

            if (!data.Activo) {
                msg_OpenDay("e", data.Mensaje)
                closeLoading();
                return;
            }
            
            $('#' + nom_control).append("<option></option>");
            for (var i = 0; i < data.Resultado.length; i++) {
                $('#' + nom_control).append("<option value='" + data.Resultado[i].ID_EMPLEADO + "'>" + data.Resultado[i].NOMBRES + ' ' + data.Resultado[i].APELLIDOS + "</option>");
            }
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
            closeLoading();
        }
    });
}
function listar_inicio() {
    listar_tour();
    listar_embarcacion();
    listar_empleado("001", "sel_piloto");
    listar_empleado("002", "sel_copiloto");
    //listar_viaje(false);
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
        url: "/Mantenimiento/ListaViaje",
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

            var htmlBotones = '<button name="editar" class="btn btn-primary btn-sm"><i class="fas fa-pencil-alt"></i></button> ' +
                '<button name="anular" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button> ';

            var html = '';
            for (var i = 0; i < data.Resultado.length; i++) {
                html += '<tr><td>' + htmlBotones + '</td>';
                html += '<td style="display:none">' + data.Resultado[i].ID_ENCRIP + '</td>';
                html += '<td>' + data.Resultado[i].nombre + '</td>';
                html += '<td>' + formatDate(parseDateServer(data.Resultado[i].fecha_ini), "dd-MM-yyyy") + '</td>';
                html += '<td>' + formatDate(parseDateServer(data.Resultado[i].fecha_ini), "HH:mm") + '</td>';
                html += '<td>' + formatDate(parseDateServer(data.Resultado[i].fecha_fin), "HH:mm") + '</td>';
                html += '<td>' + data.Resultado[i].precio + '</td>';
                html += '<td>' + data.Resultado[i].descuento + '</td></tr>';
            }

            $("#tbl_viaje tbody").append(html);
            $("#lblTotalReg").html("Total registros: " + data.Resultado.length);

            $("#tbl_viaje button").click(function () {
                if ($(this).attr("name") === "editar") {
                    $('#pnl_viaje .modal-title').html('Editar Viaje');
                    limpiar_viaje();
                    txh_viaje = $(this).parent().parent().find("td").eq(1).html();
                    txh_viaje = validaTableMobile(txh_viaje);

                    objE = {
                        ID_ENCRIP: txh_viaje
                    };

                    $.ajax({
                        type: "POST",
                        url: "/Mantenimiento/ObtenerViajexId",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data: JSON.stringify({ objE: objE }),
                        async: true,
                        beforeSend: function () {
                            $("#errorViaje").html('');
                            $("#tbl_viaje button").attr("disabled", true);
                        },
                        success: function (data) {
                            $("#tbl_viaje button").removeAttr("disabled");

                            if (data.error) {
                                msg_OpenDay("e", data.Mensaje);
                                return;
                            }
                            $("#sel_tour").val(data.Resultado.id_tour).change();
                            $("#sel_embarcacion").val(data.Resultado.id_embarcacion).change();
                            $("#sel_piloto").val(data.Resultado.piloto).change();
                            $("#sel_copiloto").val(data.Resultado.copiloto).change();
                            $("#txt_nombre").val(data.Resultado.nombre);
                            $("#txt_descripcion").val(data.Resultado.DESCRIPCION);
                            $("#txt_observacion").val(data.Resultado.observacion);
                            $("#txt_precio_real").val(data.Resultado.precio);
                            $("#txt_descuento").val(data.Resultado.descuento);
                            $("#txt_fec_ini").val(formatDate(parseDateServer(data.Resultado.fecha_ini), "yyyy-MM-dd"));
                            $("#txt_hor_ini").val(formatDate(parseDateServer(data.Resultado.fecha_ini), "HH:mm"));
                            $("#txt_hor_fin").val(formatDate(parseDateServer(data.Resultado.fecha_fin), "HH:mm"));
                            $("#div_fec_ini").hide();
                            $("#bodyDias").hide();
                            $("#pnl_viaje").modal('show');
                        },
                        error: function (data) {
                            msg_OpenDay("e", "Inconveniente en la operación");
                            $("#tbl_viaje button").removeAttr("disabled");
                        }
                    });
                    event.preventDefault();
                } else if ($(this).attr("name") === "anular") {
                    txh_idConfirm = 'ANULAR';
                    txh_viaje = $(this).parent().parent().find("td").eq(1).html();
                    txh_viaje = validaTableMobile(txh_viaje);
                    window.parent.fc_mostrar_confirmacion("¿Esta seguro de <strong>ELIMINAR</strong> el Convenio?");
                }
            });

            closeLoading();
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
            $("#btn_buscar").removeAttr("disabled");
            closeLoading();
        }
    });
}
function limpiar_viaje() {
    $("#errorViaje").html('');

    $("#pnl_viaje input[type=text]").val('');
    $("#pnl_viaje textarea").val('');
    $("#pnl_viaje select").val(null).change();
    $("#sel_piloto").val(0);
    $("#sel_copiloto").val(0);

    $("#pnl_viaje .validator-error").remove();
    txh_viaje = "";
}
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
$("#btn_nuevo").click(function () {
    limpiar_viaje();
    $("#div_fec_ini").show();
    $("#bodyDias").show();
    $('#pnl_viaje .modal-title').html('Registrar Viaje');
    $("#pnl_viaje").modal('show');

    //$("#sel_tipo").focus();
});
$("#btn_guardar").click(function (evt) {
    $("#pnl_viaje .validator-error").remove();
    if (val_required_FCP($("#sel_tour"), "tour") === false) return;
    if (val_required_FCP($("#sel_embarcacion"), "embarcación") === false) return;
    if (val_required_FCP($("#sel_piloto"), "poloto") === false) return;
    if (val_required_FCP($("#sel_copiloto"), "poloto") === false) return;
    if (val_required_FCP($("#txt_fec_ini"), "fecha inicio") === false) return;
    if (txh_viaje === "") {
        if (val_required_FCP($("#txt_fec_fin"), "fecha fin") === false) return;
    }
    if (val_required_FCP($("#txt_hor_ini"), "fecha fin") === false) return;
    if (val_required_FCP($("#txt_hor_fin"), "fecha fin") === false) return;

    openLoading();

    var ifecInicio = getDateFromFormat($("#txt_fec_ini").val() + ' ' + $("#txt_hor_ini").val(), 'yyyy-MM-dd HH:mm');
    var ifecFin = getDateFromFormat($("#txt_fec_fin").val() + ' ' + $("#txt_hor_fin").val(), 'yyyy-MM-dd HH:mm');

    if (txh_viaje === "") {
        ifecInicio = getDateFromFormat($("#txt_fec_ini").val() + ' ' + $("#txt_hor_ini").val(), 'yyyy-MM-dd HH:mm');
        ifecFin = getDateFromFormat($("#txt_fec_fin").val() + ' ' + $("#txt_hor_fin").val(), 'yyyy-MM-dd HH:mm');
    } else {
        ifecInicio = getDateFromFormat($("#txt_fec_ini").val() + ' ' + $("#txt_hor_ini").val(), 'yyyy-MM-dd HH:mm');
        ifecFin = getDateFromFormat($("#txt_fec_ini").val() + ' ' + $("#txt_hor_fin").val(), 'yyyy-MM-dd HH:mm');
    }

    //Obteniendo días de la semana 
    var ldias = "";

    $("#bodyDias .val-input-dinamic").each(function () {
        var input = $(this);
        if (input.is(':checked')) {
            ldias = ldias + input.val() + "," 
        }
    });
   
    var objE = {
        ID_ENCRIP: txh_viaje,
        id_tour: $("#sel_tour").val(),
        id_embarcacion: $("#sel_embarcacion").val(),
        piloto: $("#sel_piloto").val(),
        copiloto: $("#sel_copiloto").val(),
        nombre: $("#txt_nombre").val(),
        DESCRIPCION: $("#txt_descripcion").val(),
        observacion: $("#txt_observacion").val(),
        precio: $("#txt_precio_real").val(),
        descuento: $("#txt_descuento").val(),
        fecha_ini: ifecInicio,
        fecha_fin: ifecFin,
        dia_semana: ldias
    };
    
    $.ajax({
        type: "POST",
        url: "/Mantenimiento/ActualizarViaje",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ objE: objE }),
        async: true,
        beforeSend: function () {
            $("#btn_guardar").attr("disabled", true);
        },
        success: function (data) {
            if (!data.Activo) {
                msg_OpenDay("e", data.Mensaje);
                $("#btn_guardar").attr("disabled", false);
                closeLoading();
                return;
            }

            $("#pnl_viaje").modal('hide');
            $("#btn_guardar").attr("disabled", false);
            listar_viaje(false);
            msg_OpenDay("c", "Se guardó correctamente");
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
            $("#btn_guardar").attr("disabled", false);
            closeLoading();
        }
    });
});
