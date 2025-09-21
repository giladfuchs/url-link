import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ModelType } from "@/lib/types";
import API from "@/lib/utils/api";

import type { AGTableModelType, Link } from "@/lib/types";
import type { PayloadAction, ActionReducerMapBuilder } from "@reduxjs/toolkit";

interface PanelStateProps {
  models: {
    link: Link[];
  };
  user_id: number;
  loading: boolean;
}

const initialState: PanelStateProps = {
  models: {
    [ModelType.link]: [],
  },
  user_id: 0,
  loading: false,
};

export const fetchRowsByModel = createAsyncThunk<
  { model: ModelType; data: AGTableModelType[] },
  { model: ModelType }
>("models/fetch_rows", async ({ model }) => {
  const res = await API.post<AGTableModelType[]>(`/${model}`);
  return { model, data: res.data };
});
export const deleteRowById = createAsyncThunk<
  { model: ModelType; id: string | number },
  { model: ModelType; id: string | number }
>("models/delete_row", async ({ model, id }) => {
  const data = { query: [{ key: "id", value: id, opt: "eq" }] };
  await API.delete(`/${model}`, { data });
  return { model, id };
});
const panelSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<PanelStateProps>) => {
    builder
      .addCase(fetchRowsByModel.fulfilled, (state, action) => {
        (state.models[action.payload.model] as AGTableModelType[]) =
          action.payload.data;
      })
      .addCase(deleteRowById.fulfilled, (state, action) => {
        const { model, id } = action.payload;
        state.models[model] = state.models[model].filter(
          (row) => row.id !== id,
        );
      });
  },
});

export const { setLoading } = panelSlice.actions;
export default panelSlice.reducer;
