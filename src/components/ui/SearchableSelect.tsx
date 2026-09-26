'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './select';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import debounce from 'lodash.debounce';

type Option = {
  value: string;
  label: string;
};

type SearchableSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options?: Option[]; // valores estáticos
  fetchOptions?: (query: string) => Promise<Option[]>; // ajax
  searchable?: boolean;
};

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  value,
  onValueChange,
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


  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {searchable && (
          <div className="px-2 pb-1 pt-1">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="h-8 text-sm"
            />
          </div>
        )}
        <SelectGroup>
          {loading ? (
            <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Cargando...
            </div>
          ) : internalOptions.length > 0 ? (
            internalOptions.map((opt,index) => (
              <SelectItem key={index} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-muted-foreground">Sin resultados</div>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
