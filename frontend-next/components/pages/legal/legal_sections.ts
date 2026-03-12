export const legal_sections: Record<
  "terms" | "accessibility" | "remove",
  {
    sections: {
      title: string;
      paragraphs?: string[];
      list?: string[];
      contact?: string;
    }[];
  }
> = {
  accessibility: {
    sections: [
      {
        title: "terms.accessibility.title",
        paragraphs: ["terms.accessibility.intro"],
        list: [
          "accessibility.zoomIn",
          "accessibility.zoomOut",
          "accessibility.grayscale",
          "accessibility.contrast",
          "accessibility.invert",
          "accessibility.underline",
          "accessibility.readableFont",
        ],
        contact: "terms.accessibility.contact",
      },
    ],
  },
  terms: {
    sections: [
      {
        title: "terms.section.contact",
        contact: "terms.contact",
      },
    ],
  },
  remove: {
    sections: [
      {
        title: "terms.remove.title",
        paragraphs: ["terms.remove.intro", "terms.remove.instruction"],
        contact: "terms.remove.contact",
      },
    ],
  },
};
