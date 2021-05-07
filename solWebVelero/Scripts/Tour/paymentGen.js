var valRND = Math.floor(Math.random() * 100);
var g_id_mascota = 0;
var g_id_sol = 0;
var doSubmit = false;

/*Inicializar Script*/
//Variacion de la zona horaria
$(document).ready(function () {
    fc_listar_inicio();
    closeLoading();
    $(document).prop("title", "::Pago");
    $(document).unbind("keydown");
});

var bPreguntar = true;

window.onbeforeunload = preguntarAntesDeSalir;

function preguntarAntesDeSalir() {
    var respuesta;

    if (bPreguntar) {
        respuesta = confirm('¿Seguro que quieres salir?');

        if (respuesta) {
            window.onunload = function () {
                return true;
            };
        } else {
            return false;
        }
    }
}

function fc_listar_inicio() {
    window.Mercadopago.getIdentificationTypes();

    document.getElementById('cardNumber').addEventListener('keyup', guessPaymentMethod);
    document.getElementById('cardNumber').addEventListener('change', guessPaymentMethod);

    document.querySelector('#pay').addEventListener('submit', doPay);
    //get detalis pay
    //get session solicitud
    $.ajax({
        type: "POST",
        url: "/Tour/getPedidoItemWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        beforeSend: function () {
            openLoading();
        },
        success: function (data) {
            debugger;
            if (!data.Activo) {
                if (data.Mensaje === "SR") {
                    alert("No selecciono ninguna solicitud");
                    window.location = "/Tour";
                    return;
                } else {
                    closeLoading();
                    msg_OpenDay('e', data.Mensaje);
                    return;
                }
            }
            $(".row-summary").html("<span class='float-left'>Costo Total</span><span class='float-right'>S/. " + nwformatNumber(data.Resultado.total, 2) + "</span>");
            closeLoading();
        },
        error: function (data) {
            closeLoading();
        }
    });
}
//***************************************************************************************************
//************************* Obtener método de pago de la tarjeta Inicio *****************************
//***************************************************************************************************
function guessPaymentMethod(event) {
    let cardnumber = document.getElementById("cardNumber").value;
    $(".cardNumber-bar").html(``);

    if (cardnumber.length >= 6) {
        let bin = cardnumber.substring(0, 6);
        window.Mercadopago.getPaymentMethod({
            "bin": bin
        }, setPaymentMethod);
    }
}

function setPaymentMethod(status, response) {
    if (status === 200) {
        let paymentMethodId = response[0].id;
        let element = document.getElementById('payment_method_id');
        element.value = paymentMethodId;
        //getInstallments();
    } else {
        $(".cardNumber-bar").html(`Tarjeta no válida`);
        $("#cardNumber").focus();
    }
}
//***************************************************************************************************
//**************************** Obtener método de pago de la tarjeta Fin *****************************
//***************************************************************************************************
//Obtener cantidad de cuotas
/*
function getInstallments() {
    window.Mercadopago.getInstallments({
        "payment_method_id": document.getElementById('payment_method_id').value,
        "amount": parseFloat(document.getElementById('transaction_amount').value)

    }, function (status, response) {
        if (status === 200) {
            document.getElementById('installments').options.length = 0;
            response[0].payer_costs.forEach(installment => {
                let opt = document.createElement('option');
                opt.text = installment.recommended_message;
                opt.value = installment.installments;
                document.getElementById('installments').appendChild(opt);
            });
        } else {
            alert(`installments method info error: ${response}`);
        }
    });
}*/
//***************************************************************************************************
//****************************** Crea el token de la tarjeta Inicio *********************************
//***************************************************************************************************
function doPay(event) {
    event.preventDefault();
    if (!doSubmit) {
        var $form = document.querySelector('#pay');

        openLoading();
        window.Mercadopago.createToken($form, sdkResponseHandler);

        return false;
    }
}

function sdkResponseHandler(status, response) {
    if (status !== 200 && status !== 201) {
        validateErrorInfo(response);
        //alert("verify filled data");
    } else {
        var form = document.querySelector('#pay');
        var card = document.createElement('input');
        card.setAttribute('name', 'token');
        card.setAttribute('type', 'hidden');
        card.setAttribute('value', response.id);
        form.appendChild(card);
        doSubmit = true;
        bPreguntar = false;
        form.submit();
    }
}

function validateErrorInfo(response) {
    var cause = response.cause;

    $("#pay .group .bar").html("");
    for (var i = 0; i < cause.length; i++) {
        switch (cause[i].code) {
            case "205":  /* empty card number */
            case "E301": /* invalid car number*/
                $(".cardNumber-bar").html(`Tarjeta no válida`);
                break;
            case "E302":
                $(".securityCode-bar").html(`Código no válida`);
                break;
            case "208": /* empty card expiration month */
            case "325": /* invalid card expiration month*/
                $(".cardExpirationMonth-bar").html(`Mes no válida`);
                break;
            case "209": /* empty card expiration year */
            case "326": /* invalid card expiration year*/
                $(".cardExpirationYear-bar").html(`Año no válida`);
                break;
            case "221": /* empty cardholder name*/
                $(".cardholderName-bar").html(`Nombre no válida`);
                break;
            case "322": /* cardholder identification type*/
                //Este error no deberia suceder (revisar)
                break;
            case "324": /* invalid parameter docNumber */
                $(".docNumber-bar").html(`Documento no válido`);
                break;
        }
    }
}
//***************************************************************************************************
//********************************* Crea el token de la tarjeta Fin *********************************
//***************************************************************************************************
function openLoading() {
    $("#page-loader").show();
}

function closeLoading() {
    $("#page-loader").hide();
}
