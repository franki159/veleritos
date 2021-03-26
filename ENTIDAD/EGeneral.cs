using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDAD
{
    public class EGeneral
    {
        public string ID_ENCRIP { get; set; }
        public string CODIGO { get; set; }
        public string DESCRIPCION { get; set; }
        public DateTime FECHA_REG { get; set; }
        public int ESTADO { get; set; }
        public int OPCION { get; set; }
        public EUsuario USUARIO { get; set; }
    }
}
