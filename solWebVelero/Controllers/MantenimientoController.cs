using ENTIDAD;
using NEGOCIOS;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace solWebVelero.Controllers
{
    public class MantenimientoController : Controller
    {
        // GET: Mantenimiento
        #region "EMPLEADO"
        public ActionResult Empleado()
        {
            if (Session["ssUserVelero"] == null)
                return Redirect("~/Seguridad/Login");

            return PartialView("Empleado");
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
        #endregion
        #region "EMBARCACION"
        public ActionResult Embarcacion()
        {
            if (Session["ssUserVelero"] == null)
                return Redirect("~/Seguridad/Login");

            return PartialView("Embarcacion");
        }
        public JsonResult ListaEmbarcacion(EEmbarcacion objE)
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

                objRespuesta.Resultado = NEmbarcacion.ListarEmbarcacion(objE);
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public JsonResult ObtenerEmbarcacionxId(EEmbarcacion objE)
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

                objRespuesta.Resultado = NEmbarcacion.ListarEmbarcacionxId(objE);
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public JsonResult ActualizarEmbarcacion(EEmbarcacion objE)
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

                objResultado = NEmbarcacion.actualizarEmbarcacion(objE).ToString();

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
        public JsonResult AnularEmbarcacion(EEmbarcacion objE)
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

                objResultado = NEmbarcacion.anularEmbarcacion(objE);

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
        #endregion
        #region "TOUR"
        public ActionResult Tour()
        {
            if (Session["ssUserVelero"] == null)
                return Redirect("~/Seguridad/Login");

            return PartialView("Tour");
        }
        public JsonResult ListaTour(ETour objE)
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

                objRespuesta.Resultado = NTour.ListarTour(objE);
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public JsonResult ObtenerTourxId(ETour objE)
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

                objRespuesta.Resultado = NTour.ListarTourxId(objE);
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public JsonResult ActualizarTour(ETour objE)
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

                objResultado = NTour.actualizarTour(objE);

                if (objResultado == "")
                {
                    objRespuesta.Error("No se pudo actualizar.");
                }
                else {
                    objRespuesta.Resultado = objResultado;
                }
            }
            catch (Exception ex)
            {
                objRespuesta.Error(String.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }
            return Json(objRespuesta);
        }
        public JsonResult AnularTour(ETour objE)
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

                objResultado = NTour.anularTour(objE);

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
        public JsonResult InsertarFotoTour(EFoto objE)
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
         
                objResultado = NTour.insertarFotoTour(objE);

                if (objResultado == "")
                {
                    objRespuesta.Error("No se pudo eliminar.");
                }else {
                    objRespuesta.Resultado = objResultado;
                }
            }
            catch (Exception ex)
            {
                objRespuesta.Error(String.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }
            return Json(objRespuesta);
        }
        public JsonResult ActualizarFotoTour(EFoto objE)
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

                objResultado = NTour.actualizarFotoTour(objE);

                if (objResultado == "")
                {
                    objRespuesta.Error("No se pudo eliminar.");
                }
                else
                {
                    objRespuesta.Resultado = objResultado;
                }
            }
            catch (Exception ex)
            {
                objRespuesta.Error(String.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }
            return Json(objRespuesta);
        }
        #endregion
        #region "VIAJE"
        public ActionResult Viaje()
        {
            if (Session["ssUserVelero"] == null)
                return Redirect("~/Seguridad/Login");

            return PartialView("Viaje");
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
                EUsuario eSession = (EUsuario)Session["ssUserVelero"];

                objRespuesta.Resultado = NViaje.ListarViaje(objE);
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public JsonResult ObtenerViajexId(EViaje objE)
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

                objRespuesta.Resultado = NViaje.ListarViajexId(objE);
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public JsonResult ActualizarViaje(EViaje objE)
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

                objResultado = NViaje.actualizarViaje(objE).ToString();

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
        public JsonResult AnularViaje(EViaje objE)
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

                objResultado = NViaje.anularViaje(objE);

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
        #endregion
    }
}