using ENTIDAD;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;

namespace solWebVelero.Controllers.Generico
{
    /// <summary>
    /// Descripción breve de hh_imageServ
    /// </summary>
    public class hh_imageServ : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            ERespuestaJson objRespuesta = new ERespuestaJson();
            try
            {
                context.Response.ContentType = "text/plain";
                string str_image = "";
                string str_carpeta = "";

                foreach (string s in context.Request.Files)
                {
                    HttpPostedFile file = context.Request.Files[s];
                    str_image = context.Request.Form["name"];
                    str_carpeta = context.Request.Form["carpeta"];

                    if (!string.IsNullOrEmpty(str_image))
                    {
                        string pathToSave = HttpContext.Current.Server.MapPath(str_carpeta) + str_image;
                        Image img = clsUtil.RedimensionarImagen(file.InputStream, 300);
                        //img.Save(pathToSave);

                        using (MemoryStream stream = new MemoryStream())
                        {
                            img.Save(pathToSave);
                            stream.WriteTo(context.Response.OutputStream);
                        }
                        //file.SaveAs(pathToSave);
                    }
                }
                context.Response.Write(str_image);
            }
            catch (Exception ex)
            {
                //NMascota.log_error(String.IsNullOrEmpty(ex.Message) ? ex.InnerException.Message : ex.Message, "imagen mascota");
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}