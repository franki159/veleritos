using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace DATOS
{
    public class DUtil
    {
        //public List<T> LeerListaObjetosBDSIDARES<T>(string storedProcedureName, object obj)
        //{
        //    try
        //    {
        //        List<T> lstObject = null;
        //        SqlParameter dbParameters;
        //        string Conex;
        //        Conex = DConexion.Get_Connection(DConexion.DataBase.CnVelero);
        //        using (var oConexion = new SqlConnection(Conex))
        //        {
        //            oConexion.Open();
        //            using (var oComando = new SqlCommand(storedProcedureName, oConexion))
        //            {
        //                oComando.CommandType = CommandType.StoredProcedure;
        //                oComando.CommandTimeout = 15000;
        //                Type objType = obj.GetType();
        //                PropertyInfo[] properties = null;
        //                properties = objType.GetProperties();
        //                SqlCommandBuilder.DeriveParameters(oComando);
        //                PropertyInfo propiedad;
        //                foreach (SqlParameter dbParameterss in oComando.Parameters)
        //                {
        //                    if (dbParameters.ParameterName != "@RETURN_VALUE")
        //                    {
        //                        propiedad = objType.GetProperty(dbParameters.ParameterName.Replace("@", "").Trim);
        //                        dbParameters.Value = Interaction.IIf(propiedad.GetValue(obj, null) == null, DBNull.Value, propiedad.GetValue(obj, null));
        //                    }
        //                }

        //                SqlDataReader dbDataReader = oComando.ExecuteReader();
        //                if (!dbDataReader == null)
        //                {
        //                    lstObject = new List<T>();
        //                    T objEntidad = default(T);

        //                    string campo;
        //                    if (dbDataReader.HasRows)
        //                    {
        //                        while (dbDataReader.Read())
        //                        {
        //                            objEntidad = Activator.CreateInstance<T>();
        //                            for (int i = 0; i <= dbDataReader.FieldCount - 1; i++)
        //                            {
        //                                campo = dbDataReader.GetName(i);
        //                                propiedad = Activator.CreateInstance<T>().GetType().GetProperty(campo);
        //                                propiedad.SetValue(objEntidad, dbDataReader(propiedad.Name), null/* TODO Change to default(_) if this is not a reference type */);
        //                            }
        //                            lstObject.Add(objEntidad);
        //                        }
        //                    }
        //                    dbDataReader.Close();
        //                    dbDataReader = null/* TODO Change to default(_) if this is not a reference type */;
        //                }
        //            }
        //        }

        //        return lstObject;
        //    }
        //    catch (Exception ex)
        //    {
        //        return null;
        //    }
        //}
    }
}
