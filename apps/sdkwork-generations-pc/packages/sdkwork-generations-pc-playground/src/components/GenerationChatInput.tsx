import { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, Image as ImageIcon, Video, Music, Plus, ArrowUp, ChevronDown, Activity, Package, Smile, Loader2 } from 'lucide-react';
import {
  createDefaultSdkworkGenerationAssetConfig,
  getSdkworkGenerationModelBucket,
  serializeSdkworkGenerationAssetConfig,
} from '@sdkwork/generations-pc-workspace/generation-asset-config';
import { ModelPicker, createFallbackModel } from '@sdkwork/models-pc-picker';
import type { GenerationModality, Modality } from '../playground-modality.ts';
import type {
  PlaygroundGenerationSubmitInput,
  PlaygroundGenerationTargetType,
  PlaygroundModelBucket,
  PlaygroundModelGroup,
} from '../playground-types.ts';

export function GenerationChatInput({
  selectedModality,
  setSelectedModality,
  modelGroups,
  selectedModels,
  setSelectedModel,
  onSubmit,
  submitting = false,
}: {
  selectedModality: GenerationModality,
  setSelectedModality: (m: GenerationModality) => void,
  modelGroups: PlaygroundModelGroup[],
  selectedModels: Record<GenerationModality, string>,
  setSelectedModel: (targetModality: GenerationModality) => (modelId: string) => void,
  onSubmit?: (input: PlaygroundGenerationSubmitInput) => Promise<void> | void,
  submitting?: boolean,
}) {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [showModalityMenu, setShowModalityMenu] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
        setShowModalityMenu(false);
        setShowModelMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getModalityIcon = (m: GenerationModality) => {
    switch(m) {
      case 'agent': return <Bot className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Smile className="w-4 h-4" />;
      case 'music': return <Music className="w-4 h-4" />;
      case 'sfx': return <Activity className="w-4 h-4" />;
      case 'package': return <Package className="w-4 h-4" />;
    }
  };

  const modalityLabels: Record<GenerationModality, string> = {
    agent: t('playground.input.type.agent'),
    image: t('playground.input.type.image'),
    video: t('playground.input.type.video'),
    audio: t('playground.input.type.audio'),
    music: t('playground.input.type.music'),
    sfx: t('playground.input.type.sfx'),
    package: t('playground.input.type.package')
  };

  const currentPlaceholder = selectedModality === 'agent' ? t('playground.input.placeholder.agent') : t('playground.input.placeholder.generic');
  const selectedBucket = toModelBucket(selectedModality);
  const modelPickerFallback = useMemo(() => {
    if (!selectedBucket) {
      return null;
    }
    return createFallbackModel(
      t('playground.input.menu.model'),
      t('playground.modelPicker.noModels'),
      'AI',
      selectedBucket,
      t('common.status.pending'),
    );
  }, [selectedBucket, t]);
  const normalizedPrompt = prompt.trim();
  const canSubmit = Boolean(onSubmit && normalizedPrompt && !submitting);

  const handleSubmit = async () => {
    if (!canSubmit || !onSubmit) {
      return;
    }
    if (selectedModality === 'package') {
      return;
    }
    const generationConfig = isPlaygroundGenerationTargetType(selectedModality)
      ? serializeSdkworkGenerationAssetConfig(
        createDefaultSdkworkGenerationAssetConfig(selectedModality),
        selectedModality,
      )
      : undefined;
    try {
      await onSubmit({
        generationConfig,
        prompt: normalizedPrompt,
        selectedModality,
        selectedModel: selectedModels[selectedModality] || undefined,
      });
      setPrompt('');
      setIsFocused(true);
    } catch {
      setIsFocused(true);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`sdkwork-playground-chat-input-shell w-full transition-colors duration-200 ${
          isFocused
            ? 'rounded-2xl p-2'
            : 'rounded-full p-2 cursor-text'
        }`}
        onClick={() => { if (!isFocused) setIsFocused(true); }}
      >

        {/* Unfocused Content Overlay */}
        {!isFocused && (
          <div className="flex items-center animate-in fade-in duration-200">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIsFocused(true);
              }}
              title={t('playground.referenceAssets')}
              aria-label={t('playground.referenceAssets')}
              className="sdkwork-playground-chat-input__attach-btn"
            >
               <Plus className="w-4 h-4" />
            </button>
            <div className="sdkwork-playground-chat-input__placeholder">
              {currentPlaceholder}
            </div>
            <button
              type="button"
              disabled
              title={t('playground.input.submit')}
              aria-label={t('playground.input.submit')}
              className="sdkwork-playground-chat-input__submit-idle"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Focused Content */}
        {isFocused && (
          <div className="flex flex-col animate-in fade-in duration-300">
            <div className="flex gap-4">
              {/* Right Textarea */}
              <div className="flex-1 relative">
                 <textarea
                   autoFocus
                   value={prompt}
                   onChange={e => setPrompt(e.target.value)}
                   onKeyDown={(event) => {
                     if (event.key === 'Enter' && !event.shiftKey) {
                       event.preventDefault();
                       void handleSubmit();
                     }
                   }}
                   className="sdkwork-playground-chat-input__textarea custom-scrollbar"
                   placeholder={currentPlaceholder}
                 />
              </div>
            </div>

            {/* Bottom Toolbar */}
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                 {/* Modality Switcher Dropdown */}
                 <div className="relative">
                   <button
                     type="button"
                     data-active={showModalityMenu ? 'true' : 'false'}
                     onClick={(e) => { e.stopPropagation(); setShowModalityMenu(!showModalityMenu); setShowModelMenu(false); }}
                     className="sdkwork-playground-chat-input-chip flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
                   >
                     {getModalityIcon(selectedModality)}
                     <span>{modalityLabels[selectedModality]}</span>
                     <ChevronDown className="sdkwork-playground-chat-input__chip-chevron" />
                   </button>

                   {/* Modality Menu Popup */}
                    {showModalityMenu && (
                      <div className="sdkwork-playground-chat-input-menu absolute bottom-[calc(100%+8px)] left-0 z-50 w-48 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 origin-bottom-left">
                        <div className="sdkwork-playground-chat-input__menu-label">{t("playground.input.menu.type")}</div>
                        {(Object.keys(modalityLabels) as GenerationModality[]).filter(t => t !== 'package').map(type => (
                          <button
                            type="button"
                            key={type}
                            onClick={() => { setSelectedModality(type); setShowModalityMenu(false); setShowModelMenu(false); }}
                            className="sdkwork-playground-chat-input__menu-item"
                          >
                            <div className="flex items-center gap-2">
                               {getModalityIcon(type)}
                               <span>{modalityLabels[type]}</span>
                            </div>
                            {selectedModality === type && <div className="w-4 h-4 flex items-center justify-center shrink-0"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sdkwork-playground-chat-input__menu-item-check"><polyline points="20 6 9 17 4 12"></polyline></svg></div>}
                          </button>
                        ))}
                      </div>
                   )}
                 </div>

                 {selectedBucket && modelPickerFallback ? (
                   <div className="w-full max-w-[220px] shrink-0">
                     <ModelPicker
                       bucket={selectedBucket}
                       modelGroups={modelGroups}
                       selectedModelId={selectedModels[selectedModality] || ''}
                       onSelectModel={setSelectedModel(selectedModality)}
                       showModelMenu={showModelMenu}
                       setShowModelMenu={setShowModelMenu}
                       fallback={modelPickerFallback}
                       compact
                       variant="flat"
                     />
                   </div>
                 ) : (
                   <div className="sdkwork-playground-chat-input-model flex h-[38px] w-full max-w-[220px] shrink-0 items-center rounded-xl px-3 text-sm">
                     {modalityLabels[selectedModality]}
                   </div>
                 )}

              </div>

              <div className="flex items-center gap-3">
                 <button
                   type="button"
                   disabled={!canSubmit}
                   title={t('playground.input.submit')}
                   aria-label={t('playground.input.submit')}
                   onClick={() => { void handleSubmit(); }}
                   className="sdkwork-playground-chat-input__submit"
                   data-enabled={canSubmit ? 'true' : 'false'}
                 >
                   {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
                 </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function toModelBucket(value: GenerationModality): PlaygroundModelBucket | null {
  if (value === 'agent') {
    return 'llms';
  }
  if (value === 'package') {
    return null;
  }
  return getSdkworkGenerationModelBucket(value);
}

function isPlaygroundGenerationTargetType(value: GenerationModality): value is PlaygroundGenerationTargetType {
  return value === 'image'
    || value === 'video'
    || value === 'music'
    || value === 'audio'
    || value === 'sfx';
}
