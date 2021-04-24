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
            public static string no_email = "sistemas@cenares.minsa.gob.pe";
            public static string no_usuario = "Veleritos hotel";
            public static string no_clave = "17Sist3maSL!";
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
                message.To.Add(new MailAddress(obj.destinatario_email_copia));
            }

            if (obj.destinatario_Funcionario != null && obj.destinatario_Funcionario != "")
            {
                message.To.Add(new MailAddress(obj.destinatario_Funcionario));
            }
         
            string cuerpo = obj.plantilla;
            //cuerpo = cuerpo.Replace("{0}", obj.destinatario);
            //cuerpo = cuerpo.Replace("{1}", obj.data.destinatario_usuario);
            //cuerpo = cuerpo.Replace("{2}", obj.data.destinatario_contrasenia);
            LinkedResource img = new LinkedResource(obj.sampleImage, "image/png");
            img.ContentId = "sampleimage";

            string sEmailBody = string.Empty;
            sEmailBody = "Prueba<br><img src=cid:sampleimage>";
            AlternateView htmlView = AlternateView.CreateAlternateViewFromString(sEmailBody, null, System.Net.Mime.MediaTypeNames.Text.Html);
            htmlView.LinkedResources.Add(img);
            
            message.AlternateViews.Add(htmlView); 
            
            //message.Attachments.Add(new Attachment(obj.adjunto) { ContentId = "image001@gembox.com" });

            message.Body = cuerpo;
            
            message.IsBodyHtml = true;
            message.Subject = obj.titulo; // "Postulación electrónica - PRONABEC";

            client.Send(message);
            message.Dispose();

        }
        public void enviarSMTP_local() {
            // Replace sender@example.com with your "From" address. 
            // This address must be verified with Amazon SES.
            String FROM = "chara.20.90@gmail.com";
            String FROMNAME = "Sender Name";

            // Replace recipient@example.com with a "To" address. If your account 
            // is still in the sandbox, this address must be verified.
            String TO = "recipient@amazon.com";

            // Replace smtp_username with your Amazon SES SMTP user name.
            String SMTP_USERNAME = "chara.20.90@gmail.com";

            // Replace smtp_password with your Amazon SES SMTP password.
            String SMTP_PASSWORD = "S0p0rt31";

            // (Optional) the name of a configuration set to use for this message.
            // If you comment out this line, you also need to remove or comment out
            // the "X-SES-CONFIGURATION-SET" header below.
            String CONFIGSET = "ConfigSet";

            // If you're using Amazon SES in a region other than EE.UU. Oeste (Oregón), 
            // replace email-smtp.us-west-2.amazonaws.com with the Amazon SES SMTP  
            // endpoint in the appropriate AWS Region.
            String HOST = "email-smtp.us-west-2.amazonaws.com";

            // The port you will connect to on the Amazon SES SMTP endpoint. We
            // are choosing port 587 because we will use STARTTLS to encrypt
            // the connection.
            int PORT = 587;

            // The subject line of the email
            String SUBJECT =
                "Amazon SES test (SMTP interface accessed using C#)";

            // The body of the email
            String BODY =
                "<h1>Amazon SES Test</h1>" +
                "<p>This email was sent through the " +
                "<a href='https://aws.amazon.com/ses'>Amazon SES</a> SMTP interface " +
                "using the .NET System.Net.Mail library.</p>";

            // Create and build a new MailMessage object
            MailMessage message = new MailMessage();
            message.IsBodyHtml = true;
            message.From = new MailAddress(FROM, FROMNAME);
            message.To.Add(new MailAddress(TO));
            message.Subject = SUBJECT;
            message.Body = BODY;
            // Comment or delete the next line if you are not using a configuration set
            message.Headers.Add("X-SES-CONFIGURATION-SET", CONFIGSET);

            using (var client = new System.Net.Mail.SmtpClient(HOST, PORT))
            {
                // Pass SMTP credentials
                client.Credentials =
                    new NetworkCredential(SMTP_USERNAME, SMTP_PASSWORD);

                // Enable SSL encryption
                client.EnableSsl = true;

                // Try to send the message. Show status in console.
                try
                {
                    Console.WriteLine("Attempting to send email...");
                    client.Send(message);
                    Console.WriteLine("Email sent!");
                }
                catch (Exception ex)
                {
                    Console.WriteLine("The email was not sent.");
                    Console.WriteLine("Error message: " + ex.Message);
                }
            }
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
