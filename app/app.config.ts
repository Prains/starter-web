export default defineAppConfig({
  appName: "__APP_NAME__",
  ui: {
    colors: {
      primary: "zinc",
      neutral: "zinc",
    },
    button: {
      slots: {
        base: "cursor-pointer",
      },
    },
    tooltip: {
      slots: {
        content:
          "h-auto max-w-xs bg-inverted text-inverted ring-0 rounded-[calc(var(--ui-radius)*1.5)] px-3.5 py-2 text-sm",
        text: "text-wrap",
        arrow: "fill-inverted",
      },
      arrow: true,
    },
    popover: {
      slots: {
        content: "ring-0 shadow-[0_6px_24px_-2px_rgba(16,19,29,0.15)]",
        arrow: "!stroke-transparent",
      },
    },
    dropdownMenu: {
      slots: {
        content: "ring-0 shadow-[0_6px_24px_-2px_rgba(16,19,29,0.15)]",
      },
    },
  },
});
