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
    public class DTour
    {
        public static List<ETour> ListarTour(ETour objE)
        {
            List<ETour> lista = new List<ETour>();

            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_tour_listar", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@nombre", SqlDbType.VarChar).Value = objE.nombre;

                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        ETour mItem = new ETour();
                        mItem.ID_ENCRIP = EUtil.getEncriptar((dr.IsDBNull(dr.GetOrdinal("id_tour")) ? 0 : dr.GetInt32(dr.GetOrdinal("id_tour"))).ToString());
                        mItem.id_tour = dr.IsDBNull(dr.GetOrdinal("id_tour")) ? 0 : dr.GetInt32(dr.GetOrdinal("id_tour"));
                        mItem.nombre = dr.IsDBNull(dr.GetOrdinal("nombre")) ? string.Empty : dr.GetString(dr.GetOrdinal("nombre"));
                        mItem.DESCRIPCION = dr.IsDBNull(dr.GetOrdinal("descripcion")) ? string.Empty : dr.GetString(dr.GetOrdinal("descripcion"));
                        mItem.detalle = dr.IsDBNull(dr.GetOrdinal("detalle")) ? string.Empty : dr.GetString(dr.GetOrdinal("detalle"));
                        mItem.condicion= dr.IsDBNull(dr.GetOrdinal("condicion")) ? string.Empty : dr.GetString(dr.GetOrdinal("condicion"));
                        mItem.precio = dr.IsDBNull(dr.GetOrdinal("precio")) ? 0 : dr.GetDecimal(dr.GetOrdinal("precio"));

                        lista.Add(mItem);
                    }
                }
            }
            return lista;
        }
        public static ETour ListarTourxId(ETour objE)
        {
            ETour mItem = new ETour();

            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_tour_listarxId", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@id_tour", EUtil.getDesencriptar(objE.ID_ENCRIP));

                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        mItem.nombre = dr.IsDBNull(dr.GetOrdinal("nombre")) ? string.Empty : dr.GetString(dr.GetOrdinal("nombre"));
                        mItem.DESCRIPCION = dr.IsDBNull(dr.GetOrdinal("descripcion")) ? string.Empty : dr.GetString(dr.GetOrdinal("descripcion"));
                        mItem.detalle = dr.IsDBNull(dr.GetOrdinal("detalle")) ? string.Empty : dr.GetString(dr.GetOrdinal("detalle"));
                        mItem.condicion = dr.IsDBNull(dr.GetOrdinal("condicion")) ? string.Empty : dr.GetString(dr.GetOrdinal("condicion"));
                        mItem.caracteristicas = dr.IsDBNull(dr.GetOrdinal("caracteristicas")) ? string.Empty : dr.GetString(dr.GetOrdinal("caracteristicas"));
                        mItem.precio = dr.IsDBNull(dr.GetOrdinal("precio")) ? 0 : dr.GetDecimal(dr.GetOrdinal("precio"));
                    }

                    dr.NextResult();

                    List<EFoto> listaFoto = new List<EFoto>();

                    while (dr.Read())
                    {
                        EFoto mItem2 = new EFoto();
                        mItem2.id_foto_tour = dr.IsDBNull(dr.GetOrdinal("id_foto_tour")) ? 0 : dr.GetInt32(dr.GetOrdinal("id_foto_tour"));
                        mItem2.orden = dr.IsDBNull(dr.GetOrdinal("orden")) ? 0 : dr.GetInt32(dr.GetOrdinal("orden"));
                        mItem2.ruta = dr.IsDBNull(dr.GetOrdinal("ruta")) ? string.Empty : dr.GetString(dr.GetOrdinal("ruta"));

                        listaFoto.Add(mItem2);
                    }

                    mItem.listFoto = listaFoto;
                }
            }
            return mItem;
        }

        public static string actualizarTour(ETour objE)
        {
            int id_tour = 0;
            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_tour_actualizar", cn);
                if (objE.ID_ENCRIP != "")
                {
                    cmd.Parameters.AddWithValue("@id_tour", EUtil.getDesencriptar(objE.ID_ENCRIP));
                }
                cmd.Parameters.AddWithValue("@nombre", objE.nombre);
                cmd.Parameters.AddWithValue("@descripcion", objE.DESCRIPCION);
                cmd.Parameters.AddWithValue("@detalle", objE.detalle);
                cmd.Parameters.AddWithValue("@condicion", objE.condicion);
                cmd.Parameters.AddWithValue("@caracteristicas", objE.caracteristicas);
                cmd.Parameters.AddWithValue("@precio", objE.precio);
                cmd.Parameters.AddWithValue("@usuario", objE.USUARIO.ID_USUARIO);
                cmd.Parameters.AddWithValue("@opcion", objE.OPCION);
                cmd.CommandType = CommandType.StoredProcedure;
                cn.Open();
                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    if (dr.HasRows)
                    {
                        while (dr.Read())
                        {
                            id_tour = dr.IsDBNull(dr.GetOrdinal("id_tour")) ? 0 : dr.GetInt32(dr.GetOrdinal("id_tour"));
                        }
                    }
                }
                return EUtil.getEncriptar(id_tour.ToString());
            }
        }
        public static int anularTour(ETour objE)
        {
            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_tour_anular", cn);
                cmd.Parameters.AddWithValue("@id_tour", EUtil.getDesencriptar(objE.ID_ENCRIP));
                cmd.Parameters.AddWithValue("@usuario", objE.USUARIO.ID_USUARIO);
                cmd.CommandType = CommandType.StoredProcedure;
                cn.Open();
                return cmd.ExecuteNonQuery();
            }
        }
        public static string insertarFotoTour(EFoto objE)
        {
            string ruta = "";
            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_fotoTour_actualizar", cn);
                cmd.Parameters.AddWithValue("@id_tour", EUtil.getDesencriptar(objE.ID_ENCRIP));
                cmd.Parameters.AddWithValue("@ruta", objE.ruta);
                cmd.Parameters.AddWithValue("@orden", objE.orden);
                cmd.Parameters.AddWithValue("@opcion", 1);
                cmd.CommandType = CommandType.StoredProcedure;
                cn.Open();
                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    if (dr.HasRows)
                    {
                        while (dr.Read())
                        {
                            ruta = dr.IsDBNull(dr.GetOrdinal("ruta")) ? string.Empty : dr.GetString(dr.GetOrdinal("ruta"));
                        }
                    }
                }

                return ruta;
            }
        }
        public static string actualizarFotoTour(EFoto objE)
        {
            string ruta = "";
            using (SqlConnection cn = new SqlConnection(DConexion.Get_Connection(DConexion.DataBase.CnVelero)))
            {
                SqlCommand cmd = new SqlCommand("sp_fotoTour_actualizar", cn);
                cmd.Parameters.AddWithValue("@id_foto_tour", EUtil.getDesencriptar(objE.ID_ENCRIP));
                cmd.Parameters.AddWithValue("@ruta", objE.ruta);
                cmd.Parameters.AddWithValue("@opcion", 2);
                cmd.CommandType = CommandType.StoredProcedure;
                cn.Open();
                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    if (dr.HasRows)
                    {
                        while (dr.Read())
                        {
                            ruta = dr.IsDBNull(dr.GetOrdinal("ruta")) ? string.Empty : dr.GetString(dr.GetOrdinal("ruta"));
                        }
                    }
                }

                return ruta;
            }
        }

    }
}