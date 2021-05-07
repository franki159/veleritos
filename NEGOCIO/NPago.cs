using DATOS;
using ENTIDAD;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NEGOCIO
{
    public class NPago
    {
        public static int ActualizarPago(EPago ent)
        {
            return DPago.ActualizarPago(ent);
        }
        public static List<EPago> listarPagosPendientes()
        {
            return DPago.listarPagosPendientes();
        }
    }
}
