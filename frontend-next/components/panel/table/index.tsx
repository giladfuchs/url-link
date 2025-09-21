"use client";

import { Typography } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { useIntl } from "react-intl";

import { localeCache } from "@/lib/config";

import { ActionRenderer, AgGenericRenderer } from "./renderer";

import type { ColDef, GridReadyEvent } from "ag-grid-community";
import type { AGTableModelType } from "lib/types";

const defaultColDef: ColDef = { resizable: true, filter: true, sortable: true };

interface Props {
  cols: ColDef<AGTableModelType>[];
  rows: AGTableModelType[];
  fixedHeight?: boolean;
}

const AGTable = ({ cols, rows, fixedHeight = false }: Props) => {
  const intl = useIntl();
  const isRtl = localeCache.isRtl();
  const direction = localeCache.dir();
  const gridRef = useRef<AgGridReact<AGTableModelType>>(null);
  const [filteredCount, setFilteredCount] = useState(rows.length);
  const [containerHeightRem, setContainerHeightRem] = useState<string>(
    fixedHeight ? "20rem" : "42rem",
  );

  useEffect(() => {
    if (fixedHeight) return;

    const compute = () => {
      const rootSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize || "16",
      );
      const hRem = (window.innerHeight * 0.7) / rootSize;
      setContainerHeightRem(`${hRem}rem`);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [fixedHeight]);

  const localizedCols = useMemo<ColDef<AGTableModelType>[]>(() => {
    return cols.map((col) => ({
      ...col,
      headerName:
        col.headerName ??
        intl.formatMessage({ id: `table.headerName.${col.field}` }),
      valueFormatter:
        col.valueFormatter ??
        ((p) => (p.value && typeof p.value === "object" ? "" : p.value)),
    }));
  }, [cols, intl]);

  const rafIdRef = useRef<number | null>(null);
  const updateCounts = useCallback(() => {
    const api = gridRef.current?.api;
    if (!api || api.isDestroyed()) return;
    if (rafIdRef.current != null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      setFilteredCount(api.getDisplayedRowCount());
    });
  }, []);

  useEffect(
    () => () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
    },
    [],
  );

  const onGridReady = (e: GridReadyEvent) => {
    setFilteredCount(e.api.getDisplayedRowCount());
  };
  const onFilterChanged = () => updateCounts();
  const onModelUpdated = () => updateCounts();

  return (
    <>
      {filteredCount < rows.length && (
        <Typography variant="body1" align="center" dir="ltr">
          {filteredCount} / {rows.length}
        </Typography>
      )}
      <div
        className="ag-theme-quartz"
        data-testid="ag-table"
        dir={direction}
        style={{
          height: containerHeightRem,
          width: "100%",
          overflowX: "auto",

          direction,
        }}
      >
        <AgGridReact<AGTableModelType>
          ref={gridRef}
          className="ag-theme-quartz"
          rowData={rows}
          columnDefs={localizedCols}
          defaultColDef={defaultColDef}
          enableRtl={isRtl}
          ensureDomOrder={false}
          enableCellTextSelection
          suppressColumnVirtualisation={false}
          suppressRowVirtualisation={false}
          rowHeight={30}
          components={{
            ActionRenderer,
            AgGenericRenderer,
          }}
          onGridReady={onGridReady}
          onFilterChanged={onFilterChanged}
          onModelUpdated={onModelUpdated}
        />
      </div>
    </>
  );
};

export default AGTable;
