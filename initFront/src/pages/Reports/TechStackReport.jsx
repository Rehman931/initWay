import React, { useEffect, useState } from "react";

import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Download,
  Sparkles,
  Server,
  Database,
  BrainCircuit,
  ShieldCheck,
  Cloud,
  Code2,
  Layers3,
  CreditCard,
  Activity,
  HardDrive,
  Plug,
  CheckCircle2,
} from "lucide-react";

/* =========================================================
   PDF STYLES
========================================================= */

const pdf = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 30,
    paddingHorizontal: 34,
    fontFamily: "Helvetica",
    fontSize: 8.5,
    color: "#1f2937",
  },

  cover: {
    padding: 42,
    justifyContent: "center",
  },

  brand: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#7c3aed",
    marginBottom: 14,
  },

  coverLine: {
    width: 52,
    height: 4,
    backgroundColor: "#7c3aed",
    marginBottom: 16,
  },

  coverTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
    lineHeight: 1.15,
    marginBottom: 12,
  },

  coverText: {
    fontSize: 9.5,
    color: "#4b5563",
    lineHeight: 1.5,
  },

  coverMeta: {
    flexDirection: "row",
    gap: 30,
    marginTop: 24,
  },

  coverMetaLabel: {
    fontSize: 7,
    color: "#9ca3af",
  },

  coverMetaValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 3,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1 solid #e5e7eb",
    paddingBottom: 7,
    marginBottom: 12,
  },

  headerBrand: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#7c3aed",
  },

  headerText: {
    fontSize: 7,
    color: "#9ca3af",
  },

  section: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 6,
  },

  body: {
    fontSize: 8.3,
    color: "#4b5563",
    lineHeight: 1.4,
  },

  box: {
    backgroundColor: "#f9fafb",
    border: "1 solid #e5e7eb",
    borderRadius: 6,
    padding: 9,
    marginBottom: 9,
  },

  purpleBox: {
    backgroundColor: "#f5f3ff",
    borderLeft: "3 solid #7c3aed",
    padding: 10,
    marginBottom: 10,
  },

  purpleText: {
    fontSize: 8.3,
    color: "#4c1d95",
    lineHeight: 1.4,
  },

  twoColumn: {
    flexDirection: "row",
    gap: 9,
  },

  card: {
    flex: 1,
    padding: 9,
    backgroundColor: "#f9fafb",
    border: "1 solid #e5e7eb",
    borderRadius: 6,
  },

  cardTitle: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 5,
  },

  cardText: {
    fontSize: 7.7,
    color: "#4b5563",
    lineHeight: 1.35,
  },

  label: {
    fontSize: 6.8,
    color: "#9ca3af",
    textTransform: "uppercase",
    marginBottom: 3,
  },

  value: {
    fontSize: 8.3,
    color: "#374151",
    lineHeight: 1.35,
  },

  listItem: {
    flexDirection: "row",
    marginBottom: 5,
  },

  bullet: {
    width: 9,
    color: "#7c3aed",
    fontSize: 8,
  },

  listText: {
    flex: 1,
    fontSize: 7.8,
    color: "#4b5563",
    lineHeight: 1.35,
  },

  serviceRow: {
    padding: 8,
    backgroundColor: "#f9fafb",
    border: "1 solid #e5e7eb",
    borderRadius: 5,
    marginBottom: 6,
  },

  footer: {
    position: "absolute",
    bottom: 14,
    left: 34,
    right: 34,
    textAlign: "center",
    fontSize: 6.5,
    color: "#9ca3af",
  },
});

/* =========================================================
   PDF HEADER
========================================================= */

const PDFHeader = ({ title }) => (
  <View style={pdf.header}>
    <Text style={pdf.headerBrand}>INITWAY</Text>
    <Text style={pdf.headerText}>{title}</Text>
  </View>
);

/* =========================================================
   TECH STACK PDF
========================================================= */

const TechStackPDF = ({ tech }) => {
  const formattedCost = tech.estimatedCost?.replace(/\\n/g, "\n") || "";

  const formattedReasoning = tech.reasoning?.replace(/\\n/g, "\n") || "";

  return (
    <Document
      title={tech.title}
      author="InitWay"
      subject="Technology Stack Report"
    >
      {/* =================================================
          COVER
      ================================================= */}

      <Page size="A4" style={pdf.cover}>
        <Text style={pdf.brand}>INITWAY • TECH STACK REPORT</Text>

        <View style={pdf.coverLine} />

        <Text style={pdf.coverTitle}>{tech.title}</Text>

        <Text style={pdf.coverText}>
          A scalable technology architecture covering frontend, backend, AI,
          databases, deployment, DevOps, authentication, storage, and
          third-party integrations.
        </Text>

        <View style={pdf.coverMeta}>
          <View>
            <Text style={pdf.coverMetaLabel}>ESTIMATED MONTHLY COST</Text>

            <Text style={pdf.coverMetaValue}>
              {formattedCost.split("\n")[0]}
            </Text>
          </View>

          <View>
            <Text style={pdf.coverMetaLabel}>ARCHITECTURE</Text>

            <Text style={pdf.coverMetaValue}>Cloud Native SaaS</Text>
          </View>
        </View>

        <Text
          style={{
            position: "absolute",
            bottom: 35,
            left: 42,
            fontSize: 7,
            color: "#9ca3af",
          }}
        >
          Generated with InitWay
        </Text>
      </Page>

      {/* =================================================
          CORE TECHNOLOGY
      ================================================= */}

      <Page size="A4" style={pdf.page}>
        <PDFHeader title="CORE TECHNOLOGY STACK" />

        {/* AI */}

        <View style={pdf.section}>
          <Text style={pdf.sectionTitle}>AI Stack</Text>

          <View style={pdf.twoColumn}>
            <View style={pdf.card}>
              <Text style={pdf.cardTitle}>Framework</Text>

              <Text style={pdf.cardText}>{tech.aiStack.framework}</Text>
            </View>

            <View style={pdf.card}>
              <Text style={pdf.cardTitle}>LLM</Text>

              <Text style={pdf.cardText}>{tech.aiStack.llm}</Text>
            </View>

            <View style={pdf.card}>
              <Text style={pdf.cardTitle}>Vector Database</Text>

              <Text style={pdf.cardText}>{tech.aiStack.vectorDatabase}</Text>
            </View>
          </View>
        </View>

        {/* APPLICATION */}

        <View style={pdf.section}>
          <Text style={pdf.sectionTitle}>Application Stack</Text>

          <View style={pdf.twoColumn}>
            <View style={pdf.box}>
              <Text style={pdf.cardTitle}>Backend</Text>

              <Text style={pdf.label}>Framework</Text>

              <Text style={pdf.value}>{tech.backend.framework}</Text>

              <Text style={pdf.label}>Language</Text>

              <Text style={pdf.value}>{tech.backend.language}</Text>

              <Text style={pdf.label}>API</Text>

              <Text style={pdf.value}>{tech.backend.api}</Text>
            </View>

            <View style={pdf.box}>
              <Text style={pdf.cardTitle}>Frontend</Text>

              <Text style={pdf.label}>Framework</Text>

              <Text style={pdf.value}>{tech.frontend.framework}</Text>

              <Text style={pdf.label}>State Management</Text>

              <Text style={pdf.value}>{tech.frontend.stateManagement}</Text>

              <Text style={pdf.label}>Styling</Text>

              <Text style={pdf.value}>{tech.frontend.styling}</Text>
            </View>
          </View>
        </View>

        {/* DATABASE */}

        <View style={pdf.section}>
          <Text style={pdf.sectionTitle}>Database & Storage</Text>

          <View style={pdf.twoColumn}>
            <View style={pdf.card}>
              <Text style={pdf.cardTitle}>PostgreSQL</Text>

              <Text style={pdf.cardText}>{tech.database.primary}</Text>
            </View>

            <View style={pdf.card}>
              <Text style={pdf.cardTitle}>Redis</Text>

              <Text style={pdf.cardText}>{tech.database.cache}</Text>
            </View>

            <View style={pdf.card}>
              <Text style={pdf.cardTitle}>Object Storage</Text>

              <Text style={pdf.cardText}>{tech.storage}</Text>
            </View>
          </View>
        </View>

        <Text style={pdf.footer}>{tech.title} • InitWay</Text>
      </Page>

      {/* =================================================
          ARCHITECTURE
      ================================================= */}

      <Page size="A4" style={pdf.page}>
        <PDFHeader title="ARCHITECTURE & DEPLOYMENT" />

        <View style={pdf.section}>
          <Text style={pdf.sectionTitle}>Architecture</Text>

          <View style={pdf.purpleBox}>
            <Text style={pdf.purpleText}>{tech.architecture}</Text>
          </View>
        </View>

        {/* AUTH */}

        <View style={pdf.section}>
          <Text style={pdf.sectionTitle}>Authentication</Text>

          <View style={pdf.box}>
            <Text style={pdf.body}>{tech.authentication}</Text>
          </View>
        </View>

        {/* DEPLOYMENT */}

        <View style={pdf.section}>
          <Text style={pdf.sectionTitle}>Deployment</Text>

          <View style={pdf.twoColumn}>
            <View style={pdf.card}>
              <Text style={pdf.cardTitle}>Frontend</Text>

              <Text style={pdf.cardText}>{tech.deployment.frontend}</Text>
            </View>

            <View style={pdf.card}>
              <Text style={pdf.cardTitle}>Backend</Text>

              <Text style={pdf.cardText}>{tech.deployment.backend}</Text>
            </View>

            <View style={pdf.card}>
              <Text style={pdf.cardTitle}>Database</Text>

              <Text style={pdf.cardText}>{tech.deployment.database}</Text>
            </View>
          </View>
        </View>

        {/* DEVOPS */}

        <View style={pdf.section}>
          <Text style={pdf.sectionTitle}>DevOps & Monitoring</Text>

          <View style={pdf.twoColumn}>
            <View style={pdf.card}>
              <Text style={pdf.cardTitle}>CI/CD</Text>

              <Text style={pdf.cardText}>{tech.devOps.ciCd}</Text>
            </View>

            <View style={pdf.card}>
              <Text style={pdf.cardTitle}>Monitoring</Text>

              <Text style={pdf.cardText}>{tech.devOps.monitoring}</Text>
            </View>
          </View>
        </View>

        <Text style={pdf.footer}>{tech.title} • InitWay</Text>
      </Page>

      {/* =================================================
          COST + SERVICES
      ================================================= */}

      <Page size="A4" style={pdf.page}>
        <PDFHeader title="COST & SERVICES" />

        <View style={pdf.section}>
          <Text style={pdf.sectionTitle}>Estimated Monthly Cost</Text>

          <View style={pdf.purpleBox}>
            {formattedCost.split("\n").map((line, index) => (
              <Text
                key={index}
                style={{
                  fontSize: index === 0 ? 10 : 7.8,
                  fontWeight: index === 0 ? "bold" : "normal",
                  color: index === 0 ? "#4c1d95" : "#5b21b6",
                  marginBottom: index === 0 ? 6 : 2,
                  lineHeight: 1.35,
                }}
              >
                {line}
              </Text>
            ))}
          </View>
        </View>

        {/* SERVICES */}

        <View style={pdf.section}>
          <Text style={pdf.sectionTitle}>Third-Party Services</Text>

          {tech.thirdPartyServices.map((service, index) => (
            <View style={pdf.serviceRow} key={index}>
              <View style={pdf.listItem}>
                <Text style={pdf.bullet}>•</Text>

                <Text style={pdf.listText}>{service}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* SCALABILITY */}

        <View style={pdf.section}>
          <Text style={pdf.sectionTitle}>Scalability</Text>

          <View style={pdf.box}>
            <Text style={pdf.body}>{tech.scalabilityPlan}</Text>
          </View>
        </View>

        <Text style={pdf.footer}>{tech.title} • InitWay</Text>
      </Page>

      {/* =================================================
          REASONING
      ================================================= */}

      <Page size="A4" style={pdf.page}>
        <PDFHeader title="TECHNOLOGY DECISION" />

        <View style={pdf.section}>
          <Text style={pdf.sectionTitle}>Why This Stack?</Text>

          {formattedReasoning
            .split("\n")
            .filter((reason) => reason.trim())
            .map((reason, index) => {
              const cleanReason = reason.replace(/^•\s*/, "");

              const separatorIndex = cleanReason.indexOf(" – ");

              const heading =
                separatorIndex !== -1
                  ? cleanReason.substring(0, separatorIndex)
                  : cleanReason;

              const description =
                separatorIndex !== -1
                  ? cleanReason.substring(separatorIndex + 3)
                  : "";

              return (
                <View key={index} style={pdf.box}>
                  <Text style={pdf.cardTitle}>{heading}</Text>

                  {description && <Text style={pdf.body}>{description}</Text>}
                </View>
              );
            })}
        </View>

        <View style={pdf.purpleBox}>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              color: "#4c1d95",
              marginBottom: 5,
            }}
          >
            Stack Summary
          </Text>

          <Text style={pdf.purpleText}>{tech.architecture}</Text>
        </View>

        <Text style={pdf.footer}>{tech.title} • InitWay</Text>
      </Page>
    </Document>
  );
};

/* =========================================================
   WEB COMPONENTS
========================================================= */

const InfoCard = ({ icon: Icon, title, value }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-violet-200 transition">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">
          {title}
        </p>

        <p className="text-sm font-semibold text-gray-900 leading-6">{value}</p>
      </div>
    </div>
  </div>
);

const DetailCard = ({ icon: Icon, title, children }) => (
  <section className="bg-white border border-gray-200 rounded-2xl p-6">
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
        <Icon size={19} />
      </div>

      <h2 className="font-bold text-gray-900">{title}</h2>
    </div>

    {children}
  </section>
);

const Field = ({ label, children }) => (
  <div>
    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
      {label}
    </p>

    <p className="text-sm text-gray-600 leading-6">{children}</p>
  </div>
);

/* =========================================================
   MAIN PAGE
========================================================= */

const TechStackReport = () => {
  const navigate = useNavigate();
  const { techstackId } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     FETCH REPORT
  ======================================================= */

  useEffect(() => {
    const getTechStackReport = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:3000/api/techstack/${techstackId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tech stack report");
        }

        const data = await response.json();

        console.log("Tech Stack API Response:", data);

        setReport(data);
      } catch (err) {
        console.error("Get tech stack report error:", err);

        setError(err.message || "Failed to load tech stack report.");
      } finally {
        setLoading(false);
      }
    };

    if (techstackId) {
      getTechStackReport();
    }
  }, [techstackId]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-gray-500">Loading tech stack report...</p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Failed to load report
          </h2>

          <p className="text-sm text-gray-500 mb-5">{error}</p>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     CHECK DATA
  ======================================================= */

  if (!report || !report.techStackReport) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Report not found
          </h2>

          <p className="text-sm text-gray-500">
            No tech stack report was returned by the API.
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ACTUAL TECH DATA
  ======================================================= */

  const tech = report.techStackReport;

  /* =======================================================
     FORMAT TEXT
  ======================================================= */

  const formattedCost = tech.estimatedCost?.replace(/\\n/g, "\n") || "";

  const formattedReasoning = tech.reasoning?.replace(/\\n/g, "\n") || "";

  /* =======================================================
     PDF FILE NAME
  ======================================================= */

  const fileName = `${tech.title
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase()}-tech-stack.pdf`;

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      {/* =================================================
          BACK
      ================================================= */}

      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition"
      >
        <ArrowLeft size={17} />
        Back
      </button>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative overflow-hidden rounded-3xl bg-gray-950 text-white p-7 sm:p-10 mb-6">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />

        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-medium mb-5">
                <Sparkles size={14} />
                AI Technology Architecture
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
                {tech.title}
              </h1>

              <p className="text-sm sm:text-base text-gray-300 leading-7 max-w-2xl">
                A complete technology architecture covering AI, application
                development, databases, infrastructure, deployment, security and
                integrations.
              </p>
            </div>

            <PDFDownloadLink
              document={<TechStackPDF tech={tech} />}
              fileName={fileName}
            >
              {({ loading }) => (
                <button className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition shrink-0">
                  <Download size={17} />

                  {loading ? "Preparing PDF..." : "Download Report"}
                </button>
              )}
            </PDFDownloadLink>
          </div>

          {/* HERO SUMMARY */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-9 pt-7 border-t border-white/10">
            <div>
              <p className="text-xs text-gray-500 mb-1">BACKEND</p>

              <p className="text-sm font-semibold text-white">
                {tech.backend.framework}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">AI MODEL</p>

              <p className="text-sm font-semibold text-white">
                {tech.aiStack.llm.split(" – ")[0]}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">DATABASE</p>

              <p className="text-sm font-semibold text-white">
                PostgreSQL + Redis
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">ESTIMATED COST</p>

              <p className="text-sm font-semibold text-white">
                {formattedCost.split("\n")[0]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          OVERVIEW
      ================================================= */}

      <section className="mb-8">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 mb-1">
            Overview
          </p>

          <h2 className="text-2xl font-bold text-gray-900">
            Technology at a glance
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            The primary technologies selected for the product.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard
            icon={BrainCircuit}
            title="AI Framework"
            value={tech.aiStack.framework.split(" – ")[0]}
          />

          <InfoCard
            icon={Code2}
            title="Frontend"
            value={tech.frontend.framework}
          />

          <InfoCard
            icon={Server}
            title="Backend"
            value={tech.backend.framework}
          />

          <InfoCard
            icon={Database}
            title="Primary Database"
            value="PostgreSQL"
          />
        </div>
      </section>

      {/* =================================================
          ARCHITECTURE
      ================================================= */}

      <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="flex items-center gap-3 lg:w-56 shrink-0">
            <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Layers3 size={20} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">Architecture</h2>

              <p className="text-xs text-gray-400 mt-0.5">System design</p>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-sm text-gray-600 leading-7">
              {tech.architecture}
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          AI STACK
      ================================================= */}

      <section className="mb-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 mb-1">
            Artificial Intelligence
          </p>

          <h2 className="text-2xl font-bold text-gray-900">AI Stack</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DetailCard icon={BrainCircuit} title="Framework">
            <p className="text-sm text-gray-600 leading-7">
              {tech.aiStack.framework}
            </p>
          </DetailCard>

          <DetailCard icon={Sparkles} title="Language Model">
            <p className="text-sm text-gray-600 leading-7">
              {tech.aiStack.llm}
            </p>
          </DetailCard>

          <DetailCard icon={Database} title="Vector Database">
            <p className="text-sm text-gray-600 leading-7">
              {tech.aiStack.vectorDatabase}
            </p>
          </DetailCard>
        </div>
      </section>

      {/* =================================================
          FRONTEND + BACKEND
      ================================================= */}

      <section className="mb-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 mb-1">
            Application
          </p>

          <h2 className="text-2xl font-bold text-gray-900">
            Frontend & Backend
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <DetailCard icon={Code2} title="Frontend">
            <div className="space-y-5">
              <Field label="Framework">{tech.frontend.framework}</Field>

              <Field label="State Management">
                {tech.frontend.stateManagement}
              </Field>

              <Field label="Styling">{tech.frontend.styling}</Field>
            </div>
          </DetailCard>

          <DetailCard icon={Server} title="Backend">
            <div className="space-y-5">
              <Field label="Framework">{tech.backend.framework}</Field>

              <Field label="Language">{tech.backend.language}</Field>

              <Field label="API">{tech.backend.api}</Field>
            </div>
          </DetailCard>
        </div>
      </section>

      {/* =================================================
          DATABASE + STORAGE
      ================================================= */}

      <section className="mb-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 mb-1">
            Data Layer
          </p>

          <h2 className="text-2xl font-bold text-gray-900">
            Database & Storage
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <DetailCard icon={Database} title="Primary Database">
            <p className="text-sm text-gray-600 leading-7">
              {tech.database.primary}
            </p>
          </DetailCard>

          <DetailCard icon={Database} title="Cache">
            <p className="text-sm text-gray-600 leading-7">
              {tech.database.cache}
            </p>
          </DetailCard>

          <DetailCard icon={HardDrive} title="Storage">
            <p className="text-sm text-gray-600 leading-7">{tech.storage}</p>
          </DetailCard>
        </div>
      </section>

      {/* =================================================
          DEPLOYMENT
      ================================================= */}

      <section className="bg-gray-950 rounded-2xl p-6 sm:p-8 mb-6 text-white">
        <div className="flex items-center gap-3 mb-7">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
            <Cloud size={20} />
          </div>

          <div>
            <h2 className="font-bold">Deployment</h2>

            <p className="text-xs text-gray-500 mt-0.5">
              Hosting and infrastructure
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs text-violet-300 uppercase tracking-wide mb-2">
              Frontend
            </p>

            <p className="text-sm text-gray-300 leading-6">
              {tech.deployment.frontend}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs text-violet-300 uppercase tracking-wide mb-2">
              Backend
            </p>

            <p className="text-sm text-gray-300 leading-6">
              {tech.deployment.backend}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs text-violet-300 uppercase tracking-wide mb-2">
              Database
            </p>

            <p className="text-sm text-gray-300 leading-6">
              {tech.deployment.database}
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          SECURITY + DEVOPS
      ================================================= */}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <DetailCard icon={ShieldCheck} title="Authentication & Security">
          <p className="text-sm text-gray-600 leading-7">
            {tech.authentication}
          </p>
        </DetailCard>

        <DetailCard icon={Activity} title="DevOps & Monitoring">
          <div className="space-y-5">
            <Field label="CI/CD">{tech.devOps.ciCd}</Field>

            <Field label="Monitoring">{tech.devOps.monitoring}</Field>
          </div>
        </DetailCard>
      </section>

      {/* =================================================
          THIRD PARTY SERVICES
      ================================================= */}

      <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Plug size={20} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">Third-Party Services</h2>

            <p className="text-sm text-gray-500">
              External services used by the architecture.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tech.thirdPartyServices.map((service, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100"
            >
              <CheckCircle2
                size={17}
                className="text-violet-500 mt-0.5 shrink-0"
              />

              <p className="text-sm text-gray-600 leading-6">{service}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================
          COST
      ================================================= */}

      <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-7">
          <div className="lg:w-64 shrink-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <CreditCard size={20} />
              </div>

              <h2 className="font-bold text-gray-900">Estimated Cost</h2>
            </div>

            <p className="text-sm text-gray-500 leading-6">
              Estimated monthly infrastructure and service cost for the MVP.
            </p>
          </div>

          <div className="flex-1 rounded-xl bg-violet-50 border border-violet-100 p-5">
            <p className="text-sm text-violet-900 leading-7 whitespace-pre-line">
              {formattedCost}
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          SCALABILITY
      ================================================= */}

      <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Activity size={20} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">Scalability Plan</h2>

            <p className="text-sm text-gray-500">
              Planned approach for handling growth.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-100 p-5">
          <p className="text-sm text-gray-600 leading-7">
            {tech.scalabilityPlan}
          </p>
        </div>
      </section>

      {/* =================================================
          WHY THIS STACK
      ================================================= */}

      <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Sparkles size={20} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">Why This Stack?</h2>

            <p className="text-sm text-gray-500">
              Reasoning behind the generated technology choices.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {formattedReasoning
            .split("\n")
            .filter((reason) => reason.trim())
            .map((reason, index) => {
              const clean = reason.replace(/^•\s*/, "");

              const separatorIndex = clean.indexOf(" – ");

              const heading =
                separatorIndex !== -1
                  ? clean.substring(0, separatorIndex)
                  : clean;

              const description =
                separatorIndex !== -1
                  ? clean.substring(separatorIndex + 3)
                  : "";

              return (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <p className="font-semibold text-gray-900 text-sm">
                    {heading}
                  </p>

                  {description && (
                    <p className="text-sm text-gray-600 leading-6">
                      {description}
                    </p>
                  )}
                </div>
              );
            })}
        </div>
      </section>

      {/* =================================================
          FINAL DOWNLOAD
      ================================================= */}

      <div className="flex flex-col items-center text-center">
        <p className="text-sm text-gray-500 mb-4">
          Want the complete technology architecture as a document?
        </p>

        <PDFDownloadLink
          document={<TechStackPDF tech={tech} />}
          fileName={fileName}
        >
          {({ loading }) => (
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition shadow-sm">
              <Download size={18} />

              {loading ? "Preparing PDF..." : "Download Full Tech Stack"}
            </button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default TechStackReport;
