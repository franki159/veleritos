/*Inicializar Script*/
$(function () {
    $(document).unbind("keydown");

    $('.dtOp').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        orientation: "top left"
    });

    fc_listar_menu();

    $(document).keyup(function (e) {
        if (e.keyCode === 13) {
            if ($(this).attr("id") === "pnl_busqueda") $("#btn_buscar").click();
            else $("#pnl_busqueda").focus();
        }
    });

    $("#btn_buscar").click(function () {
        fc_listar_perfil();
    });

});
/*Funciones*/
function fc_listar_menu() {
    $.ajax({
        type: "POST",
        url: "default.aspx/InfoSesionWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data, status) {
            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                return;
            }
            /************************MENU****************************/
            var htmlMenu = '';
            var id_padre_anterior = -1;

            for (var i = 0; i < data.d.Resultado.ListaMenu.length; i++) {
                //Lista de Menus Padre
                if (data.d.Resultado.ListaMenu[i].ID_PADRE === 0) {
                    htmlMenu += "<div class='checkbox'>";
                    htmlMenu += "    <label> <input class='treeviewCheckbok' type='checkbox' value='" + data.d.Resultado.ListaMenu[i].ID_MENU + "'><b>" + data.d.Resultado.ListaMenu[i].DESCRIPCION + "<b></label>";
                    
                    for (var k = 0; k < data.d.Resultado.ListaMenu.length; k++) {
                        if (data.d.Resultado.ListaMenu[k].ID_PADRE === data.d.Resultado.ListaMenu[i].ID_MENU) {
                            htmlMenu += "<div class='checkbox' style='margin-left: 15px;'>";
                            htmlMenu += "    <label> <input type='checkbox' value='" + data.d.Resultado.ListaMenu[k].ID_MENU + "'>" + data.d.Resultado.ListaMenu[k].DESCRIPCION + "</label>";
                            htmlMenu += "</div >";
                        }
                    }

                    htmlMenu += "</input></div >";
                }
            }

            $('#bodyOpciones').html(htmlMenu);
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
        }
    });
}
function fc_listar_perfil() {
    var eperfil = {
        DESCRIPCION: $('#txt_bus_descripcion').val(),
        OPCION: 1
    };

    $.ajax({
        type: "POST",
        url: "page/mantenimiento/perfil.aspx/ListaPerfilWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: eperfil
        }),
        async: true,
        beforeSend: function () {
            $("#btn_buscar").attr("disabled", true);
            $('#tbl_perfil tbody').empty();
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
                html += '<tr><td class="cssIdCOD_perfil" style="display:none">' + data.d.Resultado[i].ID_PERFIL + '</td>';
                html += '<td>' + htmlBotones + '</td>';
                html += '<td class="cssIdCOD_GRUPO"  style="display:none">' + data.d.Resultado[i].MENU + '</td>';
                html += '<td class="cssDescripcion">' + data.d.Resultado[i].DESCRIPCION + '</td></tr>';
            }

            $("#tbl_perfil tbody").append(html);
            $("#lblTotalReg").html("Total Registros: " + data.d.Resultado.length);

            $("#tbl_perfil button").click(function () {
                if ($(this).attr("name") === "editar") {
                    $('#pnl_perfil .modal-title').html('Editar Perfil');
                    $("#errorperfil").html('');
                    limpiarMenu();

                    $("#txh_idperfil").val($(this).parent().parent().children(".cssIdCOD_perfil").html());
                    $("#txt_descripcion").val($(this).parent().parent().children(".cssDescripcion").html());
                    //Seleccionar Menus
                    var lista_detalles = $(this).parent().parent().children(".cssIdCOD_GRUPO").html().split(",");

                    $("#bodyOpciones input:checkbox").each(function () {
                        for (i = 0; i < lista_detalles.length; i++) {
                            if ($(this).val() === lista_detalles[i]) {
                                $(this).prop('checked', true);
                            }
                        }
                    });
                    
                    
                    $("#pnl_perfil").modal('show');

                } else if ($(this).attr("name") === "anular") {
                    if (confirm("¿Esta seguro de anular perfil?")) {
                        var eperfil = {
                            ID_PERFIL: $(this).parent().parent().children(".cssIdCOD_perfil").html(),
                            OPCION: 4
                        };

                        $.ajax({
                            type: "POST",
                            url: "page/mantenimiento/perfil.aspx/ActualizarPerfilWM",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            data: JSON.stringify({ objE: eperfil }),
                            async: true,
                            beforeSend: function () {
                                $("#tbl_perfil button").attr("disabled", true);
                            },
                            success: function (data) {
                                $("#tbl_perfil button").removeAttr("disabled");

                                if (!data.d.Activo) {
                                    $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                                    return;
                                }

                                $("#errorDiv").html(GenerarAlertaSuccess("Se anuló correctamente."));
                                $("#btn_buscar").click();
                            },
                            error: function (data) {
                                $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
                                $("#tbl_perfil button").removeAttr("disabled");
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
function limpiarMenu() {
    $("#bodyOpciones input:checkbox").each(function () {
        $(this).prop('checked', false);
    });
}
/*Eventos Teclado*/
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
                if ($("#pnl_perfil").css('display') === 'block') {
                    $("#btn_guardar").click();
                }
            }
            break;
    }
});
/*Eventos por Control*/
$("#btn_limpiar").click(function () {
    $("#errorDiv").html('');
    $("#pnl_busqueda input:text").val('');
    $("#pnl_busqueda select").val('0');
    $("#txt_descripcion").focus();
});
$("#btn_nuevo").click(function () {
    limpiarMenu();
    $("#errorperfil").html('');
    $('#pnl_perfil .modal-title').html('Registrar perfil');
    $("#txh_idperfil").val('0');
    $("#pnl_perfil select").val('');
    $("#pnl_perfil input:text").val('');
    $("#pnl_perfil").modal('show');
});
$("#pnl_busqueda input:text").keyup(function (e) {
    if (e.keyCode === 13) {
        $("#btn_buscar").click();
    }
});
$("#btn_guardar").click(function () {
    $("#errorperfil").html('');

    if ($("#txt_descripcion").val().trim() === "") {
        $("#errorperfil").html(GenerarAlertaWarning("Descripción: ingrese información"));
        $("#txt_nombre").focus();
        return;
    }

    //Menu Opciones
    var strCaract = "";
    $("#bodyOpciones input:checkbox:checked").each(function () {
        strCaract += $(this).val() + ",";
    });
    if (strCaract.length > 0)
        strCaract = strCaract.substr(0, strCaract.length - 1);

    var opcion = 0;
    if (validIdInput($("#txh_idperfil").val()))
        opcion = 2;
    else
        opcion = 3;
        
    var eperfil = {
        MENU: strCaract,
        ID_PERFIL: $("#txh_idperfil").val(),
        DESCRIPCION: $('#txt_descripcion').val(),
        OPCION: opcion
    };

    $.ajax({
        type: "POST",
        url: "page/mantenimiento/perfil.aspx/ActualizarperfilWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ objE: eperfil }),
        async: true,
        beforeSend: function () {
            $("#btn_guardar").attr("disabled", true);
        },
        success: function (data) {
            $("#btn_guardar").removeAttr("disabled");

            if (!data.d.Activo) {
                $("#errorperfil").html(GenerarAlertaError(data.d.Mensaje));
                return;
            }

            $("#errorDiv").html(GenerarAlertaSuccess(data.d.Mensaje));
            $("#pnl_perfil").modal('hide');
            $("#btn_buscar").click();
        },
        error: function (data) {
            $("#errorperfil").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#btn_guardar").removeAttr("disabled");
        }
    });
    event.preventDefault();
});
$(document).on('change', '.treeviewCheckbok', function () {
    debugger;
    var valoSel = false;
    if (this.checked) {
        valoSel = true;
    }

    $(".treeviewCheckbok input:checkbox").each(function () {
        $(this).prop('checked', valoSel);
    });
});