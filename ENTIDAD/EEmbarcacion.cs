using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDAD
{
    public class EEmbarcacion:EGeneral
    {
        public int id_embarcacion { get; set; }
        public string nombre { get; set; }
        public string tipo_combustible { get; set; }
        public int num_asiento { get; set; }
        public string color { get; set; }
        public string id_nave { get; set; }
        public string cod_inter_llam { get; set; }
        public string num_omi { get; set; }
        public string ambito { get; set; }
        public string tipo_nav { get; set; }
        public string tipo_serv { get; set; }
        public string constructora { get; set; }
    }
}
