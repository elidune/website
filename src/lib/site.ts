export const demoUrl = 'https://elidune-demo.b-612.fr';
export const softwareRepoUrl = 'https://github.com/elidune/elidune';
export const websiteRepoUrl = 'https://github.com/elidune/website';
export const issuesUrl = 'https://github.com/elidune/elidune/issues';
export const licenseUrl = 'https://www.gnu.org/licenses/agpl-3.0.html';
export const dockerGuideUrl = 'https://github.com/elidune/elidune/blob/main/docs/README-docker.md';
export const authorName = 'Jean Collonvillé';

export const installYaml = `services:
  elidune-all-in-one:
    image: ghcr.io/elidune/elidune-all-in-one:latest
    ports:
      - "\${GUI_PORT:-8181}:80"
    restart: unless-stopped`;
