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

        $.ajax({
            type: "POST",
            url: "login.aspx/AccederWM",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify($("#frmLogin").serializeObject()),
            async: true,
            beforeSend: function () {
                $("#frmLogin :input").attr("disabled", true);
                $("#page-loader").show();
            },
            success: function (data) {
                if (!data.d.Activo) {
                    msg_OpenDay("e", data.d.Mensaje);
                    $("#msgError").html(GenerarAlertaError(data.d.Mensaje));
                    $("#frmLogin :input").removeAttr("disabled");
                    $("#usuario").focus();
                } else {
                    window.location = data.d.Resultado;
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