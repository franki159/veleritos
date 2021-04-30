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

                if (objE.ID_CLIENTE != 0)
                {
                    objRespuesta.Resultado = objResult;
                }
                else
                {
                    objRespuesta = ProcesoController.BuscarPersonaPorDni(objE.NUM_DOCUMENTO);
                }
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }

        public JsonResult ActualizarReserva(EReserva objE)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
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
                    pasajeroHTML += "<td style='text-align:left;width:50%'>" + item.NOMBRES + " " + item.APE_PAT + " " + item.APE_MAT + "</td>";
                    pasajeroHTML += "<td style='text-align:center;'>" + item.NUM_DOCUMENTO + "</td>";
                    pasajeroHTML += "<td style='text-align:right'>" + item.ASIENTO + "</td></tr>";
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

                    correo.Mensaje = String.Format(readText, "Tour de prueba", objReservaResultado.cod_reserva, objE.fecha_ini.ToString("dd/MM/yyyy"), objE.fecha_ini.ToString("hh:mm") + " - " + objReservaResultado.fecha_fin.ToString("hh:mm"), pasajeroHTML, String.Format("{0:n0}", objReservaResultado.total));
                    //correo.EnviarImagen();
                }
            }
            catch (Exception ex)
            {
                objRespuesta.Error(String.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }
            return Json(objRespuesta);
        }
    }
}