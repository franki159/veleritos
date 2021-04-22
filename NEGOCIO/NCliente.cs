using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ENTIDAD;
using DATOS;

namespace NEGOCIOS
{
    public static class NCliente
    {
        public static List<ECliente> BuscarClientes(ECliente ent)
        {
            return DCliente.BuscarClientes(ent);
        }
        public static ECliente BuscarClientesxDocumento(ECliente ent)
        {
            return DCliente.BuscarClientesxDocumento(ent);
        }
    }
}
