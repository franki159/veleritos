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
    }
}
