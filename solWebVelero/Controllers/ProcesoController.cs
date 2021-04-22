using ENTIDAD;
using NEGOCIOS;
using System;
using System.Collections.Generic;
using System.Linq;
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
                else {
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

                string objResultado = "";
                EUsuario eSession = (EUsuario)Session["ssUserVelero"];
                objE.USUARIO = new EUsuario();
                objE.USUARIO.ID_USUARIO = eSession.ID_USUARIO;

                //Pasajeros
                var vPasajeros = "";
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
                }

                objE.vCliente = vPasajeros;

                objResultado = NReserva.actualizarReserva(objE).ToString();

                if (objResultado == "")
                {
                    objRespuesta.Error("No se pudo actualizar.");
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