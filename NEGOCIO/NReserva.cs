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
        public static EReserva actualizarReservaCliente(EReserva ent)
        {
            return DReserva.actualizarReservaCliente(ent);
        }
        public static List<EReserva> ListarAsiento(EReserva ent)
        {
            return DReserva.ListarAsiento(ent);
        }
        public static int AtenderReserva(EReserva ent)
        {
            return DReserva.AtenderReserva(ent);
        }
        public static int AnularReserva(EReserva ent)
        {
            return DReserva.AnularReserva(ent);
        }
        public static EReserva listarReservaxId(EReserva ent)
        {
            return DReserva.listarReservaxId(ent);
        }
    }
}
