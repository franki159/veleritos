var prov_id, dis_id;
var txh_empleado;
var txh_idConfirm = "";
var valRND = Math.floor(Math.random() * 100);
/*Inicializar Script*/
$(function () {
    $(document).unbind("keydown");
    $("#pnl_empleado").modal({ show: false, backdrop: 'static' });
    listar_inicio();
    $("#bus_txt_nombre").focus();
});
function aceptarConfirm() {
    switch (txh_idConfirm) {
        case "ANULAR":
            openLoading();

            var objE = {
                ID_ENCRIP: txh_empleado
            };

            $.ajax({
                type: "POST",
                url: "/Mantenimiento/AnularEmpleado",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ objE: objE }),
                async: true,
                beforeSend: function () {
                    $("#tbl_empleado button").attr("disabled", true);
                },
                success: function (data) {
                    $("#tbl_empleado button").removeAttr("disabled");

                    if (!data.Activo) {
                        msg_OpenDay("e", data.Mensaje)
                        closeLoading();
                        return;
                    }
                    
                    listar_empleado(false);
                    msg_OpenDay("c", "Se anuló correctamente");
                },
                error: function (data) {
                    msg_OpenDay("e", "Inconveniente en la operación");
                    $("#tbl_empleado button").removeAttr("disabled");
                    $("#pleaseWaitDialog").modal('hide');
                }
            });
            event.preventDefault();
            break;
        default:
            break;
    }
}
function listar_tipo_cargo() {
    $.ajax({
        type: "POST",
        url: "/Home/GetParametros",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ opcion: "TIP_CARGO" }),
        async: false,
        beforeSend: function () {
            openLoading();
        },
        success: function (data) {
            if (!data.Activo) {
                msg_OpenDay("e", data.Mensaje);
                closeLoading();
                return;
            }
            
            $('#bus_sel_cargo').append("<option value='0'>TODOS</option>");
            $('#sel_cargo').append("<option></option>");
            for (var i = 0; i < data.Resultado.length; i++) {
                $('#bus_sel_cargo').append("<option value='" + data.Resultado[i].CODIGO + "'>" + data.Resultado[i].DESCRIPCION + "</option>");
                $('#sel_cargo').append("<option value='" + data.Resultado[i].CODIGO + "'>" + data.Resultado[i].DESCRIPCION + "</option>");
            }
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
            closeLoading();
        }
    });
}
function listar_tipo_documento() {
    $.ajax({
        type: "POST",
        url: "/Home/GetParametros",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ opcion: "TIP_DOC" }),
        async: false,
        beforeSend: function () {
            openLoading();
        },
        success: function (data) {
            if (!data.Activo) {
                msg_OpenDay("e", data.Mensaje);
                closeLoading();
                return;
            }

            var html_body = "";
            for (var i = 0; i < data.Resultado.length; i++) {
                html_body += "<li class='list-group-item'>";
                html_body += "  <div class='input-group'>";
                html_body += "      <div class='input-group-prepend'>";
                html_body += "          <div class='input-group-text'>" + data.Resultado[i].DESCRIPCION + ":</div>";
                html_body += "      </div>";
                html_body += "      <input type='text' class='form-control val-input-dinamic'  cod-tipo-doc='" + data.Resultado[i].CODIGO + "' placeholder='Ingrese " + data.Resultado[i].DESCRIPCION + "'>";
                html_body += "  </div>";
                html_body += "</li>";

            }
            $("#bodyDocumentos").html(html_body);
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
            closeLoading();
        }
    });
}
function listar_inicio() {
    listar_tipo_cargo();
    listar_tipo_documento();
    closeLoading();
}
function listar_empleado(p_sync) {
    openLoading();
    var objE = {
        CARGO: $("#bus_sel_cargo").val(),
        NOMBRES: $("#bus_txt_nombre").val()
    };

    $.ajax({
        type: "POST",
        url: "/Mantenimiento/ListaEmpleados",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: objE
        }),
        async: p_sync,
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

            var htmlBotones = '<button name="editar" class="btn btn-primary btn-sm"><i class="fas fa-pencil-alt"></i></button> ' +
                '<button name="anular" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button> ';

            var html = '';
            for (var i = 0; i < data.Resultado.length; i++) {
                html += '<tr><td>' + htmlBotones + '</td>';
                html += '<td style="display:none">' + data.Resultado[i].ID_ENCRIP + '</td>';
                html += '<td>' + data.Resultado[i].NOMBRES + '</td>';
                html += '<td>' + data.Resultado[i].APELLIDOS + '</td>';
                html += '<td>' + data.Resultado[i].CARGO + '</td>';
                html += '<td>' + data.Resultado[i].SUELDO + '</td></tr>';
            }

            $("#tbl_empleado tbody").append(html);
            $("#lblTotalReg").html("Total registros: " + data.Resultado.length);

            $("#tbl_empleado button").click(function () {
                if ($(this).attr("name") === "editar") {
                    $('#pnl_empleado .modal-title').html('Editar Empleado');
                    limpiar_empleado();
                    txh_empleado = $(this).parent().parent().find("td").eq(1).html();
                    txh_empleado = validaTableMobile(txh_empleado);

                    objE = {
                        ID_ENCRIP: txh_empleado
                    };

                    $.ajax({
                        type: "POST",
                        url: "/Mantenimiento/ObtenerEmpleadoxId",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data: JSON.stringify({ objE: objE }),
                        async: true,
                        beforeSend: function () {
                            $("#errorEmpleado").html('');
                            $("#tbl_empleado button").attr("disabled", true);
                        },
                        success: function (data) {
                            $("#tbl_empleado button").removeAttr("disabled");

                            if (data.error) {
                                msg_OpenDay("e", data.Mensaje);
                                return;
                            }
                            $("#txt_nombre").val(data.Resultado.NOMBRES);
                            $("#txt_ape_pat").val(data.Resultado.APE_PAT);
                            $("#txt_ape_mat").val(data.Resultado.APE_MAT);
                            $("#sel_cargo").val(data.Resultado.CARGO);
                            $("#txt_sueldo").val(data.Resultado.SUELDO);

                            $("#bodyDocumentos .val-input-dinamic").each(function () {
                                for (var i = 0; i < data.Resultado.LDOCUMENTOS.length; i++) {
                                    var input = $(this);
                                    if (input.attr("cod-tipo-doc").trim() === data.Resultado.LDOCUMENTOS[i].TIPO_DOC) {
                                        input.val(data.Resultado.LDOCUMENTOS[i].NUMERO);
                                    }
                                }
                            });

                            $("#pnl_empleado").modal('show');
                        },
                        error: function (data) {
                            msg_OpenDay("e", "Inconveniente en la operación");
                            $("#tbl_empleado button").removeAttr("disabled");
                        }
                    });
                    event.preventDefault();
                } else if ($(this).attr("name") === "anular") {
                    txh_idConfirm = 'ANULAR';
                    txh_empleado = $(this).parent().parent().find("td").eq(1).html();
                    txh_empleado = validaTableMobile(txh_empleado);
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
function limpiar_empleado() {
    $("#errorEmpleado").html('');

    $("#pnl_empleado input").val('');
    $("#pnl_empleado textarea").val('');
    $("#sel_cargo").val(0);
    $("#pnl_empleado .validator-error").remove();
    prov_id = 0;
    dis_id = 0;
    txh_empleado = "";
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
    listar_empleado(true);
});
$("#btn_nuevo").click(function () {
    limpiar_empleado();
    $('#pnl_empleado .modal-title').html('Registrar Empleado');
    $("#pnl_empleado").modal('show');

    //$("#sel_tipo").focus();
});
$("#btn_guardar").click(function (evt) {
    $("#pnl_empleado .validator-error").remove();
    if (val_required_FCP($("#txt_nombre"), "nombre") === false) return;
    if (val_required_FCP($("#txt_ape_pat"), "apellido paterno") === false) return;
    if (val_required_FCP($("#txt_ape_mat"), "apellido materno") === false) return;

    openLoading();

    var ldocumentos = "";
    $("#bodyDocumentos .val-input-dinamic").each(function () {
        var input = $(this);
        var valor = input.val();
        if (validIdInput(valor) === false) {
            var codigo = input.attr("cod-tipo-doc");
            ldocumentos += codigo.trim() + "|" + valor.trim() + ",";
        }
    });

    if (ldocumentos.length > 0) {
        ldocumentos = ldocumentos.substring(0, ldocumentos.length - 1)
    }

    var objE = {
        ID_ENCRIP: txh_empleado,
        NOMBRES: $("#txt_nombre").val(),
        APE_PAT: $("#txt_ape_pat").val(),
        APE_MAT: $("#txt_ape_mat").val(),
        CARGO: $("#sel_cargo").val(),
        SUELDO: $("#txt_sueldo").val(),
        DOCUMENTO: ldocumentos
    };

    $.ajax({
        type: "POST",
        url: "/Mantenimiento/ActualizarEmpleado",
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

            $("#pnl_empleado").modal('hide');
            $("#btn_guardar").attr("disabled", false);
            listar_empleado(false);
            msg_OpenDay("c", "Se guardó correctamente");
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
            $("#btn_guardar").attr("disabled", false);
            closeLoading();
        }
    });
});