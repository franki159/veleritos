var txh_tour;
var txh_idConfirm = "";
var valRND = Math.floor(Math.random() * 100);
var arrayTour_activ = [];
var objTour_activ = {};
/*Inicializar Script*/
$(function () {
    $(document).unbind("keydown");
    //Fecha actual
    var fullDate = new Date();
    $("#bus_txt_fec_ini").val(formatDate(fullDate, "yyyy-MM-dd"));
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
            arrayTour_activ = [];
            for (var i = 0; i < data.Resultado.length; i++) {
                arrayTour_activ.push(data.Resultado[i]);

                html += '<div class="col-md-4 ftco-animate fadeInUp ftco-animated">';
                html += '   <div class="project-wrap">';
                html += '   	<a href="/Tour/SeleccionViaje?fromTourId=' + encodeURIComponent(data.Resultado[i].ID_ENCRIP) + '" class="img" style="background-image: url(../Content/img/tour/' + data.Resultado[i].foto + ');"></a>';
                html += '   	<div class="text p-4">';
                html += '   		<span class="price">' + data.Resultado[i].precio + '(PEN)/persona</span>';
                html += '   		<span class="days">2 horas de recorrido</span>';
                html += '   		<h3><a href="#">' + data.Resultado[i].nombre + '</a></h3>';
                html += '   		<p class="location">' + data.Resultado[i].DESCRIPCION + '</p>';
                html += '   		<ul>';
                html += '   			<li><span class="flaticon-sun-umbrella"></span></li>';
                html += '   			<li><span class="flaticon-tour-guide"></span></li>';
                html += '   			<li><span class="flaticon-shower"></span></li>';
                html += '   		</ul>';
                html += '   	</div>';
                html += '   </div>';
                html += '</div>';
            }


            $("#bodyCard").html(html);
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