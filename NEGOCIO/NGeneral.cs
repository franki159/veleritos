using DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NEGOCIO
{
    public class NGeneral
    {
        public static int log_error(string p_error, string p_tipo)
        {
            return DGeneral.log_error(p_error, p_tipo);
        }
    }
}
