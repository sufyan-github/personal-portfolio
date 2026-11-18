import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// The admin dashboard uses Cloudflare's Kumo components, which ship their own
// precompiled stylesheet built with Tailwind v4. That file uses native CSS
// `@layer base/utilities` rules, which this project's Tailwind v3 plugin
// rejects. Run Tailwind v3 on every stylesheet except Kumo's.
const isKumoStylesheet = (root) =>
  /@cloudflare[\\/]kumo[\\/]/.test(root.source?.input?.file ?? "");

const tailwind = tailwindcss();
const tailwindExceptKumo = {
  postcssPlugin: "tailwindcss-except-kumo",
  plugins: tailwind.plugins.map(
    (plugin) => (root, result) => (isKumoStylesheet(root) ? undefined : plugin(root, result)),
  ),
};

export default {
  plugins: [tailwindExceptKumo, autoprefixer()],
};
