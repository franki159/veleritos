// HTML5! http://mathiasbynens.be/notes/document-head
var currentHelsinkiHoursOffset = 2 * 60 * 60000;
document.head = document.head || document.getElementsByTagName('head')[0];

$(document).ready(function () {
    //ocultando div de publicidad
    //$("center").hide();
    //$("center").remove(":contains('Web hosting by Somee.com')");
    //$('body script[src*="http://ads.mgmt.somee.com/serveimages/ad2/WholeInsert4.js"]').remove();
    //$("div").remove(":contains('Hosted Windows Virtual Server. 2.5GHz CPU, 1.5GB RAM, 60GB SSD')");
    //$('body div[style*="height: 65px;"]').remove();

    //$("div").remove(":contains('2147483647')");
    
    $(".nom-empresa").html("Botica");
    $(".nom-empresa-small").html("Botica");
    $("title").text('HLeyva');
});

$(function () {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
    //INPUT INTEGER
    $(".integerFCP").keypress(function (event) {
        return event.charCode >= 48 && event.charCode <= 57;
    });
    //INPUT DECIMAL
    $(".decimalFCP").keypress(function (event) {
        return event.charCode === 46 || (event.charCode >= 48 && event.charCode <= 57);
    });

    //HORA FCP
    $(".hourFCP").attr("data-mask", "99:99");
    $(".hourFCP").attr("title", "Ingrese una hora correcta 23:59");
    $(".hourFCP").attr("data-toggle", "tooltip");
    $(".hourFCP").attr("data-placement", "bottom");
    $(".hourFCP").attr("placeholder", "formato 24 hras.");
    $('.hourFCP').focusout(function () {
        var inputStr = $(this).val();

        if (inputStr.length < 5) {
            $(this).css('background-color', '#ffd4d4');
            $(this).focus();
        }

        var time = inputStr.split(':');

        if (parseInt(time[0]) > 23 || parseInt(time[1]) > 59) {
            $(this).css('background-color', '#ffd4d4');
            $(this).focus();
        } else {
            $(this).css('background-color', '#fff');
        }
    });
    
});

function changeFavicon(src) {
    var link = document.createElement('link'),
     oldLink = document.getElementById('dynamic-favicon');
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = src;
    if (oldLink) {
        document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
}

Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

function MaysPrimera(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function GenerarAlertaError(texto) {
    return '<div class="alert alert-block alert-danger fade in">' +
                '<button data-dismiss="alert" class="close close-sm" type="button">' +
                    '<i class="icon-remove"></i>' +
                '</button>' + texto + '</div>';
}

function GenerarAlertaSuccess(texto) {
    return ' <div class="alert alert-block alert-success fade in">' +
                                  '<button data-dismiss="alert" class="close close-sm" type="button">' +
                                      '<i class="icon-remove"></i>' +
                                  '</button><i class="icon-ok"></i> ' +
                                  texto +
                              '</div>';
}

function GenerarAlertaInfo(texto) {
    return ' <div class="alert alert-block alert-info fade in">' +
                                  '<button data-dismiss="alert" class="close close-sm" type="button">' +
                                      '<i class="icon-remove"></i>' +
                                  '</button><i class="icon-info-sign"></i> ' +
                                  texto +
                              '</div>';
}

function GenerarAlertaWarning(texto) {
    return ' <div class="alert alert-block alert-warning fade in">' +
                                  '<button data-dismiss="alert" class="close close-sm" type="button">' +
                                      '<i class="icon-remove"></i>' +
                                  '</button><i class="icon-warning-sign"></i> ' +
                                  texto +
                              '</div>';
}


$(".go-top").click(function () {
    $('body, html').animate({
        scrollTop: 0
    }, 800);
    return false;
});


function confirmWP(question, heading, type, callbackOk, callbackCancel) {
    $('#Modalpw').remove();
    var confirmModal =
      $('<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog">' +
                '<div class="modal-content">' +
                    '<div class="modal-header btn-' + type + '">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                        '<h4 class="modal-title">' + heading + '</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    question +
                    '<br><br>Confirme la operación ingresando su contraseña: <br><input id="Modalpw" class="form-control" style="width:200px" type="password"/>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                        '<button data-dismiss="modal" class="btn btn-default" type="button">Cancelar</button>' +
                        '<button class="btn btn-' + type + '" id="ConfirmOkButton" type="button"> Confirmar</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>');

    confirmModal.find('#ConfirmOkButton').click(function (event) {
        pwd = $('#Modalpw').val();
        $('#Modalpw').remove();
        callbackOk(pwd);
        confirmModal.modal('hide');
    });

    confirmModal.on('hide.bs.modal', function () {
        if (callbackCancel && typeof (callbackCancel) === "function") {
            callbackCancel();
        }
    });

    confirmModal.modal('show');
};

function confirmWP_OpenDay(question, heading, type, callbackOk, callbackCancel) {
    $('#Modalpw').remove();
    $('#Modalobs').remove();
    var confirmModal =
      $('<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog">' +
                '<div class="modal-content">' +
                    '<div class="modal-header btn-' + type + '">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                        '<h4 class="modal-title">' + heading + '</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    question +
                    '<br><br>Confirme la operación ingresando su contraseña: <br><input id="Modalpw" class="form-control" style="width:200px" type="password"/>' +
                    '<br>Ingrese una observación: <br><textarea id="Modalobs" class="form-control" style="width:400px"></textarea>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                        '<button data-dismiss="modal" class="btn btn-default" type="button">Cancelar</button>' +
                        '<button class="btn btn-' + type + '" id="ConfirmOkButton" type="button"> Confirmar</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>');

    confirmModal.find('#ConfirmOkButton').click(function (event) {
        pwd = $('#Modalpw').val();
        obs = $('#Modalobs').val();
        $('#Modalpw').remove();
        $('#Modalobs').remove();
        callbackOk(pwd, obs);
        confirmModal.modal('hide');
    });

    confirmModal.on('hide.bs.modal', function () {
        if (callbackCancel && typeof (callbackCancel) === "function") {
            callbackCancel();
        }
    });

    confirmModal.modal('show');
};

function msg_OpenDay(tipo, contenido) {
    var heading, cssClas, icono = '';
    switch (tipo) {
        case 'c':
            heading = 'Correcto';
            icono = 'far fa-check-circle';
            cssClas = 'success'; break;
        case 'a':
            heading = 'Alerta';
            icono = 'fas fa-exclamation-circle';
            cssClas = 'warning'; break;
        case 'e':
            heading = 'Error';
            icono = 'fas fa-times-circle';
            cssClas = 'danger'; break;
        default:
    }

    $('#modalAlert').remove();

    $('body').append(
        '<div class= "modal fade" style = "z-index: 1051;" id = "modalAlert" role = "dialog" > ' +
        '<div class= "modal-dialog">' +
        '   <div class="modal-content">' +
        '       <div class="modal-' + cssClas + '">' +
        '           <button type="button" class="close" data-dismiss="modal">&times;</button>' +
        '           <h4 class="modal-title"><i class="' + icono + '"></i> ' + heading + '</h4>' +
        '       </div>' +
        '       <div class="modal-body">' +
        '           <p>' + contenido + '</p>' +
        '       </div>' +
        '       <div class="modal-footer">' +
        '           <button type="button" class="btn btn-' + cssClas + ' btn-sm" data-dismiss="modal">Aceptar</button>' +
        '       </div>' +
        '   </div>' +
        '</div> ' +
        '</div >');

    $("#modalAlert").modal();
}
function f_open_window_max(aURL) {
    var wOpen;
    var sOptions;

    aWinName = "Reporte_" + Math.floor((Math.random() * 100) + 1);

    sOptions = 'status=0,menubar=0,scrollbars=yes,resizable=yes,toolbar=0';
    sOptions = sOptions + ',width=' + (screen.availWidth - 10).toString();
    sOptions = sOptions + ',height=' + (screen.availHeight - 122).toString();
    sOptions = sOptions + ',screenX=0,screenY=0,left=0,top=0';

    wOpen = window.open('', aWinName, sOptions);
    wOpen.location = aURL;
    wOpen.focus();
    wOpen.moveTo(0, 0);
    wOpen.resizeTo(screen.availWidth - 10, screen.availHeight);
    return wOpen;
}

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}


function reloadPage() {
    location.reload();
}

$(function () {
    $.ajaxSetup({ cache: false });

    $.ajaxSetup({
        beforeSend: function () {
            if ($("#loadingbar").length === 0) {
                $("body").append("<div id='loadingbar' class='ajax-progress'></div>")
                $("#loadingbar").width((50 + Math.random() * 30) + "%");
            }
        },
        complete: function () {
            $("#loadingbar").width("101%").delay(200).fadeOut(400, function () {
                $(this).remove();
            });
        }
    });

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
});

//**********************************FUNCIONES DE VALIDACION************************************/
function isEmail(email) {
    var regex = /[\w-\.]{2,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;

    return regex.test(email);
}

function validIdInput(valor) {
    if (valor === "" || valor === "0" || valor === null)
        return true;
    else
        return false;
}

function validate_hour(inputStr) {
    if (inputStr === "") {
        return false;
    }
    var time = inputStr.split(':');

    if (parseInt(time[0]) > 23 || parseInt(time[1]) > 59) {
        return true;
    } else {
        return false;
    }
}

//**********************************INICIO FUNCIONES DE FORMATO************************************/
function toDecimal(num, decimals) {
    var t = Math.pow(10, decimals);
    //return (Math.round((num * t) + (decimals > 0 ? 1 : 0) * (Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
    return (Math.round((num * t) + (decimals > 0 ? 1 : 0) * (10 / Math.pow(100, decimals))) / t).toFixed(decimals);
}

function toURLParam(strParamName) {
    var strReturn = "";
    var strHref = window.location.href;
    var bFound = false;

    var cmpstring = strParamName + "=";
    var cmplen = cmpstring.length;

    if (strHref.indexOf("?") > -1) {
        var strQueryString = strHref.substr(strHref.indexOf("?") + 1);
        var aQueryString = strQueryString.split("&");
        for (var iParam = 0; iParam < aQueryString.length; iParam++) {
            if (aQueryString[iParam].substr(0, cmplen) === cmpstring) {
                var aParam = aQueryString[iParam].split("=");
                strReturn = aParam[1];
                bFound = true;
                break;
            }

        }
    }
    if (bFound === false) return null;
    return strReturn;
}

//********************************** EXPORTAR TABLE ************************************/
function exportGridToExcel(tableID, filename = '') {
    //window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('#' + tblExport).html()));
    var downloadLink;
    var dataType = 'application/vnd.ms-excel;base64';
    //var divtitulo = $(".drg-event-title").html();
    //Quitando columnas invisibles
    var tableTemp = document.getElementsByTagName("table")[0];
    var copyTable = tableTemp.cloneNode(true);
    copyTable.id = "copyTable";
    document.body.appendChild(copyTable);

    $("#copyTable thead tr th").each(function () {
        if ($(this).context.style.display === "none" || $(this).context.outerText.trim() === "") {
            $(this).remove();
        }
    });

    $("#copyTable tbody tr td").each(function () {
        if ($(this).context.style.display === "none" || $(this).context.outerHTML.includes("button")) {
            $(this).remove();
        }
    });

    var tableHTML = copyTable.outerHTML;//.replace(/ /g, '%20');

    // Specify file name
    filename = filename ? filename + '.xls' : 'excel_data.xls';

    // Create download link element
    downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + $.base64.encode(tableHTML);

        // Setting the file name
        downloadLink.download = filename;

        //triggering the function
        downloadLink.click();

        //delete table temp
        copyTable.remove();
    }
}
//********************************** FIN EXPORTAR TABLE ************************************/
function retornaEmpresa() {
    return "Leyva";
}