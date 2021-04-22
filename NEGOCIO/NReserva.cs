using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ENTIDAD;
using DATOS;

namespace NEGOCIOS
{
    public static class NReserva
    {
        public static EReserva actualizarReserva(EReserva ent)
        {
            return DReserva.actualizarReserva(ent);
        }

        public static List<EReserva> ListarAsiento(EReserva ent)
        {
            return DReserva.ListarAsiento(ent);
        }
    }
}
