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
                        mItem.APE_PAT = dr.IsDBNull(dr.GetOrdinal("APE_PAT")) ? string.Empty : dr.GetString(dr.GetOrdinal("APE_PAT"));
                        mItem.APE_MAT = dr.IsDBNull(dr.GetOrdinal("APE_MAT")) ? string.Empty : dr.GetString(dr.GetOrdinal("APE_MAT"));
                        mItem.DIRECCION = dr.IsDBNull(dr.GetOrdinal("DIRECCION")) ? string.Empty : dr.GetString(dr.GetOrdinal("DIRECCION"));
                        mItem.TIPO_DOCUMENTO = dr.IsDBNull(dr.GetOrdinal("TIPO_DOCUMENTO")) ? string.Empty : dr.GetString(dr.GetOrdinal("TIPO_DOCUMENTO"));
                        mItem.NUM_DOCUMENTO = dr.IsDBNull(dr.GetOrdinal("NUM_DOCUMENTO")) ? string.Empty : dr.GetString(dr.GetOrdinal("NUM_DOCUMENTO"));
                        lista.Add(mItem);
                    }
                }
            }
            return lista;
        }

        public static ECliente BuscarClientesxDocumento(ECliente objE)
        {
            ECliente mItem = new ECliente();

            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("USP_BUSCAR_CLIENTE", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@NUM_DOCUMENTO", SqlDbType.VarChar).Value = objE.NUM_DOCUMENTO;

                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        mItem.ID_CLIENTE = dr.IsDBNull(dr.GetOrdinal("ID_CLIENTE")) ? 0 : dr.GetDecimal(dr.GetOrdinal("ID_CLIENTE"));
                        mItem.NOMBRES = dr.IsDBNull(dr.GetOrdinal("NOMBRES")) ? string.Empty : dr.GetString(dr.GetOrdinal("NOMBRES"));
                        mItem.APE_PAT = dr.IsDBNull(dr.GetOrdinal("APE_PAT")) ? string.Empty : dr.GetString(dr.GetOrdinal("APE_PAT"));
                        mItem.APE_MAT = dr.IsDBNull(dr.GetOrdinal("APE_MAT")) ? string.Empty : dr.GetString(dr.GetOrdinal("APE_MAT"));
                        mItem.DIRECCION = dr.IsDBNull(dr.GetOrdinal("DIRECCION")) ? string.Empty : dr.GetString(dr.GetOrdinal("DIRECCION"));
                        mItem.TIPO_DOCUMENTO = dr.IsDBNull(dr.GetOrdinal("TIPO_DOCUMENTO")) ? string.Empty : dr.GetString(dr.GetOrdinal("TIPO_DOCUMENTO"));
                        mItem.NUM_DOCUMENTO = dr.IsDBNull(dr.GetOrdinal("NUM_DOCUMENTO")) ? string.Empty : dr.GetString(dr.GetOrdinal("NUM_DOCUMENTO"));
                        mItem.SEXO = dr.IsDBNull(dr.GetOrdinal("SEXO")) ? string.Empty : dr.GetString(dr.GetOrdinal("SEXO"));
                        mItem.FEC_NAC = dr.IsDBNull(dr.GetOrdinal("FECHA_NAC")) ? DateTime.MinValue : dr.GetDateTime(dr.GetOrdinal("FECHA_NAC"));
                    }
                }
            }
            return mItem;
        }
    }
}