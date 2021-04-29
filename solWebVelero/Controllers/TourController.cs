using ENTIDAD;
using NEGOCIOS;
using System;
using System.Collections.Generic;
using System.Linq;
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
    }
}