using ENTIDAD;
using NEGOCIOS;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;

namespace solWebVelero.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            if (Session["ssUserVelero"] == null) 
                return Redirect("~/Seguridad/Login");
            

            ViewBag.Title = "Home Page";

            return View();
        }

        public ActionResult Error()
        {
            if (Session["ssUserVelero"] == null)
                return Redirect("~/Seguridad/Login");


            ViewBag.Title = "Home Page";

            return PartialView("Error");
        }

        public JsonResult CerrarSesion()
        {
            Session.Clear();

            ERespuestaJson objRespuesta = new ERespuestaJson();
            objRespuesta.Resultado = "Login";
            return Json(objRespuesta);
        }
        public JsonResult InfoSesion()
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


                List<EMenu> listaMenu = NUsuario.PerfilUsuario(eSession.ID_USUARIO).ToList();
                //List<EMenu> listaMenu = NUsuario.PerfilUsuario(eSession.ID_USUARIO).OrderBy(x => x.ID_MENU).ToList();
                //List<EConfiguracion> listaConfig = NUsuario.ConfiguracionHotel(eSession.LOCAL.ID_LOCAL, "").ToList();

                var nomUsuario = eSession.EMPLEADO.NOMBRES.Split(Convert.ToChar(" "));
                var apeUsuario = eSession.EMPLEADO.APELLIDOS.Split(Convert.ToChar(" "));

                objRespuesta.Resultado = new
                {
                    Usuario = nomUsuario[0] + " " + apeUsuario[0],
                    LocalDesc = eSession.LOCAL.DESCRIPCION,
                    ListaMenu = listaMenu,
                    Perfil = eSession.EMPLEADO.CARGO//,
                    //ListaConfig = listaConfig
                };
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public JsonResult GetParametros(string opcion)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();

            try
            {
                objRespuesta.Resultado = NUsuario.ListarParametro(opcion).ToList();
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public JsonResult GetConfiguracion(string cod_grupo)
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

                List<EConfiguracion> listaConfig = NUsuario.ConfiguracionHotel(eSession.LOCAL.ID_LOCAL, cod_grupo).ToList();

                objRespuesta.Resultado = new
                {
                    ListaConfiguracion = listaConfig
                };
            }
            catch (Exception ex)
            {
                objRespuesta.Error(string.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message);
            }

            return Json(objRespuesta);
        }
        public JsonResult getDatosPersona(EServicio objE)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            HttpClient clientHttp = new HttpClient();
            string tipoDoc = "";

            if (objE.NUM_DOC.Length > 8)
            {
                clientHttp.BaseAddress = new Uri(ConfigurationManager.AppSettings.Get("servicioSunat"));
                tipoDoc = "ruc";
            }
            else
            {
                clientHttp.BaseAddress = new Uri(ConfigurationManager.AppSettings.Get("servicioReniec"));
                tipoDoc = "dni";
            }

            var request = clientHttp.GetAsync(tipoDoc + "/" + objE.NUM_DOC).Result;
            if (request.IsSuccessStatusCode)
            {
                objRespuesta.Resultado = request.Content.ReadAsStringAsync().Result;
            }
            else
            {
                objRespuesta.Error("Error en el servicio consultado.");
            }

            return Json(objRespuesta);
        }
    }
}
