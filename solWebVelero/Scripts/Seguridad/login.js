$(function () {
    $("#page-loader").hide();
    $("#usuario").focus();

    $("#frmLogin input").keypress(function (e) {
        if (e.keyCode === 13) {
            if ($(this).attr("id") === "usuario") $("#clave").focus();
            else $("#btnAcceder").click();
        }
    });

    $("#btnAcceder").click(function () {
        var msjValida = "";
        if ($("#usuario").val() === "") msjValida += "Ingrese Usuario</br>";
        if ($("#clave").val() === "") msjValida += "Ingrese Contraseña";

        if (msjValida !== "") {
            $("#msgError").html(GenerarAlertaError(msjValida));
            $("#usuario").focus();
            return;
        }
        debugger;
        $.ajax({
            type: "POST",
            url: "/Seguridad/AccederSistema",
            //url: "login.aspx/AccederWM",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify($("#frmLogin").serializeObject()),
            async: true,
            beforeSend: function () {
                $("#frmLogin :input").attr("disabled", true);
                $("#page-loader").show();
            },
            success: function (data) {
                debugger;
                if (!data.Activo) {
                    msg_OpenDay("e", data.Mensaje);
                    $("#msgError").html(GenerarAlertaError(data.Mensaje));
                    $("#frmLogin :input").removeAttr("disabled");
                    $("#usuario").focus();
                } else {
                    window.location = data.Resultado;
                }
                $("#page-loader").hide();
            },
            error: function (data) {
                $("#msgError").html(GenerarAlertaError("Inconveniente en la operación"));
                $("#frmLogin :input").removeAttr("disabled");
                $("#page-loader").hide();
                $("#usuario").focus();
            }
        });
    });
});