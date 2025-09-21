import {
  Email as EmailIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  InvertColors as InvertColorsIcon,
  Visibility as VisibilityIcon,
  Link as LinkIcon,
  RestartAlt as RestartAltIcon,
  ViewColumn as BarcodeIcon,
  Gavel as GavelIcon,
} from "@mui/icons-material";
import { Typography } from "@mui/material";

import { FOOTER_DATA } from "@/lib/config/config";
export const [email] = FOOTER_DATA.split(",");

export const SOCIAL_LINKS = [
  {
    icon: EmailIcon,
    href: `mailto:${email}`,
    label: "Email",
    color: "#F44336",
    hover: "#fbe9e7",
  },
];

export const createAccessibilityButtons = (
  increaseFont: () => void,
  decreaseFont: () => void,
  reset: () => void,
  grayscale: boolean,
  setGrayscale: (v: boolean) => void,
  highContrast: boolean,
  setHighContrast: (v: boolean) => void,
  invert: boolean,
  setInvert: (v: boolean) => void,
  underlineLinks: boolean,
  setUnderlineLinks: (v: boolean) => void,
  readableFont: boolean,
  setReadableFont: (v: boolean) => void,
) => [
  {
    id: "accessibility.zoomIn",
    icon: <ZoomInIcon />,
    onClick: increaseFont,
  },
  {
    id: "accessibility.zoomOut",
    icon: <ZoomOutIcon />,
    onClick: decreaseFont,
  },
  {
    id: "accessibility.grayscale",
    icon: <BarcodeIcon />,
    onClick: () => setGrayscale(!grayscale),
    selected: grayscale,
  },
  {
    id: "accessibility.contrast",
    icon: <InvertColorsIcon />,
    onClick: () => setHighContrast(!highContrast),
    selected: highContrast,
  },
  {
    id: "accessibility.invert",
    icon: <VisibilityIcon />,
    onClick: () => setInvert(!invert),
    selected: invert,
  },
  {
    id: "accessibility.underline",
    icon: <LinkIcon />,
    onClick: () => setUnderlineLinks(!underlineLinks),
    selected: underlineLinks,
  },
  {
    id: "accessibility.readableFont",
    icon: <Typography fontWeight="bold">Aa</Typography>,
    onClick: () => setReadableFont(!readableFont),
    selected: readableFont,
  },
  {
    id: "accessibility.reset",
    icon: <RestartAltIcon />,
    onClick: reset,
  },
  {
    id: "terms.accessibility.title",
    icon: <GavelIcon />,
    onClick: () => window.open("/legal/accessibility", "_blank"),
  },
];
