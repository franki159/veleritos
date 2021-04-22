var txh_tour;
var txh_idConfirm = "";
var valRND = Math.floor(Math.random() * 100);
/*Inicializar Script*/
$(function () {
    $(document).unbind("keydown");
    $("#pnl_tour").modal({ show: false, backdrop: 'static' });
    listar_inicio();
    $("#bus_txt_nombre").focus();
});
function aceptarConfirm() {
    switch (txh_idConfirm) {
        case "ANULAR":
            openLoading();

            var objE = {
                ID_ENCRIP: txh_tour
            };

            $.ajax({
                type: "POST",
                url: "/Mantenimiento/AnularTour",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ objE: objE }),
                async: true,
                beforeSend: function () {
                    $("#tbl_tour button").attr("disabled", true);
                },
                success: function (data) {
                    $("#tbl_tour button").removeAttr("disabled");

                    if (!data.Activo) {
                        msg_OpenDay("e", data.Mensaje)
                        closeLoading();
                        return;
                    }
                    
                    listar_tour(false);
                    msg_OpenDay("c", "Se anuló correctamente");
                },
                error: function (data) {
                    msg_OpenDay("e", "Inconveniente en la operación");
                    $("#tbl_tour button").removeAttr("disabled");
                    $("#pleaseWaitDialog").modal('hide');
                }
            });
            event.preventDefault();
            break;
        default:
            break;
    }
}

function listar_caracteristicas() {
    $.ajax({
        type: "POST",
        url: "/Home/GetParametros",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ opcion: "CARAC_TOUR" }),
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
                html_body += "<div class='checkbox'>";
                html_body += "    <label> <input type='checkbox' value='" + data.Resultado[i].CODIGO + "'>&nbsp;" + data.Resultado[i].DESCRIPCION + "</label>";
                html_body += "</div>";
            }

            $("#bodyCaracteristicas").html(html_body);
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
            closeLoading();
        }
    });
}
function listar_inicio() {
    listar_caracteristicas();
    closeLoading();
}
function listar_tour(p_sync) {
    openLoading();
    var objE = {
        nombre: $("#bus_txt_nombre").val()
    };
    
    $.ajax({
        type: "POST",
        url: "/Mantenimiento/ListaTour",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: objE
        }),
        async: p_sync,
        beforeSend: function () {
            $("#btn_buscar").attr("disabled", true);
            $('#tbl_tour tbody').empty();
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
                html += '<td>' + data.Resultado[i].precio + '</td>';
                html += '<td>' + data.Resultado[i].DESCRIPCION + '</td>';
                html += '<td>' + data.Resultado[i].condicion + '</td>';
                html += '<td>' + data.Resultado[i].detalle + '</td></tr>';
            }

            $("#tbl_tour tbody").append(html);
            $("#lblTotalReg").html("Total registros: " + data.Resultado.length);

            $("#tbl_tour button").click(function () {
                if ($(this).attr("name") === "editar") {
                    $('#pnl_tour .modal-title').html('Editar Tour');
                    limpiar_tour();
                    txh_tour = $(this).parent().parent().find("td").eq(1).html();
                    txh_tour = validaTableMobile(txh_tour);

                    objE = {
                        ID_ENCRIP: txh_tour
                    };

                    $.ajax({
                        type: "POST",
                        url: "/Mantenimiento/ObtenerTourxId",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data: JSON.stringify({ objE: objE }),
                        async: true,
                        beforeSend: function () {
                            $("#errorTour").html('');
                            $("#tbl_tour button").attr("disabled", true);
                        },
                        success: function (data) {
                            $("#tbl_tour button").removeAttr("disabled");

                            if (data.error) {
                                msg_OpenDay("e", data.Mensaje);
                                return;
                            }
                            $("#txt_nombre").val(data.Resultado.nombre);
                            $("#txt_descripcion").val(data.Resultado.DESCRIPCION);
                            $("#txt_detalle").val(data.Resultado.detalle);
                            $("#txt_condicion").val(data.Resultado.condicion);
                            $("#txt_precio").val(data.Resultado.precio);
                            //CARACTERISTICAS
                            var lista_detalles = data.Resultado.caracteristicas.split("|");

                            $("#bodyCaracteristicas input:checkbox").each(function () {
                                for (i = 0; i < lista_detalles.length; i++) {
                                    if ($(this).val() === lista_detalles[i]) {
                                        $(this).prop('checked', true);
                                    }
                                }
                            });
                            //Fotos de TOUR
                            for (var masc = 0; masc < data.Resultado.listFoto.length; masc++) {
                                if (masc === 0) {
                                    $('.imagePreview').css("background-image", "url(../../Content/img/tour/" + data.Resultado.listFoto[0].ruta + "?v=" + valRND + ")");
                                    $('.imagePreview').attr('img-fcp-url', data.Resultado.listFoto[0].ruta);
                                    $('.imagePreview').attr('id', 'imgGal_' + + data.Resultado.listFoto[0].id_tour);
                                } else {
                                    $(".container-file").closest(".row").find('.imgAdd').before('<div class="col-sm-2 imgUp imgSecond"><div class="imagePreview" id="imgGal_' + data.Resultado.listFoto[masc].id_tour + '"></div><label class="btn btn-primary btn-upload">Subir<input type="file" class="uploadFile img" value="Upload Photo" style="width:0px;height:0px;overflow:hidden;"></label><i class="fa fa-times del"></i></div>');
                                    $("#imgGal_" + data.Resultado.listFoto[masc].id_tour).css("background-image", "url(img/mascota/" + data.Resultado.listFoto[masc].ruta + "?v=" + valRND + ")");
                                    $("#imgGal_" + data.Resultado.listFoto[masc].id_tour).attr('img-fcp-url', data.Resultado.listFoto[masc].ruta);
                                }
                            }
                            $("#pnl_tour").modal('show');
                        },
                        error: function (data) {
                            msg_OpenDay("e", "Inconveniente en la operación");
                            $("#tbl_tour button").removeAttr("disabled");
                        }
                    });
                    event.preventDefault();
                } else if ($(this).attr("name") === "anular") {
                    txh_idConfirm = 'ANULAR';
                    txh_tour = $(this).parent().parent().find("td").eq(1).html();
                    txh_tour = validaTableMobile(txh_tour);
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
function limpiar_tour() {
    $("#errorTour").html('');

    $("#txt_nombre").val('');
    $("#txt_precio").val('');
    $("#pnl_tour textarea").val('');
    $("#bodyCaracteristicas input:checkbox").each(function () {
        $(this).prop('checked', false);
    });

    //Limpiando imagenes
    $(".container-file").find($(".imgSecond")).each(function () {
        $(this).remove();
    });

    $(".container-file .imagePreview").removeAttr("id");
    $(".container-file .imagePreview").removeAttr("img-fcp-url");

    $(".container-file").find($(".imagePreview")).css("background-image", "url(../../img/noPets.png)");

    $("#pnl_tour .validator-error").remove();
    activaTab('dato');
    txh_tour = "";
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
    listar_tour(true);
});
$("#btn_nuevo").click(function () {
    limpiar_tour();
    $('#pnl_tour .modal-title').html('Registrar Tour');
    $("#pnl_tour").modal('show');

    //$("#sel_tipo").focus();
});
$("#btn_guardar").click(function (evt) {
    $("#pnl_tour .validator-error").remove();
    if (val_required_FCP($("#txt_nombre"), "nombre") === false) {
        activaTab('dato');
        return;
    } 

    openLoading();
    var strCaract = "";
    $("#bodyCaracteristicas input:checkbox:checked").each(function () {
        strCaract += $(this).val() + "|";
    });
    if (strCaract.length > 0)
        strCaract = strCaract.substr(0, strCaract.length - 1);
    
    var objE = {
        ID_ENCRIP: txh_tour,
        nombre: $("#txt_nombre").val(),
        DESCRIPCION: $("#txt_descripcion").val(),
        detalle: $("#txt_detalle").val(),
        condicion: $("#txt_condicion").val(),
        caracteristicas: strCaract,
        precio: $("#txt_precio").val(),
    };

    $.ajax({
        type: "POST",
        url: "/Mantenimiento/ActualizarTour",
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

            valRND = Math.floor(Math.random() * 1000);

            if (txh_tour === "") {//Solo para nuevos
                //Guardando todas las imagenes BD
                var error_img = 0;
                $(".container-file").find($("input")).each(function () {
                    if ($(this).get(0).files.length !== 0) {
                        var imgTemp = $(this)[0].files[0];

                        objE = {
                            ID_ENCRIP: data.Resultado,
                            ruta: getExtension(imgTemp.name),
                            id_foto_tour: 0
                        };

                        $.ajax({
                            type: "POST",
                            url: "/Mantenimiento/InsertarFotoTour", 
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            data: JSON.stringify({ objE: objE }),
                            async: false,
                            success: function (dataImg) {
                                if (!dataImg.Activo) {
                                    msg_OpenDay("e", dataImg.Mensaje);
                                    closeLoading();
                                    return;
                                }

                                error_img += guardarImagen(evt, dataImg.Resultado, imgTemp);
                            },
                            error: function (data) {
                                msg_OpenDay("e", "Inconveniente en la operación");
                                closeLoading();
                            }
                        });

                        evt.preventDefault();
                    }
                });

                if (error_img > 0) {
                    $("#pnl_tour").modal('hide');
                    $("#btn_guardar").attr("disabled", false);
                    closeLoading();
                    msg_OpenDay("e", "Error al guardar imagen");
                } else {
                    $("#pnl_tour").modal('hide');
                    $("#btn_guardar").attr("disabled", false);
                    listar_tour(false);
                    msg_OpenDay("c", "Se guardó correctamente");
                }
            } else if (txh_tour !== "") {//Modificar
                //Guardando todas las imagenes BD
                error_img = 0;
                var inxImg = 0;
                //Las imagenes cambiadas (solo actualiza las imagenes en el servidor no BD)
                $(".container-file").find($("input")).each(function () {
                    if ($(this).get(0).files.length !== 0) {
                        if ($(this).parent().parent().children(0)[0].id !== "") {//Solo los que tiene id
                            var imgTemp = $(this)[0].files[0];
                            var nameAct = $(this).parent().parent().children(0).attr("img-fcp-url");
                            var gal_id = $(this).parent().parent().children(0)[0].id.split("_")[1];
                            //Actualizando el nombre en la base de datos
                            obE = {
                                ID_ENCRIP: txh_tour,
                                ruta: getExtension(imgTemp.name),
                                id_foto_tour: gal_id,
                                orden: inxImg
                            };

                            $.ajax({
                                type: "POST",
                                url: "/Mantenimiento/ActualizarFotoTour",
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                data: JSON.stringify({ objE: objE }),
                                async: false,
                                success: function (dataImg) {
                                    if (!dataImg.Activo) {
                                        msg_OpenDay("e", dataImg.Mensaje);
                                        closeLoading();
                                        return;
                                    }

                                    error_img += guardarImagen(evt, dataImg.Resultado, imgTemp);
                                },
                                error: function (data) {
                                    msg_OpenDay("e", "Inconveniente en la operación");
                                    closeLoading();
                                }
                            });

                            evt.preventDefault();
                        }
                    }
                    inxImg++;
                });
                //Si agrego mas imagenes (los que no tienen id, insertan en la bd)
                $(".container-file").find($("input")).each(function () {
                    if ($(this).get(0).files.length !== 0) {
                        if ($(this).parent().parent().children(0)[0].id === "") {//Solo los que no tiene id
                            var imgTemp = $(this)[0].files[0];
                            objE = {
                                ID_ENCRIP: txh_tour,
                                ruta: getExtension(imgTemp.name),
                                id_foto_tour: 0
                            };

                            $.ajax({
                                type: "POST",
                                url: "/Mantenimiento/InsertarFotoTour",
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                data: JSON.stringify({ objE: objE }),
                                async: false,
                                success: function (dataImg) {
                                    if (!dataImg.Activo) {
                                        msg_OpenDay("e", dataImg.Mensaje);
                                        closeLoading();
                                        error_img++;
                                        return;
                                    }

                                    error_img += guardarImagen(evt, dataImg.Resultado, imgTemp);
                                },
                                error: function (data) {
                                    msg_OpenDay("e", "Inconveniente en la operación");
                                    closeLoading();
                                }
                            });
                        }
                    }
                });

                if (error_img > 0) {
                    $("#pnl_tour").modal('hide');
                    $("#btn_guardar").attr("disabled", false);
                    msg_OpenDay("e", "Error al guardar imagen");
                } else {
                    $("#pnl_tour").modal('hide');
                    $("#btn_guardar").attr("disabled", false);
                    listar_tour(false);
                    msg_OpenDay("c", "Se guardó correctamente");
                }
            }
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
            $("#btn_guardar").attr("disabled", false);
            closeLoading();
        }
    });
});
function guardarImagen(evt, nameId, file) {
    var objResp = 0;
    var dataImagen = new FormData();
    dataImagen.append('file', file);
    dataImagen.append('name', nameId);
    dataImagen.append('carpeta', "~/Content/img/tour/");
   
    $.ajax({
        type: "POST",
        url: "/Controllers/Generico/hh_imageServ.ashx",
        data: dataImagen,
        async: false,
        contentType: false,
        processData: false,
        success: function (data) {
            objResp = 0;
        },
        error: function (err) {
            objResp = 1;
        }
    });

    return objResp;
}