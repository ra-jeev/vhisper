export default defineAppConfig({
  ui: {
    colors: {
      primary: "lime",
      neutral: "slate",
    },
    card: {
      slots: {
        header: "flex items-center justify-between gap-x-3",
        footer: "flex items-center justify-end gap-x-3",
      },
    },
    modal: {
      slots: {
        footer: "justify-end gap-x-3",
      },
    },
  },
});
