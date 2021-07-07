using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDAD
{
    public class ECliente
    {
        public decimal ID_CLIENTE { get; set; }
        public int ASIENTO { get; set; }
        public string NOMBRES { get; set; }
        public string APE_PAT { get; set; }
        public string APE_MAT { get; set; }
        public string TIPO_DOCUMENTO { get; set; }
        public string NUM_DOCUMENTO { get; set; }
        public string SEXO { get; set; }
        public string TELEFONOS { get; set; }
        public string DIRECCION { get; set; }
        public string DESCRIPCION { get; set; }
        public int USU_MOD { get; set; }
        public string CORREO { get; set; }
        public DateTime FEC_NAC { get; set; }
        public string TIPO { get; set; }
        public int OPCION { get; set; }

        /*Entidad para Servicio Web*/
        public string nombre { get; set; }
        public string tipoDocumento { get; set; }
        public string numeroDocumento { get; set; }
        public string estado { get; set; }
        public string condicion { get; set; }
        public string apellidoPaterno { get; set; }
        public string apellidoMaterno { get; set; }
    }
}
