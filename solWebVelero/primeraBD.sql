USE [master]
GO
/****** Object:  Database [BD_BOTICA]    Script Date: 26/03/2021 18:51:28 ******/
CREATE DATABASE [BD_BOTICA] ON  PRIMARY 
( NAME = N'BD_BOTICA', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10.SQLEXPRESS\MSSQL\DATA\BD_BOTICA.mdf' , SIZE = 2304KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'BD_BOTICA_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10.SQLEXPRESS\MSSQL\DATA\BD_BOTICA_log.LDF' , SIZE = 576KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [BD_BOTICA] SET COMPATIBILITY_LEVEL = 100
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [BD_BOTICA].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [BD_BOTICA] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [BD_BOTICA] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [BD_BOTICA] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [BD_BOTICA] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [BD_BOTICA] SET ARITHABORT OFF 
GO
ALTER DATABASE [BD_BOTICA] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [BD_BOTICA] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [BD_BOTICA] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [BD_BOTICA] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [BD_BOTICA] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [BD_BOTICA] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [BD_BOTICA] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [BD_BOTICA] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [BD_BOTICA] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [BD_BOTICA] SET  ENABLE_BROKER 
GO
ALTER DATABASE [BD_BOTICA] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [BD_BOTICA] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [BD_BOTICA] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [BD_BOTICA] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [BD_BOTICA] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [BD_BOTICA] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [BD_BOTICA] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [BD_BOTICA] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [BD_BOTICA] SET  MULTI_USER 
GO
ALTER DATABASE [BD_BOTICA] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [BD_BOTICA] SET DB_CHAINING OFF 
GO
USE [BD_BOTICA]
GO
/****** Object:  Schema [caja]    Script Date: 26/03/2021 18:51:28 ******/
CREATE SCHEMA [caja]
GO
/****** Object:  UserDefinedFunction [dbo].[FU_DEVUELVE_PARAMETRO]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[FU_DEVUELVE_PARAMETRO](  
 @COD_GRUPO VARCHAR(20),  
 @COD_PARAMETRO CHAR(3)  
)  
RETURNS VARCHAR(500)  
BEGIN  
 DECLARE @RETURN VARCHAR(500)  
  
 SET @RETURN =(  
  
 SELECT   
  P.DSC_PARAMETRO  
 FROM  
  T_PARAMETROS P  
 WHERE   
  P.COD_GRUPO = @COD_GRUPO  
  AND P.COD_PARAMETRO = @COD_PARAMETRO  
 )   
  
 RETURN ISNULL(@RETURN,'' )  
END
GO
/****** Object:  UserDefinedFunction [dbo].[fu_retorna_fechasis]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create  FUNCTION [dbo].[fu_retorna_fechasis]()
RETURNS DATETIME
BEGIN
	DECLARE @RETURN DATETIME

	SET @RETURN =(SELECT DATEADD(HOUR,2,GETDATE())) 

	RETURN @RETURN
END
GO
/****** Object:  Table [dbo].[T_CLIENTE]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[T_CLIENTE](
	[ID_CLIENTE] [decimal](18, 0) IDENTITY(1,1) NOT NULL,
	[NOMBRES] [varchar](200) NULL,
	[APELLIDOS] [varchar](200) NULL,
	[TIPO_DOCUMENTO] [varchar](2) NULL,
	[NUM_DOCUMENTO] [varchar](20) NULL,
	[DIRECCION] [varchar](1000) NULL,
	[TELEFONOS] [varchar](1000) NULL,
	[FECHA_REG] [datetime] NULL,
	[USU_REG] [int] NULL,
	[FECHA_MOD] [datetime] NULL,
	[USU_MOD] [int] NULL,
	[ESTADO] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_CLIENTE] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[T_COMPROBANTE]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[T_COMPROBANTE](
	[ID_COMPROBANTE] [int] IDENTITY(1,1) NOT NULL,
	[ID_CLIENTE] [int] NULL,
	[ID_ATENCION] [int] NULL,
	[SERIE] [varchar](5) NULL,
	[NUMERO] [varchar](20) NULL,
	[TIPO_COMPROBANTE] [char](3) NULL,
	[SUBTOTAL] [decimal](18, 5) NULL,
	[IGV] [decimal](18, 5) NULL,
	[TOTAL] [decimal](18, 5) NULL,
	[FECHA] [datetime] NULL,
	[FECHA_REG] [datetime] NULL,
	[USU_REG] [int] NULL,
	[FECHA_MOD] [datetime] NULL,
	[USU_MOD] [int] NULL,
	[ESTADO] [int] NULL,
	[OBSERVACION] [varchar](500) NULL,
	[ID_MOVIMIENTO] [int] NULL,
	[TIPO_OPERACION] [varchar](3) NULL,
	[ID_LOCAL] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_COMPROBANTE] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[T_CONFIGURACION]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[T_CONFIGURACION](
	[ID_CONFIG] [int] IDENTITY(1,1) NOT NULL,
	[ID_LOCAL] [int] NULL,
	[DESC_CONFIG] [varchar](200) NULL,
	[COD_CONFIG] [varchar](50) NULL,
	[TIPO_CONFIG] [varchar](20) NULL,
	[VALOR] [varchar](100) NULL,
	[ESTADO] [int] NULL,
	[FECHA_REG] [datetime] NULL,
	[COD_GRUPO] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_CONFIG] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[T_DOCUMENTO_EMPLEADO]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[T_DOCUMENTO_EMPLEADO](
	[ID_EMPLEADO] [int] NULL,
	[TIPO_DOC] [varchar](200) NULL,
	[NUMERO] [varchar](200) NULL,
	[FECHA_REG] [datetime] NULL,
	[USU_REG] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[t_embarcacion]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[t_embarcacion](
	[id_embarcacion] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](200) NULL,
	[tipo_combustible] [varchar](3) NULL,
	[num_asiento] [int] NULL,
	[color] [varchar](3) NULL,
	[id_nave] [varchar](100) NULL,
	[cod_inter_llam] [varchar](100) NULL,
	[num_omi] [varchar](100) NULL,
	[ambito] [varchar](3) NULL,
	[tipo_nav] [varchar](3) NULL,
	[tipo_serv] [varchar](3) NULL,
	[constructora] [varchar](3) NULL,
	[estado] [int] NULL,
	[usu_reg] [int] NULL,
	[usu_mod] [int] NULL,
	[fecha_reg] [datetime] NULL,
	[fecha_mod] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id_embarcacion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[T_EMPLEADO]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[T_EMPLEADO](
	[ID_EMPLEADO] [int] IDENTITY(1,1) NOT NULL,
	[NOMBRES] [varchar](200) NULL,
	[CARGO] [varchar](50) NULL,
	[SUELDO] [decimal](18, 2) NULL,
	[ESTADO] [int] NULL,
	[APE_PAT] [varchar](200) NULL,
	[APE_MAT] [varchar](200) NULL,
	[USU_REG] [int] NULL,
	[USU_MOD] [int] NULL,
	[FECHA_MOD] [datetime] NULL,
	[FECHA_REG] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_EMPLEADO] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[T_EMPRESA]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[T_EMPRESA](
	[ID_EMPRESA] [int] IDENTITY(1,1) NOT NULL,
	[DESCRIPCION] [varchar](200) NULL,
	[RAZON_SOCIAL] [varchar](500) NULL,
	[RUC] [varchar](20) NULL,
	[FECHA_REG] [datetime] NULL,
	[ESTADO] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_EMPRESA] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[T_LOCAL]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[T_LOCAL](
	[ID_LOCAL] [int] IDENTITY(1,1) NOT NULL,
	[ID_EMPRESA] [int] NULL,
	[DESCRIPCION] [varchar](20) NULL,
	[FECHA_REG] [datetime] NULL,
	[ESTADO] [int] NULL,
	[URL_LOGO] [varchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_LOCAL] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[T_MENU]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[T_MENU](
	[ID_MENU] [int] IDENTITY(1,1) NOT NULL,
	[ID_PADRE] [int] NULL,
	[DESCRIPCION] [varchar](50) NULL,
	[URL] [varchar](200) NULL,
	[FECHA_REG] [datetime] NULL,
	[ESTADO] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_MENU] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[T_PARAMETROS]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[T_PARAMETROS](
	[COD_PARAMETRO] [char](3) NULL,
	[COD_GRUPO] [varchar](20) NULL,
	[DSC_PARAMETRO] [varchar](200) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[T_PERFIL]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[T_PERFIL](
	[ID_PERFIL] [int] IDENTITY(1,1) NOT NULL,
	[DESCRIPCION] [varchar](200) NULL,
	[MENU] [varchar](1000) NULL,
	[FECHA_REG] [datetime] NULL,
	[ESTADO] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_PERFIL] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[T_USUARIO]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[T_USUARIO](
	[ID_USUARIO] [int] IDENTITY(1,1) NOT NULL,
	[ID_EMPLEADO] [int] NULL,
	[DSC_USUARIO] [varchar](20) NULL,
	[PASSWORD] [varchar](1000) NULL,
	[FECHA_REG] [datetime] NULL,
	[ESTADO] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_USUARIO] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[T_USUARIO_PERFIL]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[T_USUARIO_PERFIL](
	[ID_USUARIO_PERFIL] [int] IDENTITY(1,1) NOT NULL,
	[ID_PERFIL] [int] NULL,
	[ID_USUARIO] [int] NULL,
	[FECHA_REG] [datetime] NULL,
	[LOCAL] [varchar](1000) NULL,
	[ESTADO] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_USUARIO_PERFIL] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  UserDefinedFunction [dbo].[fu_split_col2]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fu_split_col2] (
    @string varchar(max)
)
RETURNS TABLE
AS
RETURN
    WITH cte 
     AS (SELECT Replace(Rtrim(Ltrim(split.a.value('.', 'VARCHAR(100)'))), '|','.') AS split_data 
         FROM   (SELECT Cast ('<M>' + Replace(@string, ',', '</M><M>') 
                              + '</M>' AS XML) AS Data) AS A 
                CROSS apply data.nodes ('/M') AS Split(a)) 
	SELECT 
		   COLUMN1 = Parsename(split_data, 2), 
		   COLUMN2 = Parsename(split_data, 1) 
	FROM   cte 
GO
SET IDENTITY_INSERT [dbo].[T_CONFIGURACION] ON 

INSERT [dbo].[T_CONFIGURACION] ([ID_CONFIG], [ID_LOCAL], [DESC_CONFIG], [COD_CONFIG], [TIPO_CONFIG], [VALOR], [ESTADO], [FECHA_REG], [COD_GRUPO]) VALUES (1, 1, N'Logo local', N'LL', N'string', N'img/charpe.png', 1, NULL, NULL)
SET IDENTITY_INSERT [dbo].[T_CONFIGURACION] OFF
GO
INSERT [dbo].[T_DOCUMENTO_EMPLEADO] ([ID_EMPLEADO], [TIPO_DOC], [NUMERO], [FECHA_REG], [USU_REG]) VALUES (2, N'01', N'aac', CAST(N'2021-03-25T17:55:18.263' AS DateTime), 1)
INSERT [dbo].[T_DOCUMENTO_EMPLEADO] ([ID_EMPLEADO], [TIPO_DOC], [NUMERO], [FECHA_REG], [USU_REG]) VALUES (2, N'02', N'bbc', CAST(N'2021-03-25T17:55:18.263' AS DateTime), 1)
INSERT [dbo].[T_DOCUMENTO_EMPLEADO] ([ID_EMPLEADO], [TIPO_DOC], [NUMERO], [FECHA_REG], [USU_REG]) VALUES (2, N'03', N'ccc', CAST(N'2021-03-25T17:55:18.263' AS DateTime), 1)
GO
SET IDENTITY_INSERT [dbo].[T_EMPLEADO] ON 

INSERT [dbo].[T_EMPLEADO] ([ID_EMPLEADO], [NOMBRES], [CARGO], [SUELDO], [ESTADO], [APE_PAT], [APE_MAT], [USU_REG], [USU_MOD], [FECHA_MOD], [FECHA_REG]) VALUES (1, N'Admin', N'Soporte de Sistemas', CAST(2500.00 AS Decimal(18, 2)), 1, NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[T_EMPLEADO] ([ID_EMPLEADO], [NOMBRES], [CARGO], [SUELDO], [ESTADO], [APE_PAT], [APE_MAT], [USU_REG], [USU_MOD], [FECHA_MOD], [FECHA_REG]) VALUES (2, N'aaaaaa', N'01 ', CAST(33.00 AS Decimal(18, 2)), 1, N'bbbbbb', N'ccccc', 1, 1, NULL, NULL)
INSERT [dbo].[T_EMPLEADO] ([ID_EMPLEADO], [NOMBRES], [CARGO], [SUELDO], [ESTADO], [APE_PAT], [APE_MAT], [USU_REG], [USU_MOD], [FECHA_MOD], [FECHA_REG]) VALUES (3, N'prub', N'01 ', CAST(33.00 AS Decimal(18, 2)), 0, N'prn', N'SDVBH', 1, 1, CAST(N'2021-03-25T19:58:34.760' AS DateTime), CAST(N'2021-03-25T17:55:52.510' AS DateTime))
INSERT [dbo].[T_EMPLEADO] ([ID_EMPLEADO], [NOMBRES], [CARGO], [SUELDO], [ESTADO], [APE_PAT], [APE_MAT], [USU_REG], [USU_MOD], [FECHA_MOD], [FECHA_REG]) VALUES (4, NULL, NULL, CAST(0.00 AS Decimal(18, 2)), 1, NULL, NULL, 1, NULL, NULL, CAST(N'2021-03-26T10:22:18.567' AS DateTime))
INSERT [dbo].[T_EMPLEADO] ([ID_EMPLEADO], [NOMBRES], [CARGO], [SUELDO], [ESTADO], [APE_PAT], [APE_MAT], [USU_REG], [USU_MOD], [FECHA_MOD], [FECHA_REG]) VALUES (5, NULL, NULL, CAST(0.00 AS Decimal(18, 2)), 1, NULL, NULL, 1, NULL, NULL, CAST(N'2021-03-26T10:23:41.210' AS DateTime))
INSERT [dbo].[T_EMPLEADO] ([ID_EMPLEADO], [NOMBRES], [CARGO], [SUELDO], [ESTADO], [APE_PAT], [APE_MAT], [USU_REG], [USU_MOD], [FECHA_MOD], [FECHA_REG]) VALUES (6, NULL, NULL, CAST(0.00 AS Decimal(18, 2)), 1, NULL, NULL, 1, NULL, NULL, CAST(N'2021-03-26T10:23:56.723' AS DateTime))
INSERT [dbo].[T_EMPLEADO] ([ID_EMPLEADO], [NOMBRES], [CARGO], [SUELDO], [ESTADO], [APE_PAT], [APE_MAT], [USU_REG], [USU_MOD], [FECHA_MOD], [FECHA_REG]) VALUES (7, NULL, NULL, CAST(0.00 AS Decimal(18, 2)), 1, NULL, NULL, 1, NULL, NULL, CAST(N'2021-03-26T10:24:30.650' AS DateTime))
INSERT [dbo].[T_EMPLEADO] ([ID_EMPLEADO], [NOMBRES], [CARGO], [SUELDO], [ESTADO], [APE_PAT], [APE_MAT], [USU_REG], [USU_MOD], [FECHA_MOD], [FECHA_REG]) VALUES (8, N'rwer', NULL, CAST(0.00 AS Decimal(18, 2)), 1, N'werwer', N'rwerew', 1, NULL, NULL, CAST(N'2021-03-26T10:39:39.587' AS DateTime))
INSERT [dbo].[T_EMPLEADO] ([ID_EMPLEADO], [NOMBRES], [CARGO], [SUELDO], [ESTADO], [APE_PAT], [APE_MAT], [USU_REG], [USU_MOD], [FECHA_MOD], [FECHA_REG]) VALUES (9, N'asdfsa', NULL, CAST(0.00 AS Decimal(18, 2)), 1, N'asd', N'asd', 1, NULL, NULL, CAST(N'2021-03-26T15:16:10.900' AS DateTime))
INSERT [dbo].[T_EMPLEADO] ([ID_EMPLEADO], [NOMBRES], [CARGO], [SUELDO], [ESTADO], [APE_PAT], [APE_MAT], [USU_REG], [USU_MOD], [FECHA_MOD], [FECHA_REG]) VALUES (10, N'aaa', NULL, CAST(0.00 AS Decimal(18, 2)), 1, N'aa', N'aaa', 1, NULL, NULL, CAST(N'2021-03-26T16:50:07.047' AS DateTime))
INSERT [dbo].[T_EMPLEADO] ([ID_EMPLEADO], [NOMBRES], [CARGO], [SUELDO], [ESTADO], [APE_PAT], [APE_MAT], [USU_REG], [USU_MOD], [FECHA_MOD], [FECHA_REG]) VALUES (11, N'asd', NULL, CAST(0.00 AS Decimal(18, 2)), 1, N'asd', N'asd', 1, NULL, NULL, CAST(N'2021-03-26T16:50:28.260' AS DateTime))
SET IDENTITY_INSERT [dbo].[T_EMPLEADO] OFF
GO
SET IDENTITY_INSERT [dbo].[T_EMPRESA] ON 

INSERT [dbo].[T_EMPRESA] ([ID_EMPRESA], [DESCRIPCION], [RAZON_SOCIAL], [RUC], [FECHA_REG], [ESTADO]) VALUES (1, N'Botica 1', N'Botica', N'0000000000', CAST(N'2020-04-23T16:47:51.033' AS DateTime), 1)
SET IDENTITY_INSERT [dbo].[T_EMPRESA] OFF
GO
SET IDENTITY_INSERT [dbo].[T_LOCAL] ON 

INSERT [dbo].[T_LOCAL] ([ID_LOCAL], [ID_EMPRESA], [DESCRIPCION], [FECHA_REG], [ESTADO], [URL_LOGO]) VALUES (1, 1, N'Local 1', CAST(N'2020-04-23T16:48:24.410' AS DateTime), 1, N'img/charpe.png')
SET IDENTITY_INSERT [dbo].[T_LOCAL] OFF
GO
SET IDENTITY_INSERT [dbo].[T_MENU] ON 

INSERT [dbo].[T_MENU] ([ID_MENU], [ID_PADRE], [DESCRIPCION], [URL], [FECHA_REG], [ESTADO]) VALUES (1, NULL, N'Mantenimiento', NULL, CAST(N'2017-03-02T22:37:06.000' AS DateTime), 1)
INSERT [dbo].[T_MENU] ([ID_MENU], [ID_PADRE], [DESCRIPCION], [URL], [FECHA_REG], [ESTADO]) VALUES (2, 1, N'Usuario', N'page/mantenimiento/usuario', CAST(N'2017-03-02T22:38:01.087' AS DateTime), 1)
INSERT [dbo].[T_MENU] ([ID_MENU], [ID_PADRE], [DESCRIPCION], [URL], [FECHA_REG], [ESTADO]) VALUES (3, 1, N'Empleado', N'mantenimiento/empleado', NULL, 1)
INSERT [dbo].[T_MENU] ([ID_MENU], [ID_PADRE], [DESCRIPCION], [URL], [FECHA_REG], [ESTADO]) VALUES (4, 1, N'Embarcación', N'mantenimiento/embarcacion', NULL, 1)
SET IDENTITY_INSERT [dbo].[T_MENU] OFF
GO
INSERT [dbo].[T_PARAMETROS] ([COD_PARAMETRO], [COD_GRUPO], [DSC_PARAMETRO]) VALUES (N'01 ', N'TIP_DOC', N'DNI')
INSERT [dbo].[T_PARAMETROS] ([COD_PARAMETRO], [COD_GRUPO], [DSC_PARAMETRO]) VALUES (N'02 ', N'TIP_DOC', N'RUC')
INSERT [dbo].[T_PARAMETROS] ([COD_PARAMETRO], [COD_GRUPO], [DSC_PARAMETRO]) VALUES (N'03 ', N'TIP_DOC', N'CE')
INSERT [dbo].[T_PARAMETROS] ([COD_PARAMETRO], [COD_GRUPO], [DSC_PARAMETRO]) VALUES (N'01 ', N'TIP_CARGO', N'Capitan')
INSERT [dbo].[T_PARAMETROS] ([COD_PARAMETRO], [COD_GRUPO], [DSC_PARAMETRO]) VALUES (N'02 ', N'TIP_CARGO', N'Copiloto')
GO
SET IDENTITY_INSERT [dbo].[T_PERFIL] ON 

INSERT [dbo].[T_PERFIL] ([ID_PERFIL], [DESCRIPCION], [MENU], [FECHA_REG], [ESTADO]) VALUES (1, N'Administrador', N'1,2,3,4,5,6,7,8,9,10,11,12,13,14,15', CAST(N'2017-03-02T23:01:48.290' AS DateTime), 1)
INSERT [dbo].[T_PERFIL] ([ID_PERFIL], [DESCRIPCION], [MENU], [FECHA_REG], [ESTADO]) VALUES (2, N'Supervisor', N'1,4', CAST(N'2017-03-02T23:01:48.290' AS DateTime), 1)
SET IDENTITY_INSERT [dbo].[T_PERFIL] OFF
GO
SET IDENTITY_INSERT [dbo].[T_USUARIO] ON 

INSERT [dbo].[T_USUARIO] ([ID_USUARIO], [ID_EMPLEADO], [DSC_USUARIO], [PASSWORD], [FECHA_REG], [ESTADO]) VALUES (1, 1, N'admin', N'psg50EepQh8=', CAST(N'2017-03-02T23:07:33.667' AS DateTime), 1)
SET IDENTITY_INSERT [dbo].[T_USUARIO] OFF
GO
SET IDENTITY_INSERT [dbo].[T_USUARIO_PERFIL] ON 

INSERT [dbo].[T_USUARIO_PERFIL] ([ID_USUARIO_PERFIL], [ID_PERFIL], [ID_USUARIO], [FECHA_REG], [LOCAL], [ESTADO]) VALUES (1, 1, 1, CAST(N'2017-03-02T23:07:52.637' AS DateTime), N'1,2', 1)
SET IDENTITY_INSERT [dbo].[T_USUARIO_PERFIL] OFF
GO
ALTER TABLE [dbo].[T_COMPROBANTE] ADD  DEFAULT ((1)) FOR [ESTADO]
GO
ALTER TABLE [dbo].[T_CONFIGURACION] ADD  DEFAULT ((1)) FOR [ESTADO]
GO
ALTER TABLE [dbo].[T_DOCUMENTO_EMPLEADO] ADD  DEFAULT (getdate()) FOR [FECHA_REG]
GO
ALTER TABLE [dbo].[t_embarcacion] ADD  DEFAULT ((1)) FOR [estado]
GO
ALTER TABLE [dbo].[t_embarcacion] ADD  DEFAULT (getdate()) FOR [fecha_reg]
GO
ALTER TABLE [dbo].[T_EMPLEADO] ADD  DEFAULT (getdate()) FOR [FECHA_REG]
GO
ALTER TABLE [dbo].[T_COMPROBANTE]  WITH CHECK ADD FOREIGN KEY([ID_LOCAL])
REFERENCES [dbo].[T_LOCAL] ([ID_LOCAL])
GO
ALTER TABLE [dbo].[T_COMPROBANTE]  WITH CHECK ADD FOREIGN KEY([ID_LOCAL])
REFERENCES [dbo].[T_LOCAL] ([ID_LOCAL])
GO
ALTER TABLE [dbo].[T_COMPROBANTE]  WITH CHECK ADD FOREIGN KEY([USU_MOD])
REFERENCES [dbo].[T_USUARIO] ([ID_USUARIO])
GO
ALTER TABLE [dbo].[T_COMPROBANTE]  WITH CHECK ADD FOREIGN KEY([USU_MOD])
REFERENCES [dbo].[T_USUARIO] ([ID_USUARIO])
GO
ALTER TABLE [dbo].[T_COMPROBANTE]  WITH CHECK ADD FOREIGN KEY([USU_REG])
REFERENCES [dbo].[T_USUARIO] ([ID_USUARIO])
GO
ALTER TABLE [dbo].[T_COMPROBANTE]  WITH CHECK ADD FOREIGN KEY([USU_REG])
REFERENCES [dbo].[T_USUARIO] ([ID_USUARIO])
GO
ALTER TABLE [dbo].[T_CONFIGURACION]  WITH CHECK ADD FOREIGN KEY([ID_LOCAL])
REFERENCES [dbo].[T_LOCAL] ([ID_LOCAL])
GO
ALTER TABLE [dbo].[T_CONFIGURACION]  WITH CHECK ADD FOREIGN KEY([ID_LOCAL])
REFERENCES [dbo].[T_LOCAL] ([ID_LOCAL])
GO
ALTER TABLE [dbo].[T_LOCAL]  WITH CHECK ADD FOREIGN KEY([ID_EMPRESA])
REFERENCES [dbo].[T_EMPRESA] ([ID_EMPRESA])
GO
ALTER TABLE [dbo].[T_USUARIO]  WITH CHECK ADD FOREIGN KEY([ID_EMPLEADO])
REFERENCES [dbo].[T_EMPLEADO] ([ID_EMPLEADO])
GO
ALTER TABLE [dbo].[T_USUARIO]  WITH CHECK ADD FOREIGN KEY([ID_EMPLEADO])
REFERENCES [dbo].[T_EMPLEADO] ([ID_EMPLEADO])
GO
ALTER TABLE [dbo].[T_USUARIO]  WITH CHECK ADD FOREIGN KEY([ID_EMPLEADO])
REFERENCES [dbo].[T_EMPLEADO] ([ID_EMPLEADO])
GO
ALTER TABLE [dbo].[T_USUARIO]  WITH CHECK ADD FOREIGN KEY([ID_EMPLEADO])
REFERENCES [dbo].[T_EMPLEADO] ([ID_EMPLEADO])
GO
ALTER TABLE [dbo].[T_USUARIO]  WITH CHECK ADD FOREIGN KEY([ID_EMPLEADO])
REFERENCES [dbo].[T_EMPLEADO] ([ID_EMPLEADO])
GO
ALTER TABLE [dbo].[T_USUARIO]  WITH CHECK ADD FOREIGN KEY([ID_EMPLEADO])
REFERENCES [dbo].[T_EMPLEADO] ([ID_EMPLEADO])
GO
ALTER TABLE [dbo].[T_USUARIO_PERFIL]  WITH CHECK ADD FOREIGN KEY([ID_PERFIL])
REFERENCES [dbo].[T_PERFIL] ([ID_PERFIL])
GO
ALTER TABLE [dbo].[T_USUARIO_PERFIL]  WITH CHECK ADD FOREIGN KEY([ID_PERFIL])
REFERENCES [dbo].[T_PERFIL] ([ID_PERFIL])
GO
ALTER TABLE [dbo].[T_USUARIO_PERFIL]  WITH CHECK ADD FOREIGN KEY([ID_PERFIL])
REFERENCES [dbo].[T_PERFIL] ([ID_PERFIL])
GO
ALTER TABLE [dbo].[T_USUARIO_PERFIL]  WITH CHECK ADD FOREIGN KEY([ID_PERFIL])
REFERENCES [dbo].[T_PERFIL] ([ID_PERFIL])
GO
ALTER TABLE [dbo].[T_USUARIO_PERFIL]  WITH CHECK ADD FOREIGN KEY([ID_PERFIL])
REFERENCES [dbo].[T_PERFIL] ([ID_PERFIL])
GO
ALTER TABLE [dbo].[T_USUARIO_PERFIL]  WITH CHECK ADD FOREIGN KEY([ID_PERFIL])
REFERENCES [dbo].[T_PERFIL] ([ID_PERFIL])
GO
ALTER TABLE [dbo].[T_USUARIO_PERFIL]  WITH CHECK ADD FOREIGN KEY([ID_USUARIO])
REFERENCES [dbo].[T_USUARIO] ([ID_USUARIO])
GO
ALTER TABLE [dbo].[T_USUARIO_PERFIL]  WITH CHECK ADD FOREIGN KEY([ID_USUARIO])
REFERENCES [dbo].[T_USUARIO] ([ID_USUARIO])
GO
ALTER TABLE [dbo].[T_USUARIO_PERFIL]  WITH CHECK ADD FOREIGN KEY([ID_USUARIO])
REFERENCES [dbo].[T_USUARIO] ([ID_USUARIO])
GO
ALTER TABLE [dbo].[T_USUARIO_PERFIL]  WITH CHECK ADD FOREIGN KEY([ID_USUARIO])
REFERENCES [dbo].[T_USUARIO] ([ID_USUARIO])
GO
ALTER TABLE [dbo].[T_USUARIO_PERFIL]  WITH CHECK ADD FOREIGN KEY([ID_USUARIO])
REFERENCES [dbo].[T_USUARIO] ([ID_USUARIO])
GO
ALTER TABLE [dbo].[T_USUARIO_PERFIL]  WITH CHECK ADD FOREIGN KEY([ID_USUARIO])
REFERENCES [dbo].[T_USUARIO] ([ID_USUARIO])
GO
/****** Object:  StoredProcedure [dbo].[sp_empleado_actualizar]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[sp_empleado_actualizar](
	@id_empleado	int = null,
	@nombres		varchar(200) = null,
	@cargo			varchar(50) = null,
	@sueldo			decimal(18,2) = null,
	@ape_pat		varchar(200) = null,
	@ape_mat		varchar(200) = null,
	@documento		varchar(max) = null,
	@usuario		int = null,
	@opcion			int = null
)
as
	if(@opcion = 1)
	begin
		insert into T_EMPLEADO ([NOMBRES],[CARGO],[SUELDO],[ESTADO],[APE_PAT],[APE_MAT],[USU_REG])
		values (@nombres,@cargo,@sueldo,1,@ape_pat,@ape_mat,@usuario)

		set @id_empleado = scope_identity()
		--Guardando los documentos 
		insert into [dbo].[T_DOCUMENTO_EMPLEADO] ([ID_EMPLEADO],[TIPO_DOC],[NUMERO],[USU_REG])
		select @id_empleado, COLUMN1, COLUMN2, @usuario from dbo.fu_split_col2(@documento) 
	end
	else if(@opcion = 2)
	begin
		update T_EMPLEADO set [NOMBRES] = @nombres,[CARGO] = @cargo,[SUELDO] = @sueldo,[APE_PAT]=@ape_pat,[APE_MAT]=@ape_mat,USU_MOD=@usuario
		where ID_EMPLEADO = @id_empleado

		--Eliminando documentos
		delete from [T_DOCUMENTO_EMPLEADO] where [ID_EMPLEADO]=@id_empleado
		--Guardando los documentos 
		insert into [dbo].[T_DOCUMENTO_EMPLEADO] ([ID_EMPLEADO],[TIPO_DOC],[NUMERO],[USU_REG])
		select @id_empleado, COLUMN1, COLUMN2, @usuario from dbo.fu_split_col2(@documento) 
	end
GO
/****** Object:  StoredProcedure [dbo].[sp_empleado_anular]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create proc [dbo].[sp_empleado_anular](
	@id_empleado	int = null,
	@usuario		int = null
)
as
	update T_EMPLEADO set ESTADO = 0, USU_MOD = @usuario, FECHA_MOD = [dbo].[fu_retorna_fechasis]() where ID_EMPLEADO = @id_empleado
GO
/****** Object:  StoredProcedure [dbo].[sp_empleado_listar]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[sp_empleado_listar](
	@cargo		varchar(50) = 0,
	@nombres	varchar(200)= ''
)
as
	select 
		e.ID_EMPLEADO,
		e.NOMBRES, 
		e.APE_PAT + ' '+ e.APE_MAT apellidos, 
		[dbo].[FU_DEVUELVE_PARAMETRO]('TIP_CARGO',e.CARGO) cargo,
		e.SUELDO
	from 
		t_empleado e
	where 
		e.CARGO = (case when @cargo = 0 then e.CARGO else @cargo end) and
		e.NOMBRES like '%' + isnull(@nombres, '') + '%' and
		e.ESTADO = 1
GO
/****** Object:  StoredProcedure [dbo].[sp_empleado_listarxId]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[sp_empleado_listarxId](
	@id_empleado	int
)
as
	select 
		e.ID_EMPLEADO,
		e.NOMBRES, 
		e.APE_PAT,
		e.APE_MAT, 
		e.CARGO,
		e.SUELDO
	from 
		t_empleado e
	where 
		e.ID_EMPLEADO = @id_empleado

	select de.tipo_doc, de.numero from [dbo].[T_DOCUMENTO_EMPLEADO] de where de.ID_EMPLEADO = @id_empleado
GO
/****** Object:  StoredProcedure [dbo].[USP_CAMBIAR_CLAVE]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[USP_CAMBIAR_CLAVE]
(
	@ID_USUARIO INT,
	@PASSWORD	VARCHAR(1000)
)
AS
BEGIN
	UPDATE T_USUARIO
	SET [PASSWORD] = @PASSWORD,
		ESTADO = 1
	WHERE ID_USUARIO = @ID_USUARIO
END

GO
/****** Object:  StoredProcedure [dbo].[USP_GET_CONFIGURACION]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[USP_GET_CONFIGURACION](
	@id_local INT,
	@cod_grupo VARCHAR(50) = ''
)
AS
	SELECT 
		C.DESC_CONFIG, C.COD_CONFIG, C.VALOR
	FROM T_CONFIGURACION C
	WHERE 
	C.ID_LOCAL = @id_local AND 
	C.ESTADO != 0 AND 
	isnull(C.COD_GRUPO, '') = (case when @cod_grupo = '' then isnull(C.COD_GRUPO, '') else @cod_grupo end)
GO
/****** Object:  StoredProcedure [dbo].[USP_LISTAR_DESCRIPCION]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[USP_LISTAR_DESCRIPCION](
	@OPCION	VARCHAR(50)
)
AS
SELECT 
	P.COD_PARAMETRO AS CODIGO, 
	P.DSC_PARAMETRO  AS DESCRIPCION
FROM 
	T_PARAMETROS P
WHERE 
	P.COD_GRUPO = @OPCION
ORDER BY 1

GO
/****** Object:  StoredProcedure [dbo].[USP_LOGIN]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[USP_LOGIN]
(
	@usuario varchar(20),
	@password varchar(1000)
)
AS
BEGIN
	SELECT u.ID_USUARIO, u.ID_EMPLEADO, u.DSC_USUARIO, u.ESTADO, 
		e.NOMBRES, e.APE_PAT + ' ' + e.APE_MAT APELLIDOS, e.CARGO
	FROM T_USUARIO u
		INNER JOIN T_EMPLEADO e ON u.ID_EMPLEADO = e.ID_EMPLEADO
	WHERE u.ESTADO <> 0 AND e.ESTADO <> 0
		AND u.DSC_USUARIO = @usuario
		AND u.[PASSWORD] = @password
END
GO
/****** Object:  StoredProcedure [dbo].[USP_LOGIN_LOCAL]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[USP_LOGIN_LOCAL]
(
	@id_usuario int
)
AS
BEGIN
	DECLARE @localopcion VARCHAR (1000) 

	SELECT @localopcion = up.[LOCAL]
	FROM T_USUARIO_PERFIL up
	WHERE up.ID_USUARIO = @id_usuario

	EXEC('
		SELECT E.ID_EMPRESA, E.DESCRIPCION EMPRESA, L.ID_LOCAL, L.DESCRIPCION, L.URL_LOGO
		FROM T_LOCAL L, T_EMPRESA E
		WHERE L.ID_EMPRESA = E.ID_EMPRESA AND E.ESTADO = 1 AND L.ESTADO = 1 AND ID_LOCAL IN ('+@localopcion+')
		ORDER BY E.ID_EMPRESA, L.ID_LOCAL
	')
END
GO
/****** Object:  StoredProcedure [dbo].[USP_LOGIN_PERFIL]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[USP_LOGIN_PERFIL]
(
	@id_usuario int
)
AS
BEGIN
	DECLARE @menuopcion VARCHAR (1000) 

	SELECT @menuopcion = MENU 
	FROM T_USUARIO_PERFIL up
		INNER JOIN T_PERFIL p ON up.ID_PERFIL = p.ID_PERFIL
	WHERE ID_USUARIO = @id_usuario

	EXEC('
		SELECT m.ID_MENU,m.ID_PADRE,m.DESCRIPCION, m.URL
		FROM T_MENU m
		WHERE m.ESTADO = 1 AND m.ID_MENU IN ('+@menuopcion+')
		ORDER BY m.DESCRIPCION
	')
END
GO
/****** Object:  StoredProcedure [dbo].[USP_MANTENIMIENTO_USUARIO]    Script Date: 26/03/2021 18:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROC [dbo].[USP_MANTENIMIENTO_USUARIO](
	@ID_EMPLEADO	INT = 0,
	@NOMBRES		VARCHAR(200) = NULL,
	@APELLIDOS		VARCHAR(200) = NULL,
	@CARGO			VARCHAR(50) = NULL,
	@SUELDO			DECIMAL(18,2) = NULL,
	@ESTADO			INT = NULL,
	@ID_USUARIO		INT = 0,
	@DSC_USUARIO	VARCHAR(20) = NULL,
	@ID_PERFIL		INT = NULL,
	@LOCAL			VARCHAR(1000) = NULL,
	@ESTADO_USUARIO	INT = NULL,
	@OPCION			INT = 1
)
AS
BEGIN TRY
	BEGIN TRANSACTION

	IF @OPCION = 1
	BEGIN
		SELECT E.ID_EMPLEADO, E.NOMBRES, E.APE_MAT, E.APE_MAT, E.CARGO, E.SUELDO, E.ESTADO, E.FECHA_REG,
			U.ID_USUARIO, U.DSC_USUARIO, U.ESTADO AS ESTADO_USUARIO, UP.ID_PERFIL, UP.[LOCAL]
		FROM T_EMPLEADO E
			LEFT JOIN T_USUARIO U ON E.ID_EMPLEADO = U.ID_EMPLEADO
			LEFT JOIN T_USUARIO_PERFIL UP ON U.ID_USUARIO = UP.ID_USUARIO
		WHERE 
			E.ID_EMPLEADO = CASE WHEN ISNULL(@ID_EMPLEADO,0) = 0 THEN E.ID_EMPLEADO ELSE @ID_EMPLEADO END AND
			E.NOMBRES LIKE '%'+ ISNULL(@NOMBRES,'') +'%' AND
			E.APE_MAT LIKE '%'+ ISNULL(@APELLIDOS,'') +'%' AND
			E.ESTADO <> 0
	END
	ELSE IF @OPCION = 2
	BEGIN
		IF EXISTS(SELECT ID_USUARIO FROM T_USUARIO 
					WHERE ID_USUARIO <> @ID_USUARIO AND DSC_USUARIO = @DSC_USUARIO)
		BEGIN
			RAISERROR('Nombre de usuario ya existe', 16, 217)
		END

		INSERT INTO T_EMPLEADO (NOMBRES, APE_PAT, APE_MAT, CARGO, SUELDO, ESTADO, FECHA_REG)
		VALUES (@NOMBRES, @APELLIDOS,@APELLIDOS, @CARGO, @SUELDO, 1, [dbo].[FU_RETORNA_FECHASIS]())

		SET @ID_EMPLEADO = CONVERT(INT,IDENT_CURRENT('dbo.T_EMPLEADO'))

		IF ISNULL(@DSC_USUARIO,'') <> ''
		BEGIN
			-->Clave por defecto: 123
			INSERT INTO T_USUARIO (ID_EMPLEADO, DSC_USUARIO, [PASSWORD], FECHA_REG, ESTADO)
			VALUES (@ID_EMPLEADO, @DSC_USUARIO, 'uk/6cvPiRUA=', dbo.FU_RETORNA_FECHASIS(), 3)

			SET @ID_USUARIO = CONVERT(INT,IDENT_CURRENT('dbo.T_USUARIO'))

			INSERT INTO T_USUARIO_PERFIL (ID_USUARIO, ID_PERFIL, FECHA_REG, LOCAL)
			VALUES (@ID_USUARIO, @ID_PERFIL, dbo.FU_RETORNA_FECHASIS(), @LOCAL)
		END
	END
	ELSE IF @OPCION = 3
	BEGIN
		IF EXISTS(SELECT ID_USUARIO FROM T_USUARIO 
					WHERE ID_USUARIO <> @ID_USUARIO AND DSC_USUARIO = @DSC_USUARIO)
		BEGIN
			RAISERROR('Nombre de usuario ya existe', 16, 217)
		END

		UPDATE T_EMPLEADO 
		SET NOMBRES = @NOMBRES, 
			APE_PAT = @APELLIDOS, 
			APE_MAT = @APELLIDOS, 
			CARGO = @CARGO,
			SUELDO = @SUELDO
		WHERE ID_EMPLEADO = @ID_EMPLEADO

		IF @ID_USUARIO <> 0
		BEGIN
			UPDATE T_USUARIO
			SET DSC_USUARIO = @DSC_USUARIO,
				ESTADO = @ESTADO_USUARIO
			WHERE ID_USUARIO = @ID_USUARIO

			UPDATE T_USUARIO_PERFIL
			SET ID_PERFIL = @ID_PERFIL,
				LOCAL = @LOCAL
			WHERE ID_USUARIO = @ID_USUARIO
		END
		ELSE IF ISNULL(@DSC_USUARIO,'') <> ''
		BEGIN
			-->Clave por defecto: 123
			INSERT INTO T_USUARIO (ID_EMPLEADO, DSC_USUARIO, [PASSWORD], FECHA_REG, ESTADO)
			VALUES (@ID_EMPLEADO, @DSC_USUARIO, 'uk/6cvPiRUA=', dbo.FU_RETORNA_FECHASIS(), 3)

			SET @ID_USUARIO = CONVERT(INT,IDENT_CURRENT('dbo.T_USUARIO'))

			INSERT INTO T_USUARIO_PERFIL (ID_USUARIO, ID_PERFIL, FECHA_REG)
			VALUES (@ID_USUARIO, @ID_PERFIL, dbo.FU_RETORNA_FECHASIS())
		END
	END
	ELSE IF @OPCION = 4
	BEGIN
		UPDATE T_EMPLEADO 
		SET ESTADO = 0
		WHERE ID_EMPLEADO = @ID_EMPLEADO

		SELECT @ID_USUARIO = ID_USUARIO FROM T_USUARIO WHERE ID_EMPLEADO = @ID_EMPLEADO

		UPDATE T_USUARIO
		SET ESTADO = 0
		WHERE ID_USUARIO = @ID_USUARIO

		UPDATE T_USUARIO_PERFIL
		SET ESTADO = 0
		WHERE ID_USUARIO = @ID_USUARIO
	END
	ELSE IF @OPCION = 5
	BEGIN
		SELECT @ID_USUARIO = ID_USUARIO FROM T_USUARIO WHERE ID_EMPLEADO = @ID_EMPLEADO

		UPDATE T_USUARIO
		SET [PASSWORD] = 'uk/6cvPiRUA=',
			ESTADO = 3
		WHERE ID_USUARIO = @ID_USUARIO
	END

	COMMIT TRANSACTION
END TRY
BEGIN CATCH
	ROLLBACK TRANSACTION
	DECLARE @ERROR VARCHAR(MAX) = ERROR_MESSAGE()
	RAISERROR(@ERROR,16,217)
END CATCH


GO
USE [master]
GO
ALTER DATABASE [BD_BOTICA] SET  READ_WRITE 
GO
