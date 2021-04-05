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
        #region "EMPLEADO"
        public ActionResult Entrada()
        {
            if (Session["ssUserVelero"] == null)
                return Redirect("~/Seguridad/Login");

            return View();
        }
        #endregion
    }
}