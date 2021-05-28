var txh_tour;
var txh_idConfirm = "";
var valRND = Math.floor(Math.random() * 100);
var arrayViaje_activ = [];
var objViaje_activ = {};
var arrayNumAsiento = [];
/*Inicializar Script*/
$(function () {
    if (toURLParam("vtoken") === null) {
        msg_OpenDay("e", "Ocurrió un error inesperado");
        return false;
    }
    $(document).unbind("keydown");
    listar_datos();
});
function listar_datos() {
    openLoading();
    var objE = {
        ID_ENCRIP: getUrlParameter("vtoken")
    };
 
    $.ajax({
        type: "POST",
        url: "/Tour/ListarReservaData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            objE: objE
        }),
        async: true,
        success: function (data) {
            if (!data.Activo) {
                msg_OpenDay("e", data.Mensaje);
                return;
            }

            $("#body-content").html(data.Resultado);
        },
        error: function (data) {
            msg_OpenDay("e", "Inconveniente en la operación");
        },
        complete: function (respuesta) {
            closeLoading();
        }
    });
}
function openLoading() {
    $("#page-loader").show();
}
function closeLoading() {
    $("#page-loader").hide();
}