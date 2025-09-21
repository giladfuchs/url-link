"use client";

import {
  Download as DownloadIcon,
  ContentCopy as ContentCopyIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import QRCode from "react-qr-code";
import { toast } from "sonner";

import AGTable from "@/components/panel/table";
import { HomeButton } from "@/components/shared/elements-client";
import { API_URL, localeCache } from "@/lib/config";
import { baseMetricsCols, ModelType } from "@/lib/types";
import API from "@/lib/utils/api";
import { safeDecodeURIComponent } from "@/lib/utils/helper";

import type {
  Totals,
  Breakdowns,
  Breakdown,
  Series,
  DataPoint,
  Link,
  SingleLinkResponse,
} from "@/lib/types";
import type { ColDef } from "ag-grid-community";
import type { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
function TrafficChart({ series }: { series: Series }) {
  const intl = useIntl();

  const chartSeries = useMemo<{ name: string; data: DataPoint[] }[]>(
    () => [
      {
        name: intl.formatMessage({ id: "table.headerName.clicks" }),
        data: series.clicks,
      },
      {
        name: intl.formatMessage({ id: "table.headerName.uniques" }),
        data: series.uniques,
      },
    ],
    [series, intl],
  );

  const options = useMemo<ApexOptions>(
    () => ({
      chart: {
        type: "area",
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      stroke: { curve: "smooth", width: 2 },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      xaxis: { type: "datetime", labels: { datetimeUTC: true } },
      yaxis: { decimalsInFloat: 0 },
      fill: {
        type: "gradient",
        gradient: { shadeIntensity: 0.3, opacityFrom: 0.25, opacityTo: 0.05 },
      },
      legend: {
        position: "top",
        horizontalAlign: localeCache.isRtl() ? "right" : "left",
      },
      grid: { strokeDashArray: 4 },
    }),
    [],
  );

  return (
    <Box sx={{ p: "1.25rem", maxWidth: "100rem" }}>
      <ReactApexChart
        options={options}
        series={chartSeries}
        type="area"
        height={360}
      />
    </Box>
  );
}

const sizeQr = 180;
export const LinkQR = ({ link }: { link: Link }) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const shortUrl = useMemo(() => `${API_URL}/${link.alias}`, [link.alias]);

  const download = () => {
    const svg = wrapRef.current?.querySelector("svg");
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = sizeQr;
      canvas.height = sizeQr;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, sizeQr, sizeQr);
      ctx.drawImage(img, 0, 0, sizeQr, sizeQr);
      URL.revokeObjectURL(url);
      const png = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = png;
      a.download = `${link.alias}.png`;
      a.click();
    };
    img.src = url;
  };

  return (
    <Box textAlign="center">
      <Box ref={wrapRef} sx={{ display: "inline-block" }}>
        <QRCode value={shortUrl} size={sizeQr} />
      </Box>
      <Box my={1} display="flex" justifyContent="center" gap="0.5rem">
        <Button
          variant="text"
          size="small"
          startIcon={<DownloadIcon />}
          onClick={download}
        >
          <FormattedMessage id="download.qr" />
        </Button>
      </Box>
      <Box display="flex" justifyContent="center">
        <Chip
          label={link.active ? "Active" : "Inactive"}
          color={link.active ? "success" : "error"}
          size="small"
        />
      </Box>
    </Box>
  );
};

export const LinkInfo = ({
  link,
  totals,
  isPublic = false,
}: {
  link: Link;
  totals: Totals;
  isPublic?: boolean;
}) => {
  const intl = useIntl();

  const shortUrl = useMemo(() => `${API_URL}/${link.alias}`, [link.alias]);
  const totalsStr = useMemo(() => {
    return Object.entries(totals)
      .map(
        ([key, value]) =>
          `${intl.formatMessage({ id: `table.headerName.${key}` })}: ${value}`,
      )
      .join(" | ");
  }, [totals, intl]);
  const copy = async (toCopy: string) => {
    await navigator.clipboard.writeText(toCopy);
    toast.success(intl.formatMessage({ id: "copy.clipboard" }), {
      description: toCopy,
    });
  };

  return (
    <Box
      sx={{ p: "0.5rem", border: "1px solid #eee", borderRadius: "0.75rem" }}
    >
      <HomeButton />
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Box
          display="flex"
          flexDirection="column"
          gap="0.5rem"
          sx={{
            direction: "ltr",
            textAlign: "center",
            maxWidth: "40rem",
            width: "100%",
          }}
        >
          <Typography variant="h2">
            <FormattedMessage id="report.title1" />
          </Typography>
          <Typography variant="h3">{totalsStr}</Typography>

          <Typography variant="h3">
            <FormattedMessage id="report.title2" />
          </Typography>

          {isPublic && (
            <>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap="0.5rem"
                justifyContent="right"
              >
                <Typography
                  color="warning"
                  sx={{ wordBreak: "break-word", fontWeight: 700 }}
                >
                  <FormattedMessage id="report.publicNotice" />
                </Typography>
                <Typography sx={{ wordBreak: "break-word" }}>
                  {window.location.href}
                  <IconButton
                    size="small"
                    onClick={() => copy(window.location.href)}
                    aria-label="copy-href"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />
            </>
          )}
          <Typography dir={localeCache.dir()} sx={{ wordBreak: "break-all" }}>
            <FormattedMessage id="report.topNotice" />
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            gap="0.5rem"
            justifyContent="left"
          >
            <Typography sx={{ wordBreak: "break-all" }}>{shortUrl}</Typography>
            <IconButton
              size="small"
              onClick={() => copy(shortUrl)}
              aria-label="copy-link"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap="0.5rem"
            justifyContent="left"
          >
            <Typography sx={{ wordBreak: "break-all" }}>{link.url}</Typography>
            <IconButton
              size="small"
              component="a"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="open"
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export const BreakdownTables = ({ breakdowns }: { breakdowns: Breakdowns }) => {
  const intl = useIntl();

  const DIM_ORDER: (keyof Breakdowns)[] = [
    "referrer",
    "city",
    "device",
    "os",
    "browser",
    "country",
    "region",
  ];

  return (
    <Grid container spacing={2}>
      {DIM_ORDER.map((dim) => {
        const rows = breakdowns[dim] as Breakdown[];
        if (!rows || rows.length === 0) return null;
        const localDim = intl.formatMessage({ id: dim });
        const cols = [
          { headerName: localDim, field: "value", flex: 1 },
          ...baseMetricsCols,
        ] as ColDef[];
        return (
          <Grid size={{ xs: 12, md: 4 }} key={dim as string}>
            <Typography
              variant="h2"
              sx={{ mb: "0.5rem", [localeCache.isRtl() ? "mr" : "ml"]: 1 }}
            >
              {localDim}
            </Typography>
            <AGTable cols={cols} rows={rows} fixedHeight />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default function Report({
  alias,
  password_hash,
  isPublic = false,
}: {
  alias?: string;
  password_hash?: string;
  isPublic?: boolean;
}) {
  const [data, setData] = useState<SingleLinkResponse | null | undefined>(null);

  const loadData = useCallback(async () => {
    try {
      if (isPublic && password_hash) {
        const res = await API.get<SingleLinkResponse>(
          `/report/${safeDecodeURIComponent(password_hash)}`,
        );
        setData(res.data);
      } else if (alias) {
        const res = await API.get<SingleLinkResponse>(
          `/${ModelType.link}/${safeDecodeURIComponent(alias)}`,
        );
        setData(res.data);
      }
    } catch {
      setData(undefined);
    }
  }, [alias, password_hash, isPublic]);

  useEffect(() => {
    if (!alias && !(isPublic && password_hash)) return notFound();
    void loadData();
  }, [loadData, alias, password_hash, isPublic]);

  if (data === undefined) return notFound();
  if (data === null) return null;

  return (
    <>
      <LinkInfo
        link={data.link}
        totals={data.report.totals}
        isPublic={isPublic}
      />
      <TrafficChart series={data.report.series} />
      <BreakdownTables breakdowns={data.report.breakdowns} />
      <LinkQR link={data.link} />
    </>
  );
}
