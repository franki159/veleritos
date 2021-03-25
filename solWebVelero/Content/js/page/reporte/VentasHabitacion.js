/*Variables Locales*/
var inputNota;

/*Inicializar Script*/
$(function () {
    $(document).unbind("keydown");

    $('.dtOp').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        orientation: "top left"
    });

    //Controles iniciales
    //Fecha actual
    var fullDate = new Date();
    var primerDia = new Date(fullDate.getFullYear(), fullDate.getMonth(), 1);
    var ultimoDia = new Date(fullDate.getFullYear(), fullDate.getMonth() + 1, 0);

    $("#txt_bus_fechainicio").val(formatDate(primerDia, "dd/MM/yyyy"));
    $("#txt_bus_fechainicio").parent().datepicker("update", $("#txt_bus_fechainicio").val());
    $("#txt_bus_fechafin").val(formatDate(ultimoDia, "dd/MM/yyyy"));
    $("#txt_bus_fechafin").parent().datepicker("update", $("#txt_bus_fechafin").val());


    $(document).keyup(function (e) {
        if (e.keyCode === 13) {
            if ($(this).attr("id") === "pnl_busqueda") $("#btn_buscar").click();
            else $("#pnl_busqueda").focus();
        }
    });

    $("#btn_buscar").click(function () {
        fc_listar_movimiento();
    });

});

function fc_listar_movimiento() {

    var ifecInicio = getDateFromFormat($("#txt_bus_fechainicio").val(), 'dd/MM/yyyy');
    var ifecFin = getDateFromFormat($("#txt_bus_fechafin").val(), 'dd/MM/yyyy');
    if ($("#sel_bus_tipo").val() === "4")
        p_option = 2;
    else
        p_option = 1;    

    var eReporte = {
        FEC_INI: ifecInicio,
        FEC_FIN: ifecFin,
        OPCION: p_option
    };

    $.ajax({
        type: "POST",
        url: "page/reporte/VentasHabitacion.aspx/ReporteVentasWM",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ objE: eReporte }),
        async: true,
        beforeSend: function () {
            $("#errorDiv").html('');
        },
        success: function (data) {
            if (!data.d.Activo) {
                $("#errorDiv").html(GenerarAlertaError(data.d.Mensaje));
                return;
            }

            //var formato_fecha = "";
            //formato_fecha = "YYYY";
            //formato_fecha = "YYYYMM";
            //formato_fecha = "YYYYMMDD";    
            var jsonStr = "";
            var index = 0;

            if ($("#sel_bus_tipo").val() === "1") {//Ventas y Gastos
                //Datos obtenidos
                data.d.Resultado.forEach(function (j) {
                    if (j.ID_LOCAL.toString() === data.d.TipoMensaje) {
                        if (index !== 0)
                            jsonStr += ",";
                        jsonStr += '{"descripcion":"' + j.descripcion2 + '"';
                        if (j.valor !== 0)
                            jsonStr += ', "valor":' + j.valor;
                        if (j.valor2 !== 0)
                            jsonStr += ', "valor2":' + j.valor2;

                        jsonStr += "}";
                        index++;
                        //j.descripcion = j.descripcion2;
                        //Arraydata.push(j);
                    }
                });

                var Arraydata = JSON.parse("[" + jsonStr + "]");
                getGrafico("line", "lineVentas", Arraydata, "YYYYMM");
            } else if ($("#sel_bus_tipo").val() === "2") {//Ventas por local
                var arrayOrder = [];
                var arrayLocal = [];
                var fechaAct = "";
                arrayOrder = sortByKey(data.d.Resultado, "descripcion2", "ASC");
                arrayOrder.forEach(function (j) {
                    if (fechaAct !== j.descripcion2) {
                        if (index !== 0)
                            jsonStr += ",";
                        jsonStr += '{"descripcion":"' + j.descripcion2 + '"';
                        //Valor 1
                        var valor1 = arrayOrder.filter(function (item) {
                            return item.descripcion2 === j.descripcion2 && item.valor !== 0;
                        });

                        if (valor1 !== undefined) {
                            for (var i = 0; i < valor1.length; i++) {
                                jsonStr += ', "local' + i.toString() + '":"' + valor1[i].descripcion + '"';
                                jsonStr += ', "valor' + i.toString() + '":' + valor1[i].valor;
                                //Agregando local
                                if (arrayLocal.indexOf(valor1[i].descripcion) === -1) {
                                    arrayLocal.push(valor1[i].descripcion);
                                }

                            }
                        }
                        jsonStr += "}";
                        index++;
                    }
                    fechaAct = j.descripcion2;

                });

                Arraydata = JSON.parse("[" + jsonStr + "]");
                getGrafico("linedinamic", "lineVentas", Arraydata, "YYYYMM", arrayLocal);
            } else if ($("#sel_bus_tipo").val() === "3") {//Gastos por local
                arrayOrder = [];
                arrayLocal = [];
                fechaAct = "";
                arrayOrder = sortByKey(data.d.Resultado, "descripcion2", "ASC");
                arrayOrder.forEach(function (j) {
                    if (fechaAct !== j.descripcion2) {
                        if (index !== 0)
                            jsonStr += ",";
                        jsonStr += '{"descripcion":"' + j.descripcion2 + '"';
                        //Valor 1
                        var valor1 = arrayOrder.filter(function (item) {
                            return item.descripcion2 === j.descripcion2 && item.valor2 !== 0;
                        });

                        if (valor1 !== undefined) {
                            for (var i = 0; i < valor1.length; i++) {
                                jsonStr += ', "local' + i.toString() + '":"' + valor1[i].descripcion + '"';
                                jsonStr += ', "valor' + i.toString() + '":' + valor1[i].valor2;
                                //Agregando local
                                if (arrayLocal.indexOf(valor1[i].descripcion) === -1) {
                                    arrayLocal.push(valor1[i].descripcion);
                                }

                            }
                        }
                        jsonStr += "}";
                        index++;
                    }
                    fechaAct = j.descripcion2;

                });
      
                Arraydata = JSON.parse("[" + jsonStr + "]");
                getGrafico("linedinamic", "lineVentas", Arraydata, "YYYYMM", arrayLocal);
            } else if ($("#sel_bus_tipo").val() === "4") {//Ventas por habitacion
                data.d.Resultado.forEach(function (j) {
                    if (j.ID_LOCAL.toString() === data.d.TipoMensaje) {
                        if (index !== 0)
                            jsonStr += ",";
                        jsonStr += '{"descripcion":"' + j.descripcion + '"';
                        if (j.valor !== 0)
                            jsonStr += ', "valor":' + j.valor;

                        jsonStr += "}";
                        index++;
                        //j.descripcion = j.descripcion2;
                        //Arraydata.push(j);
                    }
                });

                Arraydata = JSON.parse("[" + jsonStr + "]");

                getGrafico("bar", "lineVentas", Arraydata, "YYYYMM");
            }

            var arrMonthNames = Array("ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic");

            //getGrafico("line", "lineVentas", data.d.Resultado, formato_fecha);

            $("#pnl_grafico").modal('show');
        },
        error: function (data) {
            $("#errorDiv").html(GenerarAlertaError("Inconveniente en la operación"));
        }
    });

    function sortByKey(array, key, ord) {
        if (array === null)
            return null;

        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];

            if (ord === 'ASC')
                return x < y ? -1 : x > y ? 1 : 0;
            else if (ord === 'DESC') {
                return x > y ? -1 : x > y ? 0 : 1;
            }
        });
    }


    function getGrafico(tipo, control, datos, formato_fecha, graficos) {
        $("#tituloDetalle").html('<i class="fa fa-bar-chart" aria-hidden="true"></i> Gráfico de ' + $("#sel_bus_tipo option:selected").text());
        if (tipo === "linedinamic") {
            var jsonStr = "";
            var index = 0;
            //Creando los graficos dinamicamente
            graficos.forEach(function (j) {
                if (index === 0) {
                    jsonStr += '{"id":"g1",' +
                        '"bullet": "round",' +
                        '"bulletBorderAlpha": 1,' +
                        '"hideBulletsCount": 50,' +
                        '"lineThickness": 2,' +
                        '"title": "'+j+'",' +
                        '"valueField": "valor' + index.toString() +'",' +
                        '"balloonText": "[[category]]: <b>[[valor' + index.toString()+']]</b>"}';
                } else {
                    jsonStr += ',{"bullet": "round",' +
                        '"title": "'+ j +'",' +
                        '"lineThickness": 2,' +
                        '"valueField": "valor' + index.toString() + '",' +
                        '"balloonText": "[[category]]: <b>[[valor' + index.toString() +']]</b>"}';
                }

                index++;
            });
    
            ArrayGrafico = JSON.parse("[" + jsonStr + "]");

            AmCharts.makeChart(control, {
                "type": "serial",
                "theme": "none",
                "legend": {
                    "align": "center",
                    "equalWidths": false,
                    "periodValueText": "Total: [[value.sum]]",
                    "valueAlign": "left",
                    "valueText": "[[value]]",// ([[percents]]%)",
                    "valueWidth": 100
                },
                "marginRight": 40,
                "marginLeft": 80,
                "startDuration": 1,//efecto rebote
                "autoMarginOffset": 20,
                "mouseWheelZoomEnabled": true,
                "dataDateFormat": formato_fecha,
                "valueAxes": [{
                    "id": "v1",
                    "axisAlpha": 0,
                    "title": "Monto (S/.)",
                    "position": "left",
                    "ignoreAxisWidth": true
                }],
                "colors": ["#258cbb", "#d12610", "#37b7f3", "#52e136"],
                "balloon": {
                    "borderThickness": 2,
                    "shadowAlpha": 0
                },
                "graphs": ArrayGrafico,
                "chartScrollbar": {//scroll horizonal
                    "graph": "g1",
                    "oppositeAxis": false,
                    "offset": 30,
                    "scrollbarHeight": 30,
                    "backgroundAlpha": 0,
                    "selectedBackgroundAlpha": 0.1,
                    "selectedBackgroundColor": "#888888",
                    "graphFillAlpha": 0,
                    "graphLineAlpha": 0.5,
                    "selectedGraphFillAlpha": 0,
                    "selectedGraphLineAlpha": 1,
                    "autoGridCount": true,
                    "color": "#AAAAAA"
                },
                /*"valueScrollbar": {//scroll Vertical
                    "oppositeAxis": false,
                    "offset": 50,
                    //"selectedBackgroundColor": "#258cbb",
                    "scrollbarHeight": 20
                },*/
                "chartCursor": {//MouseOver Valor(valor eje x, y)
                    "pan": true,
                    "valueLineEnabled": true,
                    "valueLineBalloonEnabled": true,
                    "cursorAlpha": 1,
                    "cursorColor": "#258cbb",
                    "limitToGraph": "g1",
                    "valueLineAlpha": 0.2,
                    "categoryBalloonDateFormat": "MMM YYYY",
                    "valueZoomable": true
                },
                "categoryField": "descripcion",
                "categoryAxis": {
                    "parseDates": true,
                    "dashLength": 1,
                    "minorGridEnabled": true
                },
                "export": {
                    "enabled": true
                },
                "dataProvider": datos
            });
        }
        else if (tipo === "bar") {
            AmCharts.makeChart(control, {
                "theme": "light",
                "type": "serial",
                "startDuration": 1,
                "colors": ["#0D8ECF"],
                //"dataDateFormat": formato_fecha,
                "dataProvider": datos,// data.d.Resultado,
                "valueAxes": [{
                    "stackType": "3d",
                    //"unit": "S/.",
                    "position": "left",
                    "title": "Ingresos(S/.)"
                }],
                "graphs": [{
                    "balloonText": "[[category]]: <b>[[valor]]</b>",
                    "fillColorsField": "color",
                    "fillAlphas": 1,
                    "lineAlpha": 0.1,
                    "type": "column",
                    "valueField": "valor"
                }],
                "depth3D": 20,
                "angle": 30,
                "chartCursor": {
                    "pan": true,
                    "valueLineEnabled": true,
                    "valueLineBalloonEnabled": true,
                    "limitToGraph": "g1",
                    "valueLineAlpha": 0.2,
                    //"categoryBalloonDateFormat": "MMM YYYY",
                    "valueZoomable": true,
                    "categoryBalloonEnabled": true,
                    "zoomable": false,
                    "cursorAlpha": 1//Linea vertical en el medio del grafico.
                    //"categoryBalloonDateFormat": "JJ:NN, DD MMMM",
                },
                "categoryField": "descripcion",
                "categoryAxis": {
                    //"monthNames": arrMonthNames,
                    //"timeformat": "%b<br>%Y",
                    //"categoryBalloonDateFormat": "MMM YYYY",
                    //"minPeriod": "MM",
                   // "parseDates": true,
                    "gridPosition": "start",
                    "labelRotation": 50
                },
                "export": {
                    "enabled": true
                }

            });
        } else if (tipo === "line") {
            AmCharts.makeChart(control, {
                "type": "serial",
                "theme": "none",
                "legend": {
                    "align": "center",
                    "equalWidths": false,
                    "periodValueText": "Total: [[value.sum]]",
                    "valueAlign": "left",
                    "valueText": "[[value]]",// ([[percents]]%)",
                    "valueWidth": 100
                  },
                "marginRight": 40,
                "marginLeft": 80,
                "startDuration": 1,//efecto rebote
                "autoMarginOffset": 20,
                "mouseWheelZoomEnabled": true,
                "dataDateFormat": formato_fecha,
                "valueAxes": [{
                    "id": "v1",
                    "axisAlpha": 0,
                    "title": "Monto (S/.)",
                    "position": "left",
                    "ignoreAxisWidth": true
                }],
                "colors": ["#258cbb", "#d12610", "#37b7f3", "#52e136"],
                "balloon": {
                    "borderThickness": 2,
                    "shadowAlpha": 0
                },
                "graphs": [{
                    "id": "g1",
                    "bullet": "round",
                    "bulletBorderAlpha": 1,
                    "hideBulletsCount": 50,
                    "lineThickness": 2,
                    "title": "Ingresos",
                    "valueField": "valor",
                    "balloonText": "[[category]]: <b>[[valor]]</b>"
                }, {
                        "bullet": "round",
                        "title": "Egresos",
                        "lineThickness": 2,
                        "valueField": "valor2",
                        "balloonText": "[[category]]: <b>[[valor2]]</b>"
                    }],
                "chartScrollbar": {//scroll horizonal
                    "graph": "g1",
                    "oppositeAxis": false,
                    "offset": 30,
                    "scrollbarHeight": 30,
                    "backgroundAlpha": 0,
                    "selectedBackgroundAlpha": 0.1,
                    "selectedBackgroundColor": "#888888",
                    "graphFillAlpha": 0,
                    "graphLineAlpha": 0.5,
                    "selectedGraphFillAlpha": 0,
                    "selectedGraphLineAlpha": 1,
                    "autoGridCount": true,
                    "color": "#AAAAAA"
                },
                /*"valueScrollbar": {//scroll Vertical
                    "oppositeAxis": false,
                    "offset": 50,
                    //"selectedBackgroundColor": "#258cbb",
                    "scrollbarHeight": 20
                },*/
                "chartCursor": {//MouseOver Valor(valor eje x, y)
                    "pan": true,
                    "valueLineEnabled": true,
                    "valueLineBalloonEnabled": true,
                    "cursorAlpha": 1,
                    "cursorColor": "#258cbb",
                    "limitToGraph": "g1",
                    "valueLineAlpha": 0.2,
                    "categoryBalloonDateFormat": "MMM YYYY",
                    "valueZoomable": true
                },
                "categoryField": "descripcion",
                "categoryAxis": {
                    "parseDates": true,
                    "dashLength": 1,
                    "minorGridEnabled": true
                },
                "export": {
                    "enabled": true
                },
                "dataProvider": datos
            });
        }
    }
}

/*Eventos por Control*/
$(document).keydown(function (evt) {
    switch (evt ? evt.which : event.keyCode) {
        case 8: //BLOQUEA RETROCESO DE PAGINA
            var valor = document.activeElement.value;
            if (valor === undefined) { return false; } break;
        case 13: //BLOQUEA ENTER
            return false; break;
        case 66: //BUSCAR
            if (evt ? evt.altKey : event.altKey) $("#btn_buscar").click();
            break;
    }
});

$("#pnl_busqueda input:text").keyup(function (e) {
    if (e.keyCode === 13) {
        $("#btn_buscar").click();
    }
});
