using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDAD
{
    public class EPais:EGeneral
    {
        public int id_pais { get; set; }
        public string cod_pais { get; set; }
        public string nombre { get; set; }
        public string gentilicio { get; set; }
        public string abreviatura { get; set; }
    }
}
