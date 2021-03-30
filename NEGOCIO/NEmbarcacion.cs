using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ENTIDAD;
using DATOS;

namespace NEGOCIOS
{
    public static class NEmbarcacion
    {
        public static List<EEmbarcacion> ListarEmbarcacion(EEmbarcacion objE)
        {
            return DEmbarcacion.ListarEmbarcacion(objE);
        }
        public static EEmbarcacion ListarEmbarcacionxId(EEmbarcacion objE)
        {
            return DEmbarcacion.ListarEmbarcacionxId(objE);
        }
        public static int actualizarEmbarcacion(EEmbarcacion ent)
        {
            return DEmbarcacion.actualizarEmbarcacion(ent);
        }
        public static int anularEmbarcacion(EEmbarcacion ent)
        {
            return DEmbarcacion.anularEmbarcacion(ent);
        }
    }
}
