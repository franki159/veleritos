using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ENTIDAD;
using System.Data.SqlClient;
using System.Data;

namespace DATOS
{
    public class DPago
    {
        public static int ActualizarPago(EPago objE)
        {
            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("usp_mnt_pago", cn);
                cmd.Parameters.AddWithValue("@id", objE.ID);
                cmd.Parameters.AddWithValue("@num_card", objE.NUM_TARJETA);
                cmd.Parameters.AddWithValue("@total", objE.TOTAL);
                cmd.Parameters.AddWithValue("@estado", objE.ESTADO);
                cmd.Parameters.AddWithValue("@solicitud_id", objE.SOLICITUD_ID);
                cmd.Parameters.AddWithValue("@observacion", objE.OBSERVACION);
                cmd.Parameters.AddWithValue("@usuario", objE.USUARIO);
                cmd.Parameters.AddWithValue("@email", objE.EMAIL);
                cmd.Parameters.AddWithValue("@vEstado", objE.vPARAM1);
                cmd.Parameters.AddWithValue("@opcion", objE.OPCION);
                cmd.CommandType = CommandType.StoredProcedure;
                cn.Open();
                return cmd.ExecuteNonQuery();
            }
        }

        public static List<EPago> listarPagosPendientes()
        {
            List<EPago> lista = new List<EPago>();

            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("usp_mnt_pago", cn);
                cmd.Parameters.AddWithValue("@opcion", 3);
                cmd.CommandType = CommandType.StoredProcedure;
                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        EPago mItem = new EPago();
                        mItem.ID = dr.IsDBNull(dr.GetOrdinal("id")) ? 0 : dr.GetDecimal(dr.GetOrdinal("id"));
                        mItem.SOLICITUD_ID = dr.IsDBNull(dr.GetOrdinal("solicitud_id")) ? 0 : dr.GetDecimal(dr.GetOrdinal("solicitud_id"));
                        mItem.OBSERVACION = dr.IsDBNull(dr.GetOrdinal("observacion")) ? string.Empty : dr.GetString(dr.GetOrdinal("observacion"));
                        mItem.EMAIL = dr.IsDBNull(dr.GetOrdinal("email")) ? string.Empty : dr.GetString(dr.GetOrdinal("email"));
                        lista.Add(mItem);
                    }
                }
            }
            return lista;
        }
    }
}
