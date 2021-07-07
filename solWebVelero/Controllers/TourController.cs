using ENTIDAD;
using Gma.QrCodeNet.Encoding;
using Gma.QrCodeNet.Encoding.Windows.Render;
using MercadoPago;
using MercadoPago.Resources;
using MercadoPago.DataStructures.Payment;
using MercadoPago.Common;
using NEGOCIOS;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using Newtonsoft.Json;
using NEGOCIO;

namespace solWebVelero.Controllers
{
    public class TourController : Controller
    {
        // GET: Tour
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Viaje()
        {
            return View();
        }
        public ActionResult SeleccionViaje()
        {
            return View();
        }
        public ActionResult SeleccionAsiento()
        {
            return View();
        }
        public ActionResult paymentGen()
        {
            if (Session["solicitudPedido"] == null) Response.Redirect("~/Tour");
            EReserva objPedido = new EReserva();

            objPedido = (EReserva)Session["solicitudPedido"];

            //get params form
            float payAmount = (objPedido == null ? 0 : (float)objPedido.total);//Request.Form["transaction_amount"];
            var tokencard = Request.Form["token"];
            var payMethod = Request.Form["payment_method_id"];
            var docType = Request["docType"];
            var docNumber = Request["docNumber"];

            var installmt = 1;//Request.Form["installments"];***********cuotas

            if (tokencard != null && payMethod != null && payAmount != 0)
            {
                var p_email = Request.Form["email"];
                var rp_payment = response_pay_mp(payMethod, payAmount, p_email, objPedido.id_reserva.ToString(), tokencard, installmt, docType, docNumber);

                if (rp_payment != null)
                {
                    PaymentStatus rp_respose = processPaymentResponse(rp_payment, objPedido.id_reserva, p_email);

                    if (rp_respose == MercadoPago.Common.PaymentStatus.approved || rp_respose == MercadoPago.Common.PaymentStatus.authorized)
                        Response.Redirect("~/Tour/pago_exitoso?vtoken=" + System.Uri.EscapeDataString(EUtil.getEncriptar(objPedido.id_reserva.ToString())), true);
                    else if (rp_respose == MercadoPago.Common.PaymentStatus.cancelled)
                        Response.Redirect("~/Tour/pago_error?vTipo=" + EUtil.getEncriptar("cancelled"), true);
                    else if (rp_respose == MercadoPago.Common.PaymentStatus.rejected)
                        Response.Redirect("~/Tour/pago_error?vTipo=" + EUtil.getEncriptar("rejected"), true);
                    else if (rp_respose == MercadoPago.Common.PaymentStatus.in_process)
                        Response.Redirect("~/Tour/pago_error?vTipo=" + EUtil.getEncriptar("in_process"), false);
                }
                else
                {
                    Content("alert('El pago no se realizó, volver a intentar.')");
                }
            }

            return View();
        }
        public ActionResult pago_exitoso()
        {
            return View();
        }
        public ActionResult pago_error()
        {
            return View();
        }
        public JsonResult ListaTour(ETour objE)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                objRespuesta.Resultado = NTour.ListarTour(objE);
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public JsonResult ListaViaje(EViaje objE)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                objE.id_tour = Convert.ToInt32(EUtil.getDesencriptar(objE.ID_ENCRIP));
                objRespuesta.Resultado = NViaje.ListarViajeVigente(objE);
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public JsonResult MapearViaje(EViaje objE)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                objE.id_viaje = Convert.ToInt32(EUtil.getDesencriptar(objE.ID_ENCRIP));
                objRespuesta.Resultado = NViaje.MapearViajexId(objE);
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public JsonResult ListaAsiento(EReserva objE)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                objRespuesta.Resultado = NReserva.ListarAsiento(objE);
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public JsonResult wsSearchIdentityFromSystem(ECliente objE)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                ECliente objResult = new ECliente();

                objResult = NCliente.BuscarClientesxDocumento(objE);

                if (objResult.ID_CLIENTE != 0)
                {
                    objRespuesta.Resultado = objResult;
                }
                else
                {
                    objRespuesta = ProcesoController.getDatosPersona(objE.NUM_DOCUMENTO);
                }
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }

        public JsonResult getPedidoItemWM()
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                if (Session["solicitudPedido"] == null)
                {
                    objRespuesta.Error("NS");
                }

                //Get datos Pedido
                EReserva objPedido = new EReserva();
                objPedido = (EReserva)Session["solicitudPedido"];

                if (objPedido.id_reserva == 0)
                {
                    objRespuesta.Error("SR");
                }
                else
                {
                    objRespuesta.Resultado = objPedido;
                }
            }
            catch (Exception ex)
            {
                objRespuesta.Error(String.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }
            return Json(objRespuesta);
        }
        public JsonResult ActualizarReserva(EReserva objE)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                EReserva objResultado = new EReserva();

                //Pasajeros
                var vPasajeros = "";
                var pasajeroHTML = "";
                foreach (ECliente item in objE.listaCliente)
                {
                    vPasajeros += item.ASIENTO + ",";
                    vPasajeros += item.TIPO_DOCUMENTO + ",";
                    vPasajeros += item.NUM_DOCUMENTO + ",";
                    vPasajeros += item.FEC_NAC.ToString("dd/MM/yyyy") + ",";
                    vPasajeros += item.NOMBRES + ",";
                    vPasajeros += item.APE_PAT + ",";
                    vPasajeros += item.APE_MAT + ",";
                    vPasajeros += item.SEXO + "|";

                    pasajeroHTML += "<tr style='font -size:16px;color:#05589e'>";
                    pasajeroHTML += "<td style='text-align:left;width:50%'>" + item.NOMBRES + " " + item.APE_PAT + " " + item.APE_MAT + "</td>";
                    pasajeroHTML += "<td style='text-align:center;'>" + item.NUM_DOCUMENTO + "</td>";
                    pasajeroHTML += "<td style='text-align:right'>" + item.ASIENTO + "</td></tr>";
                }

                objE.vCliente = vPasajeros;

                objResultado = NReserva.actualizarReservaCliente(objE);

                if (objResultado.cod_reserva == "")
                {
                    objRespuesta.Error("No se pudo actualizar.");
                }
                else
                {
                    objResultado.fecha_ini = objE.fecha_ini;
                    objResultado.fecha_fin = objE.fecha_fin;
                    objResultado.correo = objE.correo;
                    objResultado.vCliente = pasajeroHTML;

                    Session["solicitudPedido"] = objResultado;
                }
            }
            catch (Exception ex)
            {
                objRespuesta.Error(String.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }
            return Json(objRespuesta);
        }
        public JsonResult ListarReservaData(EReserva objE)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                decimal id_reserva = Convert.ToDecimal(EUtil.getDesencriptar(objE.ID_ENCRIP));
                List<EReserva> listadoReserva = NReserva.ListarReservaDatos(new EReserva
                {
                    id_reserva = id_reserva
                });
                //************************* Generando QR ******************************
                var qrEncoder = new QrEncoder(ErrorCorrectionLevel.H);
                var qrCode = qrEncoder.Encode(listadoReserva[0].cod_reserva);

                MemoryStream ms = new MemoryStream();
                var renderer = new GraphicsRenderer(new FixedModuleSize(5, QuietZoneModules.Two), Brushes.Black, Brushes.White);
                renderer.WriteToStream(qrCode.Matrix, ImageFormat.Png, ms);
                //Convirtiendo imagen en decode64 inicio
                var inputAsString = Convert.ToBase64String(ms.ToArray(), Base64FormattingOptions.None);
                var imgBase64 = "data:image/png;base64," + inputAsString;
                //******************* Listado de los pasajeros ************************
                var pasajeroHTML = "";
                decimal ntotal = 0;
                foreach (EReserva item in listadoReserva)
                {
                    pasajeroHTML += "<tr style='font-size:12px;color:#333'>";
                    pasajeroHTML += "<td style='text-align:left;width:50%'>" + item.nom_cli + " " + item.ape_pat + " " + item.ape_mat + "</td>";
                    pasajeroHTML += "<td style='text-align:center;'>" + item.vDocumento + "</td>";
                    pasajeroHTML += "<td style='text-align:right'>" + item.asiento + "</td></tr>";

                    ntotal += item.total;
                }

                string path = System.Web.HttpContext.Current.Server.MapPath("~/Controllers/PlantillaHTML/CorreoReserva.txt");
                // Open the file to read from.
                string readText = System.IO.File.ReadAllText(path);
                objRespuesta.Resultado = String.Format(readText, listadoReserva[0].nombre_tour, listadoReserva[0].cod_reserva, "<img style='width:150px;' src='" + imgBase64 + "'>", listadoReserva[0].fecha_ini.ToString("dd/MM/yyyy"), listadoReserva[0].fecha_ini.ToString("hh:mm") + " - " + listadoReserva[0].fecha_fin.ToString("hh:mm"), pasajeroHTML, String.Format("{0:n0}", ntotal));

            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public static void enviarMail(string p_para, string p_tipo, string p_adicional)
        {
            if (p_tipo == "aprobada")
            {
                EReserva objPedido = new EReserva();
                objPedido = (EReserva)System.Web.HttpContext.Current.Session["solicitudPedido"];

                ECorreo correo = new ECorreo();
                //Generando QR
                var qrEncoder = new QrEncoder(ErrorCorrectionLevel.H);
                var qrCode = qrEncoder.Encode(objPedido.cod_reserva);

                MemoryStream ms = new MemoryStream();
                var renderer = new GraphicsRenderer(new FixedModuleSize(5, QuietZoneModules.Two), Brushes.Black, Brushes.White);
                renderer.WriteToStream(qrCode.Matrix, ImageFormat.Png, ms);
                //Convirtiendo imagen en decode64 inicio
                //var inputAsString = Convert.ToBase64String(ms.ToArray(), Base64FormattingOptions.None);
                //imgBase64 = "data:image/png;base64," + inputAsString;
                //Fin
                //Para el usuario
                correo.Para = objPedido.correo;
                //correo.Copia = objE.correo;

                LinkedResource img = new LinkedResource(ms, "image/png");
                img.ContentId = "codigoReserva";

                correo.ImagenEmbebido = img;
                correo.Asunto = "Veleritos - Reserva asientos";
                string path = System.Web.HttpContext.Current.Server.MapPath("~/Controllers/PlantillaHTML/CorreoReserva.txt");
                // Open the file to read from.
                string readText = System.IO.File.ReadAllText(path);

                correo.Mensaje = String.Format(readText, "Tour de prueba", objPedido.cod_reserva, "<img src=cid:codigoReserva>", objPedido.fecha_ini.ToString("dd/MM/yyyy"), objPedido.fecha_ini.ToString("hh:mm") + " - " + objPedido.fecha_fin.ToString("hh:mm"), objPedido.vCliente, String.Format("{0:n0}", objPedido.total));

                try
                {
                    correo.EnviarImagen();
                }
                catch (Exception ex)
                {
                    NGeneral.log_error("enviarMail::" + (String.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message), "pago");
                }
            }
            else
            {
                ECorreo correo = new ECorreo();

                var p_asunto = "";
                var mensaje = "";

                switch (p_tipo)
                {
                    case "proceso":
                        p_asunto = "Solicitud en proceso";
                        mensaje += "<h4>¡Saludos desde Veleritos!</h4>";
                        mensaje += "<p>Su solicitud está siendo procesada, su banco puede tardar algunos días para confirmar el pago. Si tiene alguna consulta no dude en contactarse con nosotros.</p><h4>Equipo Veleritos</h4>";
                        break;
                    case "cancelada":
                        p_asunto = "Solicitud cancelada";
                        mensaje += "<h4>¡Saludos desde Veleritos!</h4>";
                        mensaje += "<p>Su solicitud fue cancelada, no se pudo confirmar el pago.</p><h4>Equipo Veleritos</h4>";
                        break;
                    case "mercadopago":
                        p_asunto = "Pago pendiente";
                        mensaje += "<h4>¡Saludos desde Veleritos!</h4>";
                        mensaje += "<p>Su solicitud está siendo procesada, deberá acercarse al banco y brindar el código de Pago en efectivo.</p><h4>Equipo Veleritos</h4>";
                        break;
                    default:
                        break;
                }

                correo.Para = p_para;
                correo.Asunto = p_asunto;
                correo.Mensaje = mensaje;
                try
                {
                    correo.Enviar();
                }
                catch (Exception ex)
                {
                    NGeneral.log_error("enviarMail::" + (String.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message), "pago");
                }
            }
        }
        #region "MERCADOPAGO"
        public static object response_pay_mp(string payMethod, float payAmount, string email, string numPedido, string tokencard, int installmt, string docType, string docNumber)
        {
            object payResult = null;

            if (MercadoPago.SDK.AccessToken == null)
                MercadoPago.SDK.AccessToken = ConfigurationManager.AppSettings.Get("ACCESS_TOKEN");

            var payment = new Payment
            {
                TransactionAmount = payAmount,
                Token = tokencard,
                Installments = installmt,
                PaymentMethodId = payMethod,
                Description = "Pedido Rump: " + numPedido,
                ExternalReference = numPedido,

                Payer = new Payer
                {
                    Email = email,
                    Identification = new Identification()
                    {
                        Type = docType,
                        Number = docNumber
                    }
                }
            };


            try
            {
                payment.Save();
                payResult = payment;
            }
            catch (Exception ex)
            {
                NGeneral.log_error("response_pay_mp::" + (String.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message), "pago");
                payResult = null;
            }

            return payResult;
        }
        public static object response_pay_mp(string payMethod, float payAmount, string email, string numPedido)
        {
            object payResult = null;

            if (MercadoPago.SDK.AccessToken == null)
                MercadoPago.SDK.AccessToken = ConfigurationManager.AppSettings.Get("ACCESS_TOKEN");

            var payment = new Payment
            {
                TransactionAmount = payAmount,
                PaymentMethodId = payMethod,//"pagoefectivo_atm",
                Description = "Pedido Rump: " + numPedido,
                ExternalReference = numPedido,

                Payer = new Payer
                {
                    Email = email
                },
            };

            payment.Save();
            payResult = payment;

            return payResult;
        }
        private static int savePayDatabase(float total, string carnum, decimal solicitud_id, int opcion, string observacion, int estado, string mail, string vestado)
        {
            EPago objPago = new EPago();
            objPago.TOTAL = total;
            objPago.NUM_TARJETA = carnum;
            objPago.SOLICITUD_ID = solicitud_id;
            objPago.OPCION = opcion;
            objPago.OBSERVACION = observacion;
            objPago.ESTADO = estado;
            objPago.EMAIL = mail;
            objPago.vPARAM1 = vestado;
            return NPago.ActualizarPago(objPago);
        }

        public PaymentStatus processPaymentResponse(dynamic payment, decimal numPedido, string p_email)
        {
            EReserva objSol = new EReserva();
            objSol.id_reserva = numPedido;
            PaymentStatus result_estado;
            try
            {
                if (payment.Status == MercadoPago.Common.PaymentStatus.approved || payment.Status == MercadoPago.Common.PaymentStatus.authorized)
                {
                    //Actualiza el estado de la solicitud a APROBADO
                    objSol.COMENTARIO = "approved::MercadoPago";
                    //Guardando datos pago
                    savePayDatabase(payment.TransactionAmount, payment.Card.LastFourDigits, numPedido, 2, JsonConvert.SerializeObject(payment), 1, p_email, "approved");
                    //Atendiendo solicitud
                    NReserva.AtenderReserva(objSol);
                    //enviarMail(p_email, "aprobada", numPedido.ToString());

                    //Limpiando sesiones
                    Session["solicitudPedido"] = null;
                }
                else if (payment.Status == MercadoPago.Common.PaymentStatus.cancelled)
                {
                    //cancelado
                    //Actualiza el estado de la solicitud a ANULADO
                    objSol.COMENTARIO = "cancelled::MercadoPago";
                    NGeneral.log_error("cancelled::" + JsonConvert.SerializeObject(payment), "pago");
                    NReserva.AnularReserva(objSol);

                    //Limpiando sesiones
                    Session["solicitudPedido"] = null;
                }
                else if (payment.Status == MercadoPago.Common.PaymentStatus.rejected)
                {
                    //fallido
                    //Actualiza el estado de la solicitud a ANULADO
                    objSol.COMENTARIO = "rejected::MercadoPago";
                    NGeneral.log_error("rejected::" + JsonConvert.SerializeObject(payment), "pago");
                    NReserva.AnularReserva(objSol);

                    //Limpiando sesiones
                    Session["solicitudPedido"] = null;
                }
                else if (payment.Status == MercadoPago.Common.PaymentStatus.in_process)
                {
                    //Caso particular de MercadoPago (pago pendiente de revision, se da hasta 6hrs para revision)
                    //savePayDatabase(payment.TransactionAmount, payment.Card.LastFourDigits, numPedido, 2, JsonConvert.SerializeObject(payment), 2, p_email, "in_process");
                    objSol.COMENTARIO = "rejected::MercadoPago";
                    NGeneral.log_error("rejected::" + JsonConvert.SerializeObject(payment), "in_process");
                    //Eliminando pago
                    cancel_pay_mp(payment.Id);
                    NReserva.AnularReserva(objSol);
                    //Limpiando sesiones
                    Session["solicitudPedido"] = null;
                }
                else
                {
                    //Error en la pasarela de pago. Intente nuevamente por favor
                    NGeneral.log_error("Estado no considerado::" + JsonConvert.SerializeObject(payment), "pago");
                    NReserva.AnularReserva(objSol);
                    //ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "Alerta", "alert('(E02) El pago no se realizó, volver a intentar.')", true);
                }

                result_estado = payment.Status;
            }
            catch (Exception ex)
            {
                NGeneral.log_error("processPaymentResponse::" + (String.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message), "pago");
                NReserva.AnularReserva(objSol);
                //ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "Alerta", "alert('" + (String.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message) + "')", true);
                result_estado = 0;
            }

            return result_estado;
        }
        public void cancel_pay_mp(object id)
        {
            if (MercadoPago.SDK.AccessToken == null)
                MercadoPago.SDK.AccessToken = ConfigurationManager.AppSettings.Get("ACCESS_TOKEN");
            if (MercadoPago.SDK.ClientId == null)
                MercadoPago.SDK.ClientId = ConfigurationManager.AppSettings.Get("CLIENT_ID");
            if (MercadoPago.SDK.ClientSecret == null)
                MercadoPago.SDK.ClientSecret = ConfigurationManager.AppSettings.Get("CLIENT_SECRET");

            Payment payment = Payment.FindById((long)id);
            payment.Status = MercadoPago.Common.PaymentStatus.cancelled;
            payment.Update();
        }
        #endregion
    }
}