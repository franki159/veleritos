$(function () {
    $(document).unbind("keydown");
    //Listar Comprobante - Ticket
    /*$.ajax({
        type: "POST",
        url: "../../page/reporte/comprobante.aspx/getInfoComprobante",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                $("#pleaseWaitDialog").modal('hide');
                return;
            }

            var html = '';

            if (data.d.Resultado.Tipo === "T") {
                html += '<img src="https://yt3.ggpht.com/-3BKTe8YFlbA/AAAAAAAAAAI/AAAAAAAAAAA/ad0jqQ4IkGE/s900-c-k-no-mo-rj-c0xffffff/photo.jpg" alt="Logotipo" />';
                html += '<p class="centrado">' + data.d.Resultado.Lista[0].TIPO_COMPROBANTE +' DE VENTA';
                html += '</br>Lima';
                html += '</br>' + data.d.Resultado.Lista[0].FECHA +'</p>';
                html += '<table>';
                html += '   <thead>';
                html += '       <tr>';
                html += '           <th class="cantidad">CANT</th>';
                html += '           <th class="producto">DESCRIPCION</th>';
                html += '           <th class="precio">IMPORTE</th>';
                html += '       </tr>';
                html += '   </thead>';
                html += '   <tbody>';

                for (var i = 0; i < data.d.Resultado.Lista.length; i++) {
                    html += '       <tr>';
                    html += '           <td class="cantidad">' + data.d.Resultado.Lista[i].CANTIDAD+'</td>';
                    html += '           <td class="producto">' + data.d.Resultado.Lista[i].DESCRIPCION +'</td>';
                    html += '           <td class="precio">' + data.d.Resultado.Lista[i].IMPORTE +'</td>';
                    html += '       </tr>';
                }

                html += '</tbody>';
                html += '</table>';
                html += '<p class="centrado">¡GRACIAS POR SU VISITA!';
                html += '<br>charpe.somee.com</p>';
            }

            $("#comprobante").html = html;
        },
        error: function (data) {
            //$("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
            $("#pleaseWaitDialog").modal('hide');
        }
    });*/
});

function imprimir() {
    window.print();
}

function exportarPDF() {
    var doc = new jsPDF();
    var specialElementHandlers = {
        '#editor': function (element, renderer) {
            return true;
        }
    };

    doc.fromHTML($('#divComprobante').html(), 15, 15, {
        'width': 170,
        'elementHandlers': specialElementHandlers
    });
    doc.save('comprobante.pdf');
}