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

    //Controles iniciales
    //Fecha actual
    var fullDate = new Date();
    var primerDia = new Date(fullDate.getFullYear(), fullDate.getMonth(), 1);
    var ultimoDia = new Date(fullDate.getFullYear(), fullDate.getMonth() + 1, 0);

    $("#txt_bus_fechainicio").val(formatDate(primerDia, "dd/MM/yyyy"));
    $("#txt_bus_fechainicio").parent().datepicker("update", $("#txt_bus_fechainicio").val());
    $("#txt_bus_fechafin").val(formatDate(ultimoDia, "dd/MM/yyyy"));
    $("#txt_bus_fechafin").parent().datepicker("update", $("#txt_bus_fechafin").val());

    $(document).keyup(function (e) {
        if (e.keyCode === 13) {
            if ($(this).attr("id") === "pnl_busqueda") $("#btn_buscar").click();
            else $("#pnl_busqueda").focus();
        }
    });

    $("#btn_buscar").click(function () {
        fc_listar_movimiento();
    });

});

function fc_listar_movimiento() {
    $("#btn_buscar").button('loading');

    var fechaIni = getDateFromFormat($("#txt_bus_fechainicio").val(), 'dd/MM/yyyy');
    var fechaFin = getDateFromFormat($("#txt_bus_fechafin").val(), 'dd/MM/yyyy');

    var eMovimiento = {
        FECHA_INI: fechaIni,
        FECHA_FIN: fechaFin
    };

    $.ajax({
        type: "POST",
        url: "page/reporte/movimiento.aspx/ListaInicialWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: eMovimiento
        }),
        async: true,
        beforeSend: function () {
            $("#btn_buscar").attr("disabled", true);
            $('#tbl_movimiento tbody').empty();
        },
        success: function (data) {
            if (data.d.error) {
                $("#errorDiv").html(GenerarAlertaError(data.d.error));
                $("#btn_buscar").removeAttr("disabled");
                $("#btn_buscar").button('reset');
                return;
            }

            var html = '';
            var acuIngreso = 0.00;
            var acuSalida = 0.00;

            for (var i = 0; i < data.d.Resultado.length; i++) {
                html += '<tr><td>' + data.d.Resultado[i].DESCRIPCION + '</td>';
                html += '<td>' + formatDate(parseDateServer(data.d.Resultado[i].FECHA_INI), "dd/MM/yyyy") + '</td>';
                html += '<td>' + data.d.Resultado[i].TIPO + '</td>';
                html += '<td>' + data.d.Resultado[i].MONTO + '</td></tr>';
                if (data.d.Resultado[i].TIPO.trim() === 'Ingreso') {
                    acuIngreso = acuIngreso + data.d.Resultado[i].MONTO;
                }else if(data.d.Resultado[i].TIPO.trim() === 'Salida') {
                    acuSalida = acuSalida + data.d.Resultado[i].MONTO;
                }
            }

            $("#txt_ingreso").val(acuIngreso.toString());
            $("#txt_salida").val(acuSalida.toString());
            $("#tbl_movimiento tbody").append(html);

            $("#btn_buscar").removeAttr("disabled");
            $("#btn_buscar").button('reset');
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#btn_buscar").removeAttr("disabled");
            $("#btn_buscar").button('reset');
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
            return false; break;
        case 66: //BUSCAR
            if (evt ? evt.altKey : event.altKey) $("#btn_buscar").click();
            break;
    }
});

$("#pnl_busqueda input:text").keyup(function (e) {
    if (e.keyCode === 13) {
        $("#btn_buscar").click();
    }
});

$("#btn_exportar").click(function () {
    $("#btn_exportar").button('loading');

    var total_reg = $('#tbl_movimiento tr').length;

    if (total_reg < 2) {
        $("#errorDiv").html(GenerarAlertaWarning("Cantidad de Registros: No hay registros para exportar"));
        $("#btn_exportar").button('reset');
        return;
    }

    exportGridToExcel("tbl_movimiento", "Movimientos_hotel");
    $("#btn_exportar").button('reset');
});
