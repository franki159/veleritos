using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDAD
{
    public class EReserva:EGeneral
    {
        public decimal id_reserva { get; set; }
        public decimal id_reserva_pasajero { get; set; }
        public int id_viaje { get; set; }
        public int id_cliente { get; set; }
        public string nombre_tour { get; set; }
        public string cod_reserva { get; set; }
        public string tipo_reserva { get; set; }
        public string medio_pago { get; set; }
        public decimal adelanto { get; set; }
        public decimal total { get; set; }
        public int asiento { get; set; }
        public int cant_asiento { get; set; }
        public string observacion { get; set; }
        public string correo { get; set; }
        public int id_pais { get; set; }
        public string celular { get; set; }
        public List<ECliente> listaCliente { get; set; }
        public string vCliente { get; set; }
        public string vDocumento { get; set; }
    }
}
