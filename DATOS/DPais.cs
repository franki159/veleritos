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
    public class DPais
    {
        public static List<EPais> ListarPais()
        {
            List<EPais> lista = new List<EPais>();

            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_pais_listar", cn);
                cmd.CommandType = CommandType.StoredProcedure;

                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        EPais mItem = new EPais();
                        mItem.ID_ENCRIP = EUtil.getEncriptar((dr.IsDBNull(dr.GetOrdinal("id_pais")) ? 0 : dr.GetInt32(dr.GetOrdinal("id_pais"))).ToString());
                        mItem.id_pais = dr.IsDBNull(dr.GetOrdinal("id_pais")) ? 0 : dr.GetInt32(dr.GetOrdinal("id_pais"));
                        mItem.cod_pais = dr.IsDBNull(dr.GetOrdinal("cod_pais")) ? string.Empty : dr.GetString(dr.GetOrdinal("cod_pais"));
                        mItem.nombre = dr.IsDBNull(dr.GetOrdinal("nombre")) ? string.Empty : dr.GetString(dr.GetOrdinal("nombre"));
                        mItem.gentilicio = dr.IsDBNull(dr.GetOrdinal("gentilicio")) ? string.Empty : dr.GetString(dr.GetOrdinal("gentilicio"));
                        mItem.abreviatura = dr.IsDBNull(dr.GetOrdinal("abreviatura")) ? string.Empty : dr.GetString(dr.GetOrdinal("abreviatura"));

                        lista.Add(mItem);
                    }
                }
            }
            return lista;
        }
    }
}