using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ENTIDAD;
using NEGOCIOS;

namespace solWebVelero.Controllers
{
    public class SeguridadController : Controller
    {
        // GET: Login
        public ActionResult Login()
        {
            ViewBag.Title = "Velero::Login";

            return View();
        }

        public ActionResult CambiarClave()
        {
            ViewBag.Title = "Cambiar Clave";

            return View();
        }

        public ActionResult Permiso()
        {
            ViewBag.Title = "Permiso";

            return View();
        }

        public JsonResult AccederSistema(string usuario, string clave)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                /*Valida usuario*/
                EUsuario eUsuario = new EUsuario();
                eUsuario.DSC_USUARIO = usuario.Trim();
                eUsuario.PASSWORD = clave.Trim();
                eUsuario = NUsuario.Login(eUsuario);

                if (eUsuario == null)
                {
                    objRespuesta.Error("El usuario no existe o Contraseña incorrecta");
                }
                else if (eUsuario.ESTADO == 2)
                {
                    objRespuesta.Error("El usuario se encuentra desactivado");
                }
                else
                {
                    Session["UserData"] = eUsuario;
                    objRespuesta.Mensaje = Session.Timeout.ToString();
                    if (eUsuario.ESTADO == 3)
                        objRespuesta.Resultado = "CambioClave";
                    else
                        objRespuesta.Resultado = "Permiso";
                }
            }
            catch (Exception ex)
            {
                objRespuesta.Error(String.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public JsonResult ListarPermisos()
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                if (Session["UserData"] == null)
                {
                    objRespuesta.Error("Su sesión ha expirado, por favor vuelva a iniciar sesión");
                }
                EUsuario eSession = (EUsuario)Session["UserData"];

                objRespuesta.Resultado = NUsuario.PermisoLocal(eSession.ID_USUARIO);
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public JsonResult AceptaPermiso(int idLocal, string local)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                if (Session["UserData"] == null)
                {
                    objRespuesta.Error("Su sesión ha expirado, por favor vuelva a iniciar sesión");
                }
                EUsuario eSession = (EUsuario)Session["UserData"];

                eSession.LOCAL = new ELocal()
                {
                    ID_LOCAL = idLocal,
                    DESCRIPCION = local
                };

                Session["UserData"] = eSession;

                objRespuesta.Resultado = "../";
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }
            
            return Json(objRespuesta);
        }
        
    }
}