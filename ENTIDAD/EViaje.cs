using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDAD
{
    public class EViaje:EGeneral
    {
        public int id_viaje { get; set; }
        public int id_tour { get; set; }
        public int piloto { get; set; }
        public int copiloto { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public string observacion { get; set; }
        public decimal precio { get; set; }
        public decimal descuento { get; set; }
        public DateTime fecha_ini { get; set; }
        public DateTime fecha_fin { get; set; }
    }
}
