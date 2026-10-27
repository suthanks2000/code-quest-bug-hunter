import React from 'react';
import { Bug, Terminal } from 'lucide-react';

interface CodeSnippetProps {
  code: string;
  language?: string;
  bugType?: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ code, language = 'javascript', bugType }) => {
  const lines = code.split('\n');

  // Simple syntax tokenizer for clean presentation without bloated dependencies
  const highlightLine = (text: string) => {
    // Escape HTML safety
    const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'async', 'await', 'import', 'from', 'export', 'default', 'try', 'catch', 'finally', 'typeof', 'delete', 'new', 'class', 'extends'];
    const parts = text.split(/(\b(?:const|let|var|function|return|if|else|async|await|import|from|export|default|try|catch|finally|typeof|delete|new|class|extends)\b|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\/\/.+$|\d+)/g);

    return parts.map((part, idx) => {
      if (!part) return null;
      if (keywords.includes(part)) {
        return <span key={idx} className="text-[#c084fc] font-semibold">{part}</span>;
      }
      if (part.startsWith('"') || part.startsWith("'")) {
        return <span key={idx} className="text-[#00ff88]">{part}</span>;
      }
      if (part.startsWith('//')) {
        return <span key={idx} className="text-[#64748b] italic">{part}</span>;
      }
      if (/^\d+$/.test(part)) {
        return <span key={idx} className="text-[#38bdf8]">{part}</span>;
      }
      return <span key={idx} className="text-[#e2e8f0]">{part}</span>;
    });
  };

  return (
    <div className="rounded-xl overflow-hidden border border-[#2d3142] bg-[#10121a] shadow-inner">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#171924] border-b border-[#2d3142] text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-[#00ff88]" />
          <span className="font-mono text-[11px] tracking-wide text-slate-300">{language}</span>
        </div>
        {bugType && (
          <div className="flex items-center gap-1 text-[11px] font-mono text-[#c084fc]">
            <Bug className="w-3 h-3 text-[#c084fc]" />
            <span>{bugType}</span>
          </div>
        )}
      </div>

      <div className="p-3 font-mono text-xs leading-relaxed overflow-x-auto selection:bg-[#c084fc]/30">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-[#1a1d2c]/50 transition-colors">
                <td className="w-7 text-right pr-3 select-none text-slate-600 font-mono text-[11px]">
                  {idx + 1}
                </td>
                <td className="font-mono whitespace-pre text-slate-200">
                  {highlightLine(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
