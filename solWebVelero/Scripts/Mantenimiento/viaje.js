var txh_viaje;
var txh_idConfirm = "";
var valRND = Math.floor(Math.random() * 100);
/*Inicializar Script*/
$(function () {
    $(document).unbind("keydown");
    openLoading();

    $("#pnl_viaje").modal({ show: false, backdrop: 'static' });

    //Fecha actual
    var fullDate = new Date();
    var primerDia = new Date(fullDate.getFullYear(), fullDate.getMonth(), 1);
    var ultimoDia = new Date(fullDate.getFullYear(), fullDate.getMonth() + 1, 0);

    $("#bus_txt_fec_ini").val(formatDate(primerDia, "yyyy-MM-dd"));
    $("#bus_txt_fec_fin").val(formatDate(fullDate, "yyyy-MM-dd"));

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
                $('#sel_tour').append("<option value='" + data.Resultado[i].id_tour + "'>" + data.Resultado[i].nombre + "</option>");
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
    debugger;
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
                $('#' + nom_control).append("<option value='" + data.Resultado[i].id_tour + "'>" + data.Resultado[i].NOMBRES + ' ' + data.Resultado[i].APELLIDOS + "</option>");
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
    listar_empleado("001", "sel_piloto");
    listar_empleado("002", "sel_copiloto");
    listar_viaje(false);
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
                html += '<td>' + formatDate(parseDateServer(data.Resultado[i].fecha_ini), "hh:mm") + '</td>';
                html += '<td>' + formatDate(parseDateServer(data.Resultado[i].fecha_fin), "hh:mm") + '</td>';
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
                            $("#sel_tour").val(data.Resultado.id_tour);
                            $("#sel_piloto").val(data.Resultado.piloto);
                            $("#sel_copiloto").val(data.Resultado.copiloto);
                            $("#txt_nombre").val(data.Resultado.nombre);
                            
                            $("#txt_num_asiento").val(data.Resultado.num_asiento);
                            $("#sel_color").val(data.Resultado.color);
                            $("#txt_nave").val(data.Resultado.id_nave);
                            $("#txt_cod_inter").val(data.Resultado.cod_inter_llam);
                            $("#txt_num_omi").val(data.Resultado.num_omi);
                            $("#sel_ambito").val(data.Resultado.ambito);
                            $("#sel_tipo_nav").val(data.Resultado.tipo_nav);
                            $("#sel_tipo_serv").val(data.Resultado.tipo_serv);
                            $("#sel_constructora").val(data.Resultado.constructora);

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

    $("#pnl_viaje input").val('');
    $("#pnl_viaje textarea").val('');
    $("#pnl_viaje sel_cargo").val(0);

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
    $('#pnl_viaje .modal-title').html('Registrar Viaje');
    $("#pnl_viaje").modal('show');

    //$("#sel_tipo").focus();
});
$("#btn_guardar").click(function (evt) {
    $("#pnl_viaje .validator-error").remove();
    if (val_required_FCP($("#txt_nombre"), "nombre") === false) return;
    if (val_required_FCP($("#txt_num_asiento"), "Número de asientos") === false) return;

    openLoading();
    
    var objE = {
        ID_ENCRIP: txh_viaje,
        nombre: $("#txt_nombre").val(),
        tipo_combustible: $("#sel_tip_comb").val(),
        num_asiento: $("#txt_num_asiento").val(),
        color: $("#sel_color").val(),
        id_nave: $("#txt_nave").val(),
        cod_inter_llam: $("#txt_cod_inter").val(),
        num_omi: $("#txt_num_omi").val(),
        ambito: $("#sel_ambito").val(),
        tipo_nav: $("#sel_tipo_nav").val(),
        tipo_serv: $("#sel_tipo_serv").val(),
        constructora: $("#sel_constructora").val(),
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
            debugger;
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