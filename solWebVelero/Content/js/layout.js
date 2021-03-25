$(document).ready(function () {
    //$.history.init(documentLoad);
    InfoSesion();
    //fc_listar_total_alertas();
    fc_listar_configuracion();
    closeLoading();
    $("#logoutModal").click(function () {
        $.ajax({
            type: "POST",
            url: "/Home/CerrarSesion",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (data, status) {
                window.location = data.Resultado;
            },
            error: function (data) { }
        });
    });
});

function InfoSesion() {
    $.ajax({
        type: "POST",
        url: "/Home/InfoSesion",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data, status) {
            if (!data.Activo) {
                alert(data.Mensaje);
                window.location = "Login";
                return;
            }
            $(".name_user").text(data.Resultado.Usuario);
            $(".img-user-rump").attr("src", "~/Content/img/usuario/" + data.Resultado.FOTO);
            $(".name_perfil").html('<i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400 name_perfil"></i>' + MaysPrimera(data.Resultado.Perfil));
            /************************MENU****************************/
            var htmlMenu = '';

            /************************MENU****************************/
            var htmlMenu = '';
            var id_padre_anterior = -1;

            for (var i = 0; i < data.Resultado.ListaMenu.length; i++) {
                //Lista de Menus Padre
                if (data.Resultado.ListaMenu[i].ID_PADRE === 0) {
                    //if (htmlMenu !== '') htmlMenu += '</ul></li>';
                    var icoMenu = "";

                    switch (data.Resultado.ListaMenu[i].DESCRIPCION) {
                        case "Mantenimiento": icoMenu = "icon-table"; break;
                        case "Operación": icoMenu = "icon-wrench"; break;
                        case "Consulta": icoMenu = "icon-wrench"; break;
                        case "Reporte": icoMenu = "icon-bar-chart"; break;
                        default: break;
                    }

                    htmlMenu += '<a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseMascot" aria-expanded="true" aria-controls="collapseMascot">';
                    htmlMenu += '   <i class="' + icoMenu + '"></i><span>' + data.Resultado.ListaMenu[i].DESCRIPCION + '</span>';
                    htmlMenu += '</a>';
                    htmlMenu += '<div id="collapseMascot" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">';
                    htmlMenu += '   <div class="bg-white py-2 collapse-inner rounded">';

                    for (var k = 0; k < data.Resultado.ListaMenu.length; k++) {
                        if (data.Resultado.ListaMenu[k].ID_PADRE === data.Resultado.ListaMenu[i].ID_MENU) {
                            htmlMenu += '<a class="collapse-item" href="/' + data.Resultado.ListaMenu[k].URL + '">' + data.Resultado.ListaMenu[k].DESCRIPCION + '</a>';
                        }
                    }

                    htmlMenu += '   </div>';
                    htmlMenu += '</div >';

                    htmlMenu += '</ul></li>';
                }
            }

            $(".menu-dinamic").html(htmlMenu);

            sessionStorage.clear();
            sessionStorage.setItem("ID", data.Resultado.ID);
            sessionStorage.setItem("NOMBRE", data.Resultado.NOMBRE);
            sessionStorage.setItem("APELLIDO", data.Resultado.APELLIDO);
            sessionStorage.setItem("SEXO", data.Resultado.SEXO);
            //sessionStorage.setItem("PERFIL_ID", data.Resultado.USUARIO_PERFIL.ID);

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
        url: "/Home/GetConfiguracion",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ cod_grupo: "" }),
        async: false,
        success: function (data) {
            if (!data.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.Mensaje));
                $("#pleaseWaitDialog").modal('hide');
                return;
            }
            /************************ Lista de Configuraciones ****************************/
            sessionStorage.clear();
            for (var j = 0; j < data.Resultado.ListaConfiguracion.length; j++) {
                sessionStorage.setItem(data.Resultado.ListaConfiguracion[j].COD_CONFIG, data.Resultado.ListaConfiguracion[j].VALOR);
                if (data.Resultado.ListaConfiguracion[j].COD_CONFIG = "LL") {
                    $("#imgLogo").attr("src", data.Resultado.ListaConfiguracion[j].VALOR);
                }
            }
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#pleaseWaitDialog").modal('hide');
        }
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
        url: "/Home/getDatosPersona",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ objE: objE }),
        async: true,
        success: function (data) {
            var datosPers = JSON.parse(data.Resultado);
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