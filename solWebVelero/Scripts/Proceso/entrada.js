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
});

function listar_tour() {
    var objE = {
        nombre: ""
    };
    debugger;
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
            for (var i = 0; i < data.Resultado.length; i++) {
                $('#bus_sel_tour').append("<option value='" + data.Resultado[i].id_tour + "'>" + data.Resultado[i].nombre + "</option>");
            }
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
            closeLoading();
        }
    });
}
function listar_inicio() {
    $("#divAsiento").hide();
    listar_tour();
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
            
            var html = '';
            $("#body_viajes_disp").append("");
            for (var i = 0; i < data.Resultado.length; i++) {
                html += '<div class="row" name="cardViaje">';
                html += '    <div class="col-md-12">';
                html += '        <div class="card border-left-primary shadow h-100 py-2 btn-3-default">';
                html += '            <div class="card-body">';
                html += '                <div class="row no-gutters align-items-center">';
                html += '                    <div class="col mr-2">';
                html += '                        <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">' + data.Resultado[i].nombre + '</div>';
                html += '                        <div class="text-xs font-weight-bold text-uppercase mb-1">Salida: ' + formatDate(parseDateServer(data.Resultado[i].fecha_ini), "dd-MM-yyyy") + '</div>';
                html += '                        <div class="row no-gutters align-items-center">';
                html += '                            <div class="col-auto">';
                html += '                                <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800" style="font-size: 1.25rem;">' + formatDate(parseDateServer(data.Resultado[i].fecha_ini), "HH:mm") + ' - ' + formatDate(parseDateServer(data.Resultado[i].fecha_fin), "HH:mm") + '</div>';
                html += '                            </div>';
                html += '                            <div class="col">';
                html += '                                <div class="h5 mb-0 mr-3 font-weight-bold text-success" style="font-size: 1.25rem;">S/. ' + data.Resultado[i].precio + '</div>';
                html += '                            </div>';
                html += '                        </div>';
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

            $("#body_viajes_disp div").click(function () {
                if ($(this).attr("name") === "cardViaje") {
                    
                    $("#divAsiento").show();
                    $("#titulo_asiento").html($(this).html());
                    
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
