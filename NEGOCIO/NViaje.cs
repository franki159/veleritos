using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ENTIDAD;
using DATOS;

namespace NEGOCIOS
{
    public static class NViaje
    {
        public static List<EViaje> ListarViaje(EViaje objE)
        {
            return DViaje.ListarViaje(objE);
        }
        public static List<EViaje> ListarViajeVigente(EViaje objE)
        {
            return DViaje.ListarViajeVigente(objE);
        }
        
        public static EViaje ListarViajexId(EViaje objE)
        {
            return DViaje.ListarViajexId(objE);
        }
        public static int actualizarViaje(EViaje ent)
        {
            return DViaje.actualizarViaje(ent);
        }
        public static int anularViaje(EViaje ent)
        {
            return DViaje.anularViaje(ent);
        }
    }
}
