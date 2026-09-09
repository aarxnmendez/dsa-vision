import { useTranslation } from "react-i18next";
import { Icon } from "../ui/Icon";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  const { t } = useTranslation("catalog");

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-xl mt-stack-sm relative">
        <Icon
          name="search"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
          filled={false}
        />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder ?? t("search.placeholder")}
          className="w-full bg-surface-container-lowest border-2 border-surface-variant rounded-2xl py-4 pl-12 pr-4 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-0 shadow-[0_4px_0_0_#dfe3e7] transition-all duration-300 ease-in-out hover:border-primary/40 hover:shadow-[0_4px_12px_rgba(0,87,191,0.08)]"
        />
      </div>
    </div>
  );
}
