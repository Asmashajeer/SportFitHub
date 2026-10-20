import { useState } from "react";
import { Mail, Copy, Check } from "lucide-react";
import { AppEmail } from "@/constants/constants";

const SUPPORT_EMAIL = AppEmail

 const  Support=()=>{
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <section className="mx-auto max-w-xl px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold text-gray-600">Need help?</h1>
      <p className="mt-3 text-gray-600">
        Email us and we'll get back to you within 24 hours.
      </p>

      <div className="mt-8 rounded-2xl border border-green-600 p-6 shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-500/30">
          <Mail className="h-6 w-6 text-green-600" />
        </div>

        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="text-lg font-medium text-green-600 hover:underline break-all"
        >
          {SUPPORT_EMAIL}
        </a>

        <div className="mt-4 flex justify-center gap-3">
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Send email
          </a>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      
    </section>
  );
}

export default Support;