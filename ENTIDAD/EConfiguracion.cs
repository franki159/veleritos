using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDAD
{
    public class EConfiguracion
    {
        public int ID_CONFIG { get; set; }
        public int ID_LOCAL { get; set; }
        public string DESC_CONFIG { get; set; }
        public string COD_CONFIG { get; set; }
        public string TIPO_CONFIG { get; set; }
        public string VALOR { get; set; }
        public int ESTADO { get; set; }
    }
}
