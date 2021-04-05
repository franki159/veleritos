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
    public class DEmpleado
    {
        public static List<EEmpleado> ListarEmpleados(EEmpleado objE)
        {
            List<EEmpleado> lista = new List<EEmpleado>();

            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_empleado_listar", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@NOMBRES", SqlDbType.VarChar).Value = objE.NOMBRES;
                cmd.Parameters.Add("@CARGO", SqlDbType.VarChar).Value = objE.CARGO;

                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        EEmpleado mItem = new EEmpleado();
                        mItem.ID_ENCRIP = EUtil.getEncriptar((dr.IsDBNull(dr.GetOrdinal("ID_EMPLEADO")) ? 0 : dr.GetInt32(dr.GetOrdinal("ID_EMPLEADO"))).ToString());
                        mItem.ID_EMPLEADO = dr.IsDBNull(dr.GetOrdinal("ID_EMPLEADO")) ? 0 : dr.GetInt32(dr.GetOrdinal("ID_EMPLEADO"));
                        mItem.NOMBRES = dr.IsDBNull(dr.GetOrdinal("NOMBRES")) ? string.Empty : dr.GetString(dr.GetOrdinal("NOMBRES"));
                        mItem.APELLIDOS = dr.IsDBNull(dr.GetOrdinal("APELLIDOS")) ? string.Empty : dr.GetString(dr.GetOrdinal("APELLIDOS"));
                        mItem.CARGO = dr.IsDBNull(dr.GetOrdinal("CARGO")) ? string.Empty : dr.GetString(dr.GetOrdinal("CARGO"));
                        mItem.SUELDO = dr.IsDBNull(dr.GetOrdinal("SUELDO")) ? 0 : dr.GetDecimal(dr.GetOrdinal("SUELDO"));

                        lista.Add(mItem);
                    }
                }
            }
            return lista;
        }
        public static EEmpleado ListarEmpleadosxId(EEmpleado objE)
        {
            EEmpleado mItem = new EEmpleado();

            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_empleado_listarxId", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@id_empleado", EUtil.getDesencriptar(objE.ID_ENCRIP));

                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        mItem.NOMBRES = dr.IsDBNull(dr.GetOrdinal("NOMBRES")) ? string.Empty : dr.GetString(dr.GetOrdinal("NOMBRES"));
                        mItem.APE_PAT = dr.IsDBNull(dr.GetOrdinal("APE_PAT")) ? string.Empty : dr.GetString(dr.GetOrdinal("APE_PAT"));
                        mItem.APE_MAT = dr.IsDBNull(dr.GetOrdinal("APE_MAT")) ? string.Empty : dr.GetString(dr.GetOrdinal("APE_MAT"));
                        mItem.CARGO = dr.IsDBNull(dr.GetOrdinal("CARGO")) ? string.Empty : dr.GetString(dr.GetOrdinal("CARGO"));
                        mItem.SUELDO = dr.IsDBNull(dr.GetOrdinal("SUELDO")) ? 0 : dr.GetDecimal(dr.GetOrdinal("SUELDO"));
                    }

                    dr.NextResult();

                    List<EDocumento> listaDocumentos = new List<EDocumento>();

                    while (dr.Read())
                    {
                        EDocumento mItem2 = new EDocumento();
                        mItem2.TIPO_DOC = dr.IsDBNull(dr.GetOrdinal("TIPO_DOC")) ? string.Empty : dr.GetString(dr.GetOrdinal("TIPO_DOC"));
                        mItem2.NUMERO = dr.IsDBNull(dr.GetOrdinal("NUMERO")) ? string.Empty : dr.GetString(dr.GetOrdinal("NUMERO"));

                        listaDocumentos.Add(mItem2);
                    }

                    mItem.LDOCUMENTOS = listaDocumentos;
                }
            }
            return mItem;
        }

        public static int actualizarEmpleado(EEmpleado objE)
        {
            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_empleado_actualizar", cn);
                if (objE.ID_ENCRIP != "")
                {
                    cmd.Parameters.AddWithValue("@id_empleado", EUtil.getDesencriptar(objE.ID_ENCRIP));
                }
                cmd.Parameters.AddWithValue("@nombres", objE.NOMBRES);
                cmd.Parameters.AddWithValue("@ape_pat", objE.APE_PAT);
                cmd.Parameters.AddWithValue("@ape_mat", objE.APE_MAT);
                cmd.Parameters.AddWithValue("@cargo", objE.CARGO);
                cmd.Parameters.AddWithValue("@sueldo", objE.SUELDO);
                cmd.Parameters.AddWithValue("@documento", objE.DOCUMENTO);
                cmd.Parameters.AddWithValue("@usuario", objE.USUARIO.ID_USUARIO);
                cmd.Parameters.AddWithValue("@opcion", objE.OPCION);
                cmd.CommandType = CommandType.StoredProcedure;
                cn.Open();
                return cmd.ExecuteNonQuery();
            }
        }
        public static int anularEmpleado(EEmpleado objE)
        {
            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_empleado_anular", cn);
                cmd.Parameters.AddWithValue("@id_empleado", EUtil.getDesencriptar(objE.ID_ENCRIP));
                cmd.Parameters.AddWithValue("@usuario", objE.USUARIO.ID_USUARIO);
                cmd.CommandType = CommandType.StoredProcedure;
                cn.Open();
                return cmd.ExecuteNonQuery();
            }
        }
    }
}