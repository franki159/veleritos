using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDAD
{
    public class ELocal
    {
        public int ID_EMPRESA { get; set; }
        public int ID_LOCAL { get; set; }
        public string URL_LOGO { get; set; }
        public string DESCRIPCION { get; set; }
        public string EMPRESA { get; set; }
        public DateTime FECHA_REG { get; set; }
        public int ESTADO { get; set; }
        public int OPCION { get; set; }
    }
}
