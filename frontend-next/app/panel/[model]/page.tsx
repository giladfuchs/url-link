"use client";
import { Container, Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState, use } from "react";
import { FormattedMessage } from "react-intl";

import AGTable from "@/components/panel/table";
import { TableHeader } from "@/components/panel/table/table-header";
import { fetchRowsByModel, useAppDispatch, useAppSelector } from "@/lib/store";
import { get_columns_ag_by_model, ModelType } from "@/lib/types";
import { filterBySearch } from "@/lib/utils/helper";

import type { AGTableModelType } from "@/lib/types";
import type { ColDef } from "ag-grid-community";
import type { ChangeEvent } from "react";

export default function TablePage({
  params,
}: {
  params: Promise<{ model: ModelType }>;
}) {
  const dispatch = useAppDispatch();
  const { model } = use(params);

  const [searchValue, setSearchValue] = useState("");

  const rows: AGTableModelType[] = useAppSelector(
    (state) => state.panel.models[model],
  ) as AGTableModelType[];

  const cols: ColDef<AGTableModelType>[] = useMemo(
    () => get_columns_ag_by_model(model),
    [model],
  );
  useEffect(() => {
    dispatch(fetchRowsByModel({ model }));
  }, [dispatch, model]);
  const filteredRows = useMemo(
    () => filterBySearch(rows, searchValue),
    [searchValue, rows],
  );

  const onSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

  return (
    <Container disableGutters sx={{ px: 1 }}>
      <TableHeader
        model={model}
        count={filteredRows.length}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
      />

      <Grid container justifyContent="center" mt={2}>
        <AGTable cols={cols} rows={filteredRows} />
        {model === ModelType.link && (
          <Typography color="warning" variant="h2">
            <FormattedMessage id="table.subtitleClicksUniques" />
          </Typography>
        )}
      </Grid>
    </Container>
  );
}
