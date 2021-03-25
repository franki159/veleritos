using ENTIDAD;
using NEGOCIOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace solWebVelero.Controllers
{
    public class MantenimientoController : Controller
    {
        // GET: Mantenimiento
        public ActionResult Empleado()
        {
            return View();
        }
        public JsonResult ListaEmpleados(EEmpleado objE)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                if (Session["UserData"] == null)
                {
                    Redirect("~/Seguridad/Login");
                    return Json("CloseSession");
                }
                EUsuario eSession = (EUsuario)Session["UserData"];

                objRespuesta.Resultado = NEmpleado.ListarEmpleados(objE);
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
    }
}