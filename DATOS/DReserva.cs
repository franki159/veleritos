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
                    cmd.Parameters.Add("@cod_reserva", SqlDbType.VarChar, 10).Direction = ParameterDirection.Output;
                    cmd.Parameters.AddWithValue("@tipo_reserva", objE.tipo_reserva);
                    cmd.Parameters.AddWithValue("@medio_pago", objE.medio_pago);
                    cmd.Parameters.AddWithValue("@adelanto", objE.adelanto);
                    cmd.Parameters.AddWithValue("@correo", objE.correo);
                    cmd.Parameters.AddWithValue("@id_pais", objE.id_pais);
                    cmd.Parameters.AddWithValue("@celular", objE.celular);
                    cmd.Parameters.AddWithValue("@observacion", objE.observacion);
                    cmd.Parameters.AddWithValue("@usuario", objE.USUARIO.ID_USUARIO);
                    cmd.Parameters.AddWithValue("@pasajeros", objE.vCliente);
                    cmd.Parameters.AddWithValue("@precio_total", 0).Direction = ParameterDirection.Output;
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
        public static int AtenderReserva(EReserva objE)
        {
            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                EReserva objResult = new EReserva();
                using (SqlCommand cmd = new SqlCommand("sp_reserva_estado", cn))
                {
                    cmd.Parameters.AddWithValue("@id_reserva", objE.id_reserva);
                    cmd.Parameters.AddWithValue("@estado", 1);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cn.Open();
                    return cmd.ExecuteNonQuery();
                }
            }
        }
        public static int AnularReserva(EReserva objE)
        {
            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                EReserva objResult = new EReserva();
                using (SqlCommand cmd = new SqlCommand("sp_reserva_estado", cn))
                {
                    cmd.Parameters.AddWithValue("@id_reserva", objE.id_reserva);
                    cmd.Parameters.AddWithValue("@estado", 0);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cn.Open();
                    return cmd.ExecuteNonQuery();
                }
            }
        }
        public static EReserva actualizarReservaCliente(EReserva objE)
        {
            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                EReserva objResult = new EReserva();
                using (SqlCommand cmd = new SqlCommand("sp_reserva_actualizar_cliente", cn))
                {
                    cmd.Parameters.AddWithValue("@id_reserva", 0).Direction = ParameterDirection.Output;
                    cmd.Parameters.AddWithValue("@id_viaje", objE.id_viaje);
                    cmd.Parameters.Add("@cod_reserva", SqlDbType.VarChar, 10).Direction = ParameterDirection.Output;
                    cmd.Parameters.AddWithValue("@correo", objE.correo);
                    cmd.Parameters.AddWithValue("@id_pais", objE.id_pais);
                    cmd.Parameters.AddWithValue("@celular", objE.celular);
                    cmd.Parameters.AddWithValue("@observacion", objE.observacion);
                    cmd.Parameters.AddWithValue("@pasajeros", objE.vCliente);
                    cmd.Parameters.AddWithValue("@precio_total", 0).Direction = ParameterDirection.Output;
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
        public static List<EReserva> ListarReservaDatos(EReserva objE)
        {
            List<EReserva> lista = new List<EReserva>();

            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_reserva_listarxId", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@id_reserva", objE.id_reserva);
                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        EReserva mItem = new EReserva();
                        mItem.cod_reserva = dr.IsDBNull(dr.GetOrdinal("cod_reserva")) ? string.Empty : dr.GetString(dr.GetOrdinal("cod_reserva"));
                        mItem.fecha_ini = dr.IsDBNull(dr.GetOrdinal("fecha_ini")) ? DateTime.MinValue : dr.GetDateTime(dr.GetOrdinal("fecha_ini"));
                        mItem.fecha_fin = dr.IsDBNull(dr.GetOrdinal("fecha_fin")) ? DateTime.MinValue : dr.GetDateTime(dr.GetOrdinal("fecha_fin"));
                        mItem.adelanto = dr.IsDBNull(dr.GetOrdinal("adelanto")) ? 0 : dr.GetDecimal(dr.GetOrdinal("adelanto"));
                        mItem.correo = dr.IsDBNull(dr.GetOrdinal("correo")) ? string.Empty : dr.GetString(dr.GetOrdinal("correo"));
                        mItem.nombre_tour = dr.IsDBNull(dr.GetOrdinal("nombre")) ? string.Empty : dr.GetString(dr.GetOrdinal("nombre"));
                        mItem.DESCRIPCION = dr.IsDBNull(dr.GetOrdinal("descripcion")) ? string.Empty : dr.GetString(dr.GetOrdinal("descripcion"));
                        mItem.observacion = dr.IsDBNull(dr.GetOrdinal("observacion")) ? string.Empty : dr.GetString(dr.GetOrdinal("observacion"));
                        mItem.total = dr.IsDBNull(dr.GetOrdinal("total")) ? 0 : dr.GetDecimal(dr.GetOrdinal("total"));

                        mItem.asiento = dr.IsDBNull(dr.GetOrdinal("asiento")) ? 0 : dr.GetInt32(dr.GetOrdinal("asiento"));
                        mItem.precio = dr.IsDBNull(dr.GetOrdinal("precio")) ? 0 : dr.GetDecimal(dr.GetOrdinal("precio"));
                        mItem.nom_cli = dr.IsDBNull(dr.GetOrdinal("cliente")) ? string.Empty : dr.GetString(dr.GetOrdinal("cliente"));
                        mItem.ape_pat = dr.IsDBNull(dr.GetOrdinal("ape_pat")) ? string.Empty : dr.GetString(dr.GetOrdinal("ape_pat"));
                        mItem.ape_mat = dr.IsDBNull(dr.GetOrdinal("ape_mat")) ? string.Empty : dr.GetString(dr.GetOrdinal("ape_mat"));
                        mItem.vDocumento = dr.IsDBNull(dr.GetOrdinal("num_documento")) ? string.Empty : dr.GetString(dr.GetOrdinal("num_documento"));
                        lista.Add(mItem);
                    }
                }
            }
            return lista;
        }
        public static EReserva listarReservaxId(EReserva objE)
        {
            EReserva mItem = new EReserva();

            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("usp_mnt_solicitud", cn);
                cmd.Parameters.AddWithValue("@id", objE.id_reserva);
                cmd.Parameters.AddWithValue("@usuario", objE.USUARIO);
                cmd.Parameters.AddWithValue("@opcion", objE.OPCION);
                cmd.CommandType = CommandType.StoredProcedure;
                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        mItem = new EReserva();
                        //mItem.ID = dr.IsDBNull(dr.GetOrdinal("id")) ? 0 : dr.GetDecimal(dr.GetOrdinal("id"));
                        mItem.ID_ENCRIP = EUtil.getEncriptar((dr.IsDBNull(dr.GetOrdinal("id_reserva")) ? 0 : dr.GetDecimal(dr.GetOrdinal("id_reserva"))).ToString());
                        mItem.id_reserva = dr.IsDBNull(dr.GetOrdinal("id_reserva")) ? 0 : dr.GetDecimal(dr.GetOrdinal("id_reserva"));
                        mItem.total = dr.IsDBNull(dr.GetOrdinal("total")) ? 0 : dr.GetDecimal(dr.GetOrdinal("total"));
                        mItem.correo = dr.IsDBNull(dr.GetOrdinal("correo")) ? "" : dr.GetString(dr.GetOrdinal("correo"));
                    }
                }
            }
            return mItem;
        }
    }
}