import fs from 'fs';
import path from 'path';

import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import cssnano from 'cssnano';

export default async function(eleventyConfig) {
  // Add custom filter for current year
  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  // Configure Eleventy
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/lang");
  eleventyConfig.addPassthroughCopy({"./node_modules/alpinejs/dist/cdn.min.js": "./js/alpine.js"});

  //compile tailwind before eleventy processes the files
  eleventyConfig.on('eleventy.before', async () => {
    const tailwindInputPath = path.resolve('./src/css/styles.css');
    const tailwindOutputPath = './build/css/style.css';
    const cssContent = fs.readFileSync(tailwindInputPath, 'utf8');
    const outputDir = path.dirname(tailwindOutputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const result = await processor.process(cssContent, {
      from: tailwindInputPath,
      to: tailwindOutputPath,
    });
    fs.writeFileSync(tailwindOutputPath, result.css);
  });

  const processor = postcss([
    //compile tailwind
    tailwindcss(),

    //minify tailwind css
    cssnano({
      preset: 'default',
    }),
  ]);
  eleventyConfig.addWatchTarget('src/css/**/*.css');

  return {
    dir: {
      input: "src",
      includes: "templates/_includes",
      layouts: "templates/layouts",
      output: "build"
    },
    templateFormats: ["md","njk","html"]
  };
};
