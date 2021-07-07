$(function () {
    $("#page-loader").hide();
    $("#frmCambiar input").keypress(function (e) {
        if (e.keyCode == 13) {
            if ($(this).attr("id") == "clave") $("#claveR").focus();
            else $("#btnCambiar").click();
        }
    });

    $("#btnCambiar").click(function () {
        var claveUno = $("#clave").val();
        var claveDos = $("#claveR").val();

        if ($.trim(claveUno) == "") {
            msg_OpenDay("e", "Debe ingresar su nueva contraseña y no debe contener espacios.");
            return;
        }

        if (claveUno != claveDos) {
            msg_OpenDay("e", "Las contraseñas deben ser iguales.");
            return;
        }

        $.ajax({
            type: "POST",
            url: "/Seguridad/CambiarClave",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ clave: $("#clave").val() }),
            async: true,
            beforeSend: function () {
                $("#frmCambiar :input").attr("disabled", true);
            },
            success: function (data) {
                if (!data.Activo) {
                    msg_OpenDay("e", data.Mensaje);
                    $("#clave").val("");
                    $("#claveR").val("");
                    $("#frmCambiar :input").removeAttr("disabled");
                    return;
                }

                window.location = data.Resultado;
            },
            error: function (data) {
                msg_OpenDay("e", "Inconveniente en la operación");
                $("#frmCambiar :input").removeAttr("disabled");
                $("#usuario").focus();
            }
        });
    });
});