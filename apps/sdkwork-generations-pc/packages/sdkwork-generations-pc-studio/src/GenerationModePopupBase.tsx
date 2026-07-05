import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Check, ChevronUp, Settings, X } from "lucide-react";

type ConfigValue = boolean | number | string;

export interface SdkworkGenerationModeOption<T extends ConfigValue = string> {
  icon?: ReactNode;
  isVip?: boolean;
  label: string;
  value: T;
}

export interface SdkworkGenerationModeSection<Config extends object = Record<string, ConfigValue>> {
  id: string;
  label: string;
  max?: number;
  min?: number;
  options?: SdkworkGenerationModeOption<ConfigValue>[];
  step?: number;
  type: "select" | "slider" | "toggle";
  unit?: string;
  valueKey: keyof Config & string;
}

export interface SdkworkGenerationModePopupBaseProps<Config extends object> {
  canGenerate?: boolean;
  config: Config;
  generateLabel?: string;
  generatingLabel?: string;
  getSummary: (config: Config) => string;
  isGenerating?: boolean;
  onChangeConfig: (config: Config) => void;
  onGenerate: () => void;
  renderExtraControls?: () => ReactNode;
  sections: SdkworkGenerationModeSection<Config>[];
  title?: string;
  barClassName?: string;
  popupClassName?: string;
}

export function SdkworkGenerationModePopupBase<Config extends object>({
  canGenerate = true,
  config,
  generateLabel = "Generate",
  generatingLabel = "Generating...",
  getSummary,
  isGenerating = false,
  onChangeConfig,
  onGenerate,
  renderExtraControls,
  sections,
  title = "Generation settings",
  barClassName,
  popupClassName,
}: SdkworkGenerationModePopupBaseProps<Config>) {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSectionChange = (valueKey: keyof Config & string, value: ConfigValue) => {
    onChangeConfig({ ...config, [valueKey]: value } as Config);
  };

  const summary = getSummary(config);

  return (
    <div className="relative" ref={popupRef}>
      <div className={`sdkwork-generation-mode-bar flex items-center justify-between gap-4 px-4 py-3 ${barClassName ?? ''}`}>
        <button
          className="sdkwork-generation-mode-bar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <Settings className={`sdkwork-generation-mode-bar-icon h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />
          <span className="sdkwork-generation-mode-bar-summary">{summary}</span>
          <ChevronUp className={`sdkwork-generation-mode-bar-chevron h-4 w-4 transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`} />
        </button>

        <div className="flex items-center gap-3">
          {renderExtraControls?.()}

          <button
            className={`sdkwork-studio-generate-btn group relative overflow-hidden rounded-xl px-8 py-2.5 text-base font-bold transition-all duration-200 ${
              canGenerate && !isGenerating
                ? 'sdkwork-studio-generate-btn--enabled'
                : 'sdkwork-studio-generate-btn--disabled'
            }`}
            disabled={!canGenerate || isGenerating}
            onClick={(event) => {
              event.stopPropagation();
              if (canGenerate && !isGenerating) {
                onGenerate();
              }
            }}
            type="button"
          >
            <span className="relative">{isGenerating ? generatingLabel : generateLabel}</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className={`sdkwork-generation-mode-popup absolute bottom-full left-0 right-0 mb-2 overflow-hidden ${popupClassName ?? ''}`}
          style={{ animation: "sdkworkGenerationSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <div className="sdkwork-generation-mode-popup-head">
            <div className="sdkwork-generation-mode-popup-head-title">
              <Settings className="sdkwork-generation-mode-popup-head-icon h-4 w-4" />
              <h3>{title}</h3>
            </div>
            <button
              className="sdkwork-generation-mode-popup-close"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="custom-scrollbar max-h-[60vh] space-y-7 overflow-y-auto px-6 pb-6 pt-6">
            {sections.map((section, index) => (
              <div key={section.id}>
                {index > 0 ? (
                  <div className="sdkwork-generation-mode-section-divider" />
                ) : null}
                <SdkworkGenerationConfigSectionRenderer
                  onChange={(value) => handleSectionChange(section.valueKey, value)}
                  section={section}
                  value={readConfigValue(config, section.valueKey)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes sdkworkGenerationSlideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

function SdkworkGenerationConfigSectionRenderer<Config extends object>({
  onChange,
  section,
  value,
}: {
  onChange: (value: ConfigValue) => void;
  section: SdkworkGenerationModeSection<Config>;
  value: ConfigValue;
}) {
  if (section.type === "select" && section.options) {
    return (
      <div className="space-y-3">
        <label className="sdkwork-generation-mode-section-label">{section.label}</label>
        <div className={`grid gap-2.5 ${gridClassForOptionCount(section.options.length)}`}>
          {section.options.map((option) => {
            const isSelected = value === option.value;
            return (
              <button
                className="sdkwork-generation-mode-option relative flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200"
                data-selected={isSelected ? 'true' : 'false'}
                data-disabled={option.isVip ? 'true' : 'false'}
                disabled={option.isVip}
                key={String(option.value)}
                onClick={() => onChange(option.value)}
                type="button"
              >
                {isSelected ? (
                  <Check className="sdkwork-generation-mode-option-check" aria-hidden="true" />
                ) : null}
                {option.icon}
                <span>{option.label}</span>
                {option.isVip && (
                  <span className="sdkwork-generation-mode-vip-badge">
                    VIP
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (section.type === "slider") {
    const numberValue = Number(value);
    const min = section.min ?? 0;
    const max = section.max ?? 100;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="sdkwork-generation-mode-section-label">{section.label}</label>
          <span className="sdkwork-generation-mode-value-chip">{numberValue}{section.unit}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="sdkwork-generation-mode-range-label">{min}{section.unit}</span>
          <div className="relative flex-1">
            <input
              className="sdkwork-generation-mode-slider h-2 w-full cursor-pointer appearance-none rounded-full"
              max={max}
              min={min}
              onChange={(event) => onChange(Number(event.target.value))}
              step={section.step ?? 1}
              type="range"
              value={numberValue}
            />
          </div>
          <span className="sdkwork-generation-mode-range-label">{max}{section.unit}</span>
        </div>
      </div>
    );
  }

  if (section.type === "toggle") {
    return (
      <button
        className="sdkwork-generation-mode-toggle"
        data-active={value ? 'true' : 'false'}
        onClick={() => onChange(!value)}
        type="button"
      >
        <span className="sdkwork-generation-mode-toggle-track" data-active={value ? 'true' : 'false'}>
          <span className="sdkwork-generation-mode-toggle-knob" />
        </span>
        {section.label}
      </button>
    );
  }

  return null;
}

function gridClassForOptionCount(optionCount: number): string {
  if (optionCount <= 1) {
    return "grid-cols-1";
  }
  if (optionCount === 2) {
    return "grid-cols-2";
  }
  if (optionCount === 3) {
    return "grid-cols-3";
  }
  if (optionCount <= 6) {
    return "grid-cols-3";
  }
  return "grid-cols-4";
}

function readConfigValue<Config extends object>(
  config: Config,
  key: keyof Config & string,
): ConfigValue {
  const value = config[key as keyof Config];
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  return "";
}
