using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace DATOS
{
    public static class DConexion
    {
        public enum DataBase
        {
            CnVelero = 1
        }

        public static string Get_Connection(DataBase tipo)
        {
            switch (tipo)
            {
                case DataBase.CnVelero:
                    return ConfigurationManager.ConnectionStrings["CnnBDVelero"].ConnectionString;
                default:
                    return String.Empty;
            }
        }
    }
}
