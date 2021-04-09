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

                objRespuesta.Resultado = NCliente.BuscarClientes(objE);
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