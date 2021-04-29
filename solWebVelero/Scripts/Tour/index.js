var txh_tour;
var txh_idConfirm = "";
var valRND = Math.floor(Math.random() * 100);
var arrayTour_activ = [];
var objTour_activ = {};
/*Inicializar Script*/
$(function () {
    $(document).unbind("keydown");
    listar_inicio();
});
function listar_tour(p_sync) {
    openLoading();
    var objE = {
        nombre: ""
    };

    $.ajax({
        type: "POST",
        url: "/Tour/ListaTour",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: objE
        }),
        async: p_sync,
        success: function (data) {
            if (!data.Activo) {
                msg_OpenDay("e", data.Mensaje)
                closeLoading();
                return;
            }
            
            var html = '';
            $("#bodyCard").html("");
            arrayTour_activ = [];
            for (var i = 0; i < data.Resultado.length; i++) {
                arrayTour_activ.push(data.Resultado[i]);
                html += '<div class="card mb-4 box-shadow btn-3-default" style="min-width: 220px;cursor: pointer;" onClick="buscarViajes('+ i +')">';
                html += '   <img class="card-img-top" src="../Content/img/tour/'+ data.Resultado[i].foto +'" alt="Card image cap">';
                html += '   <div class="card-body">';
                html += '       <h4 class="card-title font-weight-bold"><a href="#">' + data.Resultado[i].nombre + '</a></h4>';
                html += '       <p class="card-text">' + data.Resultado[i].DESCRIPCION + '</p>';
                html += '       <h1 class="card-title pricing-card-title">S/ ' + data.Resultado[i].precio + '</h1>';
                html += '   </div>';
                html += '</div>';
            }

            $("#bodyCard").append(html);
            closeLoading();
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
            closeLoading();
        }
    });
}
function listar_inicio(index) {
    listar_tour(true);
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

function buscarViajes(row) {
    objTour_activ = arrayTour_activ[row];
    var url_destino = "/Tour/SeleccionViaje?fromTourId=" + encodeURIComponent(objTour_activ.ID_ENCRIP);
    window.open(url_destino);
}
function openLoading() {
    $("#page-loader").show();
}
function closeLoading() {
    $("#page-loader").hide();
}