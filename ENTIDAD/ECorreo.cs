using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDAD
{
    public class ECorreo
    {
        public class Cuenta
        {
            public static string no_email = "chara.20.90@gmail.com";
            public static string no_usuario = "VELERITOS - Hotel";
            public static string no_clave = "S0p0rt31";
            //public static string no_host = "smtp.gmail.com";
            //public static int nu_port = 587;
            public static string no_host = "relay-hosting.secureserver.net";
            public static int nu_port = 25;
            public static int nu_ssl = 0;
        }

        public string Para = string.Empty;
        public string Copia = string.Empty;
        public string Asunto = string.Empty;
        public List<string> Adjunto = new List<string>();
        public string Mensaje = string.Empty;

        public void Enviar()
        {
            System.Net.Mail.MailMessage Mail = new System.Net.Mail.MailMessage();
            System.Net.Mail.SmtpClient ObjectSmtp = new System.Net.Mail.SmtpClient();

            Mail.From = new System.Net.Mail.MailAddress(Cuenta.no_email, Cuenta.no_usuario);

            /*Agregamos los correos a enviar To*/
            if (!string.IsNullOrEmpty(Para))
                foreach (string item in Para.Split(';'))
                    if (item.Contains("@"))
                        Mail.To.Add(item);

            /*Agregamos los correos a enviar CC*/
            if (!string.IsNullOrEmpty(Copia))
                foreach (string item in Copia.Split(';'))
                    if (item.Contains("@"))
                        Mail.CC.Add(item);

            /*Agregamos los archivos adjuntos*/
            if (Adjunto != null)
            {
                foreach (string archivo in Adjunto)
                {
                    Mail.Attachments.Add(new Attachment(archivo));
                }
            }

            Mail.Subject = Asunto;
            Mail.Body = Mensaje;
            Mail.BodyEncoding = Encoding.GetEncoding("UTF-8");
            Mail.IsBodyHtml = true;
            Mail.Priority = System.Net.Mail.MailPriority.High;

            ObjectSmtp.Host = Cuenta.no_host;
            ObjectSmtp.Port = Cuenta.nu_port;
            //if (Cuenta.nu_ssl == 0)
            //    ObjectSmtp.EnableSsl = true;
            //else
            ObjectSmtp.EnableSsl = false;
            ObjectSmtp.Credentials = new System.Net.NetworkCredential(Cuenta.no_email, Cuenta.no_clave);
            ObjectSmtp.Send(Mail);

            Mail.Dispose();
            ObjectSmtp.Dispose();
        }
    }
}
