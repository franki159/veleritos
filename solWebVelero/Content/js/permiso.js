var lpermisos;

function ListaPermisos() {
    $.ajax({
        type: "POST",
        url: "permiso.aspx/ListarPermisosWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        beforeSend: function () {
            $('#local').empty();
            $("#frmPermiso :input").attr("disabled", true);
        },
        success: function (data, status) {
            if (!data.d.Activo) {
                msg_OpenDay("e", data.d.Mensaje);
                return;
            }

            lpermisos = data.d.Resultado;
            var des_empresa = "";
            for (var i = 0; i < lpermisos.length; i++) {
                if (data.d.Resultado[i].EMPRESA !== des_empresa) {
                    $('#empresa').append("<option value='" + data.d.Resultado[i].ID_EMPRESA + "'>" + data.d.Resultado[i].EMPRESA + "</option>");
                }

                des_empresa = data.d.Resultado[i].EMPRESA;
            }
     
            if (data.d.Resultado.length === 1) {
                //$("#btnAceptar").click();
                $("#empresa").change();
            }
            $("#page-loader").hide();
            $("#frmPermiso :input").removeAttr("disabled");
        },
        failure: function (data) { },
        error: function (data) { }
    });
}

$(function () {
    ListaPermisos();

    $(document).keyup(function (e) {
        if (e.keyCode === 13) {
            if ($(this).attr("id") === "local") $("#btnAceptar").click();
            else $("#local").focus();
        }
    });

    $("#btnAceptar").click(function () {
        var msjValida = "";

        if ($("#local").val() === "" || $("#local").val() === "0") msjValida += "Seleccione Local</br>";

        if (msjValida !== "") {
            $("#msg").html(GenerarAlertaError(msjValida));
            return;
        }

        $.ajax({
            type: "POST",
            url: "permiso.aspx/AceptarWM",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                idLocal: $("#local :selected").val(),
                local: $("#local :selected").text()
            }),
            async: true,
            beforeSend: function () {
                $("#frmPermiso :input").attr("disabled", true);
                $("#page-loader").show();
            },
            success: function (data) {
                if (!data.d.Activo) {
                    $("#msg").html(GenerarAlertaError(data.d.Mensaje));
                    $("#frmPermiso :input").removeAttr("disabled");
                    $("#local").focus();
                    return;
                }
                window.location = data.d.Resultado;
            },
            error: function (data) {
                $("#msg").html(GenerarAlertaError("Inconveniente en la operación"));
                $("#frmPermiso :input").removeAttr("disabled");
                $("#local").focus();
            }
        });
    });

    $("#empresa").change(function () {
        for (var i = 0; i < lpermisos.length; i++) {
            if (lpermisos[i].ID_EMPRESA !== $(this).val()) {
                $('#local').append("<option value='" + lpermisos[i].ID_LOCAL + "'>" + lpermisos[i].DESCRIPCION + "</option>");
            }
        }
    });
});