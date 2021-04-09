using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDAD
{
    public class ECliente
    {
        public int ID_CLIENTE { get; set; }
        public string NOMBRES { get; set; }
        public string APELLIDOS { get; set; }
        public int ID_TIPO_DOCUMENTO { get; set; }
        public string NUM_DOCUMENTO { get; set; }
        public string TELEFONOS { get; set; }
        public string DIRECCION { get; set; }
        public string DESCRIPCION { get; set; }
        public int USU_MOD { get; set; }
        public string CORREO { get; set; }
        public Nullable<DateTime> FEC_NAC { get; set; }
        public int OPCION { get; set; }
    }
}
