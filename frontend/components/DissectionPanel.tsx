"use client";

import { AnalysisResult, Insight } from "@/lib/api";

type DissectionData = AnalysisResult | Insight;

interface Props {
  data: DissectionData;
}

function Section({ label, value }: { label: string; value: string | string[] }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;

  return (
    <div className="border border-[#1e1e2e] rounded-lg p-4">
      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">{label}</p>
      {Array.isArray(value) ? (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, i) => (
            <span key={i} className="bg-[#1e1e2e] text-[#9ca3af] text-xs px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[#e8e8f0] text-sm leading-relaxed">{value}</p>
      )}
    </div>
  );
}

export default function DissectionPanel({ data }: Props) {
  const analysisResult = data as AnalysisResult;

  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-purple-500" />
        <h3 className="text-white font-semibold">Dissecação Claude AI</h3>
        {"copy_framework" in data && (
          <span className="ml-auto text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
            {data.copy_framework}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <Section label="Ângulo Principal" value={data.main_angle} />
        <Section label="Grande Promessa" value={data.big_promise} />
        <Section label="Mecanismo Único" value={data.unique_mechanism} />
        <Section label="Crença Quebrada" value={data.broken_belief} />
        <Section label="Por que Converte" value={data.why_it_works_hypothesis} />

        {"hook_type" in data && (
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-[#1e1e2e] rounded-lg p-4">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Tipo de Hook</p>
              <p className="text-[#e8e8f0] text-sm">{analysisResult.hook_type}</p>
            </div>
            <div className="border border-[#1e1e2e] rounded-lg p-4">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Tipo de CTA</p>
              <p className="text-[#e8e8f0] text-sm">{analysisResult.cta_type}</p>
            </div>
          </div>
        )}

        {"target_awareness" in data && analysisResult.target_awareness && (
          <Section label="Nível de Consciência" value={analysisResult.target_awareness} />
        )}

        {"strengths" in data && analysisResult.strengths?.length > 0 && (
          <div className="border border-emerald-500/20 rounded-lg p-4 bg-emerald-500/5">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Pontos Fortes</p>
            <ul className="space-y-1">
              {analysisResult.strengths.map((s, i) => (
                <li key={i} className="text-[#9ca3af] text-sm flex gap-2">
                  <span className="text-emerald-400">+</span> {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {"weaknesses" in data && analysisResult.weaknesses?.length > 0 && (
          <div className="border border-red-500/20 rounded-lg p-4 bg-red-500/5">
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Pontos Fracos</p>
            <ul className="space-y-1">
              {analysisResult.weaknesses.map((w, i) => (
                <li key={i} className="text-[#9ca3af] text-sm flex gap-2">
                  <span className="text-red-400">−</span> {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Section
          label="Tags de Similaridade"
          value={"similarity_tags" in data ? data.similarity_tags : []}
        />
      </div>
    </div>
  );
}
