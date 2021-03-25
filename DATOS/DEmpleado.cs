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
        
    }
}
