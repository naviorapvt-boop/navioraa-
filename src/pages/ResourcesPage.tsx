import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Resource } from '../types';

interface ResourcesPageProps {
  navigate: (path: string) => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ navigate }) => {
  const { resources, updateResource } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDownloadModal, setActiveDownloadModal] = useState<Resource | null>(null);

  const publishedResources = resources.filter(r => r.status === 'published');

  const categories = [
    { id: 'all', label: 'All Documents' },
    { id: 'Engineering Notes', label: 'Engineering Notes' },
    { id: 'Architecture Guide', label: 'Architecture Guide' },
    { id: 'System Blueprints', label: 'System Blueprints' },
    { id: 'Tutorials & Code', label: 'Tutorials & Code' }
  ];

  const filteredResources = publishedResources.filter(r => {
    const matchesCat = activeCategory === 'all' || r.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      r.title.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query) ||
      r.fileType.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  const handleDownload = async (resource: Resource) => {
    setActiveDownloadModal(resource);
    try {
      await updateResource(resource.id, {
        downloadCount: (resource.downloadCount || 0) + 1
      });
    } catch (e) {
      console.warn('Update download count note:', e);
    }
  };

  return (
    <div className="w-full bg-[#080d1b] min-h-screen text-[#dee2f6]">
      {/* Header */}
      <div className="relative w-full overflow-hidden bg-[#090e1c] py-16 border-b border-[#434655]/20">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#65e8ff]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#252a39] border border-[#65e8ff]/30">
            <span className="w-2 h-2 rounded-full bg-[#65e8ff] animate-pulse" />
            <span className="font-mono text-[11px] text-[#65e8ff] uppercase tracking-wider font-semibold">
              Open Technical Library
            </span>
          </div>

          <h1 className="font-['Geist'] text-[40px] sm:text-[50px] font-bold text-[#dee2f6] tracking-tight">
            Learning Resources &{' '}
            <span className="bg-gradient-to-r from-[#658aff] via-[#2ad9f2] to-[#65e8ff] bg-clip-text text-transparent">
              Engineering Notes
            </span>
          </h1>

          <p className="text-[17px] text-[#a6b1c5] max-w-2xl leading-relaxed">
            Curated whitepapers, architectural schematics, code patterns, and deep-dive technical notes published by Navioraa's systems faculty for engineers and students.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#10182b] p-4 rounded-xl border border-[#434655]/20 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-1">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === c.id
                    ? 'bg-[#252a39] text-[#65e8ff] border border-[#65e8ff]/40 shadow-sm'
                    : 'text-[#a6b1c5] hover:text-[#dee2f6] hover:bg-[#161b2a]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a6b1c5] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter notes, blueprints..."
              className="w-full bg-[#090e1c] text-[#dee2f6] pl-10 pr-4 py-2 rounded-lg text-[14px] border border-[#252a39] focus:outline-none focus:border-[#65e8ff]"
            />
          </div>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map(res => (
            <div
              key={res.id}
              className="rounded-xl bg-[#10182b] border border-[#434655]/20 hover:border-[#65e8ff]/40 p-6 flex flex-col justify-between group transition-all shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded bg-[#252a39] text-[#65e8ff] font-mono text-[11px] uppercase font-bold border border-[#252a39]">
                    {res.category}
                  </span>
                  <span className="text-[12px] font-mono text-[#a6b1c5] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">download</span>
                    {res.downloadCount || 0} downloads
                  </span>
                </div>

                <h3 className="font-['Geist'] text-[20px] text-[#dee2f6] font-bold mb-2 group-hover:text-[#65e8ff] transition-colors">
                  {res.title}
                </h3>
                <p className="text-[14px] text-[#a6b1c5] mb-6 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#252a39] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-[#8d90a0]">
                  <span className="material-symbols-outlined text-[16px] text-[#b5c4ff]">description</span>
                  <span>{res.fileType}</span>
                  {res.fileSize && <span>({res.fileSize})</span>}
                </div>

                <button
                  onClick={() => handleDownload(res)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold text-[13px] shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">file_download</span>
                  <span>Get Resource</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Download / Access Dialog */}
      {activeDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090e1c]/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-xl bg-[#10182b] border border-[#65e8ff]/30 p-8 shadow-2xl flex flex-col gap-4">
            <button
              onClick={() => setActiveDownloadModal(null)}
              className="absolute top-4 right-4 text-[#a6b1c5] hover:text-[#dee2f6] p-1 rounded"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="w-12 h-12 rounded-lg bg-[#252a39] flex items-center justify-center text-[#65e8ff]">
              <span className="material-symbols-outlined text-[28px]">file_download</span>
            </div>

            <h3 className="font-['Geist'] text-[22px] text-[#dee2f6] font-bold">
              Access Document: {activeDownloadModal.title}
            </h3>

            <p className="text-[14px] text-[#a6b1c5] leading-relaxed">
              This publication is distributed under Navioraa Technical Open Spec License. You may freely use, reference, and build upon these architecture notes.
            </p>

            <div className="p-3 rounded bg-[#090e1c] border border-[#252a39] text-xs font-mono text-[#65e8ff] truncate">
              {activeDownloadModal.fileUrl}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setActiveDownloadModal(null)}
                className="px-4 py-2 rounded-lg bg-[#252a39] text-[#a6b1c5] hover:text-[#dee2f6] text-[13px] font-semibold cursor-pointer"
              >
                Close
              </button>
              <a
                href={activeDownloadModal.fileUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold text-[13px] shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>Direct Open / Download</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
