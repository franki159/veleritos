using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ENTIDAD;
using DATOS;

namespace NEGOCIOS
{
    public static class NPais
    {
        public static List<EPais> ListarPais()
        {
            return DPais.ListarPais();
        }
    }
}
