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
            if (Session["ssUserVelero"] == null)
                return Redirect("~/Seguridad/Login");

            return View();
        }
        public ActionResult Embarcacion()
        {
            if (Session["ssUserVelero"] == null)
                return Redirect("~/Seguridad/Login");

            return View();
        }
        public JsonResult ListaEmpleados(EEmpleado objE)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                if (Session["ssUserVelero"] == null)
                {
                    objRespuesta.Error("Su sesión ha expirado, por favor vuelva a iniciar sesión");
                    return Json(objRespuesta);
                }
                EUsuario eSession = (EUsuario)Session["ssUserVelero"];

                objRespuesta.Resultado = NEmpleado.ListarEmpleados(objE);
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public JsonResult ObtenerEmpleadoxId(EEmpleado objE)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                if (Session["ssUserVelero"] == null)
                {
                    objRespuesta.Error("Su sesión ha expirado, por favor vuelva a iniciar sesión");
                    return Json(objRespuesta);
                }
                EUsuario eSession = (EUsuario)Session["ssUserVelero"];

                objRespuesta.Resultado = NEmpleado.ListarEmpleadosxId(objE);
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        
        public JsonResult ActualizarEmpleado(EEmpleado objE)
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
                if (objE.ID_ENCRIP == null || objE.ID_ENCRIP == "")
                {
                    objE.ID_ENCRIP = "";
                    objE.OPCION = 1;
                }
                else
                {
                    objE.OPCION = 2;
                }

                objResultado = NEmpleado.actualizarEmpleado(objE).ToString();

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
        public JsonResult AnularEmpleado(EEmpleado objE)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                if (Session["ssUserVelero"] == null)
                {
                    objRespuesta.Error("Su sesión ha expirado, por favor vuelva a iniciar sesión");
                    return Json(objRespuesta);
                }

                int objResultado = 0;
                EUsuario eSession = (EUsuario)Session["ssUserVelero"];
                objE.USUARIO = new EUsuario();
                objE.USUARIO.ID_USUARIO = eSession.ID_USUARIO;
                
                objResultado = NEmpleado.anularEmpleado(objE);

                if (objResultado == 0)
                {
                    objRespuesta.Error("No se pudo eliminar.");
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