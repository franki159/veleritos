function fc_listar_tipo_documento() {
    //Lista Data Inicial
    var eParametro = {
        OPCION: 5
    };

    $.ajax({
        type: "POST",
        url: "page/mantenimiento/parametro.aspx/ListaParametroWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: eParametro
        }),
        async: true,
        beforeSend: function () {
            $('#sel_tipodocumento').empty();
            $("#pnl_busqueda :input").attr("disabled", true);
        },
        success: function (data, status) {
            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                return;
            }

            $('#sel_bus_grupo').append("<option value=''>TODOS</option>");
            $('#sel_grupo').append("<option value=''>Seleccione</option>");

            for (var i = 0; i < data.d.Resultado.length; i++) {
                $('#sel_bus_grupo').append("<option value='" + data.d.Resultado[i].COD_GRUPO + "'>" + data.d.Resultado[i].COD_GRUPO + "</option>");
                $('#sel_grupo').append("<option value='" + data.d.Resultado[i].COD_GRUPO + "'>" + data.d.Resultado[i].COD_GRUPO + "</option>");
            }

            $("#pnl_busqueda :input").removeAttr("disabled");
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
        }
    });
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

    fc_listar_tipo_documento();

    $(document).keyup(function (e) {
        if (e.keyCode === 13) {
            if ($(this).attr("id") === "pnl_busqueda") $("#btn_buscar").click();
            else $("#pnl_busqueda").focus();
        }
    });

    $("#btn_buscar").click(function () {
        fc_listar_parametro();
    });

});

function fc_listar_parametro() {

    var eParametro = {
        COD_GRUPO: $('#sel_bus_grupo').val(),
        DSC_PARAMETRO: $('#txt_bus_descripcion').val(),
        OPCION: 1
    };

    $.ajax({
        type: "POST",
        url: "page/mantenimiento/parametro.aspx/ListaParametroWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: eParametro
        }),
        async: true,
        beforeSend: function () {
            $("#btn_buscar").attr("disabled", true);
            $('#tbl_parametro tbody').empty();
        },
        success: function (data) {
            $("#btn_buscar").removeAttr("disabled");

            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                return;
            }

            var htmlBotones = '<button name="editar" class="btn btn-primary btn-xs"><i class="icon-pencil"></i></button> ' +
                '<button name="anular" class="btn btn-danger btn-xs"><i class="icon-trash "></i></button> ';

            var html = '';
            for (var i = 0; i < data.d.Resultado.length; i++) {
                html += '<tr><td class="cssIdCOD_PARAMETRO" style="display:none">' + data.d.Resultado[i].COD_PARAMETRO + '</td>';
                html += '<td>' + htmlBotones + '</td>';
                html += '<td class="cssIdCOD_GRUPO">' + data.d.Resultado[i].COD_GRUPO + '</td>';
                html += '<td class="cssDescripcion">' + data.d.Resultado[i].DSC_PARAMETRO + '</td></tr>';
            }

            $("#tbl_parametro tbody").append(html);
            $("#lblTotalReg").html("Total Registros: " + data.d.Resultado.length);

            $("#tbl_parametro button").click(function () {
                if ($(this).attr("name") === "editar") {
                    $('#pnl_parametro .modal-title').html('Editar Parametro');
                    $("#errorParametro").html('');

                    $("#sel_grupo").val($(this).parent().parent().children(".cssIdCOD_GRUPO").html());
                    $("#txh_idparametro").val($(this).parent().parent().children(".cssIdCOD_PARAMETRO").html());
                    $("#txt_descripcion").val($(this).parent().parent().children(".cssDescripcion").html());
                    
                    $("#pnl_parametro").modal('show');

                } else if ($(this).attr("name") === "anular") {
                    if (confirm("¿Esta seguro de anular parametro?")) {
                        var eParametro = {
                            COD_GRUPO: $(this).parent().parent().children(".cssIdCOD_GRUPO").html(),
                            COD_PARAMETRO: $(this).parent().parent().children(".cssIdCOD_PARAMETRO").html(),
                            DSC_PARAMETRO: $('#txt_descripcion').val(),
                            OPCION: 4
                        };

                        $.ajax({
                            type: "POST",
                            url: "page/mantenimiento/parametro.aspx/ActualizarParametroWM",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            data: JSON.stringify({ objE: eParametro }),
                            async: true,
                            beforeSend: function () {
                                $("#tbl_parametro button").attr("disabled", true);
                            },
                            success: function (data) {
                                $("#tbl_parametro button").removeAttr("disabled");

                                if (!data.d.Activo) {
                                    $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                                    return;
                                }

                                $("#errorDiv").html(GenerarAlertaSuccess("Se anuló correctamente."));
                                $("#btn_buscar").click();
                            },
                            error: function (data) {
                                $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
                                $("#tbl_parametro button").removeAttr("disabled");
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
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#btn_buscar").removeAttr("disabled");
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
                if ($("#pnl_parametro").css('display') === 'block') {
                    $("#btn_guardar").click();
                }
            }
            break;
    }
});

$("#btn_limpiar").click(function () {
    $("#errorDiv").html('');
    $("#pnl_busqueda input:text").val('');
    $("#pnl_busqueda select").val('0');
    $("#txt_descripcion").focus();
});

$("#btn_nuevo").click(function () {
    $("#errorParametro").html('');
    $('#pnl_parametro .modal-title').html('Registrar Parametro');
    $("#txh_idparametro").val('0');
    $("#pnl_parametro select").val('');
    $("#pnl_parametro input:text").val('');
    $("#pnl_parametro").modal('show');
});

$("#pnl_busqueda input:text").keyup(function (e) {
    if (e.keyCode === 13) {
        $("#btn_buscar").click();
    }
});

$("#btn_guardar").click(function () {
    $("#errorParametro").html('');

    if ($("#sel_grupo").val() === "") {
        $("#errorParametro").html(GenerarAlertaWarning("Grupo: seleccionar una opción"));
        $("#sel_grupo").focus();
        return;
    } else if ($("#txt_descripcion").val().trim() === "") {
        $("#errorParametro").html(GenerarAlertaWarning("Descripción: ingrese información"));
        $("#txt_nombre").focus();
        return;
    }

    var opcion = 0;
    if (validIdInput($("#txh_idparametro").val()))
        opcion = 2;
    else
        opcion = 3;
        
    var eParametro = {
        COD_GRUPO: $('#sel_grupo').val(),
        COD_PARAMETRO: $("#txh_idparametro").val(),
        DSC_PARAMETRO: $('#txt_descripcion').val(),
        OPCION: opcion
    };

    $.ajax({
        type: "POST",
        url: "page/mantenimiento/parametro.aspx/ActualizarParametroWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ objE: eParametro }),
        async: true,
        beforeSend: function () {
            $("#btn_guardar").attr("disabled", true);
        },
        success: function (data) {
            $("#btn_guardar").removeAttr("disabled");

            if (!data.d.Activo) {
                $("#errorParametro").html(GenerarAlertaError(data.d.Mensaje));
                return;
            }

            $("#errorDiv").html(GenerarAlertaSuccess(data.d.Mensaje));
            $("#pnl_parametro").modal('hide');
            $("#btn_buscar").click();
        },
        error: function (data) {
            $("#errorParametro").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#btn_guardar").removeAttr("disabled");
        }
    });
    event.preventDefault();
});