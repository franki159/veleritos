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
    public class DEmbarcacion
    {
        public static List<EEmbarcacion> ListarEmbarcacion(EEmbarcacion objE)
        {
            List<EEmbarcacion> lista = new List<EEmbarcacion>();

            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_embarcacion_listar", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@nombre", SqlDbType.VarChar).Value = objE.nombre;

                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        EEmbarcacion mItem = new EEmbarcacion();
                        mItem.ID_ENCRIP = EUtil.getEncriptar((dr.IsDBNull(dr.GetOrdinal("id_embarcacion")) ? 0 : dr.GetInt32(dr.GetOrdinal("id_embarcacion"))).ToString());
                        mItem.id_embarcacion = dr.IsDBNull(dr.GetOrdinal("id_embarcacion")) ? 0 : dr.GetInt32(dr.GetOrdinal("id_embarcacion"));
                        mItem.nombre = dr.IsDBNull(dr.GetOrdinal("nombre")) ? string.Empty : dr.GetString(dr.GetOrdinal("nombre"));
                        mItem.tipo_combustible = dr.IsDBNull(dr.GetOrdinal("tipo_combustible")) ? string.Empty : dr.GetString(dr.GetOrdinal("tipo_combustible"));
                        mItem.color = dr.IsDBNull(dr.GetOrdinal("color")) ? string.Empty : dr.GetString(dr.GetOrdinal("color"));
                        mItem.num_asiento = dr.IsDBNull(dr.GetOrdinal("num_asiento")) ? 0 : dr.GetInt32(dr.GetOrdinal("num_asiento"));

                        lista.Add(mItem);
                    }
                }
            }
            return lista;
        }
        public static EEmbarcacion ListarEmbarcacionxId(EEmbarcacion objE)
        {
            EEmbarcacion mItem = new EEmbarcacion();

            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_embarcacion_listarxId", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@id_embarcacion", EUtil.getDesencriptar(objE.ID_ENCRIP));

                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        mItem.nombre = dr.IsDBNull(dr.GetOrdinal("nombre")) ? string.Empty : dr.GetString(dr.GetOrdinal("nombre"));
                        mItem.tipo_combustible = dr.IsDBNull(dr.GetOrdinal("tipo_combustible")) ? string.Empty : dr.GetString(dr.GetOrdinal("tipo_combustible"));
                        mItem.num_asiento = dr.IsDBNull(dr.GetOrdinal("num_asiento")) ? 0 : dr.GetInt32(dr.GetOrdinal("num_asiento"));
                        mItem.color = dr.IsDBNull(dr.GetOrdinal("color")) ? string.Empty : dr.GetString(dr.GetOrdinal("color"));
                        mItem.id_nave = dr.IsDBNull(dr.GetOrdinal("id_nave")) ? string.Empty : dr.GetString(dr.GetOrdinal("id_nave"));
                        mItem.cod_inter_llam = dr.IsDBNull(dr.GetOrdinal("cod_inter_llam")) ? string.Empty : dr.GetString(dr.GetOrdinal("cod_inter_llam"));
                        mItem.num_omi = dr.IsDBNull(dr.GetOrdinal("num_omi")) ? string.Empty : dr.GetString(dr.GetOrdinal("num_omi"));
                        mItem.ambito = dr.IsDBNull(dr.GetOrdinal("ambito")) ? string.Empty : dr.GetString(dr.GetOrdinal("ambito"));
                        mItem.tipo_nav = dr.IsDBNull(dr.GetOrdinal("tipo_nav")) ? string.Empty : dr.GetString(dr.GetOrdinal("tipo_nav"));
                        mItem.tipo_serv = dr.IsDBNull(dr.GetOrdinal("tipo_serv")) ? string.Empty : dr.GetString(dr.GetOrdinal("tipo_serv"));
                        mItem.constructora = dr.IsDBNull(dr.GetOrdinal("constructora")) ? string.Empty : dr.GetString(dr.GetOrdinal("constructora"));
                    }
                }
            }
            return mItem;
        }

        public static int actualizarEmbarcacion(EEmbarcacion objE)
        {
            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_embarcacion_actualizar", cn);
                if (objE.ID_ENCRIP != "")
                {
                    cmd.Parameters.AddWithValue("@id_embarcacion", EUtil.getDesencriptar(objE.ID_ENCRIP));
                }
                cmd.Parameters.AddWithValue("@nombre", objE.nombre);
                cmd.Parameters.AddWithValue("@tipo_combustible", objE.tipo_combustible);
                cmd.Parameters.AddWithValue("@num_asiento", objE.num_asiento);
                cmd.Parameters.AddWithValue("@color", objE.color);
                cmd.Parameters.AddWithValue("@id_nave", objE.id_nave);
                cmd.Parameters.AddWithValue("@cod_inter_llam", objE.cod_inter_llam);
                cmd.Parameters.AddWithValue("@num_omi", objE.num_omi);
                cmd.Parameters.AddWithValue("@ambito", objE.ambito);
                cmd.Parameters.AddWithValue("@tipo_nav", objE.tipo_nav);
                cmd.Parameters.AddWithValue("@tipo_serv", objE.tipo_serv);
                cmd.Parameters.AddWithValue("@constructora", objE.constructora);
                cmd.Parameters.AddWithValue("@usuario", objE.USUARIO.ID_USUARIO);
                cmd.Parameters.AddWithValue("@opcion", objE.OPCION);
                cmd.CommandType = CommandType.StoredProcedure;
                cn.Open();
                return cmd.ExecuteNonQuery();
            }
        }
        public static int anularEmbarcacion(EEmbarcacion objE)
        {
            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_embarcacion_anular", cn);
                cmd.Parameters.AddWithValue("@id_embarcacion", EUtil.getDesencriptar(objE.ID_ENCRIP));
                cmd.Parameters.AddWithValue("@usuario", objE.USUARIO.ID_USUARIO);
                cmd.CommandType = CommandType.StoredProcedure;
                cn.Open();
                return cmd.ExecuteNonQuery();
            }
        }
    }
}