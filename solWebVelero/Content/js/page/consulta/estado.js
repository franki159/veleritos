/*Inicializar Script*/
$(function () {
    $(document).prop("title", "LV::Reporte de Movimientos");
    $(document).unbind("keydown");

    fc_listar_estadoHotel();

    //setInterval('fc_listar_estadoHotel()', 50000);
});

function fc_listar_estadoHotel() {
    $.ajax({
        type: "POST",
        url: "page/consulta/estado.aspx/ListaEstadoHotelWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        beforeSend: function () {
            $('#pnl_estado').empty();
        },
        success: function (data) {
            if (data.d.error) {
                $("#errorDiv").html(GenerarAlertaError(data.d.error));
                return;
            }

            var html = '';
            var arrayPiso = [];
            var contPiso = 0;
            var piso = 0;
            var color = '';

            for (var j = 0; j < data.d.Resultado.length; j++) {
                if (piso != data.d.Resultado[j].PISO) {
                    arrayPiso[contPiso] = data.d.Resultado[j].PISO;
                    contPiso++;
                    piso = data.d.Resultado[j].PISO
                }
            }

            for (var k = 0; k < arrayPiso.length; k++) {
                html += '<div class="panel panel-primary" style="overflow:auto;">';
                html += '<div class="panel-heading">PISO ' + arrayPiso[k] + '</div>';
                html += '<div class="panel-body">'

                for (var i = 0; i < data.d.Resultado.length; i++) {
                    var arrayAccion = [];
                    if (arrayPiso[k] == data.d.Resultado[i].PISO) {
                        switch (data.d.Resultado[i].DSC_ESTADO) {
                            case 'OCUPADO': color = 'default'; arrayAccion[0] = "Liberar"; arrayAccion[1] = "Asignar gasto"; break;
                            case 'RESERVADO': color = 'info'; arrayAccion[0] = "Atender"; arrayAccion[1] = "Anular"; break;
                            case 'DEMORADO': color = 'danger'; arrayAccion[0] = "Liberar"; arrayAccion[1] = "Asignar gasto"; break;
                            case 'POR SALIR': color = 'warning'; arrayAccion[0] = "Liberar"; arrayAccion[1] = "Asignar gasto"; break;
                            case 'LIBRE': color = 'success'; arrayAccion[0] = "Reservar"; arrayAccion[1] = "Atender"; break;
                            default: color = 'success'; break;
                        }
                        html += '<div class="dropdown" style="display: inline-block;margin: 5px;">';
                        html += '<button id="H' + data.d.Resultado[i].ID_HABITACION + '" class="btn btn-' + color + ' btn-sm dropdown-toggle" type="button" data-toggle="dropdown">' + data.d.Resultado[i].NUMERO + "<BR>" + data.d.Resultado[i].TIPOHABITACION.DESCRIPCION + '</button>&nbsp;&nbsp;'
                        html += '<ul class="dropdown-menu">';
                        html += '<li><a href="#">' + arrayAccion[0] + '</a></li>';
                        html += '<li><a href="#">' + arrayAccion[1] + '</a></li>';
                        html += '</ul>';
                        html += '</div>';
                    }
                }

                html += '</div>';
                html += '</BR>';
                html += '</BR>';
                html += '</BR>';
                html += '</div>';
            }

            $("#pnl_estado").html(html);
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
        }
    });
}

/*Eventos por Control*/
$(document).keydown(function (evt) {
    switch (evt ? evt.which : event.keyCode) {
        case 8: //BLOQUEA RETROCESO DE PAGINA
            var valor = document.activeElement.value;
            if (valor == undefined) { return false; } break;
        case 13: //BLOQUEA ENTER
            return false; break;
    }
});

