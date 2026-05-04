import { parse as parseYaml } from "@std/yaml";
import { resolve } from "@std/path";
import { Eta } from "@bgub/eta";

interface ConfigData {
  site: SiteConfig;
  mods: ModsYaml;
}

interface SiteConfig {
  name: string;
  tagline: string;
  base_url: string;
  dev_url: string;
  assets?: string[];
}

interface ModsYaml {
  [modid: string]: ModConfig;
}

interface ModConfig {
  display_name: string;
  description: string;
  [page: string]: string;
}

function assertIsConfigData(data: unknown): asserts data is ConfigData {
  if (typeof data !== "object" || data === null)
    throw new Error("Config data is not an object");

  if (!("site" in data))
    throw new Error("Config data missing site");
  assertIsSiteConfig(data.site);

  if (!("mods" in data))
    throw new Error("Config data missing mods");
  assertIsModsYaml(data.mods);
}

function assertIsSiteConfig(data: unknown): asserts data is SiteConfig {
  if (typeof data !== "object" || data === null)
    throw new Error("Site config is not an object");

  if (!("name" in data) || typeof data.name !== "string")
    throw new Error("Site config missing valid name field");

  if (!("tagline" in data) || typeof data.tagline !== "string")
    throw new Error("Site config missing valid tagline field");

  if (
    !("base_url" in data)
    || typeof data.base_url !== "string"
    || !URL.canParse(data.base_url)
  ) throw new Error("Site config missing valid base_url field");

  if (
    !("dev_url" in data)
    || typeof data.dev_url !== "string"
    || !URL.canParse(data.dev_url)
  ) throw new Error("Site config missing valid dev_url field");

  if ("assets" in data) {
    if (!Array.isArray(data.assets))
      throw new Error("Site config assets field is not an array");

    for (let i = 0; i < data.assets.length; i++) {
      if (typeof data.assets[i] !== "string")
        throw new Error(`Site config assets[${i}] is not a string`);

      if (!Deno.statSync(resolve(Deno.cwd(), data.assets[i])).isFile)
        throw new Error(`Site config assets[${i}] does not point to a file`);
    }
  }
}

function assertIsModConfig(data: unknown): asserts data is ModConfig {
  if (typeof data !== "object" || data === null)
    throw new Error("Mod config is not an object");

  if (!("display_name" in data) || typeof data.display_name !== "string")
    throw new Error("Mod config missing valid display_name");

  if (!("description" in data) || typeof data.description !== "string")
    throw new Error("Mod config missing valid description");
}

function assertIsModsYaml(data: unknown): asserts data is ModsYaml {
  if (typeof data !== "object" || data === null)
    throw new Error("Mods YAML is not an object");

  for (const [modid, modConfig] of Object.entries(data)) {
    if (typeof modid !== "string" || /^[a-z0-9_.-]+$/.test(modid) === false)
      throw new Error(`Invalid modid: ${modid}`);

    assertIsModConfig(modConfig);
  }
}

function mkOutputDir(...str: string[]) {
  return Deno.mkdir(outputDir(...str), { recursive: true });
}

const isProduction = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
const outputDir = (...str: string[]) => resolve(Deno.cwd(), "public", ...str);
const eta = new Eta({ views: Deno.cwd(), cache: true });

const configData = {
  mods: parseYaml(await Deno.readTextFile("mods.yaml")),
  site: parseYaml(await Deno.readTextFile("site.yaml")),
};

assertIsConfigData(configData);

await Deno.remove(outputDir(), { recursive: true });
console.log(`\n🔨 Building site...\n`);

// Mods
for (const [modid, modConfig] of Object.entries(configData.mods)) {
  // deno-lint-ignore no-unused-vars
  const { display_name, description, ...redirects } = modConfig;

  if (redirects.index === undefined)
    redirects.index = `https://modrinth.com/mod/${modid}/`;

  for (const [redirectId, redirectTarget] of Object.entries(redirects)) {
    let redirectDisplayName = redirectId.replaceAll("_", " ").trim();
    redirectDisplayName = redirectDisplayName.charAt(0).toUpperCase()
      + redirectDisplayName.slice(1);

    const html = eta.render("redirect", {
      site: {
        ...configData.site,
        base_url: isProduction ? configData.site.base_url : configData.site.dev_url,
        dev_url: undefined,
        assets: configData.site.assets ?? [],
      },
      mod: modConfig,
      redirect: { display_name: redirectDisplayName, target: redirectTarget },
    });

    await mkOutputDir(modid);
    const filePath = outputDir(modid, `${redirectId}.html`);
    await Deno.writeTextFile(filePath, html);
    console.log(`  ✓ ${modid}/${redirectId}.html`);
  }
}

// Home
// Get list of mods and their redirects
const modsList = Object.entries(configData.mods).map(([id, modConfig]) => {
  const { display_name, description, ...redirects } = modConfig;
  return {
    id,
    display_name,
    description,
    redirects: Object.entries(redirects).map(([redirectId]) => {
      let redirectDisplayName = redirectId.replaceAll("_", " ").trim();
      redirectDisplayName = redirectDisplayName.charAt(0).toUpperCase()
        + redirectDisplayName.slice(1);
      return {
        id: redirectId,
        display_name: redirectDisplayName,
      };
    }),
  };
});

const homeHtml = eta.render("index", {
  site: {
    ...configData.site,
    base_url: isProduction ? configData.site.base_url : configData.site.dev_url,
    dev_url: undefined,
    assets: configData.site.assets ?? [],
  },
  mods: modsList,
});
await mkOutputDir();
await Deno.writeTextFile(outputDir("index.html"), homeHtml);
console.log(`  ✓ index.html`); // Abstract common page building logic?

console.log(`\n✨ Build complete!\n`);

// copy assets
if (configData.site.assets) {
  for (const assetPath of configData.site.assets) {
    await Deno.copyFile(
      resolve(Deno.cwd(), assetPath),
      outputDir(assetPath),
    );
    console.log(`  ✓ ${assetPath}`);
  }
}

console.log(`\n✨ Build Completed!\n`);
