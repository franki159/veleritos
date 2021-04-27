using ENTIDAD;
using Gma.QrCodeNet.Encoding;
using Gma.QrCodeNet.Encoding.Windows.Render;
using NEGOCIOS;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;

namespace solWebVelero.Controllers
{
    public class ProcesoController : Controller
    {
        // GET: Proceso
        #region "Viaje"
        public ActionResult Entrada()
        {
            if (Session["ssUserVelero"] == null)
                return Redirect("~/Seguridad/Login");

            return PartialView("Entrada");
        }
        public JsonResult ListaViaje(EViaje objE)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                if (Session["ssUserVelero"] == null)
                {
                    objRespuesta.Error("Su sesión ha expirado, por favor vuelva a iniciar sesión");
                    return Json(objRespuesta);
                }

                objRespuesta.Resultado = NViaje.ListarViajeVigente(objE);
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public JsonResult ListaPais()
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                if (Session["ssUserVelero"] == null)
                {
                    objRespuesta.Error("Su sesión ha expirado, por favor vuelva a iniciar sesión");
                    return Json(objRespuesta);
                }

                objRespuesta.Resultado = NPais.ListarPais();
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public JsonResult BuscarCliente(ECliente objE)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                if (Session["ssUserVelero"] == null)
                {
                    objRespuesta.Error("Su sesión ha expirado, por favor vuelva a iniciar sesión");
                    return Json(objRespuesta);
                }

                ECliente objResult = new ECliente();

                objResult = NCliente.BuscarClientesxDocumento(objE);

                if (objE.ID_CLIENTE != 0)
                {
                    objRespuesta.Resultado = objResult;
                }
                else
                {
                    objRespuesta = BuscarPersonaPorDni(objE.NUM_DOCUMENTO);
                }
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public ERespuestaJson BuscarPersonaPorDni(string NumeroDocumento = "")
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                ECliente objE = new ECliente();
                String[] svc = new wsConsultaDNI.ServiceDNISoapClient().GetReniec("", NumeroDocumento).ToArray();
                objE.ID_CLIENTE = 0;
                objE.APE_PAT = svc[1];
                objE.APE_MAT = svc[2];
                objE.NOMBRES = svc[3];
                objE.TIPO_DOCUMENTO = "001";
                objE.DIRECCION = svc[16];
                objE.NUM_DOCUMENTO = NumeroDocumento;
                objE.SEXO = (svc[17] == "1" ? "001" : "002");
                objE.FEC_NAC = DateTime.ParseExact(svc[18], "yyyyMMdd", null);

                objRespuesta.Resultado = objE;
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return objRespuesta;
        }
        //        public JsonResult ActualizarReserva(EReserva objE)
        //        {
        //            ERespuestaJson objRespuesta = new ERespuestaJson();
        //            try
        //            {
        //                if (Session["ssUserVelero"] == null)
        //                {
        //                    objRespuesta.Error("Su sesión ha expirado, por favor vuelva a iniciar sesión");
        //                    return Json(objRespuesta);
        //                }

        //                var qrEncoder = new QrEncoder(ErrorCorrectionLevel.H);
        //                var qrCode = qrEncoder.Encode("123456aaa");
        //                var imgBase64 = "";

        //                MemoryStream ms = new MemoryStream();
        //                var renderer = new GraphicsRenderer(new FixedModuleSize(5, QuietZoneModules.Two), Brushes.Black, Brushes.White);
        //                renderer.WriteToStream(qrCode.Matrix, ImageFormat.Png, ms);
        //                //Convirtiendo imagen en decode64 inicio
        //                //var inputAsString = Convert.ToBase64String(ms.ToArray(), Base64FormattingOptions.None);
        //                //imgBase64 = "data:image/png;base64," + inputAsString;
        //                //Fin
        //                ECorreo email = new ECorreo();
        //                email.Enviar_Correo_Solicitud(new ECorreo._Email<ECorreo._Email_Registro>
        //                {
        //                    data = new ECorreo._Email_Registro
        //                    {
        //                        destinatario_usuario = "",
        //                        destinatario_contrasenia = "",
        //                        destinatario_codigo = ""
        //                    },
        //                    remitente = "CENARES",
        //                    remitente_emails = "chara.20.90@gmail.com",
        //                    remitente_password = "S0p0rt31",
        //                    sampleImage = ms,
        //                    plantilla = "<h4>...</h4>" +
        //"<p><img src='" + imgBase64 + "' /></p>" +
        //"<h4>Equipo CENARES</h4>",
        //                    adjunto = imgBase64,
        //                    destinatario_email = "chara.20.90@gmail.com",
        //                    mailSent = false,
        //                    titulo = "Prueba de sistemas"
        //                });
        //            }
        //            catch (Exception ex)
        //            {
        //                objRespuesta.Error(String.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
        //            }
        //            return Json(objRespuesta);
        //        }
        public JsonResult ActualizarReserva(EReserva objE)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                if (Session["ssUserVelero"] == null)
                {
                    objRespuesta.Error("Su sesión ha expirado, por favor vuelva a iniciar sesión");
                    return Json(objRespuesta);
                }

                EReserva objResultado = new EReserva();
                EUsuario eSession = (EUsuario)Session["ssUserVelero"];
                objE.USUARIO = new EUsuario();
                objE.USUARIO.ID_USUARIO = eSession.ID_USUARIO;

                //Pasajeros
                var vPasajeros = "";
                var pasajeroHTML = "";
                pasajeroHTML += "<table style=width:100%;height:auto;margin-top:10px'>";
                pasajeroHTML += "    <thead><tr style='margin:0px;text-align:left;font-size:16px;color:#05589e;width:50%'><td><strong>Pasajero</strong></td><td style='text-align:center'><strong>Documento</strong></td><td style='text-align:right'><strong>Asiento</strong></td></tr><tr><td>&nbsp;</td><td></td><td></td></tr>";
                pasajeroHTML += "    </thead><tbody>";
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
                    pasajeroHTML += "<td style='text-align:left;width:50%'>"+ item.NOMBRES + " " + item.APE_PAT + " " + item.APE_MAT + "</td>";
                    pasajeroHTML += "<td style='text-align:center;'>"+ item.NUM_DOCUMENTO + "</td>";
                    pasajeroHTML += "<td style='text-align:right'>"+item.ASIENTO + "</td></tr>";
                }
                pasajeroHTML += "</tbody></table>";

                objE.vCliente = vPasajeros;

                EReserva objReservaResultado = new EReserva();
                objReservaResultado = NReserva.actualizarReserva(objE);
                objResultado = objReservaResultado;

                if (objReservaResultado.cod_reserva == "")
                {
                    objRespuesta.Error("No se pudo actualizar.");
                }
                else
                {
                    //Generando QR
                    var qrEncoder = new QrEncoder(ErrorCorrectionLevel.H);
                    var qrCode = qrEncoder.Encode(objReservaResultado.cod_reserva);
                    var imgBase64 = "";

                    MemoryStream ms = new MemoryStream();
                    var renderer = new GraphicsRenderer(new FixedModuleSize(5, QuietZoneModules.Two), Brushes.Black, Brushes.White);
                    renderer.WriteToStream(qrCode.Matrix, ImageFormat.Png, ms);
                    //Convirtiendo imagen en decode64 inicio
                    //var inputAsString = Convert.ToBase64String(ms.ToArray(), Base64FormattingOptions.None);
                    //imgBase64 = "data:image/png;base64," + inputAsString;
                    //Fin
                    ECorreo correo = new ECorreo();
                    //Para el usuario
                    correo.Para = objE.correo;
                    //correo.Copia = objE.correo;

                    LinkedResource img = new LinkedResource(ms, "image/png");
                    img.ContentId = "codigoReserva";

                    correo.ImagenEmbebido = img;
                    correo.Asunto = "Veleritos - Reserva asientos";
                    string path = Server.MapPath("~/Controllers/PlantillaHTML/CorreoReserva.txt");
                    // Open the file to read from.
                    string readText = System.IO.File.ReadAllText(path);

                    correo.Mensaje = String.Format(readText, "Tour de prueba", objReservaResultado.cod_reserva, objE.fecha_ini.ToString("dd/MM/yyyy"), objE.fecha_ini.ToString("hh:mm") + " - " + objReservaResultado.fecha_fin.ToString("hh:mm") , pasajeroHTML, String.Format("{0:n0}", objReservaResultado.total));
                    //correo.EnviarImagen();
                }
            }
            catch (Exception ex)
            {
                objRespuesta.Error(String.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }
            return Json(objRespuesta);
        }
        public JsonResult ListaAsiento(EReserva objE)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                if (Session["ssUserVelero"] == null)
                {
                    objRespuesta.Error("Su sesión ha expirado, por favor vuelva a iniciar sesión");
                    return Json(objRespuesta);
                }

                objRespuesta.Resultado = NReserva.ListarAsiento(objE);
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        #endregion
    }
}