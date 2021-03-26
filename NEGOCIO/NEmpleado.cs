using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ENTIDAD;
using DATOS;

namespace NEGOCIOS
{
    public static class NEmpleado
    {
        public static List<EEmpleado> ListarEmpleados(EEmpleado objE)
        {
            return DEmpleado.ListarEmpleados(objE);
        }
        public static EEmpleado ListarEmpleadosxId(EEmpleado objE)
        {
            return DEmpleado.ListarEmpleadosxId(objE);
        }
        public static int actualizarEmpleado(EEmpleado ent)
        {
            return DEmpleado.actualizarEmpleado(ent);
        }
        public static int anularEmpleado(EEmpleado ent)
        {
            return DEmpleado.anularEmpleado(ent);
        }
    }
}
