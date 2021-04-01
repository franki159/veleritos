using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDAD
{
    public class ETour:EGeneral
    {
        public int id_tour { get; set; }
        public string nombre { get; set; }
        public string detalle { get; set; }
        public string condicion { get; set; }
        public string caracteristicas { get; set; }
        public decimal precio { get; set; }

        public List<EFoto>listFoto { get; set; }
    }

    public class EFoto : EGeneral
    {
        public int id_foto_tour { get; set; }
        public int orden { get; set; }
        public string ruta { get; set; }
    }
}
