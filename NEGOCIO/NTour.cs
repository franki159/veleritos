using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ENTIDAD;
using DATOS;

namespace NEGOCIOS
{
    public static class NTour
    {
        public static List<ETour> ListarTour(ETour objE)
        {
            return DTour.ListarTour(objE);
        }
        public static ETour ListarTourxId(ETour objE)
        {
            return DTour.ListarTourxId(objE);
        }
        public static string actualizarTour(ETour ent)
        {
            return DTour.actualizarTour(ent);
        }
        public static int anularTour(ETour ent)
        {
            return DTour.anularTour(ent);
        }
        public static string insertarFotoTour(EFoto ent)
        {
            return DTour.insertarFotoTour(ent);
        }
        public static string actualizarFotoTour(EFoto ent)
        {
            return DTour.actualizarFotoTour(ent);
        }
    }
}
