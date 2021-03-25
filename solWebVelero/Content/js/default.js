var _globalNotificacion;

function documentLoad() {
    var url = $(location).attr('href');

    if (url.indexOf("#!") !== -1) {
       
        var elem = url.split("#!/");
        var get = elem[elem.length - 1];
        
        get = get.split('?')[0];
        
        $(".wrapper").empty().html("Cargando...");

        $.get(get + '.aspx', function (data) {
            openLoading();
            $(".wrapper").html(data);

            if ($("#sidebar").css("position") === "absolute") $('#sidebar > ul').hide();

            $('body, html').animate({
                scrollTop: 0
            }, 1000);
        }).fail(function () {
            $(".wrapper").empty().html(GenerarAlertaWarning("No disponible."));
        });

    } else {
        $.get('page/inicio.aspx#', function (data) {
            $(".wrapper").html(data);

            $('body, html').animate({
                scrollTop: 0
            }, 1000);
        });
    }
}

$(document).ready(function () {
    $.history.init(documentLoad);
    InfoSesion();
    //fc_listar_total_alertas();
    fc_listar_configuracion();
    closeLoading();
    $("#logoutModal").click(function () {
        $.ajax({
            type: "POST",
            url: "default.aspx/CerrarSesionWM",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (data, status) {
                window.location = data.d.Resultado;
            },
            error: function (data) { }
        });
    });
});

function InfoSesion() {
    $.ajax({
        type: "POST",
        url: "default.aspx/InfoSesionWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data, status) {
            if (!data.d.Activo) {
                alert(data.d.Mensaje);
                window.location = "InicioSesion";
                return;
            }
            $(".name_user").text(data.d.Resultado.Usuario);
            $(".img-user-rump").attr("src", "img/usuario/" + data.d.Resultado.FOTO);
            $(".name_perfil").html('<i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400 name_perfil"></i>' + MaysPrimera(data.d.Resultado.Perfil));
            /************************MENU****************************/
            var htmlMenu = '';

            /************************MENU****************************/
            var htmlMenu = '';
            var id_padre_anterior = -1;

            for (var i = 0; i < data.d.Resultado.ListaMenu.length; i++) {
                //Lista de Menus Padre
                if (data.d.Resultado.ListaMenu[i].ID_PADRE === 0) {
                    //if (htmlMenu !== '') htmlMenu += '</ul></li>';
                    var icoMenu = "";

                    switch (data.d.Resultado.ListaMenu[i].DESCRIPCION) {
                        case "Mantenimiento": icoMenu = "icon-table"; break;
                        case "Operación": icoMenu = "icon-wrench"; break;
                        case "Consulta": icoMenu = "icon-wrench"; break;
                        case "Reporte": icoMenu = "icon-bar-chart"; break;
                        default: break;
                    }

                    htmlMenu += '<a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseMascot" aria-expanded="true" aria-controls="collapseMascot">';
                    htmlMenu += '   <i class="' + icoMenu + '"></i><span>' + data.d.Resultado.ListaMenu[i].DESCRIPCION + '</span>';
                    htmlMenu += '</a>';
                    htmlMenu += '<div id="collapseMascot" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">';
                    htmlMenu += '   <div class="bg-white py-2 collapse-inner rounded">';

                    for (var k = 0; k < data.d.Resultado.ListaMenu.length; k++) {
                        if (data.d.Resultado.ListaMenu[k].ID_PADRE === data.d.Resultado.ListaMenu[i].ID_MENU) {
                            htmlMenu += '<a class="collapse-item" href="#!/' + data.d.Resultado.ListaMenu[k].URL + '">' + data.d.Resultado.ListaMenu[k].DESCRIPCION + '</a>';
                        }
                    }

                    htmlMenu += '   </div>';
                    htmlMenu += '</div >';

                    htmlMenu += '</ul></li>';
                }
            }

            $(".menu-dinamic").html(htmlMenu);

            sessionStorage.clear();
            sessionStorage.setItem("ID", data.d.Resultado.ID);
            sessionStorage.setItem("NOMBRE", data.d.Resultado.NOMBRE);
            sessionStorage.setItem("APELLIDO", data.d.Resultado.APELLIDO);
            sessionStorage.setItem("SEXO", data.d.Resultado.SEXO);
            //sessionStorage.setItem("PERFIL_ID", data.d.Resultado.USUARIO_PERFIL.ID);
            
            closeLoading();
        },
        error: function (data) {
            closeLoading();
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
        async: false,
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
                if (data.d.Resultado.ListaConfiguracion[j].COD_CONFIG = "LL") {
                    $("#imgLogo").attr("src", data.d.Resultado.ListaConfiguracion[j].VALOR);
                }
            }
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#pleaseWaitDialog").modal('hide');
        }
    });
}

function EnviarNotificacion(btn) {
    var objE = {
        ID_ENCRIP: $(btn).attr('data-cod'),
        FECHA_INICIO: getDateFromFormat($(btn).attr('data-fec'), 'dd/MM/yyyy HH:mm:ss'),
        ESTADO: $(btn).attr('data-est')
    };

    $.ajax({
        type: "POST",
        url: "default.aspx/EventoNotificaWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ objE: objE }),
        async: true,
        beforeSend: function () {
            openLoading();
        },
        success: function (data) {
            if (!data.d.Activo) {
                alert(data.d.Mensaje);
                return;
            }
            closeLoading();
            $(btn).parent().parent().remove();
        },
        error: function (data) {
            closeLoading();
        }
    });
}

function InfoNotificacionAlmacen() {
    $.ajax({
        type: "POST",
        url: "default.aspx/InfoNotificacionAlmacen",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            if (data.d.error) {
                return;
            }

            $("#header_notification_bar ul").empty();
            $("#header_notification_bar a span").html("0");

            if (data.d.length > 0) {
                var htmlNotif = '';
                for (var i = 0; i < data.d.length; i++) {
                    htmlNotif += '<li><a href="#!/' + data.d[i].co_comprobante_pago.trim() + '-' + data.d[i].nid_documento.toString() + '#!/page/almacen/ordenalmacen">' +
                        '<span class="label label-warning">Pendiente</span>' + data.d[i].no_comprobante_pago + ' ' + data.d[i].nu_documento + '</a>';
                }

                $("#header_notification_bar a span").html(data.d.length.toString());
                $("#header_notification_bar ul").append(htmlNotif);

                $('#audio_fca')[0].play(); //Emite sonido de alerta
            }
        },
        error: function (data) { }
    });
}

function InfoNotificacionUsuario() {
    $.ajax({
        type: "POST",
        url: "default.aspx/InfoNotificacionVenta",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            if (data.d.error) {
                return;
            }

            $("#header_notification_bar ul").empty();

            var htmlNotif = '<div class="notify-arrow notify-arrow-yellow"></div><li><p class="yellow">Usted tiene ' + data.d.length.toString() + ' notificacion(es)</p></li>';

            for (var i = 0; i < data.d.length; i++) {
                htmlMenu += '<li><a href="#!/page/almacen/almacen#!/' + data.d[i].no_comprobante_pago + '-' + data.d[i].nid_documento.toString() + '">' +
                    '<span class="label label-warning">Pendiente</span>' + data.d[i].no_comprobante_pago + ' ' + data.d[i].nu_documento + '</a>';
            }

            $("#header_notification_bar a span").html(data.d.length.toString());
            $("#header_notification_bar ul").append(htmlMenu);
        },
        error: function (data) { }
    });
}

function fc_mostrar_confirmacion(contenido) {
    $("#txtContenido").html(contenido);
    $("#modalConfirm").modal('show');
}

function fc_aceptar_confirmacion() {
    if (aceptarConfirm() !== false) {
        $("#modalConfirm").modal('hide');
    }    
}
function fc_consulta_persona(num_doc) {
    var objE = {
        NUM_DOC: num_doc
    };

    $.ajax({
        type: "POST",
        url: "default.aspx/getDatosPersona",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ objE: objE }),
        async: true,
        success: function (data) {
            var datosPers = JSON.parse(data.d.Resultado);
            return datosPers;
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#pleaseWaitDialog").modal('hide');
        }
    });
}

function openNav() {
    $("#accordionSidebar").css("width", "350px");
    $(".backdrop-fcp").css("display", "block");
}

function closeNav() {
    $("#accordionSidebar").css("width", "0px");
    $(".backdrop-fcp").css("display", "none");
}

function openLoading() {
    $("#page-loader").show();
}

function closeLoading() {
    $("#page-loader").hide();
}