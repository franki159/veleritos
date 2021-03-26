using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDAD
{
    public class EEmpleado:EGeneral
    {
        public int ID_EMPLEADO { get; set; }
        public string NOMBRES { get; set; }
        public string APE_PAT { get; set; }
        public string APE_MAT { get; set; }
        public string APELLIDOS { get; set; }
        public string CARGO { get; set; }
        public decimal SUELDO { get; set; }
        public string DOCUMENTO { get; set; }
        public string TIPO_DOC { get; set; }
        public string NUMERO { get; set; }
        public List<EDocumento> LDOCUMENTOS { get; set; }
    }
}
