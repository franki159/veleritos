using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;

namespace ENTIDAD
{
    public class ECorreo
    {
        public class Cuenta
        {
            public static string no_email = "marketing@worldpetsperu.pe";
            public static string no_usuario = "Veleritos hotel";
            public static string no_clave = "paoleses221017";
            //public static string no_usuario = "Veleritos hotel";
            //public static string no_clave = "S0p0rt31";

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
        public LinkedResource ImagenEmbebido { get; set; }
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
        public void EnviarImagen()
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
            //Para incrustar la imagen INI
            AlternateView htmlView = AlternateView.CreateAlternateViewFromString(Mensaje, null, System.Net.Mime.MediaTypeNames.Text.Html);
            htmlView.LinkedResources.Add(ImagenEmbebido);

            Mail.AlternateViews.Add(htmlView);
            //Fin
            Mail.BodyEncoding = Encoding.GetEncoding("UTF-8");
            Mail.IsBodyHtml = true;
            Mail.Priority = System.Net.Mail.MailPriority.High;

            ObjectSmtp.Host = Cuenta.no_host;
            ObjectSmtp.Port = Cuenta.nu_port;

            ObjectSmtp.EnableSsl = true;
            ObjectSmtp.DeliveryMethod = SmtpDeliveryMethod.Network;
            ObjectSmtp.UseDefaultCredentials = false;
            ObjectSmtp.Credentials = new System.Net.NetworkCredential(Cuenta.no_email, Cuenta.no_clave);
            ObjectSmtp.Send(Mail);

            Mail.Dispose();
            ObjectSmtp.Dispose();
        }

        public void Enviar_Correo_Solicitud(_Email<_Email_Registro> obj)
        {
            var emails = obj.remitente_emails.Split(',');
            int i = new Random().Next(emails.Length); // ejm. length 5 -> 0-4
            var remitente_email = emails[i];

            var client = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(remitente_email, obj.remitente_password)
            };

            MailAddress from = new MailAddress(remitente_email, obj.remitente);
            // Set destinations for the e-mail message.
            MailAddress to = new MailAddress(obj.destinatario_email);



            // Specify the message content.
            MailMessage message = new MailMessage(from, to);

            if (obj.destinatario_email_copia != null && obj.destinatario_email_copia != "")
            {
                var correo_copia = obj.destinatario_email_copia.Split(Convert.ToChar(";"));
                for (int index = 0; index < correo_copia.Length; index++)
                {
                    message.CC.Add(new MailAddress(correo_copia[index]));
                }

            }

            if (obj.destinatario_Funcionario != null && obj.destinatario_Funcionario != "")
            {
                message.To.Add(new MailAddress(obj.destinatario_Funcionario));
            }

            string cuerpo = obj.plantilla;
            //cuerpo = cuerpo.Replace("{0}", obj.destinatario);
            //cuerpo = cuerpo.Replace("{1}", obj.data.destinatario_usuario);
            //cuerpo = cuerpo.Replace("{2}", obj.data.destinatario_contrasenia);
            message.Body = cuerpo;

            message.IsBodyHtml = true;
            message.Subject = obj.titulo; // "Postulación electrónica - PRONABEC";

            client.Send(message);
            message.Dispose();

        }
        public class _Email<T>
        {

            private T Data;
            public T data
            {
                get { return Data; }
                set { this.Data = value; }
            }
            public string remitente { get; set; }
            public string remitente_emails { get; set; }
            public string remitente_password { get; set; }
            public string destinatario { get; set; }
            public string destinatario_email { get; set; }
            public string destinatario_email_copia { get; set; }
            public string destinatario_Funcionario { get; set; }
            public string titulo { get; set; }
            public string plantilla { get; set; }
            public bool mailSent { get; set; }
            public string adjunto { get; set; }
            public MemoryStream sampleImage { get; set; }
        }
        public class _Email_Registro
        {
            public string destinatario_usuario { get; set; }
            public string destinatario_contrasenia { get; set; }
            public string destinatario_codigo { get; set; }
        }
    }
}
