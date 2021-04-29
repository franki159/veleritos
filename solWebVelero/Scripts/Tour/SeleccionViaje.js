var txh_tour;
var txh_idConfirm = "";
var valRND = Math.floor(Math.random() * 100);
var arrayViaje_activ = [];
var objTour_activ = {};
/*Inicializar Script*/
$(function () {
    if (toURLParam("fromTourId") === null) {
        msg_OpenDay("e", "No se ha seleccionado ningún Tour");
        return false;
    }

    $(document).unbind("keydown");
    //Fecha actual
    var fullDate = new Date();

    $("#bus_txt_fec_ini").val(formatDate(fullDate, "yyyy-MM-dd"));
    $("#bus_txt_fec_ini").attr("min", formatDate(fullDate, "yyyy-MM-dd"));

    listar_inicio();
});
function listar_viaje(p_sync) {
    openLoading();
    var objE = {
        ID_ENCRIP: getUrlParameter("fromTourId"),
        fecha_ini: $("#bus_txt_fec_ini").val() === "" ? null : getDateFromFormat($("#bus_txt_fec_ini").val(), 'yyyy-MM-dd'),
        fecha_fin: $("#bus_txt_fec_ini").val() === "" ? null : getDateFromFormat($("#bus_txt_fec_ini").val(), 'yyyy-MM-dd')
    };
 
    $.ajax({
        type: "POST",
        url: "/Tour/ListaViaje",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: objE
        }),
        async: p_sync,
        beforeSend: function () {
            $("#btn_buscar").attr("disabled", true);
        },
        success: function (data) {
            if (!data.Activo) {
                msg_OpenDay("e", data.Mensaje);
                return;
            }

            var html = '';
            $("#body_viajes_disp").html("");
            arrayViaje_activ = [];
            for (var i = 0; i < data.Resultado.length; i++) {
                arrayViaje_activ.push(data.Resultado[i]);

                var color_card = "";
                if (data.Resultado[i].asiento_libre === 0)
                    color_card = "danger";
                else if (data.Resultado[i].asiento_libre < 5)
                    color_card = "warning";
                else
                    color_card = "primary";

                html += '<div class="row" onclick="mostrarAsientos(' + i + ')" style="cursor:pointer;">';
                html += '    <div class="col-md-12">';
                html += '        <div class="card border-left-' + color_card + ' shadow h-100 py-2 btn-3-default">';
                html += '            <div class="card-body">';
                html += '                <div class="row no-gutters align-items-center">';
                html += '                    <div class="col mr-2">';
                html += '                        <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">' + data.Resultado[i].nombre + '</div>';
                html += '                        <div class="h5 mb-0 font-weight-bold text-gray-800">S/.' + data.Resultado[i].precio + '</div>';
                html += '                    </div>';
                html += '                    <div class="col mr-2">';
                html += '                        <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Salida: ' + formatDate(parseDateServer(data.Resultado[i].fecha_ini), "dd-MM-yyyy") + '</div>';
                html += '                        <span class="h5 mb-0 font-weight-bold text-gray-800 ">' + formatDate(parseDateServer(data.Resultado[i].fecha_ini), "HH:mm") + ' - ' + formatDate(parseDateServer(data.Resultado[i].fecha_fin), "HH:mm") + '</span>';
                html += '                    </div>';
                html += '                    <div class="col mr-2">';
                html += '                        <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">Asientos</div>';
                html += '                        <span class="badge badge-' + color_card + '">' + data.Resultado[i].asiento_libre + ' libres</span>';
                html += '                    </div>';
                html += '                    <div class="col-auto">';
                html += '                        <i class="fas fa-ship fa-2x text-gray-300"></i>';
                html += '                    </div>';
                html += '                </div>';
                html += '            </div>';
                html += '        </div>';
                html += '    </div>';
                html += '</div>';
            }

            $("#body_viajes_disp").append(html);
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
        },
        complete: function (respuesta) {
            $("#btn_buscar").removeAttr("disabled");
            closeLoading();
        }
    });
}
function listar_inicio() {
    listar_viaje(true);
}
function mostrarAsientos(row) {
    objViaje_activ = arrayViaje_activ[row];
    var url_destino = "/Tour/SeleccionAsiento?fromViajeId=" + encodeURIComponent(objViaje_activ.ID_ENCRIP);
    window.open(url_destino);
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
    listar_viaje(true);
});
function openLoading() {
    $("#page-loader").show();
}
function closeLoading() {
    $("#page-loader").hide();
}