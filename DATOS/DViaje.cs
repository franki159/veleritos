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
    public class DViaje
    {
        public static List<EViaje> ListarViaje(EViaje objE)
        {
            List<EViaje> lista = new List<EViaje>();

            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_viaje_listar", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@id_tour", objE.id_tour);
                cmd.Parameters.AddWithValue("@fecha_ini", objE.fecha_ini);
                cmd.Parameters.AddWithValue("@fecha_fin", objE.fecha_fin);
                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        EViaje mItem = new EViaje();
                        mItem.ID_ENCRIP = EUtil.getEncriptar((dr.IsDBNull(dr.GetOrdinal("id_viaje")) ? 0 : dr.GetInt32(dr.GetOrdinal("id_viaje"))).ToString());
                        mItem.nombre = dr.IsDBNull(dr.GetOrdinal("nombre")) ? string.Empty : dr.GetString(dr.GetOrdinal("nombre"));
                        mItem.fecha_ini = dr.IsDBNull(dr.GetOrdinal("fecha_ini")) ? DateTime.MinValue : dr.GetDateTime(dr.GetOrdinal("fecha_ini"));
                        mItem.fecha_fin = dr.IsDBNull(dr.GetOrdinal("fecha_fin")) ? DateTime.MinValue : dr.GetDateTime(dr.GetOrdinal("fecha_fin"));
                        mItem.precio = dr.IsDBNull(dr.GetOrdinal("precio")) ? 0 : dr.GetDecimal(dr.GetOrdinal("precio"));
                        mItem.descuento = dr.IsDBNull(dr.GetOrdinal("descuento")) ? 0 : dr.GetDecimal(dr.GetOrdinal("descuento"));
                        lista.Add(mItem);
                    }
                }
            }
            return lista;
        }
        public static EViaje ListarViajexId(EViaje objE)
        {
            EViaje mItem = new EViaje();

            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_viaje_listarxId", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@id_viaje", EUtil.getDesencriptar(objE.ID_ENCRIP));

                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        mItem.id_tour = dr.IsDBNull(dr.GetOrdinal("id_tour")) ? 0 : dr.GetInt32(dr.GetOrdinal("id_tour"));
                        mItem.piloto = dr.IsDBNull(dr.GetOrdinal("piloto")) ? 0 : dr.GetInt32(dr.GetOrdinal("piloto"));
                        mItem.copiloto = dr.IsDBNull(dr.GetOrdinal("copiloto")) ? 0 : dr.GetInt32(dr.GetOrdinal("copiloto"));
                        mItem.nombre = dr.IsDBNull(dr.GetOrdinal("nombre")) ? string.Empty : dr.GetString(dr.GetOrdinal("nombre"));
                        mItem.descripcion = dr.IsDBNull(dr.GetOrdinal("descripcion")) ? string.Empty : dr.GetString(dr.GetOrdinal("descripcion"));
                        mItem.observacion = dr.IsDBNull(dr.GetOrdinal("observacion")) ? string.Empty : dr.GetString(dr.GetOrdinal("observacion"));
                        mItem.fecha_ini = dr.IsDBNull(dr.GetOrdinal("fecha_ini")) ? DateTime.MinValue : dr.GetDateTime(dr.GetOrdinal("fecha_ini"));
                        mItem.fecha_fin = dr.IsDBNull(dr.GetOrdinal("fecha_fin")) ? DateTime.MinValue : dr.GetDateTime(dr.GetOrdinal("fecha_fin"));
                        mItem.precio = dr.IsDBNull(dr.GetOrdinal("precio")) ? 0 : dr.GetDecimal(dr.GetOrdinal("precio"));
                        mItem.descuento = dr.IsDBNull(dr.GetOrdinal("descuento")) ? 0 : dr.GetDecimal(dr.GetOrdinal("descuento"));
                    }
                }
            }
            return mItem;
        }

        public static int actualizarViaje(EViaje objE)
        {
            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_viaje_actualizar", cn);
                if (objE.ID_ENCRIP != "")
                {
                    cmd.Parameters.AddWithValue("@id_viaje", EUtil.getDesencriptar(objE.ID_ENCRIP));
                }
                cmd.Parameters.AddWithValue("@id_tour", objE.id_tour);
                cmd.Parameters.AddWithValue("@piloto", objE.piloto);
                cmd.Parameters.AddWithValue("@copiloto", objE.copiloto);
                cmd.Parameters.AddWithValue("@nombre", objE.nombre);
                cmd.Parameters.AddWithValue("@descripcion", objE.descripcion);
                cmd.Parameters.AddWithValue("@observacion", objE.observacion);
                cmd.Parameters.AddWithValue("@precio", objE.precio);
                cmd.Parameters.AddWithValue("@descuento", objE.descuento);
                cmd.Parameters.AddWithValue("@fecha_ini", objE.fecha_ini);
                cmd.Parameters.AddWithValue("@fecha_fin", objE.fecha_fin);
                cmd.Parameters.AddWithValue("@usuario", objE.USUARIO.ID_USUARIO);
                cmd.Parameters.AddWithValue("@opcion", objE.OPCION);
                cmd.CommandType = CommandType.StoredProcedure;
                cn.Open();
                return cmd.ExecuteNonQuery();
            }
        }
        public static int anularViaje(EViaje objE)
        {
            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_viaje_anular", cn);
                cmd.Parameters.AddWithValue("@id_viaje", EUtil.getDesencriptar(objE.ID_ENCRIP));
                cmd.Parameters.AddWithValue("@usuario", objE.USUARIO.ID_USUARIO);
                cmd.CommandType = CommandType.StoredProcedure;
                cn.Open();
                return cmd.ExecuteNonQuery();
            }
        }
    }
}