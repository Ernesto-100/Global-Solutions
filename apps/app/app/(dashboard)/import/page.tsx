"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  ArrowRight,
  Database,
} from "lucide-react";
import { toast } from "sonner";

type ImportStep = "upload" | "validating" | "preview" | "importing" | "complete";

const supportedFormats = [
  { name: "QuickBooks Online", ext: ".qbo", icon: "🏦" },
  { name: "QuickBooks Desktop", ext: ".qbw / .iif", icon: "💼" },
  { name: "CSV / Excel", ext: ".csv / .xlsx", icon: "📊" },
  { name: "Wave Accounting", ext: ".csv", icon: "🌊" },
  { name: "Xero", ext: ".csv", icon: "🔵" },
];

const previewData = {
  accounts: 14,
  customers: 47,
  vendors: 23,
  transactions: 1842,
  invoices: 89,
  bills: 134,
  dateRange: "Jan 2023 — Mar 2026",
  issues: [
    "3 transactions with duplicate IDs — will be deduplicated automatically",
    "2 invoices reference deleted customers — will be flagged for review",
  ],
};

export default function ImportPage() {
  const [step, setStep] = useState<ImportStep>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (!f) return;
    setFile(f);
    setStep("validating");

    // Simulate validation
    setTimeout(() => {
      setStep("preview");
      toast.success(`File "${f.name}" validated successfully!`);
    }, 2000);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/octet-stream": [".qbo", ".qbw", ".iif"],
    },
    maxFiles: 1,
  });

  async function runImport() {
    setStep("importing");
    // Simulate import with progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((r) => setTimeout(r, 100));
      setProgress(i);
    }
    setStep("complete");
    toast.success("Import complete! All data is now in TrueBooks.");
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Import Data</h1>
        <p className="mt-1 text-sm text-slate-500">
          Switch from QuickBooks, Wave, or Xero in one step
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2">
        {["Upload", "Validate", "Preview", "Import", "Done"].map((label, i) => {
          const stepMap: ImportStep[] = ["upload", "validating", "preview", "importing", "complete"];
          const currentIndex = stepMap.indexOf(step);
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  done
                    ? "bg-brand-600 text-white"
                    : active
                    ? "border-2 border-brand-600 text-brand-600"
                    : "border-2 border-slate-200 text-slate-400"
                }`}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  active ? "text-brand-700" : done ? "text-slate-500" : "text-slate-300"
                }`}
              >
                {label}
              </span>
              {i < 4 && (
                <div className={`h-px w-6 ${done ? "bg-brand-400" : "bg-slate-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step: Upload */}
      {step === "upload" && (
        <>
          <div
            {...getRootProps()}
            className={`card border-2 border-dashed p-12 text-center cursor-pointer transition-all ${
              isDragActive
                ? "border-brand-400 bg-brand-50"
                : "border-slate-200 hover:border-brand-300 hover:bg-slate-50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-10 w-10 text-slate-300 mb-4" />
            <p className="text-base font-semibold text-slate-700">
              {isDragActive
                ? "Drop your file here"
                : "Drag & drop your export file here"}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              or click to browse (.qbo, .csv, .xlsx, .iif)
            </p>
          </div>

          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              Supported formats
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {supportedFormats.map((fmt) => (
                <div
                  key={fmt.name}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3"
                >
                  <span className="text-xl">{fmt.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {fmt.name}
                    </p>
                    <p className="text-xs text-slate-400">{fmt.ext}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Need help exporting from QuickBooks?{" "}
              <a href="#" className="text-brand-600 underline">
                View our step-by-step guide
              </a>{" "}
              or{" "}
              <a href="/support" className="text-brand-600 underline">
                chat with our migration team
              </a>
              .
            </p>
          </div>
        </>
      )}

      {/* Step: Validating */}
      {step === "validating" && (
        <div className="card p-12 text-center">
          <Loader2 className="mx-auto h-10 w-10 text-brand-600 animate-spin mb-4" />
          <p className="text-base font-semibold text-slate-700">
            Validating "{file?.name}"
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Checking data integrity, detecting duplicates…
          </p>
        </div>
      )}

      {/* Step: Preview */}
      {step === "preview" && (
        <div className="space-y-4">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-5">
              <FileText className="h-5 w-5 text-brand-600" />
              <div>
                <p className="text-sm font-semibold text-slate-800">{file?.name}</p>
                <p className="text-xs text-slate-400">{previewData.dateRange}</p>
              </div>
              <span className="ml-auto badge badge-green">Validated</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Chart of Accounts", value: previewData.accounts },
                { label: "Customers", value: previewData.customers },
                { label: "Vendors", value: previewData.vendors },
                { label: "Transactions", value: previewData.transactions.toLocaleString() },
                { label: "Invoices", value: previewData.invoices },
                { label: "Bills", value: previewData.bills },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                >
                  <span className="text-xs text-slate-500">{item.label}</span>
                  <span className="text-sm font-bold text-slate-800">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {previewData.issues.length > 0 && (
            <div className="card p-5 border-yellow-200 bg-yellow-50">
              <div className="flex gap-3">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-yellow-800 mb-1">
                    Minor issues found (handled automatically)
                  </p>
                  <ul className="space-y-1">
                    {previewData.issues.map((issue) => (
                      <li key={issue} className="text-xs text-yellow-700">
                        • {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="card p-5 border-brand-100 bg-brand-50">
            <div className="flex gap-3">
              <CheckCircle2 className="h-4 w-4 text-brand-600 mt-0.5 shrink-0" />
              <p className="text-sm text-brand-700">
                Your existing TrueBooks data will <strong>not</strong> be
                modified during import. All imported data is added in a staging
                area for your review first.
              </p>
            </div>
          </div>

          <button onClick={runImport} className="btn-primary w-full py-3 text-base">
            <Database className="h-4 w-4" />
            Start Import — {previewData.transactions.toLocaleString()} transactions
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Step: Importing */}
      {step === "importing" && (
        <div className="card p-12 text-center">
          <div className="mx-auto h-20 w-20 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin mb-6" />
          <p className="text-base font-semibold text-slate-700">
            Importing your data…
          </p>
          <p className="text-sm text-slate-400 mt-1 mb-6">
            Please don't close this window
          </p>
          <div className="mx-auto max-w-xs">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step: Complete */}
      {step === "complete" && (
        <div className="card p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Import complete!
          </h2>
          <p className="mt-2 text-slate-500">
            {previewData.transactions.toLocaleString()} transactions imported
            successfully. Your books are ready.
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <a href="/" className="btn-primary">
              Go to Dashboard
            </a>
            <a href="/reconciliation" className="btn-secondary">
              Run Reconciliation
            </a>
          </div>
          <p className="mt-6 text-xs text-slate-400">
            A migration specialist from our team will reach out within 2 hours
            to confirm everything looks correct.
          </p>
        </div>
      )}
    </div>
  );
}
