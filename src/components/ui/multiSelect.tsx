import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectScrollDownButton, SelectScrollUpButton, SelectTrigger, SelectValue } from './select';
import { Input } from '@/components/ui/input';
import { Check, Loader2, ChevronDown } from 'lucide-react';
import debounce from 'lodash.debounce';
import * as SelectPrimitive from '@radix-ui/react-select';

type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  options?: Option[];
  fetchOptions?: (query: string) => Promise<Option[]>;
  searchable?: boolean;
};

export const MultiSelectProps: React.FC<MultiSelectProps> = ({
  values,
  onChange,
  placeholder = 'Selecciona...',
  options = [],
  fetchOptions,
  searchable = true,
}) => {
  const [search, setSearch] = useState('');
  const [internalOptions, setInternalOptions] = useState<Option[]>(options);
  const [loading, setLoading] = useState(false);

  // Cargar dinámicamente si hay función fetchOptions
  const fetchOptionsDebounced = useCallback(
    debounce(async (query: string) => {
      if (!fetchOptions) return;
      setLoading(true);
      try {
        const result = await fetchOptions(query);
        setInternalOptions(result);
      } catch (error) {
        console.error('Error cargando opciones', error);
        setInternalOptions([]);
      } finally {
        setLoading(false);
      }
    }, 400),
    [fetchOptions] // solo cambia si fetchOptions cambia
  );

  useEffect(() => {
    if (fetchOptions) {
      fetchOptionsDebounced(search);
    } else {
      const filtered = options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      );
      setInternalOptions(filtered);
    }
  }, [search]); // sólo depende de search

  useEffect(() => {
    return () => {
      fetchOptionsDebounced.cancel();
    };
  }, [fetchOptionsDebounced]);

  const toggleValue = (val: string) => {
    if (values.includes(val)) {
      onChange(values.filter((v) => v !== val));
    } else {
      onChange([...values, val]);
    }
  };

  return (
    <SelectPrimitive.Root open={false}>
      <SelectTrigger>
        <div className="flex flex-wrap gap-1">
          {values.length === 0 ? (
            <span className="text-muted-foreground text-sm">{placeholder}</span>
          ) : (
            values.map((val) => {
              const label = internalOptions.find((o) => o.value === val)?.label || val;
              return (
                <span
                  key={val}
                  className="bg-gray-200 rounded px-2 py-0.5 text-xs font-medium text-gray-800"
                >
                  {label}
                </span>
              );
            })
          )}
        </div>
        <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
      </SelectTrigger>
      <SelectContent>
        {searchable && (
          <div className="px-2 py-1">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="h-8 text-sm"
            />
          </div>
        )}
        <SelectScrollUpButton />
        <SelectGroup>
          {loading ? (
            <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Cargando...
            </div>
          ) : internalOptions.length > 0 ? (
            internalOptions.map((opt) => {
              const selected = values.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  onClick={() => toggleValue(opt.value)}
                  className={`cursor-pointer flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent ${
                    selected ? 'bg-accent text-accent-foreground font-semibold' : ''
                  }`}
                >
                  <Check className={`h-4 w-4 ${selected ? 'opacity-100' : 'opacity-0'}`} />
                  {opt.label}
                </div>
              );
            })
          ) : (
            <div className="px-4 py-2 text-sm text-muted-foreground">Sin resultados</div>
          )}
        </SelectGroup>
        <SelectScrollDownButton />
      </SelectContent>
    </SelectPrimitive.Root>
  );
};
