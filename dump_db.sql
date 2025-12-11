--
-- PostgreSQL database dump
--

\restrict ps0auER8Zv4FF7KaLh0k5HKWcgMHQfRYJGV7eeWKZLOPMMDNOu5RJQYxZsFLisa

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

-- Started on 2025-11-28 11:29:09

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 16983)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 17007)
-- Name: Asset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Asset" (
    id integer NOT NULL,
    name text NOT NULL,
    code text,
    location text,
    description text,
    manufacturer text,
    model text,
    year integer,
    criticality text,
    "parentId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Asset" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17039)
-- Name: AssetAttachment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AssetAttachment" (
    id integer NOT NULL,
    "fileName" text NOT NULL,
    url text NOT NULL,
    "mimeType" text,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "assetId" integer NOT NULL
);


ALTER TABLE public."AssetAttachment" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 17038)
-- Name: AssetAttachment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AssetAttachment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AssetAttachment_id_seq" OWNER TO postgres;

--
-- TOC entry 5131 (class 0 OID 0)
-- Dependencies: 224
-- Name: AssetAttachment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AssetAttachment_id_seq" OWNED BY public."AssetAttachment".id;


--
-- TOC entry 218 (class 1259 OID 17006)
-- Name: Asset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Asset_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Asset_id_seq" OWNER TO postgres;

--
-- TOC entry 5132 (class 0 OID 0)
-- Dependencies: 218
-- Name: Asset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Asset_id_seq" OWNED BY public."Asset".id;


--
-- TOC entry 223 (class 1259 OID 17029)
-- Name: Attachment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Attachment" (
    id integer NOT NULL,
    "fileName" text NOT NULL,
    url text NOT NULL,
    "mimeType" text,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "workOrderId" integer NOT NULL
);


ALTER TABLE public."Attachment" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 17028)
-- Name: Attachment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Attachment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Attachment_id_seq" OWNER TO postgres;

--
-- TOC entry 5133 (class 0 OID 0)
-- Dependencies: 222
-- Name: Attachment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Attachment_id_seq" OWNED BY public."Attachment".id;


--
-- TOC entry 249 (class 1259 OID 17157)
-- Name: Client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Client" (
    id integer NOT NULL,
    doc text,
    name text NOT NULL,
    cep text,
    logradouro text,
    numero text,
    bairro text,
    cidade text,
    estado text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Client" OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 17156)
-- Name: Client_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Client_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Client_id_seq" OWNER TO postgres;

--
-- TOC entry 5134 (class 0 OID 0)
-- Dependencies: 248
-- Name: Client_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Client_id_seq" OWNED BY public."Client".id;


--
-- TOC entry 257 (class 1259 OID 17201)
-- Name: CommercialFamily; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CommercialFamily" (
    id integer NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(6) without time zone,
    "erpCode" text
);


ALTER TABLE public."CommercialFamily" OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 17200)
-- Name: CommercialFamily_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CommercialFamily_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CommercialFamily_id_seq" OWNER TO postgres;

--
-- TOC entry 5135 (class 0 OID 0)
-- Dependencies: 256
-- Name: CommercialFamily_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CommercialFamily_id_seq" OWNED BY public."CommercialFamily".id;


--
-- TOC entry 253 (class 1259 OID 17175)
-- Name: Complaint; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Complaint" (
    id integer NOT NULL,
    code text,
    "entityId" integer NOT NULL,
    "createdById" integer,
    division text,
    type text,
    phase text,
    "dueDate" timestamp(3) without time zone,
    canceled boolean DEFAULT false NOT NULL,
    "cancelReason" text,
    "dateSac" timestamp(3) without time zone,
    "dateReceived" timestamp(3) without time zone,
    "counterpartyType" text,
    "counterpartyCode" text,
    "counterpartyName" text,
    city text,
    uf text,
    "contactName" text,
    "contactPhone" text,
    "contactEmail" text,
    "representativeName" text,
    "representativeEmail" text,
    carrier text,
    "freightType" text,
    attendant text,
    reference text,
    classification text,
    "occurrencePattern" text,
    "occurrenceCode" text,
    "occurrenceText" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Complaint" OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 17186)
-- Name: ComplaintItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ComplaintItem" (
    id integer NOT NULL,
    "complaintId" integer NOT NULL,
    "invoiceNumber" text,
    sft text,
    "orderNumber" text,
    spd text,
    "emissionDate" timestamp(3) without time zone,
    description text,
    uom text,
    "unitPrice" double precision DEFAULT 0 NOT NULL,
    "qtyInvoiced" double precision DEFAULT 0 NOT NULL,
    "divergenceQty" double precision DEFAULT 0 NOT NULL,
    "divergenceValue" double precision DEFAULT 0 NOT NULL,
    "divergencePercent" double precision DEFAULT 0 NOT NULL,
    "totalPercent" double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public."ComplaintItem" OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 17185)
-- Name: ComplaintItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ComplaintItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ComplaintItem_id_seq" OWNER TO postgres;

--
-- TOC entry 5136 (class 0 OID 0)
-- Dependencies: 254
-- Name: ComplaintItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ComplaintItem_id_seq" OWNED BY public."ComplaintItem".id;


--
-- TOC entry 252 (class 1259 OID 17174)
-- Name: Complaint_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Complaint_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Complaint_id_seq" OWNER TO postgres;

--
-- TOC entry 5137 (class 0 OID 0)
-- Dependencies: 252
-- Name: Complaint_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Complaint_id_seq" OWNED BY public."Complaint".id;


--
-- TOC entry 229 (class 1259 OID 17060)
-- Name: Entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Entity" (
    id integer NOT NULL,
    cnpj text NOT NULL,
    name text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "parentId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Entity" OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 17091)
-- Name: EntityModule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EntityModule" (
    id integer NOT NULL,
    "entityId" integer NOT NULL,
    "moduleId" integer NOT NULL
);


ALTER TABLE public."EntityModule" OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 18994)
-- Name: EntityModuleItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EntityModuleItem" (
    id integer NOT NULL,
    "entityModuleId" integer NOT NULL,
    "inventoryItemId" integer NOT NULL,
    allowed boolean DEFAULT true NOT NULL
);


ALTER TABLE public."EntityModuleItem" OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 18993)
-- Name: EntityModuleItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."EntityModuleItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."EntityModuleItem_id_seq" OWNER TO postgres;

--
-- TOC entry 5138 (class 0 OID 0)
-- Dependencies: 263
-- Name: EntityModuleItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."EntityModuleItem_id_seq" OWNED BY public."EntityModuleItem".id;


--
-- TOC entry 237 (class 1259 OID 17098)
-- Name: EntityModuleProgram; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EntityModuleProgram" (
    id integer NOT NULL,
    "entityModuleId" integer NOT NULL,
    "programId" integer NOT NULL,
    allowed boolean DEFAULT true NOT NULL
);


ALTER TABLE public."EntityModuleProgram" OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 17097)
-- Name: EntityModuleProgram_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."EntityModuleProgram_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."EntityModuleProgram_id_seq" OWNER TO postgres;

--
-- TOC entry 5139 (class 0 OID 0)
-- Dependencies: 236
-- Name: EntityModuleProgram_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."EntityModuleProgram_id_seq" OWNED BY public."EntityModuleProgram".id;


--
-- TOC entry 234 (class 1259 OID 17090)
-- Name: EntityModule_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."EntityModule_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."EntityModule_id_seq" OWNER TO postgres;

--
-- TOC entry 5140 (class 0 OID 0)
-- Dependencies: 234
-- Name: EntityModule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."EntityModule_id_seq" OWNED BY public."EntityModule".id;


--
-- TOC entry 228 (class 1259 OID 17059)
-- Name: Entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Entity_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Entity_id_seq" OWNER TO postgres;

--
-- TOC entry 5141 (class 0 OID 0)
-- Dependencies: 228
-- Name: Entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Entity_id_seq" OWNED BY public."Entity".id;


--
-- TOC entry 221 (class 1259 OID 17017)
-- Name: InventoryItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InventoryItem" (
    id integer NOT NULL,
    name text NOT NULL,
    sku text,
    quantity integer DEFAULT 0 NOT NULL,
    unit text,
    "minStock" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "commercialFamilyId" integer
);


ALTER TABLE public."InventoryItem" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 17016)
-- Name: InventoryItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."InventoryItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."InventoryItem_id_seq" OWNER TO postgres;

--
-- TOC entry 5142 (class 0 OID 0)
-- Dependencies: 220
-- Name: InventoryItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."InventoryItem_id_seq" OWNED BY public."InventoryItem".id;


--
-- TOC entry 231 (class 1259 OID 17071)
-- Name: Module; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Module" (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Module" OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 17070)
-- Name: Module_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Module_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Module_id_seq" OWNER TO postgres;

--
-- TOC entry 5143 (class 0 OID 0)
-- Dependencies: 230
-- Name: Module_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Module_id_seq" OWNED BY public."Module".id;


--
-- TOC entry 259 (class 1259 OID 17211)
-- Name: PaymentTerm; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PaymentTerm" (
    id integer NOT NULL,
    code integer,
    description text NOT NULL,
    installments integer DEFAULT 1,
    "createdAt" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(6) without time zone
);


ALTER TABLE public."PaymentTerm" OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 17210)
-- Name: PaymentTerm_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PaymentTerm_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PaymentTerm_id_seq" OWNER TO postgres;

--
-- TOC entry 5144 (class 0 OID 0)
-- Dependencies: 258
-- Name: PaymentTerm_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PaymentTerm_id_seq" OWNED BY public."PaymentTerm".id;


--
-- TOC entry 233 (class 1259 OID 17081)
-- Name: Program; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Program" (
    id integer NOT NULL,
    "moduleId" integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Program" OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 17080)
-- Name: Program_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Program_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Program_id_seq" OWNER TO postgres;

--
-- TOC entry 5145 (class 0 OID 0)
-- Dependencies: 232
-- Name: Program_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Program_id_seq" OWNED BY public."Program".id;


--
-- TOC entry 245 (class 1259 OID 17129)
-- Name: SalesOrder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SalesOrder" (
    id integer NOT NULL,
    code text NOT NULL,
    status text DEFAULT 'OPEN'::text NOT NULL,
    "orderDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "customerName" text NOT NULL,
    "customerDoc" text,
    "paymentTerms" text,
    carrier text,
    "deliveryDate" timestamp(3) without time zone,
    notes text,
    "createdById" integer,
    subtotal double precision DEFAULT 0 NOT NULL,
    "discountTotal" double precision DEFAULT 0 NOT NULL,
    total double precision DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SalesOrder" OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 17144)
-- Name: SalesOrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SalesOrderItem" (
    id integer NOT NULL,
    "orderId" integer NOT NULL,
    "inventoryItemId" integer,
    sku text,
    name text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit text,
    "unitPrice" double precision DEFAULT 0 NOT NULL,
    "discountPct" double precision DEFAULT 0 NOT NULL,
    "lineTotal" double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public."SalesOrderItem" OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 17143)
-- Name: SalesOrderItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SalesOrderItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SalesOrderItem_id_seq" OWNER TO postgres;

--
-- TOC entry 5146 (class 0 OID 0)
-- Dependencies: 246
-- Name: SalesOrderItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SalesOrderItem_id_seq" OWNED BY public."SalesOrderItem".id;


--
-- TOC entry 244 (class 1259 OID 17128)
-- Name: SalesOrder_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SalesOrder_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SalesOrder_id_seq" OWNER TO postgres;

--
-- TOC entry 5147 (class 0 OID 0)
-- Dependencies: 244
-- Name: SalesOrder_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SalesOrder_id_seq" OWNED BY public."SalesOrder".id;


--
-- TOC entry 217 (class 1259 OID 16996)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    password text NOT NULL,
    "salesRepAdmin" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastEntityId" integer,
    doc text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 17167)
-- Name: UserClientRep; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserClientRep" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "clientId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."UserClientRep" OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 17166)
-- Name: UserClientRep_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserClientRep_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserClientRep_id_seq" OWNER TO postgres;

--
-- TOC entry 5148 (class 0 OID 0)
-- Dependencies: 250
-- Name: UserClientRep_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserClientRep_id_seq" OWNED BY public."UserClientRep".id;


--
-- TOC entry 239 (class 1259 OID 17106)
-- Name: UserEntity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserEntity" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "entityId" integer NOT NULL
);


ALTER TABLE public."UserEntity" OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 17113)
-- Name: UserEntityModule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserEntityModule" (
    id integer NOT NULL,
    "userEntityId" integer NOT NULL,
    "moduleId" integer NOT NULL,
    allowed boolean DEFAULT true NOT NULL
);


ALTER TABLE public."UserEntityModule" OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 17121)
-- Name: UserEntityModuleProgram; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserEntityModuleProgram" (
    id integer NOT NULL,
    "userEntityModuleId" integer NOT NULL,
    "programId" integer NOT NULL,
    allowed boolean DEFAULT true NOT NULL
);


ALTER TABLE public."UserEntityModuleProgram" OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 17120)
-- Name: UserEntityModuleProgram_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserEntityModuleProgram_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserEntityModuleProgram_id_seq" OWNER TO postgres;

--
-- TOC entry 5149 (class 0 OID 0)
-- Dependencies: 242
-- Name: UserEntityModuleProgram_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserEntityModuleProgram_id_seq" OWNED BY public."UserEntityModuleProgram".id;


--
-- TOC entry 240 (class 1259 OID 17112)
-- Name: UserEntityModule_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserEntityModule_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserEntityModule_id_seq" OWNER TO postgres;

--
-- TOC entry 5150 (class 0 OID 0)
-- Dependencies: 240
-- Name: UserEntityModule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserEntityModule_id_seq" OWNED BY public."UserEntityModule".id;


--
-- TOC entry 238 (class 1259 OID 17105)
-- Name: UserEntity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserEntity_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserEntity_id_seq" OWNER TO postgres;

--
-- TOC entry 5151 (class 0 OID 0)
-- Dependencies: 238
-- Name: UserEntity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserEntity_id_seq" OWNED BY public."UserEntity".id;


--
-- TOC entry 216 (class 1259 OID 16995)
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- TOC entry 5152 (class 0 OID 0)
-- Dependencies: 216
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- TOC entry 227 (class 1259 OID 17049)
-- Name: WorkOrder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WorkOrder" (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    status text DEFAULT 'OPEN'::text NOT NULL,
    "assetId" integer,
    "rootAssetId" integer,
    "scheduledAt" timestamp(3) without time zone,
    sector text,
    "maintenanceType" text,
    "openedAt" timestamp(3) without time zone,
    "assetCondition" text,
    "personnelCount" integer,
    "estimatedDurationMinutes" integer,
    tasks text,
    materials text,
    "startedAt" timestamp(3) without time zone,
    "completedAt" timestamp(3) without time zone,
    "closedAt" timestamp(3) without time zone,
    mttr integer,
    "assignedUserId" integer,
    "usedEquipment" text,
    "maintainedComponents" text,
    "executionDescription" text,
    observations text,
    "technicianSignature" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."WorkOrder" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 17048)
-- Name: WorkOrder_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."WorkOrder_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."WorkOrder_id_seq" OWNER TO postgres;

--
-- TOC entry 5153 (class 0 OID 0)
-- Dependencies: 226
-- Name: WorkOrder_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."WorkOrder_id_seq" OWNED BY public."WorkOrder".id;


--
-- TOC entry 215 (class 1259 OID 16984)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 17221)
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    token character varying(64) NOT NULL,
    user_id integer NOT NULL,
    expires timestamp(6) with time zone NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 17228)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 17227)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5154 (class 0 OID 0)
-- Dependencies: 261
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4762 (class 2604 OID 17010)
-- Name: Asset id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Asset" ALTER COLUMN id SET DEFAULT nextval('public."Asset_id_seq"'::regclass);


--
-- TOC entry 4770 (class 2604 OID 17042)
-- Name: AssetAttachment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AssetAttachment" ALTER COLUMN id SET DEFAULT nextval('public."AssetAttachment_id_seq"'::regclass);


--
-- TOC entry 4768 (class 2604 OID 17032)
-- Name: Attachment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attachment" ALTER COLUMN id SET DEFAULT nextval('public."Attachment_id_seq"'::regclass);


--
-- TOC entry 4802 (class 2604 OID 17160)
-- Name: Client id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Client" ALTER COLUMN id SET DEFAULT nextval('public."Client_id_seq"'::regclass);


--
-- TOC entry 4816 (class 2604 OID 17204)
-- Name: CommercialFamily id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CommercialFamily" ALTER COLUMN id SET DEFAULT nextval('public."CommercialFamily_id_seq"'::regclass);


--
-- TOC entry 4806 (class 2604 OID 17178)
-- Name: Complaint id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Complaint" ALTER COLUMN id SET DEFAULT nextval('public."Complaint_id_seq"'::regclass);


--
-- TOC entry 4809 (class 2604 OID 17189)
-- Name: ComplaintItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComplaintItem" ALTER COLUMN id SET DEFAULT nextval('public."ComplaintItem_id_seq"'::regclass);


--
-- TOC entry 4775 (class 2604 OID 17063)
-- Name: Entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Entity" ALTER COLUMN id SET DEFAULT nextval('public."Entity_id_seq"'::regclass);


--
-- TOC entry 4782 (class 2604 OID 17094)
-- Name: EntityModule id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EntityModule" ALTER COLUMN id SET DEFAULT nextval('public."EntityModule_id_seq"'::regclass);


--
-- TOC entry 4824 (class 2604 OID 18997)
-- Name: EntityModuleItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EntityModuleItem" ALTER COLUMN id SET DEFAULT nextval('public."EntityModuleItem_id_seq"'::regclass);


--
-- TOC entry 4783 (class 2604 OID 17101)
-- Name: EntityModuleProgram id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EntityModuleProgram" ALTER COLUMN id SET DEFAULT nextval('public."EntityModuleProgram_id_seq"'::regclass);


--
-- TOC entry 4764 (class 2604 OID 17020)
-- Name: InventoryItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryItem" ALTER COLUMN id SET DEFAULT nextval('public."InventoryItem_id_seq"'::regclass);


--
-- TOC entry 4778 (class 2604 OID 17074)
-- Name: Module id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Module" ALTER COLUMN id SET DEFAULT nextval('public."Module_id_seq"'::regclass);


--
-- TOC entry 4818 (class 2604 OID 17214)
-- Name: PaymentTerm id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentTerm" ALTER COLUMN id SET DEFAULT nextval('public."PaymentTerm_id_seq"'::regclass);


--
-- TOC entry 4780 (class 2604 OID 17084)
-- Name: Program id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Program" ALTER COLUMN id SET DEFAULT nextval('public."Program_id_seq"'::regclass);


--
-- TOC entry 4790 (class 2604 OID 17132)
-- Name: SalesOrder id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalesOrder" ALTER COLUMN id SET DEFAULT nextval('public."SalesOrder_id_seq"'::regclass);


--
-- TOC entry 4797 (class 2604 OID 17147)
-- Name: SalesOrderItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalesOrderItem" ALTER COLUMN id SET DEFAULT nextval('public."SalesOrderItem_id_seq"'::regclass);


--
-- TOC entry 4759 (class 2604 OID 16999)
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- TOC entry 4804 (class 2604 OID 17170)
-- Name: UserClientRep id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserClientRep" ALTER COLUMN id SET DEFAULT nextval('public."UserClientRep_id_seq"'::regclass);


--
-- TOC entry 4785 (class 2604 OID 17109)
-- Name: UserEntity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserEntity" ALTER COLUMN id SET DEFAULT nextval('public."UserEntity_id_seq"'::regclass);


--
-- TOC entry 4786 (class 2604 OID 17116)
-- Name: UserEntityModule id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserEntityModule" ALTER COLUMN id SET DEFAULT nextval('public."UserEntityModule_id_seq"'::regclass);


--
-- TOC entry 4788 (class 2604 OID 17124)
-- Name: UserEntityModuleProgram id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserEntityModuleProgram" ALTER COLUMN id SET DEFAULT nextval('public."UserEntityModuleProgram_id_seq"'::regclass);


--
-- TOC entry 4772 (class 2604 OID 17052)
-- Name: WorkOrder id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkOrder" ALTER COLUMN id SET DEFAULT nextval('public."WorkOrder_id_seq"'::regclass);


--
-- TOC entry 4822 (class 2604 OID 17231)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5079 (class 0 OID 17007)
-- Dependencies: 219
-- Data for Name: Asset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Asset" (id, name, code, location, description, manufacturer, model, year, criticality, "parentId", "createdAt", "updatedAt") FROM stdin;
13	Motor de Acionamento	OND-BHS-001-DRY-FAC-MOT	\N	Motor de acionamento do corte.	\N	\N	\N	\N	11	2025-11-13 18:05:48.764	2025-11-13 18:05:48.764
16	Quadro de Comando	OND-BHS-001-ELEC-QC	\N	Painel de comando com CLP.	\N	\N	\N	\N	15	2025-11-13 18:05:48.77	2025-11-13 18:05:48.77
22	Caixa de Entrada (Headbox)	MP-LIN01-WET-HB	\N	\N	\N	\N	\N	\N	21	2025-11-13 18:05:48.777	2025-11-13 18:05:48.777
23	Distribuidor	MP-LIN01-WET-HB-DIST	\N	\N	\N	\N	\N	\N	22	2025-11-13 18:05:48.779	2025-11-13 18:05:48.779
24	Bomba de Polpa	MP-LIN01-WET-HB-PUMP	\N	\N	\N	\N	\N	\N	22	2025-11-13 18:05:48.781	2025-11-13 18:05:48.781
26	Mesa Plana (Wire Section)	MP-LIN01-WET-WIRE	\N	\N	\N	\N	\N	\N	21	2025-11-13 18:05:48.785	2025-11-13 18:05:48.785
27	Tela Formadora	MP-LIN01-WET-WIRE-TELA	\N	\N	\N	\N	\N	\N	26	2025-11-13 18:05:48.787	2025-11-13 18:05:48.787
29	Rolo Couch	MP-LIN01-WET-WIRE-COUCH	\N	\N	\N	\N	\N	\N	26	2025-11-13 18:05:48.79	2025-11-13 18:05:48.79
32	Rolos Prensa	MP-LIN01-WET-PRESS-ROLL	\N	\N	\N	\N	\N	\N	31	2025-11-13 18:05:48.796	2025-11-13 18:05:48.796
33	Feltros	MP-LIN01-WET-PRESS-FELT	\N	\N	\N	\N	\N	\N	31	2025-11-13 18:05:48.798	2025-11-13 18:05:48.798
36	Secagem (Dryer Section)	MP-LIN01-DRY	\N	\N	\N	\N	\N	\N	20	2025-11-13 18:05:48.803	2025-11-13 18:05:48.803
37	Cilindros Secadores	MP-LIN01-DRY-CYL	\N	\N	\N	\N	\N	\N	36	2025-11-13 18:05:48.805	2025-11-13 18:05:48.805
38	Rolamentos	MP-LIN01-DRY-CYL-BEAR	\N	\N	\N	\N	\N	\N	37	2025-11-13 18:05:48.807	2025-11-13 18:05:48.807
41	Capota de Secagem (Hood)	MP-LIN01-DRY-HOOD	\N	\N	\N	\N	\N	\N	36	2025-11-13 18:05:48.813	2025-11-13 18:05:48.813
42	Exaustores	MP-LIN01-DRY-HOOD-EXH	\N	\N	\N	\N	\N	\N	41	2025-11-13 18:05:48.814	2025-11-13 18:05:48.814
45	Ventiladores de Ar Quente	MP-LIN01-DRY-VENT-FAN	\N	\N	\N	\N	\N	\N	44	2025-11-13 18:05:48.82	2025-11-13 18:05:48.82
46	Trocadores de Calor	MP-LIN01-DRY-VENT-HX	\N	\N	\N	\N	\N	\N	44	2025-11-13 18:05:48.822	2025-11-13 18:05:48.822
47	Acabamento (Dry End)	MP-LIN01-DE	\N	\N	\N	\N	\N	\N	20	2025-11-13 18:05:48.824	2025-11-13 18:05:48.824
48	Calandra	MP-LIN01-DE-CAL	\N	\N	\N	\N	\N	\N	47	2025-11-13 18:05:48.825	2025-11-13 18:05:48.825
49	Rolos de Calandragem	MP-LIN01-DE-CAL-ROLL	\N	\N	\N	\N	\N	\N	48	2025-11-13 18:05:48.827	2025-11-13 18:05:48.827
50	Motores de Ajuste	MP-LIN01-DE-CAL-MOT	\N	\N	\N	\N	\N	\N	48	2025-11-13 18:05:48.829	2025-11-13 18:05:48.829
51	Refile	MP-LIN01-DE-REF	\N	\N	\N	\N	\N	\N	47	2025-11-13 18:05:48.831	2025-11-13 18:05:48.831
52	Facas de Corte	MP-LIN01-DE-REF-KN	\N	\N	\N	\N	\N	\N	51	2025-11-13 18:05:48.833	2025-11-13 18:05:48.833
53	Motores de Refile	MP-LIN01-DE-REF-MOT	\N	\N	\N	\N	\N	\N	51	2025-11-13 18:05:48.835	2025-11-13 18:05:48.835
54	Enroladeira (Reel)	MP-LIN01-DE-REEL	\N	\N	\N	\N	\N	\N	47	2025-11-13 18:05:48.837	2025-11-13 18:05:48.837
55	Tambor Enrolador	MP-LIN01-DE-REEL-DRUM	\N	\N	\N	\N	\N	\N	54	2025-11-13 18:05:48.839	2025-11-13 18:05:48.839
58	Sistema de Transporte e Motores	MP-LIN01-DRV	\N	\N	\N	\N	\N	\N	20	2025-11-13 18:05:48.844	2025-11-13 18:05:48.844
60	Motor da Mesa Plana	MP-LIN01-DRV-MOT-WIRE	\N	\N	\N	\N	\N	\N	59	2025-11-13 18:05:48.848	2025-11-13 18:05:48.848
61	Motor da Prensa	MP-LIN01-DRV-MOT-PRESS	\N	\N	\N	\N	\N	\N	59	2025-11-13 18:05:48.85	2025-11-13 18:05:48.85
62	Motor dos Secadores	MP-LIN01-DRV-MOT-DRY	\N	\N	\N	\N	\N	\N	59	2025-11-13 18:05:48.852	2025-11-13 18:05:48.852
63	Motor da Enroladeira	MP-LIN01-DRV-MOT-REEL	\N	\N	\N	\N	\N	\N	59	2025-11-13 18:05:48.854	2025-11-13 18:05:48.854
64	Correias e Acoplamentos	MP-LIN01-DRV-BELT	\N	\N	\N	\N	\N	\N	58	2025-11-13 18:05:48.856	2025-11-13 18:05:48.856
66	Quadro de Comando	MP-LIN01-EL-PANEL	\N	\N	\N	\N	\N	\N	65	2025-11-13 18:05:48.86	2025-11-13 18:05:48.86
68	Contatores	MP-LIN01-EL-PANEL-CONTACT	\N	\N	\N	\N	\N	\N	66	2025-11-13 18:05:48.863	2025-11-13 18:05:48.863
70	Painel de Interface (IHM)	MP-LIN01-EL-IHM	\N	\N	\N	\N	\N	\N	65	2025-11-13 18:05:48.867	2025-11-13 18:05:48.867
71	Tela Touch	MP-LIN01-EL-IHM-TOUCH	\N	\N	\N	\N	\N	\N	70	2025-11-13 18:05:48.869	2025-11-13 18:05:48.869
72	Placas Controladoras	MP-LIN01-EL-IHM-BOARDS	\N	\N	\N	\N	\N	\N	70	2025-11-13 18:05:48.871	2025-11-13 18:05:48.871
10	Dry End (módulo)	OND-BHS-001-DRY	\N	Sa�da, corte e stacker.	\N	\N	\N	\N	3	2025-11-13 18:05:48.759	2025-11-25 12:30:49.047
17	CLP (Controlador Lógico Programável)	OND-BHS-001-ELEC-QC-CLP	\N	Controlador com programa ladder.	\N	\N	\N	\N	16	2025-11-13 18:05:48.772	2025-11-25 12:32:41.864
7	Rolamentos	OND-BHS-001-WET-PA-RB	\N	Rolamentos do pr�-aquecedor.	\N	\N	\N	\N	5	2025-11-13 18:05:48.752	2025-11-18 14:26:28.989
8	Sensor de Temperatura	OND-BHS-001-WET-PA-TS	\N	Sensor de temperatura do pr�-aquecedor.	\N	\N	\N	\N	5	2025-11-13 18:05:48.754	2025-11-18 14:26:28.991
9	Coladeira	OND-BHS-001-WET-COL	\N	Aplica��o e dosagem de cola.	\N	\N	\N	\N	4	2025-11-13 18:05:48.757	2025-11-18 14:26:28.993
15	Sistema Elétrico (módulo)	OND-BHS-001-ELEC	\N	Distribui��o e controle el�trico.	\N	\N	\N	\N	3	2025-11-13 18:05:48.768	2025-11-25 12:31:09.509
5	Pré-Aquecedor	OND-BHS-001-WET-PA	\N	Pr�-aquecimento do papel.	\N	\N	\N	\N	4	2025-11-13 18:05:48.748	2025-11-25 12:32:13.222
6	Motor Elétrico	OND-BHS-001-WET-PA-MOT	\N	Motor el�trico do pr�-aquecedor.	\N	\N	\N	\N	5	2025-11-13 18:05:48.75	2025-11-25 12:33:13.269
14	Estaqueador	OND-BHS-001-DRY-STACK	\N	Ac�mulo e empilhamento de chapas.	\N	\N	\N	\N	10	2025-11-13 18:05:48.766	2025-11-18 14:26:29
11	Facão (Corte)	OND-BHS-001-DRY-FAC	\N	Sistema de corte transversal.	\N	\N	\N	\N	10	2025-11-13 18:05:48.76	2025-11-25 12:31:49.459
12	Lâmina de Corte	OND-BHS-001-DRY-FAC-BLA	\N	L�mina de corte com desgaste controlado.	\N	\N	\N	\N	11	2025-11-13 18:05:48.762	2025-11-25 12:32:57.844
59	Motores Elétricos	MP-LIN01-DRV-MOT	\N	\N	\N	\N	\N	\N	58	2025-11-13 18:05:48.846	2025-11-18 18:02:36.437
21	Forma��o (Wet End)	MP-LIN01-WET	\N	\N	\N	\N	\N	\N	20	2025-11-13 18:05:48.775	2025-11-18 14:26:29.007
25	Sistema de Agita��o	MP-LIN01-WET-HB-AGIT	\N	\N	\N	\N	\N	\N	22	2025-11-13 18:05:48.783	2025-11-18 14:26:29.008
28	Caixas de Suc��o	MP-LIN01-WET-WIRE-SUC	\N	\N	\N	\N	\N	\N	26	2025-11-13 18:05:48.789	2025-11-18 14:26:29.01
35	Bombas Hidráulicas	MP-LIN01-WET-PRESS-PUMP	\N	\N	\N	\N	\N	\N	31	2025-11-13 18:05:48.801	2025-11-18 18:03:56.655
31	Pixaão (Press Section)	MP-LIN01-WET-PRESS	\N	\N	\N	\N	\N	\N	21	2025-11-13 18:05:48.794	2025-11-18 17:54:08.101
34	Sistema de Lubrifica��o	MP-LIN01-WET-PRESS-LUBE	\N	\N	\N	\N	\N	\N	31	2025-11-13 18:05:48.8	2025-11-18 14:26:29.014
69	Inversores de Frequência	MP-LIN01-EL-PANEL-VFD	\N	\N	\N	\N	\N	\N	66	2025-11-13 18:05:48.865	2025-11-18 18:04:17.966
39	Tubulações de Vapor	MP-LIN01-DRY-CYL-STEAM	\N	\N	\N	\N	\N	\N	37	2025-11-13 18:05:48.809	2025-11-18 17:54:29.066
57	Sistema Hidráulico	MP-LIN01-DE-REEL-HYD	\N	\N	\N	\N	\N	\N	54	2025-11-13 18:05:48.842	2025-11-18 17:49:19.417
30	Sistema de Vácuo	MP-LIN01-WET-WIRE-VAC	\N	\N	\N	\N	\N	\N	26	2025-11-13 18:05:48.792	2025-11-18 18:03:38.093
44	Sistema de Ventila��o	MP-LIN01-DRY-VENT	\N	\N	\N	\N	\N	\N	36	2025-11-13 18:05:48.818	2025-11-18 14:26:29.021
56	Motores de Tra��o	MP-LIN01-DE-REEL-DRIVE	\N	\N	\N	\N	\N	\N	54	2025-11-13 18:05:48.84	2025-11-18 14:26:29.023
67	CLP (Controlador Lógico Programável)	MP-LIN01-EL-PANEL-PLC	\N	\N	\N	\N	\N	\N	66	2025-11-13 18:05:48.862	2025-11-18 17:49:58.389
43	Queimadores a Gás/Vapor	MP-LIN01-DRY-HOOD-BURN	\N	\N	\N	\N	\N	\N	41	2025-11-13 18:05:48.816	2025-11-18 18:03:16.873
73	Botões de Emergência	MP-LIN01-EL-IHM-ESTOP	\N	\N	\N	\N	\N	\N	70	2025-11-13 18:05:48.873	2025-11-18 18:04:42.266
65	Sistema de Controle e Elétrica	MP-LIN01-EL	\N	\N	\N	\N	\N	\N	20	2025-11-13 18:05:48.858	2025-11-18 18:01:21.283
4	Wet End (módulo)	OND-BHS-001-WET	\N	Alimenta��o, emenda e ondula��o (single facer).	\N	\N	\N	\N	3	2025-11-13 18:05:48.746	2025-11-25 12:30:29.989
40	Sifões de Condensado	MP-LIN01-DRY-CYL-SIF	\N	\N	\N	\N	\N	\N	37	2025-11-13 18:05:48.811	2025-11-18 17:24:32.911
78	Sistema de Vapor	MP-LIN01-AUX-STM	\N	\N	\N	\N	\N	\N	74	2025-11-13 18:05:48.884	2025-11-13 18:05:48.884
84	Filtros	MP-LIN01-AUX-WTR-FLT	\N	\N	\N	\N	\N	\N	82	2025-11-13 18:05:48.895	2025-11-13 18:05:48.895
3	Onduladeira BHS - Linha 01	OND-BHS-001	Cartonificio Valinhos - Setor Ondula��o / Linha 1	Onduladeira BHS para Linha 01. Fun��o: ondula��o e produ��o de papel�o. Capacidade nominal conforme especifica��o. Observa��es: cr�tico para produ��o.	BHS Corrugated	ExampleModel-2200	2020	HIGH	\N	2025-11-13 18:05:48.741	2025-11-18 14:26:28.955
79	Caldeira (integra��o)	MP-LIN01-AUX-STM-BOILER	\N	\N	\N	\N	\N	\N	78	2025-11-13 18:05:48.886	2025-11-18 14:26:29.045
86	Lubrifica��o Central	MP-LIN01-AUX-LUBE	\N	\N	\N	\N	\N	\N	74	2025-11-13 18:05:48.899	2025-11-18 14:26:29.053
89	Tubula��o de Distribui��o	MP-LIN01-AUX-LUBE-PIP	\N	\N	\N	\N	\N	\N	86	2025-11-13 18:05:48.905	2025-11-18 14:26:29.057
82	Sistema de Água	MP-LIN01-AUX-WTR	\N	\N	\N	\N	\N	\N	74	2025-11-13 18:05:48.892	2025-11-18 17:52:47.079
74	Serviços Auxiliares	MP-LIN01-AUX	\N	\N	\N	\N	\N	\N	20	2025-11-13 18:05:48.875	2025-11-18 18:01:39.785
20	Máquina de Papel | Linha 01	MP-LIN01	Cartonificio Valinhos | Setor Papel / Linha 01	M�quina de papel completa com se��es de forma��o, prensagem, secagem e acabamento.	Voith / Valmet (exemplo)	PM-4200	2019	HIGH	\N	2025-11-13 18:05:48.774	2025-11-18 18:02:16.58
75	Sistema de Vácuo	MP-LIN01-AUX-VAC	\N	\N	\N	\N	\N	\N	74	2025-11-13 18:05:48.879	2025-11-18 18:02:53.839
80	Válvulas Reguladoras	MP-LIN01-AUX-STM-VALV	\N	\N	\N	\N	\N	\N	78	2025-11-13 18:05:48.888	2025-11-18 18:05:01.806
81	Manômetros	MP-LIN01-AUX-STM-GAUGE	\N	\N	\N	\N	\N	\N	78	2025-11-13 18:05:48.89	2025-11-18 18:05:26.511
87	Bombas de óleo	MP-LIN01-AUX-LUBE-PUMP	\N	\N	\N	\N	\N	\N	86	2025-11-13 18:05:48.901	2025-11-18 18:05:41.723
88	Reservatório	MP-LIN01-AUX-LUBE-TANK	\N	\N	\N	\N	\N	\N	86	2025-11-13 18:05:48.903	2025-11-18 18:05:59.949
83	Bomba de água Branca	MP-LIN01-AUX-WTR-PUMP	\N	\N	\N	\N	\N	\N	82	2025-11-13 18:05:48.894	2025-11-18 18:06:21.362
85	Tubulações	MP-LIN01-AUX-WTR-PIP	\N	\N	\N	\N	\N	\N	82	2025-11-13 18:05:48.897	2025-11-18 18:06:39.011
76	Bombas de Vácuo	MP-LIN01-AUX-VAC-PUMP	\N	\N	\N	\N	\N	\N	75	2025-11-13 18:05:48.881	2025-11-18 18:07:09.08
77	Selos Mecânicos	MP-LIN01-AUX-VAC-SEAL	\N	\N	\N	\N	\N	\N	75	2025-11-13 18:05:48.882	2025-11-18 18:07:28.021
\.


--
-- TOC entry 5085 (class 0 OID 17039)
-- Dependencies: 225
-- Data for Name: AssetAttachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AssetAttachment" (id, "fileName", url, "mimeType", "uploadedAt", "assetId") FROM stdin;
3	MP-PA-001.json	data:application/json;base64,eyJjb2RlIjoiTVAtUEEtMDAxIiwiZnJlcXVlbmN5SG91cnMiOjIwMDAsImZyZXF1ZW5jeURheXMiOjkwLCJlc3RpbWF0ZWRUYXNrSG91cnMiOjIsImNoZWNrbGlzdCI6WyJWZXJpZmljYXIgdmlicmHDp8OjbyBkbyBtb3RvciIsIk1lZGlyIHRlbXBlcmF0dXJhIGVtIHBvbnRvIFgiLCJWZXJpZmljYXIgZGVzZ2FzdGUgZG9zIHJvbGFtZW50b3MiLCJMdWJyaWZpY2FyIHJvbGFtZW50b3MiLCJDaGVjYXIgZml4YcOnw7VlcyIsIlRlc3RlIGVtIGZ1bmNpb25hbWVudG8gMTAgbWludXRvcyJdLCJwbGFubmVkUGFydHMiOlt7InNrdSI6IlNQLU9ORC1STEItMDAxIiwicXR5IjoxLCJub3RlIjoic2UgZGVzZ2FzdGUgPiBsaW1pdGUifSx7Im1hdGVyaWFsIjoiTHVicmlmaWNhbnRlIiwicXR5IjowLjIsInVuaXQiOiJMIn1dLCJzYWZldHkiOiJMb2Nrb3V0IHRhZ291dCAoTE9UTykgKyBsaWJlcmFyIHZhcG9yIGFudGVzIGRlIGludGVydmVuw6fDo28ifQ==	application/json	2025-11-13 18:05:48.955	5
4	MP-BLA-001.json	data:application/json;base64,eyJjb2RlIjoiTVAtQkxBLTAwMSIsImNoZWNrbGlzdCI6WyJJbnNwZcOnw6NvIGRpw6FyaWE6IGNoZWNhciByZWJhcmJhcyIsIlN1YnN0aXR1aXIgcXVhbmRvIGRlc2dhc3RlID4gMSBtbSIsIkNoZWNrbGlzdCB0cm9jYTogTE9UTywgcmV0aXJhciBwcm90ZcOnw6NvLCBtZWRpciwgaW5zdGFsYXIsIGFwZXJ0YXIgdG9ycXVlIFggTm0sIHRlc3RhciJdLCJsaWZlSG91cnMiOjIwMH0=	application/json	2025-11-13 18:05:48.958	12
5	diagrama_eletrico.pdf	https://example.com/diagrama_eletrico.pdf	application/pdf	2025-11-13 18:05:48.96	16
6	backup_ladder.zip	https://example.com/backup_ladder.zip	application/zip	2025-11-13 18:05:48.961	17
7	asset-3-1759547291601-6599f9fd-d0ac-48f2-81bb-7d81c7ef2f95-onduladeira.webp	/uploads/asset-3-1759547291601-6599f9fd-d0ac-48f2-81bb-7d81c7ef2f95-onduladeira.webp	image/webp	2025-11-13 18:05:48.963	3
10	MP-FAC-BLA.json	data:application/json;base64,eyJjb2RlIjoiTVAtRkFDLUJMQSIsImZyZXF1ZW5jeSI6eyJob3VycyI6MjAwLCJtb2RlIjoidmlkYSBtw6lkaWEgb3UgbWVkacOnw6NvIn0sImNoZWNrbGlzdCI6W3sic3RlcCI6MSwidGV4dCI6Iklzb2xhciBlbmVyZ2lhIChMT1RPKSDigJQgY29uZmlybWFyIGJsb3F1ZWlvcyIsInNpZ25hdHVyZSI6dHJ1ZX0seyJzdGVwIjoyLCJ0ZXh0IjoiTGliZXJhciBwcmVzc8Ojby92YXBvciAoc2UgYXBsaWPDoXZlbCkifSx7InN0ZXAiOjMsInRleHQiOiJSZXRpcmFyIHByb3Rlw6fDo28gZG8gZmFjw6NvIn0seyJzdGVwIjo0LCJ0ZXh0IjoiTWVkaXIgbMOibWluYSB2ZWxoYSIsImZpZWxkIjp7InR5cGUiOiJudW1iZXIiLCJuYW1lIjoibWVkaWRhX21tIn19LHsic3RlcCI6NSwidGV4dCI6Ikluc3RhbGFyIGzDom1pbmEgbm92YSDigJQgdG9ycXVlIFggTm0iLCJmaWVsZCI6eyJ0eXBlIjoibnVtYmVyIiwibmFtZSI6InRvcnF1ZV9ubSJ9fSx7InN0ZXAiOjYsInRleHQiOiJBY3Jlc2NlbnRhciBsdWJyaWZpY2FudGUgWCIsImZpZWxkIjp7InR5cGUiOiJ0ZXh0IiwibmFtZSI6Imx1YnJpZmljYW50ZSJ9fSx7InN0ZXAiOjcsInRleHQiOiJSZWFsaXphciB0ZXN0ZSBkZSBjb3J0ZSA1bWluIn0seyJzdGVwIjo4LCJ0ZXh0IjoiQXNzaW5hdHVyYSBkbyB0w6ljbmljbyBlIGRvIHN1cGVydmlzb3IiLCJzaWduYXR1cmUiOnRydWV9XSwidG9vbHMiOlsiQ2hhdmUgZGUgdG9ycXVlIiwiQ2FsaWJyYWRvciIsIkVQSTogbHV2YXMsIMOzY3Vsb3MiXSwicGFydHMiOlt7InNrdSI6IlNQLU9ORC1CTEEtMDAxIiwicXR5IjoxfV19	application/json	2025-11-13 18:05:48.964	12
11	asset-6-1759549936292-727c001c-6753-409d-a748-f6a167a16cd7-motor_eletrico.webp	/uploads/asset-6-1759549936292-727c001c-6753-409d-a748-f6a167a16cd7-motor_eletrico.webp	image/webp	2025-11-13 18:05:48.966	6
13	asset-20-1759550762334-d7609d5c-6c2d-473a-a798-5b963cba2948-maquina_de_papel.png	/uploads/asset-20-1759550762334-d7609d5c-6c2d-473a-a798-5b963cba2948-maquina_de_papel.png	image/png	2025-11-13 18:05:48.967	20
14	ond_bhs_linha1.jpg	/icons/logo cartonificio.png	image/jpeg	2025-11-13 18:05:48.968	3
15	manual_bhs.pdf	https://example.com/manual_bhs.pdf	application/pdf	2025-11-13 18:05:48.97	3
16	pm_linha01.webp	/icons/logo cartonificio.png	image/webp	2025-11-13 18:05:48.971	20
\.


--
-- TOC entry 5083 (class 0 OID 17029)
-- Dependencies: 223
-- Data for Name: Attachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Attachment" (id, "fileName", url, "mimeType", "uploadedAt", "workOrderId") FROM stdin;
1	assinatura-1759527758332.png	data:image/png;base64,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	image/png	2025-11-13 18:05:48.94	1
2	assinatura-1759529554450.png	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABagAAADwCAYAAADlwYNsAAAAAXNSR0IArs4c6QAAIABJREFUeF7t3V9sZFl+F/Bzq+z+Nz1t1/S0XTO7q830tF2zs+xmIQhFSqKA4CEQoRAhkYR/Sh554Y9EBDwgeEB5SCRQeOANkIiCEiIhiEQgQkKRNiRCCEKSze7Y7p7ZXc1sl929XWW3u9ttV92Dquxyl3vc3VV2/TtVHytKovS95/zO59xbD989+d0s+CNAgAABAgQIECBAgAABAgQIECBAgAABAmMQyMYwpykJECBAgAABAgQIECBAgAABAgQIECBAgEAQUHsICBAgQIAAAQIECBAgQIAAAQIECBAgQGAsAgLqsbCblAABAgQIECBAgAABAgQIECBAgAABAgQE1J4BAgQIECBAgAABAgQIECBAgAABAgQIEBiLgIB6LOwmJUCAAAECBAgQIECAAAECBAgQIECAAAEBtWeAAAECBAgQIECAAAECBAgQIECAAAECBMYiIKAeC7tJCRAgQIAAAQIECBAgQIAAAQIECBAgQEBA7RkgQIAAAQIECBAgQIAAAQIECBAgQIAAgbEICKjHwm5SAgQIECBAgAABAgQIECBAgAABAgQIEBBQewYIECBAgAABAgQIECBAgAABAgQIECBAYCwCAuqxsJuUAAECBAgQIECAAAECBAgQIECAAAECBATUngECBAgQIECAAAECBAgQIECAAAECBAgQGIuAgHos7CYlQIAAAQIECBAgQIAAAQIECBAgQIAAAQG1Z4AAAQIECBAgQIAAAQIECBAgQIAAAQIExiIgoB4Lu0kJECBAgAABAgQIECBAgAABAgQIECBAQEDtGSBAgAABAgQIECBAgAABAgQIECBAgACBsQgIqMfCblICBAgQIECAAAECBAgQIECAAAECBAgQEFB7BggQIECAAAECBAgQIECAAAECBAgQIEBgLAIC6rGwm5QAAQIECBAgQIAAAQIECBAgQIAAAQIEBNSeAQIECBAgQIAAAQIECBAgQIAAAQIECBAYi4CAeizsJiVAgAABAgQIECBAgAABAgQIECBAgAABAbVngAABAgQIECBAgAABAgQIECBAgAABAgTGIiCgHgu7SQkQIECAAAECBAgQIECAAAECBAgQIEBAQO0ZIDBDAq8vV5pzWSjEEEIeDvKd6ofFGVq+pRIg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CBAg0L+AgLp/M3fMkMC1ciUvPjtGHWqb09Lq40f/XKl8+793ttLHEmfoobZUAgQIECBAgAABAgQIECBAgMAECQioJ2gzlDKZAt0fFZymns2LS5U8K4T2b0Azj3Fna3pamEzmk6QqAgQIECBAgAABAgQIECBAgACB5wUE1J4JAq8QWFz88lezS09/sHNZI4b84eZaMXW4S+XK3uUQLh6uI4Zadd3vQeqbqn4CBAgQIECAAAECBAgQIECAQGICAqnENky54xFYvFFpZsVw/JHES9nOv7979+5fG081g5u1tFyJh2eoQzhoNJq79+/MDW50IxEgQIAAAQIECBAgQIAAAQIECBB4uYCA2hNCoEeB7jA3xBhqm+mfOL765ruN+bm549PgelH3+DC4jAABAgQIECBAgAABAgQIECBAYCACAuqBMBpkVgQWy5XYeWlizGN9c+P4VHWqBt09th/tPznYf/DtC6muRd0ECBAgQIAAAQIECBAgQIAAAQJpCQio09ov1Y5Z4Or1m435+daJ48NX53Fjv/70/kelMZd1rumvLa3kxULh+LfAKepzcbqZAAECBAgQIECAAAECBAgQIECgDwEBdR9YLiXQEigtreThKNCNMYb6FLT6OHEyPMRYr64nfzLc00qAAAECBAgQIECAAAECBAgQIDD5AgLqyd8jFU6gQHdbjBhjrG+mHeguLHzpw8Llp+90TobHkOf16sZxb+oJ3AIlESBAgAABAgQIECBAgAABAgQITIGAgHoKNtESRi9w+e33P76UNz9zPHNsNmubt+dGX8ngZlxcutnICvPtUDqGGJ7kzf2nW3cuDm4GIxEgQIAAAQIECBAgQIAAAQIECBA4KSCg9kQQOKNA6UYlD8WjZtQxhNrmWvLv08JyJS9kR2sKIehHfcaHw20ECBAgQIAAAQIECBAgQIAAAQI9CSQfqPW0ShcRGJJAabkSn8W50xHodq9Jq48hPTiGJUCAAAECBAgQIECAAAECBAgQaAsIqD0IBM4j8IUv/PxiLf/ZzosUmyGv31tLunfz1avvVuevzi13WJyiPs8D4l4CBAgQIECAAAECBAgQIECAAIGXCQioPR8Ezimw8OZKszBXKHSGOdjdX9vd/ei9cw471tsXy6t5FrLD34dmI6/du5N06D5WTJMTIECAAAECBAgQIECAAAECBAi8UEBA7eEgMACB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9vBqIspXBAECBAgQIECAAAECBAgQIECAAAECBAikKiCgTnXn1E2AAAECBAgQIECAAAECBAgQIECAAIHEBQTUiW+g8gkQIECAAAECBAgQIECAAAECBAgQIJCqgIA61Z1TNwECBAgQIECAAAECBAgQIECAAAECBBIXEFAnvoHKJ0CAAAECBAgQIECAAAECBAgQIECAQKoCAupUd07dBAgQIECAAAECBAgQIECAAAECBAgQSFxAQJ34BiqfAAECBAgQIECAAAECBAgQIECAAAECqQoIqFPdOXUTIECAAAECBAgQIECAAAECBAgQIEAgcQEBdeIbqHwCBAgQIECAAAECBAgQIECAAAECBAikKiCgTnXn1E2AAAECBAgQIECAAAECBAgQIECAAIHEBQTUiW+g8gkQIECAAAECBAgQIECAAAECBAgQIJCqgIA61Z1TNwECBAgQIECAAAECBAgQIECAAAECBBIXEFAnvoHKJ0CAAAECBAgQIECAAAECBAgQIECAQKoCAupUd07dBAgQIECAAAECBAgQIECAAAECBAgQSFxAQJ34BiqfAAECBAgQIECAAAECBAgQIECAAAECqQoIqFPdOXUTIECAAAECBAgQIECAAAECBAgQIEAgcQEBdeIbqHwCBAgQIECAAAECBAgQIECAAAECBAikKiCgTnXn1E2AAAECBAgQIECAAAECBAgQIECAAIHEBQTUiW+g8gkQIECAAAECBAgQIECAAAECBAgQIJCqgIA61Z1TNwECBAgQIECAAAECBAgQIECAAAECBBIXEFAnvoHKJ0CAAAECBAgQIECAAAECBAgQIECAQKoCAupUd07dBAgQIECAAAECBAgQIECAAAECBAgQSFxAQJ34BiqfAAECBAgQIECAAAECBAgQIECAAAECqQoIqFPdOXUTIECAAAECBAgQIECAAAECBAgQIEAgcQEBdeIbqHwCBAgQIECAAAECBAgQIECAAAECBAikKiCgTnXn1E2AAAECBAgQIECAAAECBAgQIECAAIHEBQTUiW+g8gkQIECAAAECBAgQIECAAAECBAgQIJCqgIA61Z1TNwECBAgQIECAAAECBAgQIECAAAECBBIXEFAnvoHKJ0CAAAECBAgQIECAAAECBAgQIECAQKoCAupUd07dBAgQIECAAAECBAgQIECAAAECBAgQSFxAQJ34BiqfAAECBAgQIECAAAECBAgQIECAAAECqQoIqFPdOXUTIECAAAECBAgQIECAAAECBAgQIEAgcQEBdeIbqHwCBAgQIECAAAECBAgQIECAAAECBAikKiCgTnXn1E2AAAECBAgQIECAAAECBAgQIECAAIHEBQTUiW+g8gkQIECAAAECBAgQIECAAAECBAgQIJCqgIA61Z1TNwECBAgQIECAAAECBAgQIECAAAECBBIXEFAnvoHKJ0CAAAECBAgQIECAAAECBAgQIECAQKoCAupUd07dBAgQIECAAAECBAgQIECAAAECBAgQSFxAQJ34BiqfAAECBAgQIECAAAECBAgQIECAAAECqQoIqFPdOXUTIECAAAECBAgQIECAAAECBAgQIEAgcQEBdeIbqHwCBAgQIECAAAECBAgQIECAAAECBAikKiCgTnXn1E2AAAECBAgQIECAAAECBAgQIECAAIHEBQTUiW+g8gkQIECAAAECBAgQIECAAAECBAgQIJCqgIA61Z1TNwECBAgQIECAAAECBAgQIECAAAECBBIXEFAnvoHKJ0CAAAECBAgQIECAAAECBAgQIECAQKoCAupUd07dBAgQIECAAAECBAgQIECAAAECBAgQSFxAQJ34BiqfAAECBAgQIECAAAECBAgQIECAAAECqQoIqFPdOXUTIECAAAECBAgQIECAAAECBAgQIEAgcQEBdeIbqHwCBAgQIECAAAECBAgQIECAAAECBAikKiCgTnXn1E2AAAECBAgQIECAAAECBAgQIECAAIHEBQTUiW+g8gkQIECAAAECBAgQIECAAAECBAgQIJCqgIA61Z1TNwECBAgQIECAAAECBAgQIECAAAECBBIXEFAnvoHKJ0CAAAECBAgQIECAAAECBAgQIECAQKoC/x+sTo54zmFJ3AAAAABJRU5ErkJggg==	image/png	2025-11-13 18:05:48.947	4
3	assinatura-1759540010195.png	data:image/png;base64,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	image/png	2025-11-13 18:05:48.951	2
\.


--
-- TOC entry 5109 (class 0 OID 17157)
-- Dependencies: 249
-- Data for Name: Client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Client" (id, doc, name, cep, logradouro, numero, bairro, cidade, estado, "createdAt", "updatedAt") FROM stdin;
6	58953795000132	Fortebox Embalagens e Maquinas Ltda	17039770	Rua Maurita Vaz Malmonge	2-142	Distrito Industrial Marcus Vinicius Felix Machado	Bauru	SP	2025-11-18 12:16:55.266	2025-11-18 12:22:06.22
10	56883820000204	EMBRAMACO EMPRESA BRASILEIRA DE MATERIAIS PARA CONSTRUCAO SA	13510204	CONDE GUILHERME PRATES	382	SANTA CATARINA	SANTA GERTRUDES	SP	2025-11-18 12:35:57.717	2025-11-18 12:35:57.717
11	00999999000190	Cliente Doc Patch	\N	\N	\N	\N	Campinas	SP	2025-11-27 12:41:22.783	2025-11-27 12:43:06.648
21	22763898000192	M.E EMBALAGENS LTDA	13901014	AVENIDA DA SAUDADES, 1130	1130	SILVESTRE	AMPARO	SP	2025-11-27 13:08:48.845	2025-11-27 21:41:32.213
23	02377937000106	RC MOVEIS E EQUIPAMENTOS HOSPITALARES LTDA	13368100	AV MOISES FORTI, 1230	1230	DIST INDL	CAPIVARI	SP	2025-11-27 13:08:49.228	2025-11-27 21:41:32.404
13	62960063000147	FORBOX SOLUCAO EM CAIXAS DE PAPELAO LTDA	19050350	RUA PIONEIRO JOSE LORENCETE,51	51	JARDIM BONGIOVANI	PRESIDENTE PRUDENTE	SP	2025-11-27 13:08:47.046	2025-11-27 21:41:32.985
18	61069669000124	HORTOPEL EMBALAGENS LTDA	13188190	RUA BRAS CUBAS, 35	35	JD AMANDA II	HORTOLANDIA	SP	2025-11-27 13:08:48.035	2025-11-27 21:41:33.174
15	26532996000170	MARIA DA PENHA DA CRUZ RODRIGUES 09349130726	22785092	ESTRADA DOS BANDEIRANTES, 27238	27238	VARGEM GRANDE	RIO DE JANEIRO	RJ	2025-11-27 13:08:47.441	2025-11-27 21:41:33.63
22	27065075000107	DEBORA ROBERTA M. DE S. VIEIRA 01975849779	21635290	RUA LUCIO JOSE FILHO, 277 FUNDOS	277 FUNDOS	PARQUE ANCHIETA	RIO DE JANEIRO	RJ	2025-11-27 13:08:49.067	2025-11-27 21:41:33.76
25	20013983000108	EMPLASTIC IND E COM DE PLASTICOS LTDA	38402034	RUA MARIA QUITERIA, 96	96	MARTA HELENA	UBERLANDIA	MG	2025-11-27 13:08:49.588	2025-11-27 21:41:34.11
24	47256980000151	EXCLUSIVA EMBALAGENS LTDA	32667370	RUA JULIA PINHEIRO DE ARAUJO,144	144	SANTA CRUZ	BETIM	MG	2025-11-27 13:08:49.395	2025-11-27 21:41:34.453
26	11827485000108	VILAR IND E COMERCIO DE MOVEIS LTDA	36500001	RUA FLORENCIA DE SOUZA, 70	70	INDUSTRIAL	UBA	MG	2025-11-27 13:08:49.808	2025-11-27 21:41:34.794
17	36977292000164	36977292 FERNANDO SOUSA LOBO	13842308	RUA FRANCISCO CARAVETA, 38	38	PQ DOS EUCALIPTOS	MOGI GUACU	sp	2025-11-27 13:08:47.844	2025-11-27 21:41:35.142
19	58311683000188	AGROPLAST SERVICO INDUSTRIA E COMERCIO LTDA	37136122	RUA CAXAMBU N 23	RUA CAXAMBU N 23	RESIDENCIAL OLIVEIRA	ALFENAS	MG	2025-11-27 13:08:48.196	2025-11-27 21:41:35.273
14	55522847000128	ANA PAULA T DANTAS & H.S MACHADO EMB. LTDA	02186000	RUA CABO ANTONIO PINTO, 31	31	PARQUE NOVO MUNDO	SAO PAULO	SP	2025-11-27 13:08:47.243	2025-11-27 21:41:30.857
12	53142132000114	BOX360 EMBALAGENS E PAPELAO LTDA	03141030	RUA PINHEIRO GUIMARAES,764	764	PQ DA VILA PRUDENTE	SAO PAULO	SP	2025-11-27 13:08:46.848	2025-11-27 21:41:31.319
16	54786115000182	MINERADORA PAULISTA COMERCIO LTDA	13520991	ROD SP-304 SAO PEDRO, S/N	S/N	SANTA MARIA DA SERRA	SAO PEDRO	SP	2025-11-27 13:08:47.644	2025-11-27 21:41:31.825
20	04331322000174	DRAGAO INJETORA DE PLASTICOS LTDA	13320150	RUA ITALIA MANFREDINI, 186	186	NUCLEO INDL ALERT	SALTO	SP	2025-11-27 13:08:48.428	2025-11-27 21:41:32.017
\.


--
-- TOC entry 5117 (class 0 OID 17201)
-- Dependencies: 257
-- Data for Name: CommercialFamily; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CommercialFamily" (id, description, "createdAt", "updatedAt", "erpCode") FROM stdin;
2	CAIXAS	2025-11-25 12:59:35.19796	2025-11-27 14:02:37.429561	CAIXAS
1	CHAPAS	2025-11-25 12:59:26.408424	2025-11-27 14:02:43.694637	CHAPAS
4	FANFOLD	2025-11-25 13:01:35.776813	2025-11-27 14:02:50.491829	FANFOLD
3	PAPEL	2025-11-25 13:00:15.599269	2025-11-27 14:02:56.596821	PAPEL
\.


--
-- TOC entry 5113 (class 0 OID 17175)
-- Dependencies: 253
-- Data for Name: Complaint; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Complaint" (id, code, "entityId", "createdById", division, type, phase, "dueDate", canceled, "cancelReason", "dateSac", "dateReceived", "counterpartyType", "counterpartyCode", "counterpartyName", city, uf, "contactName", "contactPhone", "contactEmail", "representativeName", "representativeEmail", carrier, "freightType", attendant, reference, classification, "occurrencePattern", "occurrenceCode", "occurrenceText", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5115 (class 0 OID 17186)
-- Dependencies: 255
-- Data for Name: ComplaintItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ComplaintItem" (id, "complaintId", "invoiceNumber", sft, "orderNumber", spd, "emissionDate", description, uom, "unitPrice", "qtyInvoiced", "divergenceQty", "divergenceValue", "divergencePercent", "totalPercent") FROM stdin;
\.


--
-- TOC entry 5089 (class 0 OID 17060)
-- Dependencies: 229
-- Data for Name: Entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Entity" (id, cnpj, name, "isActive", "parentId", "createdAt", "updatedAt") FROM stdin;
2	45.992.476/0001-94	Cartonificio Valinhos SA	t	\N	2025-11-13 18:39:44.839	2025-11-13 18:39:44.839
3	45.992.476/0002-75	Cartonificio Valinhos SA - MG	t	\N	2025-11-13 18:39:44.844	2025-11-13 18:39:44.844
\.


--
-- TOC entry 5095 (class 0 OID 17091)
-- Dependencies: 235
-- Data for Name: EntityModule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EntityModule" (id, "entityId", "moduleId") FROM stdin;
2	2	2
3	2	3
4	2	4
5	2	5
11	3	3
\.


--
-- TOC entry 5124 (class 0 OID 18994)
-- Dependencies: 264
-- Data for Name: EntityModuleItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EntityModuleItem" (id, "entityModuleId", "inventoryItemId", allowed) FROM stdin;
\.


--
-- TOC entry 5097 (class 0 OID 17098)
-- Dependencies: 237
-- Data for Name: EntityModuleProgram; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EntityModuleProgram" (id, "entityModuleId", "programId", allowed) FROM stdin;
2	2	7	t
3	2	8	t
4	2	9	t
5	2	10	t
9	3	2	t
10	3	3	t
11	3	4	t
13	3	6	t
14	4	11	t
15	4	12	t
16	4	13	t
17	4	14	t
18	4	15	t
19	5	19	t
20	5	20	t
22	5	22	t
6	2	16	t
7	2	17	t
8	2	18	t
47	2	23	t
\.


--
-- TOC entry 5081 (class 0 OID 17017)
-- Dependencies: 221
-- Data for Name: InventoryItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InventoryItem" (id, name, sku, quantity, unit, "minStock", "createdAt", "updatedAt", "commercialFamilyId") FROM stdin;
68	CX PAP OND REF CXPO 88600 - MASTER MARIANA	04817	0	PC	0	2025-11-25 20:43:15.319	2025-11-27 21:41:09.825	\N
49	CX PAP OND REF CXPO DURATTI 81000	04368	0	PC	0	2025-11-25 20:43:09.086	2025-11-27 21:41:05.918	\N
50	CX PAP OND REF CX.PO 85611  MASTER PREMIUM CARTELA	04373	0	PC	0	2025-11-25 20:43:09.391	2025-11-27 21:41:06.116	\N
51	CX PAP OND REF CXPO 60800 MASTER UNIVERSAL EVOLUTION	04384	0	PC	0	2025-11-25 20:43:09.73	2025-11-27 21:41:06.317	\N
52	CX PAP OND REF CXPO 0056 MASTER PREMIUM CARTELA	04385	0	PC	0	2025-11-25 20:43:10.047	2025-11-27 21:41:06.513	\N
53	CX PAP OND REF CXPO 80200 CX MASTER FL-6 COM IMPRESSAO	04388	0	PC	0	2025-11-25 20:43:10.403	2025-11-27 21:41:06.763	\N
54	CX PAP OND REF PQ 01 - CMC0-BB	04395	0	PC	0	2025-11-25 20:43:10.742	2025-11-27 21:41:07.035	\N
55	CX PAP OND REF PQ - CMC0-BB	04396	0	PC	0	2025-11-25 20:43:11.115	2025-11-27 21:41:07.303	\N
56	CX PAP OND REF 61164 - TRAFUL PREMIUM CARTELA	04403	0	PC	0	2025-11-25 20:43:11.401	2025-11-27 21:41:07.566	\N
57	CX PAP OND REF 84900 - CX MASTER TRAFUL 6 PCS	04404	0	PC	0	2025-11-25 20:43:11.771	2025-11-27 21:41:07.708	\N
58	CX PAP OND REF 2301044080 - CX COPO 50ML SELECT	04451	0	PC	0	2025-11-25 20:43:12.119	2025-11-27 21:41:07.843	\N
59	CX PAP OND REF CX PO 60900 CX MASTER THEMA PP CV BRAN	04458	0	PC	0	2025-11-25 20:43:12.47	2025-11-27 21:41:07.978	\N
60	CX PAP OND REF CX.PO 81650  MASTER F5 06 PCS S/IMPRESSAO	04545	0	PC	0	2025-11-25 20:43:12.846	2025-11-27 21:41:08.128	\N
61	CX PAP OND REF 87420 - APOLO CARTELA S/IMPR	04570	0	PC	0	2025-11-25 20:43:13.163	2025-11-27 21:41:08.441	\N
62	CX PAP OND REF 87410 - CX MASTER APOLO SODIMAC	04571	0	PC	0	2025-11-25 20:43:13.448	2025-11-27 21:41:08.586	\N
63	CX PAP OND REF CX PO N° 01 - COD. 21.010	04605	0	PC	0	2025-11-25 20:43:13.767	2025-11-27 21:41:08.724	\N
64	CX PAP OND REF CX.PO 84850 MASTER FL BARI PPCV	04631	0	PC	0	2025-11-25 20:43:14.059	2025-11-27 21:41:08.863	\N
69	CX PAP OND REF 60840 - CX. MASTER EVOLUTION S/IMPRESSAO V2	04818	0	PC	0	2025-11-25 20:43:15.672	2025-11-27 21:41:09.97	\N
70	CX PAP OND REF 60850 - CX. MASTER EVOLUTION AMANCO C/ CODIGO	04828	0	PC	0	2025-11-25 20:43:15.975	2025-11-27 21:41:10.108	\N
226	CX PAP OND REF 450 x 900 - BMC-B	05907	0	PC	0	2025-11-27 17:49:17.069	2025-11-27 21:41:28.351	\N
227	CHAPA DE PAPELAO 450 x 900 - BMC-B	05907A	0	PC	0	2025-11-27 17:49:17.212	2025-11-27 21:41:28.491	\N
33	CX PAP OND REF 27 x 13 x 9,5 12P	02113	0	PC	0	2025-11-25 20:43:03.722	2025-11-27 21:41:02.881	\N
34	CX PAP OND REF CXPO SAPEKA	03295	0	PC	0	2025-11-25 20:43:04.079	2025-11-27 21:41:03.019	\N
35	CX PAP OND REF CXPO 2301025252 400/440 ML	03510	0	PC	0	2025-11-25 20:43:04.363	2025-11-27 21:41:03.158	\N
36	CX PAP OND REF CXPO M	03682	0	PC	0	2025-11-25 20:43:04.813	2025-11-27 21:41:03.431	\N
37	CX PAP OND REF CXPO Z	03686	0	PC	0	2025-11-25 20:43:05.118	2025-11-27 21:41:03.567	\N
38	CX PAP OND REF CXPO 44	03692	0	PC	0	2025-11-25 20:43:05.412	2025-11-27 21:41:03.71	\N
39	CX PAP OND REF CXPO  DESENGRAXANTE 4 X 5 LT	03750	0	PC	0	2025-11-25 20:43:05.713	2025-11-27 21:41:03.852	\N
40	CX PAP OND REF CXPO AQUARELA	03776	0	PC	0	2025-11-25 20:43:06.05	2025-11-27 21:41:03.993	\N
41	CX PAP OND REF CX.PO 85611  MASTER PREMIUM CARTELA S/ IMP.	03810	0	PC	0	2025-11-25 20:43:06.384	2025-11-27 21:41:04.131	\N
42	CX PAP OND REF CX.PO 85000 MASTER F1.6 S/ IMP.	03811	0	PC	0	2025-11-25 20:43:06.687	2025-11-27 21:41:04.267	\N
43	CX PAP OND REF CXPO 83200- MASTER PLASTURBO PREMIUM	03812	0	PC	0	2025-11-25 20:43:06.991	2025-11-27 21:41:04.404	\N
44	CX PAP OND REF CX PO 85310 - MASTER INFANTIL S/IMPRESSAO	04161	0	PC	0	2025-11-25 20:43:07.352	2025-11-27 21:41:04.957	\N
45	CX PAP OND REF CXPO 81400 CX MASTER LORENZETTI 03 PCS	04194	0	PC	0	2025-11-25 20:43:07.673	2025-11-27 21:41:05.124	\N
46	CX PAP OND REF CXPO 81420 - CX MASTER LOREN 3 PCS CARTELA	04208	0	PC	0	2025-11-25 20:43:08.028	2025-11-27 21:41:05.325	\N
65	CX PAP OND REF CXPO PRA VALER DETERGENTE LIQUIDO 24 X 500 ML	04637	0	PC	0	2025-11-25 20:43:14.354	2025-11-27 21:41:08.998	\N
47	CX PAP OND REF CXPO 2301043632 - COPO 400ML QUALITA	04228	0	PC	0	2025-11-25 20:43:08.373	2025-11-27 21:41:05.523	\N
66	CX PAP OND REF 2301003595 - PURA CASA 300 ML	04639	0	PC	0	2025-11-25 20:43:14.684	2025-11-27 21:41:09.137	\N
48	CX PAP OND REF CX.PO 85611  MASTER PREMIUM CARTELA S/ IMP.	04341	0	PC	0	2025-11-25 20:43:08.733	2025-11-27 21:41:05.719	\N
67	CX PAP OND REF CX.PO 85621 MASTER FIORI LIRIO BRANCO	04733	0	PC	0	2025-11-25 20:43:14.983	2025-11-27 21:41:09.685	\N
93	CX PAP OND REF CX 1300 400X300X250	05326	0	PC	0	2025-11-25 20:43:22.972	2025-11-27 21:41:14.543	\N
94	CX PAP OND REF CXPO 12X1 LT AGUA SANIT. QUALITA	05353	0	PC	0	2025-11-25 20:43:23.264	2025-11-27 21:41:14.812	\N
95	CX PAP OND REF CXPO 6X2 LT AGUA SANIT. QUALITA	05354	0	PC	0	2025-11-25 20:43:23.579	2025-11-27 21:41:14.953	\N
96	CX PAP OND REF CAIXA 400X330X285	05370	0	PC	0	2025-11-25 20:43:23.88	2025-11-27 21:41:15.089	\N
97	CX PAP OND REF 1780 GIANT ESCAVATOR - 2 CALCOS	05385	0	PC	0	2025-11-25 20:43:24.175	2025-11-27 21:41:15.501	\N
98	CX PAP OND REF 1780 GIANT ESCAVATOR - CALCO MAIOR	05385B	0	PC	0	2025-11-25 20:43:24.479	2025-11-27 21:41:15.649	\N
99	CX PAP OND REF 1780 GIANT ESCAVATOR - CALCO MENOR	05385C	0	PC	0	2025-11-25 20:43:24.766	2025-11-27 21:41:15.797	\N
100	CX PAP OND REF CAIXA 400X330X305	05387	0	PC	0	2025-11-25 20:43:25.059	2025-11-27 21:41:15.946	\N
101	CX PAP OND REF CAIXA 250X250X290	05390	0	PC	0	2025-11-25 20:43:25.373	2025-11-27 21:41:16.235	\N
102	CX PAP OND REF CAIXA PAP 61,8 X 61,8 DECORE	05464	0	PC	0	2025-11-25 20:43:25.715	2025-11-27 21:41:16.518	\N
103	CX PAP OND REF CAIXA 400X330X265	05501	0	PC	0	2025-11-25 20:43:26.018	2025-11-27 21:41:16.792	\N
104	CX PAP OND REF CAIXA 250X250X320	05514	0	PC	0	2025-11-25 20:43:26.317	2025-11-27 21:41:16.927	\N
105	CX PAP OND REF CXPO - 50X50 BOLD - ALMEIDA	05520	0	PC	0	2025-11-25 20:43:26.597	2025-11-27 21:41:17.2	\N
106	CX PAP OND REF (NOVA) CAIXA PAP 60X60 RET EMBRAMACO MOD2	05535	0	PC	0	2025-11-25 20:43:26.909	2025-11-27 21:41:17.336	\N
107	CX PAP OND REF CAIXA MANTEIGA TOURINHO 1 KG	05540	0	PC	0	2025-11-25 20:43:27.213	2025-11-27 21:41:17.471	\N
108	CX PAP OND REF CAIXA 400X330X325	05546	0	PC	0	2025-11-25 20:43:27.509	2025-11-27 21:41:17.608	\N
109	CX PAP OND REF CAIXA 400X300X205	05547	0	PC	0	2025-11-25 20:43:27.819	2025-11-27 21:41:17.751	\N
110	CX PAP OND REF CAIXA LBK 200	05553	0	PC	0	2025-11-25 20:43:28.12	2025-11-27 21:41:17.895	\N
111	CX PAP OND REF CAIXA 30 DUZIAS UNIT.	05585	0	PC	0	2025-11-25 20:43:28.466	2025-11-27 21:41:18.032	\N
112	CX PAP OND REF CAIXA 30 DUZIAS UNIT. - CALCO EM Z	05585A	0	PC	0	2025-11-25 20:43:28.842	2025-11-27 21:41:18.169	\N
113	CX PAP OND REF CAIXA 30 DUZIAS GRANDE	05586	0	PC	0	2025-11-25 20:43:29.206	2025-11-27 21:41:18.305	\N
114	CX PAP OND REF CAIXA 30 DUZIAS GRANDE - CALCO EM Z	05586A	0	PC	0	2025-11-25 20:43:29.567	2025-11-27 21:41:18.442	\N
115	CX PAP OND REF CXPO 75,5 X 75,5 RETIFICADO UNIVERSAL (BANDEJ	05599	0	PC	0	2025-11-25 20:43:29.93	2025-11-27 21:41:18.579	\N
116	CX PAP OND REF REF. 1339 CESTA ATIBAIA 250X195X255	05613	0	PC	0	2025-11-25 20:43:30.302	2025-11-27 21:41:18.85	\N
117	CX PAP OND REF CAIXA 1332 - 450X340X325	05615	0	PC	0	2025-11-25 20:43:30.655	2025-11-27 21:41:18.987	\N
118	CX PAP OND REF CX. MAJOPAR 57 X 57	05616	0	PC	0	2025-11-25 20:43:31.034	2025-11-27 21:41:19.123	\N
119	CX PAP OND REF TP - 060100 CAIXA 6010 / 6011 - TOTOKINHA SPO	05632	0	PC	0	2025-11-25 20:43:31.431	2025-11-27 21:41:19.261	\N
120	CX PAP OND REF CAIXA 30 DUZIAS	05636	0	PC	0	2025-11-25 20:43:31.754	2025-11-27 21:41:19.539	\N
121	CX PAP OND REF CAIXA 30 DUZIAS - CALCO EM Z	05636A	0	PC	0	2025-11-25 20:43:32.056	2025-11-27 21:41:19.678	\N
122	CX PAP OND REF CAIXA 30 DUZIAS - GRANDE	05638	0	PC	0	2025-11-25 20:43:32.352	2025-11-27 21:41:19.817	\N
123	CX PAP OND REF CAIXA 30 DUZIAS - GRANDE - CALCO EM Z	05638A	0	PC	0	2025-11-25 20:43:32.649	2025-11-27 21:41:19.952	\N
124	CX PAP OND REF CXPO 32 X 57 UNIVERSAL	05640	0	PC	0	2025-11-25 20:43:32.97	2025-11-27 21:41:20.104	\N
125	CX PAP OND REF 30 DUZIAS OVOS - NIKKEI UNIC	05671	0	PC	0	2025-11-25 20:43:33.268	2025-11-27 21:41:21.348	\N
126	CX PAP OND REF 30 DUZIAS OVOS - NIKKEI UNIC - CALCO EM Z	05671A	0	PC	0	2025-11-25 20:43:33.559	2025-11-27 21:41:21.496	\N
127	CX PAP OND REF 000041263 - 66X66 RETIFICADO OPUS	05678	0	PC	0	2025-11-25 20:43:33.873	2025-11-27 21:41:21.634	\N
128	CX PAP OND REF CXPO INCEFRA 45 X 45 PRETA	05701	0	PC	0	2025-11-25 20:43:34.201	2025-11-27 21:41:21.769	\N
129	CX PAP OND REF CXPO N 3	05711	0	PC	0	2025-11-25 20:43:34.636	2025-11-27 21:41:22.176	\N
130	CX PAP OND REF CXPO N 4	05730	0	PC	0	2025-11-25 20:43:34.944	2025-11-27 21:41:22.313	\N
132	CX PAP OND REF CAIXA 30 DUZIAS UNIC - CALCO EM Z	05734A	0	PC	0	2025-11-25 20:43:35.564	2025-11-27 21:41:22.722	\N
133	CX PAP OND REF CXPO INCEFRA 74 X 74 RETIFICADO	05743	0	PC	0	2025-11-25 20:43:35.89	2025-11-27 21:41:22.997	\N
134	CX PAP OND REF CXPO INCEFRA 74 X 74 POLIDO	05744	0	PC	0	2025-11-25 20:43:36.225	2025-11-27 21:41:23.131	\N
135	CX PAP OND REF CAIXA 191	05759	0	PC	0	2025-11-25 20:43:36.526	2025-11-27 21:41:23.266	\N
136	CX PAP OND REF 2301004047 - COPO SUPER PREMIUM 770 ML - 500	05768	0	PC	0	2025-11-25 20:43:36.848	2025-11-27 21:41:23.538	\N
72	CX PAP OND REF CX.PO 81650 MASTER F5	04846	0	PC	0	2025-11-25 20:43:16.566	2025-11-27 21:41:10.397	\N
73	CX PAP OND REF 02 ASSENTO / ENCOSTO - AGATA / ONIX	04877	0	PC	0	2025-11-25 20:43:16.849	2025-11-27 21:41:10.536	\N
74	CX PAP OND REF 02 ASSENTO / ENCOSTO - DAFNE	04878	0	PC	0	2025-11-25 20:43:17.143	2025-11-27 21:41:10.677	\N
75	CX PAP OND REF CXPO AGUA SANITARIA CONDE 3X5 LTS NOVA	04929	0	PC	0	2025-11-25 20:43:17.451	2025-11-27 21:41:10.814	\N
76	CX PAP OND REF CAIXA 30DZ UNIC	04947	0	PC	0	2025-11-25 20:43:17.742	2025-11-27 21:41:10.953	\N
77	CX PAP OND REF CX PO 85320 - MASTER INFANTIL TUPAN CARTELA	05008	0	PC	0	2025-11-25 20:43:18.033	2025-11-27 21:41:11.094	\N
78	CX PAP OND REF 60880 - CX. MASTER EVOLUTION TUPAN V2	05009	0	PC	0	2025-11-25 20:43:18.383	2025-11-27 21:41:11.23	\N
79	CX PAP OND REF CAIXA 30 DUZIAS LARANJA UNIC	05045	0	PC	0	2025-11-25 20:43:18.709	2025-11-27 21:41:11.368	\N
80	CX PAP OND REF 81810 - CAIXA MASTER F4 - 3 PECAS S/ IMPR	05083	0	PC	0	2025-11-25 20:43:18.993	2025-11-27 21:41:11.504	\N
81	CX PAP OND REF 60885 - MASTER EVL LYON BCO - COMBO	05085	0	PC	0	2025-11-25 20:43:19.308	2025-11-27 21:41:11.646	\N
82	CX PAP OND REF 60845 - CX. MASTER SOLUTION V2	05086	0	PC	0	2025-11-25 20:43:19.596	2025-11-27 21:41:11.789	\N
83	CX PAP OND REF CXPO 60910 CX MASTER THEMA  - S/IMP	05132	0	PC	0	2025-11-25 20:43:19.888	2025-11-27 21:41:12.074	\N
84	CX PAP OND REF CXPO 85000 MASTER FL - S/ IMP	05133	0	PC	0	2025-11-25 20:43:20.204	2025-11-27 21:41:12.209	\N
85	CX PAP OND REF CXPO 85613 MASTER EVOLUTION - S/IMP	05134	0	PC	0	2025-11-25 20:43:20.553	2025-11-27 21:41:12.346	\N
86	CX PAP OND REF CX 20KG T3 RECICLAVEL	05151	0	PC	0	2025-11-25 20:43:20.86	2025-11-27 21:41:12.482	\N
87	CX PAP OND REF CXPO - TRIPLEX C/ DIV BIQUEIRA 4 GRANDE	05156	0	PC	0	2025-11-25 20:43:21.165	2025-11-27 21:41:12.62	\N
88	CX PAP OND REF REF. 08 - BATIE	05187	0	PC	0	2025-11-25 20:43:21.469	2025-11-27 21:41:13.447	\N
89	CX PAP OND REF CXPO 60890 - MASTER SOLUTION AMANCO SC BRANCO	05190	0	PC	0	2025-11-25 20:43:21.764	2025-11-27 21:41:13.583	\N
91	CX PAP OND REF CXPO 60865 - MASTER SOLUTION LILLE COMBO	05208	0	PC	0	2025-11-25 20:43:22.374	2025-11-27 21:41:13.854	\N
92	CX PAP OND REF 87420 - APOLO CARTELA C/IMPR	05228	0	PC	0	2025-11-25 20:43:22.677	2025-11-27 21:41:14.13	\N
204	CX PAP OND REF 600X400X335 EVASOFT	05659	0	PC	0	2025-11-27 13:08:34.853	2025-11-27 21:41:20.709	\N
138	CX PAP OND REF W 563731	05848	0	PC	0	2025-11-25 20:43:37.562	2025-11-27 21:41:24.084	\N
141	CX PAP OND REF VASSOURA BRASILEIRINHA - BRUBALAR	05879	0	PC	0	2025-11-25 20:43:38.545	2025-11-25 20:43:38.545	\N
142	CX PAP OND REF VASSOURA BRASILEIRINHA - PRETA	05880	0	PC	0	2025-11-25 20:43:38.931	2025-11-25 20:43:38.931	\N
139	CX PAP OND REF ASSENTO /  ENCOSTO LUNARA	05857	0	PC	0	2025-11-25 20:43:37.854	2025-11-27 21:41:24.225	\N
184	PAPEL MIOLO 180 G/M2 F 81 CM	M180.081	0	KG	0	2025-11-25 20:43:55.873	2025-11-25 20:43:55.873	\N
143	CX PAP OND REF 2301044080 - COPO 50ML SELECT	05881	0	PC	0	2025-11-25 20:43:39.305	2025-11-27 21:41:24.506	\N
164	CX PAP OND REF CX 03110158 GIANT ESCAVATOR - 2 CALCOS	05903	0	PC	0	2025-11-25 20:43:48.637	2025-11-27 21:41:27.516	\N
165	CX PAP OND REF CX 03110158 GIANT ESCAVATOR - CALCO MAIOR	05903B	0	PC	0	2025-11-25 20:43:49.074	2025-11-27 21:41:27.65	\N
166	CX PAP OND REF CX 03110158 GIANT ESCAVATOR - CALCO MENOR	05903C	0	PC	0	2025-11-25 20:43:49.487	2025-11-27 21:41:27.79	\N
167	CX PAP OND REF CXPO 30 DZS UNIC.	05904	0	PC	0	2025-11-25 20:43:49.861	2025-11-27 21:41:27.927	\N
168	CX PAP OND REF CXPO 30 DZS UNIC. - CALCO EM Z	05904A	0	PC	0	2025-11-25 20:43:50.23	2025-11-27 21:41:28.064	\N
169	CX PAP OND REF CAIXA 30 DUZIAS UNIT	CJ05894	0	PC	0	2025-11-25 20:43:50.586	2025-11-27 21:41:28.632	\N
170	CX PAP OND REF CX 03110158 GIANT ESCAVATOR - 2 CALCOS	CJ05903	0	PC	0	2025-11-25 20:43:50.977	2025-11-27 21:41:28.773	\N
171	PAPEL MIOLO SIZE 100 G/M2 F 118 CM	M100SZ.118	0	KG	0	2025-11-25 20:43:51.332	2025-11-27 21:41:28.968	\N
172	PAPEL MIOLO SIZE 110 G/M2 F 105 CM	M110SZ.105	0	KG	0	2025-11-25 20:43:51.714	2025-11-27 21:41:29.113	\N
173	PAPEL MIOLO SIZE 110 G/M2 F 140 CM	M110SZ.140	0	KG	0	2025-11-25 20:43:52.086	2025-11-27 21:41:29.247	\N
174	PAPEL MIOLO SIZE 130 G/M2 F  85 CM	M130SZ.085	0	KG	0	2025-11-25 20:43:52.447	2025-11-27 21:41:29.383	\N
176	PAPEL MIOLO SIZE  130 G/M2 F 95 CM	M130SZ.095	0	KG	0	2025-11-25 20:43:53.063	2025-11-27 21:41:29.657	\N
177	PAPEL MIOLO SIZE  130 G/M2 F 125 CM	M130SZ.125	0	KG	0	2025-11-25 20:43:53.371	2025-11-27 21:41:29.803	\N
178	PAPEL MIOLO SIZE  130 G/M2 F 135 CM	M130SZ.135	0	KG	0	2025-11-25 20:43:53.681	2025-11-27 21:41:29.942	\N
179	PAPEL MIOLO SIZE  130 G/M2 F 145 CM	M130SZ.145	0	KG	0	2025-11-25 20:43:54.04	2025-11-27 21:41:30.084	\N
180	PAPEL MIOLO SIZE 130 G/M2 F  156 CM	M130SZ.156	0	KG	0	2025-11-25 20:43:54.417	2025-11-27 21:41:30.226	\N
181	PAPEL MIOLO SIZE 130 G/M2 F 160 CM	M130SZ.160	0	KG	0	2025-11-25 20:43:54.802	2025-11-27 21:41:30.367	\N
182	PAPEL MIOLO SIZE 160 G/M2 F 90 CM	M160SZ.090	0	KG	0	2025-11-25 20:43:55.162	2025-11-27 21:41:30.508	\N
183	PAPEL MIOLO SIZE 160 G/M2 F 140 CM	M160SZ.140	0	KG	0	2025-11-25 20:43:55.532	2025-11-27 21:41:30.644	\N
185	CX PAP OND REF CXPO B	03678	0	PC	0	2025-11-27 13:08:13.283	2025-11-27 21:41:03.294	\N
186	CX PAP OND REF CXPO 56	04691	0	PC	0	2025-11-27 13:08:19.546	2025-11-27 21:41:09.409	\N
71	CX PAP OND REF 60860 - CX. MASTER EVOLUTION LEROY	04829	0	PC	0	2025-11-25 20:43:16.263	2025-11-27 21:41:10.254	\N
187	CX PAP OND REF CAIXA GRANDE	05120	0	PC	0	2025-11-27 13:08:22.994	2025-11-27 21:41:11.932	\N
188	CX PAP OND REF CXPO - TRIPLEX C/ DIV BIQUEIRA 4 GRANDE  - CA	05156A	0	PC	0	2025-11-27 13:08:25.317	2025-11-27 21:41:12.764	\N
189	CX PAP OND REF CXPO - TRIPLEX C/ DIV BIQUEIRA 5 PEQUENA	05157	0	PC	0	2025-11-27 13:08:25.573	2025-11-27 21:41:12.903	\N
190	CX PAP OND REF CXPO - TRIPLEX C/ DIV BIQUEIRA 5 PEQUENA - CA	05157A	0	PC	0	2025-11-27 13:08:25.742	2025-11-27 21:41:13.039	\N
191	CX PAP OND REF CAIXA 03	05158	0	PC	0	2025-11-27 13:08:25.88	2025-11-27 21:41:13.174	\N
192	CX PAP OND REF CXPO 375X314X325	05159	0	PC	0	2025-11-27 13:08:26.014	2025-11-27 21:41:13.31	\N
90	CX PAP OND REF 2301035287 - CXPO COPO 330ML IMP C/1000 ALTA	05203	0	PC	0	2025-11-25 20:43:22.059	2025-11-27 21:41:13.719	\N
193	CX PAP OND REF CAIXA MEDIA	05220	0	PC	0	2025-11-27 13:08:26.763	2025-11-27 21:41:13.992	\N
194	CX PAP OND REF CAMELBACK PASSEIO	05331	0	PC	0	2025-11-27 13:08:27.483	2025-11-27 21:41:14.678	\N
195	CX PAP OND REF CAIXA AQ1	05371	0	PC	0	2025-11-27 13:08:28.225	2025-11-27 21:41:15.229	\N
196	CX PAP OND REF CAIXA AQ1 s/impressao	05374	0	PC	0	2025-11-27 13:08:28.426	2025-11-27 21:41:15.366	\N
197	CX PAP OND REF CAIXA AQ2	05389	0	PC	0	2025-11-27 13:08:29.34	2025-11-27 21:41:16.092	\N
198	CX PAP OND REF CAIXA 270X270X245	05391	0	PC	0	2025-11-27 13:08:29.703	2025-11-27 21:41:16.376	\N
199	CX PAP OND REF CAIXA 492X280X325	05495	0	PC	0	2025-11-27 13:08:30.067	2025-11-27 21:41:16.655	\N
200	CX PAP OND REF CAIXA 250X250X350	05515	0	PC	0	2025-11-27 13:08:30.604	2025-11-27 21:41:17.063	\N
201	CX PAP OND REF CAMELBACK MOTO	05605	0	PC	0	2025-11-27 13:08:32.702	2025-11-27 21:41:18.715	\N
202	CX PAP OND REF CAIXA 56X32X12	05635	0	PC	0	2025-11-27 13:08:33.585	2025-11-27 21:41:19.4	\N
144	CX PAP OND REF CXPO INCEFRA FUSTELA 35X70 HD MAX 11PCS	05882	0	PC	0	2025-11-25 20:43:39.742	2025-11-27 21:41:24.642	\N
145	CX PAP OND REF CXPO RAIZEN CESTA FESTIVA	05883	0	PC	0	2025-11-25 20:43:40.071	2025-11-27 21:41:24.779	\N
146	CX PAP OND REF POTE MANTEIGA 12X500G / 24X200G TARJA BRANCA	05884	0	PC	0	2025-11-25 20:43:40.362	2025-11-27 21:41:24.915	\N
147	CX PAP OND REF CXP PQ	05885	0	PC	0	2025-11-25 20:43:40.66	2025-11-27 21:41:25.056	\N
148	CX PAP OND REF VASSOURA SAPEKA BRUBALAR	05886	0	PC	0	2025-11-25 20:43:41.017	2025-11-27 21:41:25.193	\N
149	CX PAP OND REF VASSOURA SAPEKA PRETA	05887	0	PC	0	2025-11-25 20:43:41.394	2025-11-27 21:41:25.329	\N
150	CX PAP OND REF VASSOURA AQUARELA BRUBALAR	05888	0	PC	0	2025-11-25 20:43:41.829	2025-11-27 21:41:25.464	\N
151	CX PAP OND REF VASSOURA AQUARELA PRETA	05889	0	PC	0	2025-11-25 20:43:42.185	2025-11-27 21:41:25.634	\N
152	CX PAP OND REF CXPO 75,5 X 75,5 BANDEJA 4PCS	05890	0	PC	0	2025-11-25 20:43:42.538	2025-11-27 21:41:25.83	\N
153	CX PAP OND REF CXPO 32 X 57 11PCS FUSTELA	05891	0	PC	0	2025-11-25 20:43:42.958	2025-11-27 21:41:26.025	\N
154	CX PAP OND REF CXPO - 50X50 FUSTELA MULTICER	05892	0	PC	0	2025-11-25 20:43:43.526	2025-11-27 21:41:26.16	\N
155	CX PAP OND REF CAIXA 2783	05893	0	PC	0	2025-11-25 20:43:43.925	2025-11-27 21:41:26.296	\N
156	CX PAP OND REF CAIXA 30 DUZIAS UNIT	05894	0	PC	0	2025-11-25 20:43:45.941	2025-11-27 21:41:26.432	\N
157	CX PAP OND REF CAIXA 30 DUZIAS UNIT - CALCO EM Z	05894A	0	PC	0	2025-11-25 20:43:46.479	2025-11-27 21:41:26.569	\N
158	CX PAP OND REF CAIXA 01	05895	0	PC	0	2025-11-25 20:43:46.79	2025-11-27 21:41:26.703	\N
159	CX PAP OND REF CXPO INCEFRA BANDEJA 27X110  8PCS	05896	0	PC	0	2025-11-25 20:43:47.094	2025-11-27 21:41:26.838	\N
160	CX PAP OND REF 670 X 750 CMM0-B	05897	0	PC	0	2025-11-25 20:43:47.4	2025-11-27 21:41:26.973	\N
161	CHAPA DE PAPELAO 670 X 750 CMM0-B	05897A	0	PC	0	2025-11-25 20:43:47.708	2025-11-27 21:41:27.11	\N
162	CX PAP OND REF 640 X 1000 - CMC-B	05898	0	PC	0	2025-11-25 20:43:48.011	2025-11-27 21:41:27.246	\N
163	CHAPA DE PAPELAO 640 X 100 - CMC-B	05898A	0	PC	0	2025-11-25 20:43:48.325	2025-11-27 21:41:27.382	\N
218	CX PAP OND REF CAIXA 30 DUZIAS UNIC	05255	0	PC	0	2025-11-27 17:02:52.938	2025-11-27 21:41:14.268	\N
219	CX PAP OND REF CAIXA 30 DUZIAS UNIC - CALCO EM Z	05255A	0	PC	0	2025-11-27 17:02:53.135	2025-11-27 21:41:14.406	\N
203	CX PAP OND REF CXPO - TRIPLEX S/ DIVISORIA	05649	0	PC	0	2025-11-27 13:08:34.711	2025-11-27 21:41:20.255	\N
220	CX PAP OND REF CXPO 20 UNID. MOD. 1000	05657	0	PC	0	2025-11-27 17:03:00.503	2025-11-27 21:41:20.397	\N
221	CX PAP OND REF CXPO 10 UNID. MOD. 2000	05658	0	PC	0	2025-11-27 17:03:00.636	2025-11-27 21:41:20.544	\N
222	CX PAP OND REF CXPO - MOD 1050 COM FUROS	05661	0	PC	0	2025-11-27 17:03:00.909	2025-11-27 21:41:20.873	\N
223	CX PAP OND REF CXPO - MOD 500 COM FUROS	05662	0	PC	0	2025-11-27 17:03:01.043	2025-11-27 21:41:21.039	\N
224	CX PAP OND REF CX PO 60 UNID. MOD. 200	05668	0	PC	0	2025-11-27 17:03:01.225	2025-11-27 21:41:21.198	\N
205	CX PAP OND REF 492X305X330 EVASOFT	05706	0	PC	0	2025-11-27 13:08:35.772	2025-11-27 21:41:21.905	\N
206	CX PAP OND REF CXPO 376X310X312	05707	0	PC	0	2025-11-27 13:08:35.97	2025-11-27 21:41:22.04	\N
225	CX PAP OND REF CAIXA 4 - AZ HOUSE	05733	0	PC	0	2025-11-27 17:03:02.533	2025-11-27 21:41:22.448	\N
131	CX PAP OND REF CAIXA 30 DUZIAS UNIC	05734	0	PC	0	2025-11-25 20:43:35.235	2025-11-27 21:41:22.584	\N
212	CX PAP OND REF CX PO 40 UNID. MOD. 500	04051	0	PC	0	2025-11-27 17:02:43.615	2025-11-27 21:41:04.54	\N
213	CX PAP OND REF CX PO 20 UNID. MOD. 1050	04053	0	PC	0	2025-11-27 17:02:43.793	2025-11-27 21:41:04.682	\N
214	CX PAP OND REF CX PO 60 UNID. MOD. 200	04054	0	PC	0	2025-11-27 17:02:43.928	2025-11-27 21:41:04.818	\N
215	CX PAP OND REF CAIXA N° 10	04562	0	PC	0	2025-11-27 17:02:46.479	2025-11-27 21:41:08.284	\N
216	CX PAP OND REF CXPO 50 UNID MOD 400	04651	0	PC	0	2025-11-27 17:02:47.587	2025-11-27 21:41:09.272	\N
217	CX PAP OND REF CXPO 40 UNID. MOD. 500B	04716	0	PC	0	2025-11-27 17:02:47.935	2025-11-27 21:41:09.55	\N
207	CX PAP OND REF 440X430X700 EVASOFT	05740	0	PC	0	2025-11-27 13:08:36.877	2025-11-27 21:41:22.86	\N
208	CX PAP OND REF CAIXA 02	05762	0	PC	0	2025-11-27 13:08:37.653	2025-11-27 21:41:23.402	\N
137	CX PAP OND REF ASSENTO / ENCOSTO GRECIA	05830	0	PC	0	2025-11-25 20:43:37.26	2025-11-27 21:41:23.675	\N
209	CX PAP OND REF CAIXA 510X340X210	05831	0	PC	0	2025-11-27 13:08:38.167	2025-11-27 21:41:23.811	\N
210	CX PAP OND REF CAIXA 490 X 320 X 230	05840	0	PC	0	2025-11-27 13:08:38.326	2025-11-27 21:41:23.944	\N
140	CX PAP OND REF SABAO EM BARRA CONDE 5X180G	05878	0	PC	0	2025-11-25 20:43:38.159	2025-11-27 21:41:24.367	\N
211	CX PAP OND REF CX PUREVALLE	05906	0	PC	0	2025-11-27 13:08:43.637	2025-11-27 21:41:28.207	\N
175	PAPEL MIOLO SIZE 130 G/M2 F  88 CM	M130SZ.088	0	KG	0	2025-11-25 20:43:52.771	2025-11-27 21:41:29.521	\N
\.


--
-- TOC entry 5091 (class 0 OID 17071)
-- Dependencies: 231
-- Data for Name: Module; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Module" (id, code, name, description, "isActive") FROM stdin;
3	MAINT	Manutenção Industrial	Manutenção industrial	t
4	SALES	Vendas	Força de vendas	t
5	SAC	SAC	Serviço de Atendimento ao Cliente	t
2	BASE	Base	Módulo Base	t
\.


--
-- TOC entry 5119 (class 0 OID 17211)
-- Dependencies: 259
-- Data for Name: PaymentTerm; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PaymentTerm" (id, code, description, installments, "createdAt", "updatedAt") FROM stdin;
1	\N	14/21/45	3	2025-11-18 12:40:40.295318	\N
\.


--
-- TOC entry 5093 (class 0 OID 17081)
-- Dependencies: 233
-- Data for Name: Program; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Program" (id, "moduleId", code, name, description, "isActive") FROM stdin;
2	3	DASHBOARD	Dashboard	\N	t
3	3	ASSETS	Ativos	\N	t
4	3	WORK_ORDERS	Ordens de Serviço	\N	t
6	3	REPORTS	Relatórios	\N	t
7	2	USERS	Usuários	\N	t
8	2	SETTINGS	Configurações	\N	t
9	2	ADMIN_ENTITIES	Cadastro de Entidade	\N	t
10	2	ADMIN_MODULES	Cadastro de Módulo	\N	t
11	4	SALES_CREATE_ORDER	Inclusão de Pedidos	\N	t
12	4	SALES_ORDER_SEARCH	Consulta de Pedidos	\N	t
13	4	SALES_CLIENT_SEARCH	Consulta de Clientes	\N	t
14	4	SALES_PRODUCTION_SCHEDULE	Agenda Produção	\N	t
15	4	SALES_REPRESENTATIVE	Representante	\N	t
16	2	CLIENTS	Clientes	\N	t
17	2	PAYMENT_TERMS	Condição de Pagamento	\N	t
18	2	COMMERCIAL_FAMILY	Família Comercial	\N	t
19	5	SAC_COMPLAINT_MAINTENANCE	Manutenção de Reclamação	\N	t
22	5	SAC_STANDARD_OCCURRENCE	Ocorrência Padrão	\N	t
23	2	ITEM_MAINTENANCE	Manutenção de Item	\N	t
20	5	SAC_COMPLAINT_SEARCH	Painel Reclamações	\N	t
\.


--
-- TOC entry 5105 (class 0 OID 17129)
-- Dependencies: 245
-- Data for Name: SalesOrder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SalesOrder" (id, code, status, "orderDate", "customerName", "customerDoc", "paymentTerms", carrier, "deliveryDate", notes, "createdById", subtotal, "discountTotal", total, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5107 (class 0 OID 17144)
-- Dependencies: 247
-- Data for Name: SalesOrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SalesOrderItem" (id, "orderId", "inventoryItemId", sku, name, quantity, unit, "unitPrice", "discountPct", "lineTotal") FROM stdin;
\.


--
-- TOC entry 5077 (class 0 OID 16996)
-- Dependencies: 217
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, name, password, "salesRepAdmin", "createdAt", "updatedAt", "lastEntityId", doc) FROM stdin;
11	lupelcartonagem@gmail.com	ROMILDO GONÇALVES SANTOS	$2b$10$3Kj6geC8NfSxvSBfeKXpN.3VKSsHomG4bx0mZGeqnz4QOXznSAMNq	t	2025-11-27 19:43:07.441	2025-11-27 21:41:34.929	\N	03992034607
12	sgq@cartonificiovalinhos.com.br	DIRETO - CARTONIFICIO	$2b$10$vwyE3TcCdszQ7r8l/KkFSu3P6gwFlQu4p5fvymOhRc7Ao0D/PAEqy	t	2025-11-27 19:43:08.028	2025-11-27 21:41:35.406	\N	00000000000000
2	tecnico@cartonificiovalinhos.com.br	João Barroso	$2b$10$RByy7FA1XHZK/hoZHOGx0erPcK0j9Vo2RaMqmGczizhYzUVcqUnEy	t	2025-10-06 19:15:53.861	2025-11-25 21:17:31.934	\N	\N
1	ti@cartonificiovalinhos.com.br	TI Cartonificio	$2b$10$ixtuCpW7DI0djBEfKN6wFelWsyMZdIt.39sWKtjYgKrAWMgqwpP9m	t	2025-11-13 15:52:44.151	2025-11-25 21:02:56.956	2	\N
4	mr.cozaro@uol.com.br	PEDRO MAGNANI	$2b$10$t4.CCkTpNsunKyLZ27o9x.Z5OlsOQ8FJwxGEx43vo1infUt05mGIK	t	2025-11-27 19:35:07.306	2025-11-27 21:41:31.008	\N	00220474842
5	temacrepresentacao@bol.com.br	TEMAC REPRESENTAÇOES DE PAPEIS LTDA	$2b$10$BsCn74klJ.f7oWCi3.Thcug9jzv0VV4Gqr8cSDdoYJ7F87TzR/udK	t	2025-11-27 19:43:03.465	2025-11-27 21:41:31.517	\N	12598649000135
6	SERGIOFRATEANI11@GMAIL.COM	SERGIO FRATEANI	$2b$10$035lvPW0RD.8Cq2E8kzAnuVvz0GF0PQMYOeZqJ6UWubAYcpuCd19u	t	2025-11-27 19:43:04.343	2025-11-27 21:41:32.626	2	36630856864
7	ROBERTOEMBALAGENS@OUTLOOK.COM	JOSE ROBERTO FRANCISCO	$2b$10$WqavuO6uw6LPMotrQQ0/0ujCSEjpLAfOAdTGQBMADgdtw6r2bs6em	t	2025-11-27 19:43:05.369	2025-11-27 21:41:33.371	\N	27502658866
8	coutinho_27@outlook.com	FRANZ LISZT COUTINHO MADRUGA	$2b$10$W6oUyD95yvww6zOI.MVhMOTvGwg1SnJMweU7CkOYXnfgze8pNZoMi	t	2025-11-27 19:43:06.034	2025-11-27 21:41:33.896	\N	61289426791
9	-	ANTONIO CARLOS COUTINHO	$2b$10$B28Ztb0MQFf2T9EP2rfg1.L1kSknGnRYtf0ugAdxIL5Do.zSU9hkG	t	2025-11-27 19:43:06.549	2025-11-27 21:41:34.244	\N	00111794650
10	FLAVIOEMBALAGENS@YAHOO.COM.BR	FLAVIO SANTOS DA SILVA	$2b$10$NOmC8Xk97gg/ePMuFRtXf.0aA9ifkPYLFi41lQcrkqw1QZtRARDd.	t	2025-11-27 19:43:06.994	2025-11-27 21:41:34.587	\N	73098663634
\.


--
-- TOC entry 5111 (class 0 OID 17167)
-- Dependencies: 251
-- Data for Name: UserClientRep; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserClientRep" (id, "userId", "clientId", "createdAt") FROM stdin;
4	1	10	2025-11-25 21:17:43.91
5	1	6	2025-11-25 21:17:43.912
6	4	14	2025-11-27 21:41:31.126
7	5	12	2025-11-27 21:41:31.633
8	6	16	2025-11-27 21:41:32.777
9	6	20	2025-11-27 21:41:32.778
10	6	21	2025-11-27 21:41:32.779
11	6	23	2025-11-27 21:41:32.78
12	7	13	2025-11-27 21:41:33.488
13	7	18	2025-11-27 21:41:33.489
14	8	15	2025-11-27 21:41:33.977
15	8	22	2025-11-27 21:41:33.978
16	9	25	2025-11-27 21:41:34.324
17	10	24	2025-11-27 21:41:34.666
18	11	26	2025-11-27 21:41:35.009
19	12	17	2025-11-27 21:41:35.486
20	12	19	2025-11-27 21:41:35.488
\.


--
-- TOC entry 5099 (class 0 OID 17106)
-- Dependencies: 239
-- Data for Name: UserEntity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserEntity" (id, "userId", "entityId") FROM stdin;
2	1	2
3	1	3
4	2	2
5	2	3
7	6	2
8	6	3
\.


--
-- TOC entry 5101 (class 0 OID 17113)
-- Dependencies: 241
-- Data for Name: UserEntityModule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserEntityModule" (id, "userEntityId", "moduleId", allowed) FROM stdin;
3	2	3	t
5	2	5	t
7	3	3	t
9	3	5	t
11	4	3	t
12	4	4	t
13	4	5	t
15	5	3	t
16	5	4	t
17	5	5	t
10	4	2	t
14	5	2	t
2	2	2	t
6	3	2	t
24	7	4	t
25	8	4	t
4	2	4	t
8	3	4	t
\.


--
-- TOC entry 5103 (class 0 OID 17121)
-- Dependencies: 243
-- Data for Name: UserEntityModuleProgram; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserEntityModuleProgram" (id, "userEntityModuleId", "programId", allowed) FROM stdin;
2	2	7	t
3	2	8	t
4	2	9	t
5	2	10	t
9	3	2	t
10	3	3	t
11	3	4	t
13	3	6	t
14	4	11	t
15	4	12	t
16	4	13	t
17	4	14	t
19	5	19	t
20	5	20	t
22	5	22	t
23	6	7	t
24	6	8	t
25	6	9	t
26	6	10	t
30	7	2	t
31	7	3	t
32	7	4	t
34	7	6	t
35	8	11	t
36	8	12	t
37	8	13	t
38	8	14	t
40	9	19	t
41	9	20	t
43	9	22	t
44	10	7	t
45	10	8	t
46	10	9	t
47	10	10	t
51	11	2	t
52	11	3	t
53	11	4	t
55	11	6	t
56	12	11	t
57	12	12	t
58	12	13	t
59	12	14	t
60	12	15	t
61	13	19	t
62	13	20	t
64	13	22	t
65	14	7	t
66	14	8	t
67	14	9	t
68	14	10	t
72	15	2	t
73	15	3	t
74	15	4	t
76	15	6	t
77	16	11	t
78	16	12	t
79	16	13	t
80	16	14	t
81	16	15	t
82	17	19	t
83	17	20	t
85	17	22	t
48	10	16	t
49	10	17	t
50	10	18	t
89	10	23	t
69	14	16	t
70	14	17	t
71	14	18	t
93	14	23	t
6	2	16	t
7	2	17	t
8	2	18	t
97	2	23	t
27	6	16	t
28	6	17	t
29	6	18	t
101	6	23	t
107	24	11	t
108	24	12	t
109	24	13	t
110	24	14	t
112	25	15	t
18	4	15	t
39	8	15	t
\.


--
-- TOC entry 5087 (class 0 OID 17049)
-- Dependencies: 227
-- Data for Name: WorkOrder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WorkOrder" (id, title, description, status, "assetId", "rootAssetId", "scheduledAt", sector, "maintenanceType", "openedAt", "assetCondition", "personnelCount", "estimatedDurationMinutes", tasks, materials, "startedAt", "completedAt", "closedAt", mttr, "assignedUserId", "usedEquipment", "maintainedComponents", "executionDescription", observations, "technicianSignature", "createdAt", "updatedAt") FROM stdin;
1	OS de exemplo 1759527741177	\N	COMPLETED	\N	\N	2025-10-07 14:46:00	Automacao	Melhoria	\N	\N	\N	\N	\N	\N	2025-10-03 21:47:51.651	2025-10-04 03:40:40.836	2025-10-04 03:40:30.931	352	\N	\N	\N	\N	\N	\N	2025-11-13 18:05:48.909	2025-11-13 18:05:48.909
2	OS de exemplo 1759527777873	\N	COMPLETED	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-03 21:47:51.982	2025-10-03 21:48:02.716	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-13 18:05:48.914	2025-11-13 18:05:48.914
3	OS de exemplo 1759528076956	\N	IN_PROGRESS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-03 21:48:08.355	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-13 18:05:48.917	2025-11-13 18:05:48.917
4	OS de exemplo 1759528086921	\N	COMPLETED	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-06 20:19:22.133	2025-10-06 20:19:31.802	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-13 18:05:48.92	2025-11-13 18:05:48.92
5	WO-0001  Corretiva: Falha el�trica no motor do Pr�-Aquecedor	Motor apresentou aquecimento excessivo e parada s�bita. Verificar bobinagem e rolamentos.\nConsumo previsto: 1x rolamento, �leo lubrificante	OPEN	6	\N	2025-10-09 14:46:00	Eletrica	Corretiva	\N	\N	\N	\N	\N	\N	2025-10-04 03:40:20.632	2025-10-04 03:40:48.023	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-13 18:05:48.923	2025-11-18 14:26:29.06
6	WO-0002  Preventiva: Inspe��o rotineira do Fac�o - L�mina	Preventiva gerada conforme plano. Checklist r�pido di�rio/por turno.	OPEN	12	\N	2025-10-14 14:46:00	Mecanica	Corretiva	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-13 18:05:48.926	2025-11-18 14:26:29.062
7	WO-0001  Corretiva: Falha el�trica no motor do Pr�-Aquecedor	Motor apresentou aquecimento excessivo e parada s�bita. Verificar bobinagem e rolamentos.\nConsumo previsto: 1x rolamento, �leo lubrificante	OPEN	6	\N	2025-10-10 10:15:00	Segurança	Segurança	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-13 18:05:48.929	2025-11-18 14:26:29.064
8	WO-0002  Preventiva: Inspe��o rotineira do Fac�o - L�mina	Preventiva gerada conforme plano. Checklist r�pido di�rio/por turno.	OPEN	12	\N	2025-10-09 10:15:00	Mecanica	Inspeção	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-11-13 18:05:48.932	2025-11-18 14:26:29.066
9	Manuten��o PC Preparo de Massa (TESTE)	Teste	OPEN	20	\N	2025-10-08 10:30:00	Automacao	Melhoria	2025-10-06 22:15:14.957	RODANDO	2	90	Teste	Teste	\N	\N	\N	\N	2	\N	\N	\N	\N	\N	2025-11-13 18:05:48.935	2025-11-18 14:26:29.068
\.


--
-- TOC entry 5075 (class 0 OID 16984)
-- Dependencies: 215
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
23c9b93d-6266-4cdf-b044-dd0f873ee245	51a8f20f1c33df9036e63372792de55d7973422a75290b2c0530fc11f6163e07	2025-11-13 14:31:19.574247+00	20251113143119_init_postgres	\N	\N	2025-11-13 14:31:19.120232+00	1
7b996d76-7907-4a8c-ad70-4e108ee92027	91698e2e9ffaee8d22a801665210033cfa611be083baa18c1e7421eccdf81a12	2025-11-18 13:40:16.604007+00	20251118134016_add_item_family_and_availability	\N	\N	2025-11-18 13:40:16.570339+00	1
\.


--
-- TOC entry 5120 (class 0 OID 17221)
-- Dependencies: 260
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (token, user_id, expires, created_at) FROM stdin;
\.


--
-- TOC entry 5122 (class 0 OID 17228)
-- Dependencies: 262
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, name, password_hash, created_at) FROM stdin;
\.


--
-- TOC entry 5155 (class 0 OID 0)
-- Dependencies: 224
-- Name: AssetAttachment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AssetAttachment_id_seq"', 16, true);


--
-- TOC entry 5156 (class 0 OID 0)
-- Dependencies: 218
-- Name: Asset_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Asset_id_seq"', 89, true);


--
-- TOC entry 5157 (class 0 OID 0)
-- Dependencies: 222
-- Name: Attachment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Attachment_id_seq"', 3, true);


--
-- TOC entry 5158 (class 0 OID 0)
-- Dependencies: 248
-- Name: Client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Client_id_seq"', 26, true);


--
-- TOC entry 5159 (class 0 OID 0)
-- Dependencies: 256
-- Name: CommercialFamily_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CommercialFamily_id_seq"', 4, true);


--
-- TOC entry 5160 (class 0 OID 0)
-- Dependencies: 254
-- Name: ComplaintItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ComplaintItem_id_seq"', 1, false);


--
-- TOC entry 5161 (class 0 OID 0)
-- Dependencies: 252
-- Name: Complaint_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Complaint_id_seq"', 1, false);


--
-- TOC entry 5162 (class 0 OID 0)
-- Dependencies: 263
-- Name: EntityModuleItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."EntityModuleItem_id_seq"', 38, true);


--
-- TOC entry 5163 (class 0 OID 0)
-- Dependencies: 236
-- Name: EntityModuleProgram_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."EntityModuleProgram_id_seq"', 51, true);


--
-- TOC entry 5164 (class 0 OID 0)
-- Dependencies: 234
-- Name: EntityModule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."EntityModule_id_seq"', 11, true);


--
-- TOC entry 5165 (class 0 OID 0)
-- Dependencies: 228
-- Name: Entity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Entity_id_seq"', 3, true);


--
-- TOC entry 5166 (class 0 OID 0)
-- Dependencies: 220
-- Name: InventoryItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."InventoryItem_id_seq"', 227, true);


--
-- TOC entry 5167 (class 0 OID 0)
-- Dependencies: 230
-- Name: Module_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Module_id_seq"', 6, true);


--
-- TOC entry 5168 (class 0 OID 0)
-- Dependencies: 258
-- Name: PaymentTerm_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PaymentTerm_id_seq"', 1, true);


--
-- TOC entry 5169 (class 0 OID 0)
-- Dependencies: 232
-- Name: Program_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Program_id_seq"', 23, true);


--
-- TOC entry 5170 (class 0 OID 0)
-- Dependencies: 246
-- Name: SalesOrderItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SalesOrderItem_id_seq"', 1, true);


--
-- TOC entry 5171 (class 0 OID 0)
-- Dependencies: 244
-- Name: SalesOrder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SalesOrder_id_seq"', 1, true);


--
-- TOC entry 5172 (class 0 OID 0)
-- Dependencies: 250
-- Name: UserClientRep_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserClientRep_id_seq"', 20, true);


--
-- TOC entry 5173 (class 0 OID 0)
-- Dependencies: 242
-- Name: UserEntityModuleProgram_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserEntityModuleProgram_id_seq"', 112, true);


--
-- TOC entry 5174 (class 0 OID 0)
-- Dependencies: 240
-- Name: UserEntityModule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserEntityModule_id_seq"', 25, true);


--
-- TOC entry 5175 (class 0 OID 0)
-- Dependencies: 238
-- Name: UserEntity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserEntity_id_seq"', 8, true);


--
-- TOC entry 5176 (class 0 OID 0)
-- Dependencies: 216
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 12, true);


--
-- TOC entry 5177 (class 0 OID 0)
-- Dependencies: 226
-- Name: WorkOrder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."WorkOrder_id_seq"', 9, true);


--
-- TOC entry 5178 (class 0 OID 0)
-- Dependencies: 261
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 4841 (class 2606 OID 17047)
-- Name: AssetAttachment AssetAttachment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AssetAttachment"
    ADD CONSTRAINT "AssetAttachment_pkey" PRIMARY KEY (id);


--
-- TOC entry 4834 (class 2606 OID 17015)
-- Name: Asset Asset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Asset"
    ADD CONSTRAINT "Asset_pkey" PRIMARY KEY (id);


--
-- TOC entry 4839 (class 2606 OID 17037)
-- Name: Attachment Attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attachment"
    ADD CONSTRAINT "Attachment_pkey" PRIMARY KEY (id);


--
-- TOC entry 4877 (class 2606 OID 17165)
-- Name: Client Client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Client"
    ADD CONSTRAINT "Client_pkey" PRIMARY KEY (id);


--
-- TOC entry 4889 (class 2606 OID 17209)
-- Name: CommercialFamily CommercialFamily_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CommercialFamily"
    ADD CONSTRAINT "CommercialFamily_pkey" PRIMARY KEY (id);


--
-- TOC entry 4885 (class 2606 OID 17199)
-- Name: ComplaintItem ComplaintItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComplaintItem"
    ADD CONSTRAINT "ComplaintItem_pkey" PRIMARY KEY (id);


--
-- TOC entry 4883 (class 2606 OID 17184)
-- Name: Complaint Complaint_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Complaint"
    ADD CONSTRAINT "Complaint_pkey" PRIMARY KEY (id);


--
-- TOC entry 4901 (class 2606 OID 19000)
-- Name: EntityModuleItem EntityModuleItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EntityModuleItem"
    ADD CONSTRAINT "EntityModuleItem_pkey" PRIMARY KEY (id);


--
-- TOC entry 4858 (class 2606 OID 17104)
-- Name: EntityModuleProgram EntityModuleProgram_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EntityModuleProgram"
    ADD CONSTRAINT "EntityModuleProgram_pkey" PRIMARY KEY (id);


--
-- TOC entry 4855 (class 2606 OID 17096)
-- Name: EntityModule EntityModule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EntityModule"
    ADD CONSTRAINT "EntityModule_pkey" PRIMARY KEY (id);


--
-- TOC entry 4846 (class 2606 OID 17069)
-- Name: Entity Entity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Entity"
    ADD CONSTRAINT "Entity_pkey" PRIMARY KEY (id);


--
-- TOC entry 4836 (class 2606 OID 17027)
-- Name: InventoryItem InventoryItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryItem"
    ADD CONSTRAINT "InventoryItem_pkey" PRIMARY KEY (id);


--
-- TOC entry 4849 (class 2606 OID 17079)
-- Name: Module Module_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Module"
    ADD CONSTRAINT "Module_pkey" PRIMARY KEY (id);


--
-- TOC entry 4893 (class 2606 OID 17220)
-- Name: PaymentTerm PaymentTerm_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentTerm"
    ADD CONSTRAINT "PaymentTerm_pkey" PRIMARY KEY (id);


--
-- TOC entry 4852 (class 2606 OID 17089)
-- Name: Program Program_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Program"
    ADD CONSTRAINT "Program_pkey" PRIMARY KEY (id);


--
-- TOC entry 4872 (class 2606 OID 17155)
-- Name: SalesOrderItem SalesOrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalesOrderItem"
    ADD CONSTRAINT "SalesOrderItem_pkey" PRIMARY KEY (id);


--
-- TOC entry 4870 (class 2606 OID 17142)
-- Name: SalesOrder SalesOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalesOrder"
    ADD CONSTRAINT "SalesOrder_pkey" PRIMARY KEY (id);


--
-- TOC entry 4879 (class 2606 OID 17173)
-- Name: UserClientRep UserClientRep_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserClientRep"
    ADD CONSTRAINT "UserClientRep_pkey" PRIMARY KEY (id);


--
-- TOC entry 4866 (class 2606 OID 17127)
-- Name: UserEntityModuleProgram UserEntityModuleProgram_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserEntityModuleProgram"
    ADD CONSTRAINT "UserEntityModuleProgram_pkey" PRIMARY KEY (id);


--
-- TOC entry 4863 (class 2606 OID 17119)
-- Name: UserEntityModule UserEntityModule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserEntityModule"
    ADD CONSTRAINT "UserEntityModule_pkey" PRIMARY KEY (id);


--
-- TOC entry 4860 (class 2606 OID 17111)
-- Name: UserEntity UserEntity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserEntity"
    ADD CONSTRAINT "UserEntity_pkey" PRIMARY KEY (id);


--
-- TOC entry 4831 (class 2606 OID 17005)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 4843 (class 2606 OID 17058)
-- Name: WorkOrder WorkOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkOrder"
    ADD CONSTRAINT "WorkOrder_pkey" PRIMARY KEY (id);


--
-- TOC entry 4827 (class 2606 OID 16992)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4895 (class 2606 OID 17226)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (token);


--
-- TOC entry 4898 (class 2606 OID 17236)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4832 (class 1259 OID 17238)
-- Name: Asset_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Asset_code_key" ON public."Asset" USING btree (code);


--
-- TOC entry 4873 (class 1259 OID 17251)
-- Name: Client_cidade_estado_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Client_cidade_estado_idx" ON public."Client" USING btree (cidade, estado);


--
-- TOC entry 4874 (class 1259 OID 17249)
-- Name: Client_doc_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Client_doc_key" ON public."Client" USING btree (doc);


--
-- TOC entry 4875 (class 1259 OID 17250)
-- Name: Client_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Client_name_idx" ON public."Client" USING btree (name);


--
-- TOC entry 4886 (class 1259 OID 17254)
-- Name: CommercialFamily_description_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CommercialFamily_description_idx" ON public."CommercialFamily" USING btree (description);


--
-- TOC entry 4887 (class 1259 OID 20715)
-- Name: CommercialFamily_erpCode_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CommercialFamily_erpCode_idx" ON public."CommercialFamily" USING btree ("erpCode");


--
-- TOC entry 4881 (class 1259 OID 17253)
-- Name: Complaint_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Complaint_code_key" ON public."Complaint" USING btree (code);


--
-- TOC entry 4899 (class 1259 OID 19001)
-- Name: EntityModuleItem_entityModuleId_inventoryItemId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "EntityModuleItem_entityModuleId_inventoryItemId_key" ON public."EntityModuleItem" USING btree ("entityModuleId", "inventoryItemId");


--
-- TOC entry 4856 (class 1259 OID 17244)
-- Name: EntityModuleProgram_entityModuleId_programId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "EntityModuleProgram_entityModuleId_programId_key" ON public."EntityModuleProgram" USING btree ("entityModuleId", "programId");


--
-- TOC entry 4853 (class 1259 OID 17243)
-- Name: EntityModule_entityId_moduleId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "EntityModule_entityId_moduleId_key" ON public."EntityModule" USING btree ("entityId", "moduleId");


--
-- TOC entry 4844 (class 1259 OID 17240)
-- Name: Entity_cnpj_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Entity_cnpj_key" ON public."Entity" USING btree (cnpj);


--
-- TOC entry 4837 (class 1259 OID 17239)
-- Name: InventoryItem_sku_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "InventoryItem_sku_key" ON public."InventoryItem" USING btree (sku);


--
-- TOC entry 4847 (class 1259 OID 17241)
-- Name: Module_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Module_code_key" ON public."Module" USING btree (code);


--
-- TOC entry 4890 (class 1259 OID 17255)
-- Name: PaymentTerm_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PaymentTerm_code_key" ON public."PaymentTerm" USING btree (code);


--
-- TOC entry 4891 (class 1259 OID 17256)
-- Name: PaymentTerm_description_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PaymentTerm_description_idx" ON public."PaymentTerm" USING btree (description);


--
-- TOC entry 4850 (class 1259 OID 17242)
-- Name: Program_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Program_code_key" ON public."Program" USING btree (code);


--
-- TOC entry 4868 (class 1259 OID 17248)
-- Name: SalesOrder_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SalesOrder_code_key" ON public."SalesOrder" USING btree (code);


--
-- TOC entry 4880 (class 1259 OID 17252)
-- Name: UserClientRep_userId_clientId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserClientRep_userId_clientId_key" ON public."UserClientRep" USING btree ("userId", "clientId");


--
-- TOC entry 4867 (class 1259 OID 17247)
-- Name: UserEntityModuleProgram_userEntityModuleId_programId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserEntityModuleProgram_userEntityModuleId_programId_key" ON public."UserEntityModuleProgram" USING btree ("userEntityModuleId", "programId");


--
-- TOC entry 4864 (class 1259 OID 17246)
-- Name: UserEntityModule_userEntityId_moduleId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserEntityModule_userEntityId_moduleId_key" ON public."UserEntityModule" USING btree ("userEntityId", "moduleId");


--
-- TOC entry 4861 (class 1259 OID 17245)
-- Name: UserEntity_userId_entityId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserEntity_userId_entityId_key" ON public."UserEntity" USING btree ("userId", "entityId");


--
-- TOC entry 4828 (class 1259 OID 20714)
-- Name: User_doc_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_doc_key" ON public."User" USING btree (doc);


--
-- TOC entry 4829 (class 1259 OID 17237)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 4896 (class 1259 OID 17257)
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- TOC entry 4906 (class 2606 OID 17273)
-- Name: AssetAttachment AssetAttachment_assetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AssetAttachment"
    ADD CONSTRAINT "AssetAttachment_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES public."Asset"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4903 (class 2606 OID 17263)
-- Name: Asset Asset_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Asset"
    ADD CONSTRAINT "Asset_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Asset"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4905 (class 2606 OID 17268)
-- Name: Attachment Attachment_workOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attachment"
    ADD CONSTRAINT "Attachment_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES public."WorkOrder"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4928 (class 2606 OID 17383)
-- Name: ComplaintItem ComplaintItem_complaintId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComplaintItem"
    ADD CONSTRAINT "ComplaintItem_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES public."Complaint"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4926 (class 2606 OID 17373)
-- Name: Complaint Complaint_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Complaint"
    ADD CONSTRAINT "Complaint_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4927 (class 2606 OID 17378)
-- Name: Complaint Complaint_entityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Complaint"
    ADD CONSTRAINT "Complaint_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES public."Entity"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4930 (class 2606 OID 19007)
-- Name: EntityModuleItem EntityModuleItem_entityModuleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EntityModuleItem"
    ADD CONSTRAINT "EntityModuleItem_entityModuleId_fkey" FOREIGN KEY ("entityModuleId") REFERENCES public."EntityModule"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4931 (class 2606 OID 19012)
-- Name: EntityModuleItem EntityModuleItem_inventoryItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EntityModuleItem"
    ADD CONSTRAINT "EntityModuleItem_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES public."InventoryItem"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4913 (class 2606 OID 17308)
-- Name: EntityModuleProgram EntityModuleProgram_entityModuleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EntityModuleProgram"
    ADD CONSTRAINT "EntityModuleProgram_entityModuleId_fkey" FOREIGN KEY ("entityModuleId") REFERENCES public."EntityModule"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4914 (class 2606 OID 17313)
-- Name: EntityModuleProgram EntityModuleProgram_programId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EntityModuleProgram"
    ADD CONSTRAINT "EntityModuleProgram_programId_fkey" FOREIGN KEY ("programId") REFERENCES public."Program"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4911 (class 2606 OID 17298)
-- Name: EntityModule EntityModule_entityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EntityModule"
    ADD CONSTRAINT "EntityModule_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES public."Entity"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4912 (class 2606 OID 17303)
-- Name: EntityModule EntityModule_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EntityModule"
    ADD CONSTRAINT "EntityModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public."Module"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4909 (class 2606 OID 17288)
-- Name: Entity Entity_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Entity"
    ADD CONSTRAINT "Entity_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Entity"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4904 (class 2606 OID 19002)
-- Name: InventoryItem InventoryItem_commercialFamilyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryItem"
    ADD CONSTRAINT "InventoryItem_commercialFamilyId_fkey" FOREIGN KEY ("commercialFamilyId") REFERENCES public."CommercialFamily"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4910 (class 2606 OID 17293)
-- Name: Program Program_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Program"
    ADD CONSTRAINT "Program_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public."Module"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4922 (class 2606 OID 17353)
-- Name: SalesOrderItem SalesOrderItem_inventoryItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalesOrderItem"
    ADD CONSTRAINT "SalesOrderItem_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES public."InventoryItem"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4923 (class 2606 OID 17358)
-- Name: SalesOrderItem SalesOrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalesOrderItem"
    ADD CONSTRAINT "SalesOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."SalesOrder"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4921 (class 2606 OID 17348)
-- Name: SalesOrder SalesOrder_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalesOrder"
    ADD CONSTRAINT "SalesOrder_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4924 (class 2606 OID 17363)
-- Name: UserClientRep UserClientRep_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserClientRep"
    ADD CONSTRAINT "UserClientRep_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4925 (class 2606 OID 17368)
-- Name: UserClientRep UserClientRep_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserClientRep"
    ADD CONSTRAINT "UserClientRep_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4919 (class 2606 OID 17338)
-- Name: UserEntityModuleProgram UserEntityModuleProgram_programId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserEntityModuleProgram"
    ADD CONSTRAINT "UserEntityModuleProgram_programId_fkey" FOREIGN KEY ("programId") REFERENCES public."Program"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4920 (class 2606 OID 17343)
-- Name: UserEntityModuleProgram UserEntityModuleProgram_userEntityModuleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserEntityModuleProgram"
    ADD CONSTRAINT "UserEntityModuleProgram_userEntityModuleId_fkey" FOREIGN KEY ("userEntityModuleId") REFERENCES public."UserEntityModule"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4917 (class 2606 OID 17328)
-- Name: UserEntityModule UserEntityModule_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserEntityModule"
    ADD CONSTRAINT "UserEntityModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public."Module"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4918 (class 2606 OID 17333)
-- Name: UserEntityModule UserEntityModule_userEntityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserEntityModule"
    ADD CONSTRAINT "UserEntityModule_userEntityId_fkey" FOREIGN KEY ("userEntityId") REFERENCES public."UserEntity"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4915 (class 2606 OID 17318)
-- Name: UserEntity UserEntity_entityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserEntity"
    ADD CONSTRAINT "UserEntity_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES public."Entity"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4916 (class 2606 OID 17323)
-- Name: UserEntity UserEntity_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserEntity"
    ADD CONSTRAINT "UserEntity_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4902 (class 2606 OID 17258)
-- Name: User User_lastEntityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_lastEntityId_fkey" FOREIGN KEY ("lastEntityId") REFERENCES public."Entity"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4907 (class 2606 OID 17278)
-- Name: WorkOrder WorkOrder_assetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkOrder"
    ADD CONSTRAINT "WorkOrder_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES public."Asset"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4908 (class 2606 OID 17283)
-- Name: WorkOrder WorkOrder_assignedUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkOrder"
    ADD CONSTRAINT "WorkOrder_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4929 (class 2606 OID 17388)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5130 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2025-11-28 11:29:10

--
-- PostgreSQL database dump complete
--

\unrestrict ps0auER8Zv4FF7KaLh0k5HKWcgMHQfRYJGV7eeWKZLOPMMDNOu5RJQYxZsFLisa

