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
    public class DCliente
    {
        public static List<ECliente> BuscarClientes(ECliente objE)
        {
            List<ECliente> lista = new List<ECliente>();

            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("USP_BUSCAR_CLIENTE", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@NUM_DOCUMENTO", SqlDbType.VarChar).Value = objE.NUM_DOCUMENTO;
                cmd.Parameters.Add("@NOMBRES", SqlDbType.VarChar).Value = objE.NOMBRES;

                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        ECliente mItem = new ECliente();
                        mItem.ID_CLIENTE = dr.IsDBNull(dr.GetOrdinal("ID_CLIENTE")) ? 0 : dr.GetInt32(dr.GetOrdinal("ID_CLIENTE"));
                        mItem.NOMBRES = dr.IsDBNull(dr.GetOrdinal("NOMBRES")) ? string.Empty : dr.GetString(dr.GetOrdinal("NOMBRES"));
                        mItem.APELLIDOS = dr.IsDBNull(dr.GetOrdinal("APELLIDOS")) ? string.Empty : dr.GetString(dr.GetOrdinal("APELLIDOS"));
                        mItem.ID_TIPO_DOCUMENTO = dr.IsDBNull(dr.GetOrdinal("ID_TIPO_DOCUMENTO")) ? 0 : dr.GetInt32(dr.GetOrdinal("ID_TIPO_DOCUMENTO"));
                        mItem.DESCRIPCION = dr.IsDBNull(dr.GetOrdinal("DESCRIPCION")) ? string.Empty : dr.GetString(dr.GetOrdinal("DESCRIPCION"));
                        mItem.DIRECCION = dr.IsDBNull(dr.GetOrdinal("DIRECCION")) ? string.Empty : dr.GetString(dr.GetOrdinal("DIRECCION"));
                        mItem.NUM_DOCUMENTO = dr.IsDBNull(dr.GetOrdinal("NUM_DOCUMENTO")) ? string.Empty : dr.GetString(dr.GetOrdinal("NUM_DOCUMENTO"));
                        lista.Add(mItem);
                    }
                }
            }
            return lista;
        }
    }
}