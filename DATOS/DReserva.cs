using ENTIDAD;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace DATOS
{
    public class DReserva
    {
        public static EReserva actualizarReserva(EReserva objE)
        {
            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                EReserva objResult = new EReserva();
                using (SqlCommand cmd = new SqlCommand("sp_reserva_actualizar", cn))
                {
                    cmd.Parameters.AddWithValue("@id_reserva", 0).Direction = ParameterDirection.Output;
                    cmd.Parameters.AddWithValue("@id_viaje", objE.id_viaje);
                    cmd.Parameters.AddWithValue("@cod_reserva", "").Direction = ParameterDirection.Output;
                    cmd.Parameters.AddWithValue("@tipo_reserva", objE.tipo_reserva);
                    cmd.Parameters.AddWithValue("@medio_pago", objE.medio_pago);
                    cmd.Parameters.AddWithValue("@adelanto", objE.adelanto);
                    cmd.Parameters.AddWithValue("@correo", objE.correo);
                    cmd.Parameters.AddWithValue("@id_pais", objE.id_pais);
                    cmd.Parameters.AddWithValue("@celular", objE.celular);
                    cmd.Parameters.AddWithValue("@observacion", objE.observacion);
                    cmd.Parameters.AddWithValue("@usuario", objE.USUARIO.ID_USUARIO);
                    cmd.Parameters.AddWithValue("@pasajeros", objE.vCliente);
                    cmd.Parameters.AddWithValue("@precio_total", objE.total);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cn.Open();
                    cmd.ExecuteNonQuery();

                    if (cmd.Parameters["@id_reserva"] != null)
                    {
                        objResult.id_reserva = Convert.ToDecimal(cmd.Parameters["@id_reserva"].Value);
                        objResult.cod_reserva = (string)cmd.Parameters["@cod_reserva"].Value;
                        objResult.total = Convert.ToDecimal(cmd.Parameters["@precio_total"].Value);
                    }
                }
                return objResult;
            }
        }
        public static List<EReserva> ListarAsiento(EReserva objE)
        {
            List<EReserva> lista = new List<EReserva>();

            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_asiento_listar", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@id_viaje", objE.id_viaje);
                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        EReserva mItem = new EReserva();
                        mItem.ID_ENCRIP = EUtil.getEncriptar((dr.IsDBNull(dr.GetOrdinal("id_reserva_pasajero")) ? 0 : dr.GetDecimal(dr.GetOrdinal("id_reserva_pasajero"))).ToString());
                        mItem.id_reserva_pasajero = dr.IsDBNull(dr.GetOrdinal("id_reserva_pasajero")) ? 0 : dr.GetDecimal(dr.GetOrdinal("id_reserva_pasajero"));
                        mItem.id_reserva = dr.IsDBNull(dr.GetOrdinal("id_reserva")) ? 0 : dr.GetDecimal(dr.GetOrdinal("id_reserva"));
                        mItem.asiento = dr.IsDBNull(dr.GetOrdinal("asiento")) ? 0 : dr.GetInt32(dr.GetOrdinal("asiento"));
                        mItem.vCliente = dr.IsDBNull(dr.GetOrdinal("vCliente")) ? string.Empty : dr.GetString(dr.GetOrdinal("vCliente"));
                        mItem.vDocumento = dr.IsDBNull(dr.GetOrdinal("num_documento")) ? string.Empty : dr.GetString(dr.GetOrdinal("num_documento"));
                        lista.Add(mItem);
                    }
                }
            }
            return lista;
        }
        
    }
}