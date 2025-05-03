export default {
  'src/**/*.{ts, tsx}': (stagedFiles) => {
    const files = stagedFiles.join(' ');
    return [`eslint ${files}`, `prettier --write ${files}`];
  },
  'src/**/*.css': (stagedFiles) => {
    return [`prettier --write ${stagedFiles.join(' ')}`];
  },
}