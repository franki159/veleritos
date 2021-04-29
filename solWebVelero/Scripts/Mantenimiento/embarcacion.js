var prov_id, dis_id;
var txh_embarcacion;
var txh_idConfirm = "";
var valRND = Math.floor(Math.random() * 100);
/*Inicializar Script*/
$(function () {
    $(document).unbind("keydown");
    $("#pnl_embarcacion").modal({ show: false, backdrop: 'static' });
    listar_inicio();
    $("#bus_txt_nombre").focus();
});
function aceptarConfirm() {
    switch (txh_idConfirm) {
        case "ANULAR":
            openLoading();

            var objE = {
                ID_ENCRIP: txh_embarcacion
            };

            $.ajax({
                type: "POST",
                url: "/Mantenimiento/AnularEmbarcacion",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ objE: objE }),
                async: true,
                beforeSend: function () {
                    $("#tbl_embarcacion button").attr("disabled", true);
                },
                success: function (data) {
                    $("#tbl_embarcacion button").removeAttr("disabled");

                    if (!data.Activo) {
                        msg_OpenDay("e", data.Mensaje)
                        closeLoading();
                        return;
                    }
                    
                    listar_embarcacion(false);
                    msg_OpenDay("c", "Se anuló correctamente");
                },
                error: function (data) {
                    msg_OpenDay("e", "Inconveniente en la operación");
                    $("#tbl_embarcacion button").removeAttr("disabled");
                    $("#pleaseWaitDialog").modal('hide');
                }
            });
            event.preventDefault();
            break;
        default:
            break;
    }
}

function listar_inicio() {
    listar_parametros_select("#sel_tip_comb", "TIP_COMBUS", false);
    listar_parametros_select("#sel_color", "COL_EMB", false);
    listar_parametros_select("#sel_ambito", "AMBITO", false);
    listar_parametros_select("#sel_tipo_nav", "TIP_NAV", false);
    listar_parametros_select("#sel_tipo_serv", "TIP_SERV", false);
    listar_parametros_select("#sel_constructora", "CONSTRUCTORA", false);
    closeLoading();
}
function listar_embarcacion(p_sync) {
    openLoading();
    var objE = {
        nombre: $("#bus_txt_nombre").val()
    };

    $.ajax({
        type: "POST",
        url: "/Mantenimiento/ListaEmbarcacion",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: objE
        }),
        async: p_sync,
        beforeSend: function () {
            $("#btn_buscar").attr("disabled", true);
            $('#tbl_embarcacion tbody').empty();
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
                html += '<td>' + data.Resultado[i].tipo_combustible + '</td>';
                html += '<td>' + data.Resultado[i].num_asiento + '</td>';
                html += '<td>' + data.Resultado[i].color + '</td></tr>';
            }

            $("#tbl_embarcacion tbody").append(html);
            $("#lblTotalReg").html("Total registros: " + data.Resultado.length);

            $("#tbl_embarcacion button").click(function () {
                if ($(this).attr("name") === "editar") {
                    $('#pnl_embarcacion .modal-title').html('Editar Embarcacion');
                    limpiar_embarcacion();
                    txh_embarcacion = $(this).parent().parent().find("td").eq(1).html();
                    txh_embarcacion = validaTableMobile(txh_embarcacion);

                    objE = {
                        ID_ENCRIP: txh_embarcacion
                    };

                    $.ajax({
                        type: "POST",
                        url: "/Mantenimiento/ObtenerEmbarcacionxId",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data: JSON.stringify({ objE: objE }),
                        async: true,
                        beforeSend: function () {
                            $("#errorEmbarcacion").html('');
                            $("#tbl_embarcacion button").attr("disabled", true);
                        },
                        success: function (data) {
                            $("#tbl_embarcacion button").removeAttr("disabled");

                            if (data.error) {
                                msg_OpenDay("e", data.Mensaje);
                                return;
                            }
                            $("#txt_nombre").val(data.Resultado.nombre);
                            $("#sel_tip_comb").val(data.Resultado.tipo_combustible);
                            $("#txt_num_asiento").val(data.Resultado.num_asiento);
                            $("#sel_color").val(data.Resultado.color);
                            $("#txt_nave").val(data.Resultado.id_nave);
                            $("#txt_cod_inter").val(data.Resultado.cod_inter_llam);
                            $("#txt_num_omi").val(data.Resultado.num_omi);
                            $("#sel_ambito").val(data.Resultado.ambito);
                            $("#sel_tipo_nav").val(data.Resultado.tipo_nav);
                            $("#sel_tipo_serv").val(data.Resultado.tipo_serv);
                            $("#sel_constructora").val(data.Resultado.constructora);
                            $("#txt_distribucion").val(data.Resultado.distribucion);
                            $("#divDistribucion").html($("#txt_distribucion").val());

                            $("#pnl_embarcacion").modal('show');
                        },
                        error: function (data) {
                            msg_OpenDay("e", "Inconveniente en la operación");
                            $("#tbl_embarcacion button").removeAttr("disabled");
                        }
                    });
                    event.preventDefault();
                } else if ($(this).attr("name") === "anular") {
                    txh_idConfirm = 'ANULAR';
                    txh_embarcacion = $(this).parent().parent().find("td").eq(1).html();
                    txh_embarcacion = validaTableMobile(txh_embarcacion);
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
function limpiar_embarcacion() {
    $("#errorEmbarcacion").html('');

    $("#pnl_embarcacion input").val('');
    $("#pnl_embarcacion textarea").val('');
    $("#pnl_embarcacion sel_cargo").val(0);
    $("#divDistribucion").html("");

    $("#pnl_embarcacion .validator-error").remove();
    txh_embarcacion = "";
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
    listar_embarcacion(true);
});
$("#btn_nuevo").click(function () {
    limpiar_embarcacion();
    $('#pnl_embarcacion .modal-title').html('Registrar Embarcacion');
    $("#pnl_embarcacion").modal('show');

    //$("#sel_tipo").focus();
});
$("#btn_guardar").click(function (evt) {
    $("#pnl_embarcacion .validator-error").remove();
    if (val_required_FCP($("#txt_nombre"), "nombre") === false) return;
    if (val_required_FCP($("#txt_num_asiento"), "Número de asientos") === false) return;

    openLoading();
    
    var objE = {
        ID_ENCRIP: txh_embarcacion,
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
        distribucion: $("#txt_distribucion").val()
    };

    $.ajax({
        type: "POST",
        url: "/Mantenimiento/ActualizarEmbarcacion",
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

            $("#pnl_embarcacion").modal('hide');
            $("#btn_guardar").attr("disabled", false);
            listar_embarcacion(false);
            msg_OpenDay("c", "Se guardó correctamente");
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
            $("#btn_guardar").attr("disabled", false);
            closeLoading();
        }
    });
});
$("#txt_distribucion").on('keyup', function (evt) {
    $("#divDistribucion").html($("#txt_distribucion").val());
});
