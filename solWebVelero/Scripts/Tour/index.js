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
            
            var html_tours_pc = "";
            var html_tours_mobile = "";
            $("#bodyCard").html("");

            html += '<div class="carousel-item active">';
            html += '   <div class="row h-100">';
            arrayTour_activ = [];
            for (var i = 0; i < data.Resultado.length; i++) {
                arrayTour_activ.push(data.Resultado[i]);

debugger;
                var html = '';
                html += '     <div class="col-md-4 mb-3 mb-md-0">';
                html += '         <div class="card h-100 text-white hover-top">';
                html += '           <img class="img-fluid h-100" src="../Content/img/tour/'+ data.Resultado[i].foto +'" alt="" />';
                html += '           <div class="card-img-overlay ps-0 d-flex flex-column justify-content-between bg-dark-gradient">';
                html += '               <div class="pt-3"><span class="badge bg-primary">S/ ' + data.Resultado[i].precio + '</span></div>';
                html += '               <div class="ps-3 d-flex justify-content-between align-items-center">';
                html += '                   <h5 class="text-white">' + data.Resultado[i].nombre + '</h5>';
                html += '                   <h6 class="text-600">Tour</h6>';
                html += '               </div>';
                html += '           </div>';
                html += '         </div>';
                html += '    </div>';
                
                if (i%3 === 0){
                    if (i == 0){
                        html_tours_pc += '<div class="carousel-item active">';
                    }else{
                        html_tours_pc += '</div>';
                        html_tours_pc += '</div>';
                        html_tours_pc += '<div class="carousel-item">';                    
                    }

                    html_tours_pc += '   <div class="row h-100">';
                }
                html_tours_pc += html;
                html_tours_mobile += html;
            }


            $("#bodyCard").append(html_tours_pc);
            $("bodyCardMobile").append(html_tours_mobile);
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